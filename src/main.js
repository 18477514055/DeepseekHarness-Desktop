"use strict";

/**
 * DeepSeek Harness 桌面版 —— Electron 主进程
 *
 * 设计:UI 与网页版一比一(直接加载官方 dsh web 服务器与官方前端 dist),
 * 桌面层只负责原生外壳:服务器托管/复用、窗口、托盘、菜单、单实例。
 *
 * 服务器生命周期:
 *   1. 探测 127.0.0.1:3080,已有官方 dsh 服务器则直接复用(attach);
 *   2. 否则用内置 @deepseek-ai/dsh 自建(ELECTRON_RUN_AS_NODE);
 *   3. 内置缺失/失败时自动回退到 `npx -y @deepseek-ai/dsh web`(无需用户手动);
 *   4. 运行期间每 5 秒探活,掉线(含复用的外部服务器被关闭)自动恢复并重载页面。
 */

const {
  app, BrowserWindow, Tray, Menu, Notification, dialog, shell, nativeImage,
} = require("electron");
const { spawn, spawnSync } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { buildStatusHtml } = require("./status-page");
const { startAutoUpdate, isUpdating } = require("./updater");

// 若从带控制台的父进程(批处理/计划任务/终端)启动,Electron 会继承其控制台,
// 脚本退出后留下一个空终端窗口。这里主动脱离控制台,该窗口随即消失;
// 从桌面双击启动时本就没有控制台,此调用无副作用。
/** 主动脱离控制台后 stdout 会失效,后续 console.log 会抛 EBADF(见 log 里的保护)。 */
let detachedConsole = false;
try {
  const k = require("koffi");
  const koffi = k.default || k;
  koffi.load("kernel32.dll").func("__stdcall", "FreeConsole", "int", [])();
  detachedConsole = true;
} catch { /* koffi 不可用时忽略 */ }

// 远程桌面/无 GPU 环境下 Chromium 的硬件加速路径会偶发 fail-fast
// (CoreMessaging.dll / GPU process 崩溃);DSH UI 为纯 2D 页面,禁用无副作用。
app.disableHardwareAcceleration();

const HOST = "127.0.0.1";
const DEFAULT_PORT = 3080;
/** index.html 中出现的标题,用于识别"这是官方 dsh 前端"。 */
const INDEX_MARKER = "DeepSeek Harness";
const SMOKE = process.argv.includes("--smoke");
/** --port N:强制自建服务器(0 = 系统分配端口),跳过探测/复用逻辑。 */
const FORCE_PORT = (() => {
  const i = process.argv.indexOf("--port");
  if (i === -1) return null;
  const v = Number(process.argv[i + 1]);
  return Number.isFinite(v) ? v : null;
})();
/** 诊断开关:跳过内置 bin,强制走 npx 回退路径。 */
const FORCE_NPX = process.env.DSH_FORCE_NPX === "1";
/**
 * 启动哪个 profile:默认 "web"。
 * 若 %APPDATA%\DeepSeek Harness\profile.txt 存在且内容合法(字母/数字/下划线/连字符),
 * 就用它 —— 这是"纯净启动"的开关:让外壳去启动只含官方 bundle 的 profile,
 * 从而完全不加载任何第三方插件。文件不存在时行为与原来完全一致。
 */
function readProfileOverride() {
  try {
    const name = fs.readFileSync(path.join(app.getPath("userData"), "profile.txt"), "utf8").trim();
    if (/^[A-Za-z0-9_-]{1,40}$/.test(name)) {
      if (name === "web") return "web";
      // 防呆:标记文件指向的 profile 被删掉时回退 web。否则外壳会去启动一个不存在的
      // profile,表现为"应用永远起不来",而且从界面上完全看不出原因。
      const home = process.env.DSH_HOME || path.join(os.homedir(), ".dsh");
      const manifest = path.join(home, "profiles", name, "package.json");
      if (fs.existsSync(manifest)) return name;
      log("profile 标记指向「" + name + "」但 " + manifest + " 不存在,已回退 web");
    }
  } catch { /* 没有标记文件 = 用默认 profile */ }
  return "web";
}
/**
 * 外壳自带内核的精确版本:npx 回退必须钉住同一版本。
 * 默认的 `@deepseek-ai/dsh` 会被解析成"最新版",一旦与外壳自带内核不同世代,
 * 那次启动就会把 ~/.dsh/profiles/node_modules(插件共用的模块镜像)整体重写成
 * 另一个世代的副本;此后插件解析到的 @deepseek-ai/* 与宿主内核不是同一份,
 * 服务身份/协议不一致 → 激活失败 → 表现为"装了插件后应用再也起不来,重装也没用"。
 */
const BUNDLED_DSH_SPEC = (() => {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
    const pinned = manifest.dependencies && manifest.dependencies["@deepseek-ai/dsh"];
    if (typeof pinned === "string" && /^\d/.test(pinned)) return `@deepseek-ai/dsh@${pinned}`;
  } catch { /* 打包布局异常时用下面的兜底版本 */ }
  return "@deepseek-ai/dsh@0.1.2-rc.1";
})();

// ---------------------------------------------------------------------------
// 状态
// ---------------------------------------------------------------------------
let mainWindow = null;
let tray = null;
let serverProc = null; // 当前服务器的子进程(attach 模式为 null)
let serverOwned = false; // 服务器是否由本应用托管
let serverUrl = null;
let quitting = false;
let restarting = null; // 自动恢复的进行中 Promise(防重入)
let healthTimer = null; // 探活定时器
let retryTimer = null; // 启动失败自动重试定时器
let restartTimer = null; // 补丁组 3:自动恢复失败后的继续重试定时器
let spawnReason = "bootstrap"; // 补丁组 3:本次启动的原因(bootstrap|retry|recovery|recovery-retry)
let healthChecks = 0; // 补丁组 3:连续探活失败次数
const HEALTH_TIMEOUT_MS = 5000; // 补丁组 3:单次探活超时(原 1.5 秒太紧,整机繁忙时会误判掉线)
const HEALTH_FAIL_LIMIT = 3; // 补丁组 3:连续失败几次才判定掉线(原为 1 次就杀内核)
let statusPageActive = false; // 鲸鱼状态页是否显示中(更新进度只写状态页)
let pendingLoadUi = false;    // 更新期间服务器已就绪,待更新流程结束后载入主 UI
let settings = { closeToTray: true, workspace: null, directoryPicker: "browse" };

/**
 * 外壳自身日志:除 console 外还要落盘。打包版没有控制台,"探活失败/自动恢复/内核退出"
 * 这些关键行原本全部丢失,用户只能看到"闪退"。
 */
const SHELL_LOG_MAX_BYTES = 4 * 1024 * 1024;
function shellLog(text) {
  try {
    const file = path.join(app.getPath("userData"), "shell.log");
    try {
      if (fs.statSync(file).size > SHELL_LOG_MAX_BYTES) fs.renameSync(file, file + ".1");
    } catch { /* 文件还不存在 */ }
    fs.appendFileSync(file, text);
  } catch { /* 忽略 */ }
}
const log = (...args) => {
  const line = "[desktop] " + args.map((a) => {
    if (typeof a === "string") return a;
    try { return JSON.stringify(a); } catch { return String(a); }
  }).join(" ");
  // 先落盘,再"尽力"写 console:外壳可能已 FreeConsole(),此时 stdout 无效,
  // console.log 会抛 EBADF——日志函数绝不能让这种异常打断启动流程。
  shellLog("[" + new Date().toISOString() + "] " + line + "\n");
  if (!detachedConsole) {
    try { console.log(line); } catch { detachedConsole = true; }
  }
};

// ---------------------------------------------------------------------------
// 错误兜底:主进程异常写日志(userData/error.log),不再弹系统级报错框吓用户
// ---------------------------------------------------------------------------
function logError(kind, e) {
  try {
    fs.appendFileSync(
      path.join(app.getPath("userData"), "error.log"),
      `[${new Date().toISOString()}] ${kind}: ${(e && e.stack) || e}\n`);
  } catch { /* 忽略 */ }
}
process.on("uncaughtException", (e) => logError("uncaughtException", e));
process.on("unhandledRejection", (e) => logError("unhandledRejection", e));

// ---------------------------------------------------------------------------
// 内核日志:服务器子进程(dsh 内核 + 所有插件)的 stdout/stderr 全量落盘。
// 否则启动失败时只有状态页里的最后几行可见,用户除了重装无从下手。
// ---------------------------------------------------------------------------
const serverLogFile = () => path.join(app.getPath("userData"), "server.log");
const SERVER_LOG_MAX_BYTES = 4 * 1024 * 1024;
let serverLogStream = null;
let serverLogBytes = 0;
/** 缓冲异步写入:旧实现每来一段内核输出就同步 appendFileSync,会在主进程里阻塞。 */
function serverLog(text) {
  try {
    if (serverLogStream === null) {
      let size = 0;
      try { size = fs.statSync(serverLogFile()).size; } catch { size = 0; }
      if (size > SERVER_LOG_MAX_BYTES) {
        try { fs.renameSync(serverLogFile(), serverLogFile() + ".1"); } catch { /* 忽略 */ }
        size = 0;
      }
      serverLogBytes = size;
      serverLogStream = fs.createWriteStream(serverLogFile(), { flags: "a" });
      serverLogStream.on("error", () => { serverLogStream = null; });
    }
    serverLogStream.write(text);
    serverLogBytes += Buffer.byteLength(text);
    if (serverLogBytes > SERVER_LOG_MAX_BYTES) {
      try { serverLogStream.end(); } catch { /* 忽略 */ }
      serverLogStream = null;
    }
  } catch { /* 忽略 */ }
}

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------
const settingsFile = () => path.join(app.getPath("userData"), "settings.json");
function loadSettings() {
  try {
    // 兼容带 BOM 的 UTF-8(部分编辑器/工具写出 BOM 会让 JSON.parse 抛错)
    const text = fs.readFileSync(settingsFile(), "utf8").replace(/^\uFEFF/, "");
    settings = { ...settings, ...JSON.parse(text) };
  } catch { /* 首次运行无配置文件 */ }
  // 0.1.2-rc.1 起:默认采用应用内浏览式目录选择器(browse)。原生 Win32 对话框 worker
  // 在远程桌面/受控会话(如 RDP、向日葵等)下会崩溃("win32 folder dialog worker exited
  // before reporting a result"),因此把历史配置中的 "native" 迁移为 "browse",彻底规避。
  if (settings.directoryPicker === "native") {
    settings.directoryPicker = "browse";
    saveSettings();
    log("目录选择器: 由 native 迁移为 browse(避免原生对话框 worker 在远程/受控会话崩溃)");
  }
}
function saveSettings() {
  try {
    fs.mkdirSync(path.dirname(settingsFile()), { recursive: true });
    fs.writeFileSync(settingsFile(), JSON.stringify(settings, null, 2));
  } catch (e) { log("保存设置失败", e); }
}

function iconPath(preferTray = false) {
  const base = path.join(__dirname, "..", "assets");
  const list = preferTray
    ? ["tray@2x.png", "tray.png", "icon.png"]
    : ["icon.png", "icon-256.png", "tray.png"];
  for (const name of list) {
    const p = path.join(base, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function httpGet(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    // 官方 dsh 0.1.2 起,带 token 的 URL 会 303 重定向到 `/` 并在响应里下发
    // `dsh-auth-*` 会话 cookie;浏览器靠它完成认证。这里跟随重定向(上限 5 跳)
    // 并携带 Set-Cookie,否则健康检查会拿到 303/401 而误判服务器未就绪。
    let cookie = null;
    const client = (u, hops) => {
      const req = http.get(u, { headers: cookie ? { cookie } : {} }, (res) => {
        const chunks = [];
        const setCookie = res.headers["set-cookie"];
        if (setCookie) {
          const list = Array.isArray(setCookie) ? setCookie : [setCookie];
          cookie = list.map((c) => c.split(";")[0].trim()).filter(Boolean).join("; ");
        }
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && hops > 0) {
            let next;
            try { next = new URL(res.headers.location, u).toString(); } catch { next = null; }
            if (next) return client(next, hops - 1);
          }
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") });
        });
      });
      req.setTimeout(timeoutMs, () => { req.destroy(); resolve(null); });
      req.on("error", () => resolve(null));
    };
    client(url, 5);
  });
}
function isDsh(res) {
  return !!res && res.status === 200 && res.body.includes(INDEX_MARKER);
}
/** 探测一个地址:返回 "dsh"(官方服务器) / "other"(别的服务) / "none"(无响应) */
async function probe(url, timeoutMs = 5000) {
  const res = await httpGet(url, timeoutMs);
  if (isDsh(res)) return "dsh";
  return res ? "other" : "none";
}
async function waitForDsh(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if ((await probe(url)) === "dsh") return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// dsh 服务器
// ---------------------------------------------------------------------------
/** 解析 @deepseek-ai/dsh 的 bin 入口(兼容有/无 asar 两种打包布局)。 */
function resolveDshBin() {
  if (FORCE_NPX) return null;
  const candidates = [];
  if (app.isPackaged) {
    const base = process.resourcesPath;
    candidates.push(
      path.join(base, "app", "node_modules", "@deepseek-ai", "dsh", "lib", "bin.js"),
      path.join(base, "app.asar.unpacked", "node_modules", "@deepseek-ai", "dsh", "lib", "bin.js"),
    );
  } else {
    try {
      const pkg = require.resolve("@deepseek-ai/dsh/package.json");
      candidates.push(path.join(path.dirname(pkg), "lib", "bin.js"));
    } catch { /* 未安装 */ }
  }
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}

/** 服务器子进程的环境:directoryPicker=browse 时设置 SSH_CONNECTION,
 *  让 dsh 的目录选择器解析器挂载应用内浏览选择器(唯一消费者,已确认无副作用),
 *  规避远程桌面会话下原生对话框 worker 崩溃导致"打不开新工作区"。 */
function serverEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  if (settings.directoryPicker === "browse") env.SSH_CONNECTION = "desktop-shell-browse";
  return env;
}

/**
 * spawn 一次 dsh web 服务器。kind = "builtin" | "npx"。
 * 返回 { child, url, exited, exit } —— url 从 stdout 的 "dsh web: ..." 行解析。
 */
function spawnDsh(port, kind) {
  const workspace = settings.workspace || os.homedir();
  let child;
  // --no-open:官方 dsh web 默认会调用系统默认浏览器打开界面;桌面版自身就是
  // 界面,不需要这个跳转(否则每次启动都会弹一个浏览器标签页)。
  if (kind === "npx") {
    const npxProfile = readProfileOverride() === "web" ? "web" : `--profile ${readProfileOverride()}`;
    // 自动完成用户手动执行的 `npx @deepseek-ai/dsh web`(Windows 经 cmd 调用 npx)
    child = spawn("cmd.exe", [
      "/d", "/s", "/c",
      `npx -y ${BUNDLED_DSH_SPEC} ${npxProfile} --host ${HOST} --port ${port} --no-open`,
    ], {
      cwd: workspace,
      env: serverEnv(),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } else {
    const bin = resolveDshBin();
    if (!bin) throw new Error("找不到 dsh 服务器入口(node_modules/@deepseek-ai/dsh 未安装)");
    const profileArgs = readProfileOverride() === "web" ? ["web"] : ["--profile", readProfileOverride()];
    child = spawn(process.execPath, [bin, ...profileArgs, "--host", HOST, "--port", String(port), "--no-open"], {
      cwd: workspace,
      env: serverEnv({ ELECTRON_RUN_AS_NODE: "1" }),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  }
  const handle = { child, url: null, exited: false, exit: null, kind, snapshot: () => ({ stdout: out, stderr: err }) };
  let out = "";
  let err = "";
  serverLog(`\n===== [${new Date().toISOString()}] spawn ${kind} port=${port} pid=${child.pid} 原因=${spawnReason} profile=${readProfileOverride()} =====\n`);
  child.stdout.on("data", (d) => {
    out += d.toString();
    serverLog(d.toString());
    const m = out.match(/dsh web: (https?:\/\/\S+)/);
    if (m && !handle.url) handle.url = m[1].trim();
  });
  child.stderr.on("data", (d) => {
    err += d.toString();
    serverLog(d.toString());
  });
  const spawnedAt = Date.now();
  child.on("exit", (code, sig) => {
    handle.exited = true;
    handle.exit = { code, sig, stderr: err.trim(), stdout: out.trim() };
    // 补丁组 3:核心诊断——内核是被杀的还是自己崩的,跑了多久,是谁起的。
    const alive = ((Date.now() - spawnedAt) / 1000).toFixed(1);
    serverLog(`\n[exit] kind=${kind} port=${port} pid=${child.pid} code=${code} signal=${sig} 运行=${alive}s 原因=${spawnReason}\n`);
    log(`内核退出: kind=${kind} pid=${child.pid} code=${code} signal=${sig} 运行=${alive}s(原因=${spawnReason})`);
  });
  return handle;
}

/** 在指定端口启动一次服务器(内置 bin 优先,npx 自动回退);成功返回 true。 */
async function trySpawn(port) {
  const kinds = resolveDshBin() ? ["builtin", "npx"] : ["npx"];
  for (const kind of kinds) {
    const handle = spawnDsh(port, kind);
    serverProc = handle;
    const deadline = Date.now() + 60000;
    while (!handle.url && !handle.exited && Date.now() < deadline) await sleep(100);
    if (!handle.url && !handle.exited && port !== 0) {
      // URL 行没抓到就直接探测目标端口
      if ((await probe(`http://${HOST}:${port}`)) === "dsh") {
        handle.url = `http://${HOST}:${port}`;
      }
    }
    if (handle.url && (await waitForDsh(handle.url, 60000))) {
      serverUrl = handle.url;
      serverOwned = true;
      log(`已启动内置服务器(${kind}): ${serverUrl} (工作目录: ${settings.workspace || os.homedir()})`);
      watchServerCrash();
      return true;
    }
    let why;
    if (handle.exit) {
      why = `退出码 ${handle.exit.code}: ${(handle.exit.stderr || "无输出").split("\n").slice(-40).join("\n")}`;
    } else {
      // 诊断:超时未退出时,打印子进程到目前为止的输出,暴露它卡在哪
      const snap = handle.snapshot ? handle.snapshot() : { stdout: "", stderr: "" };
      let probeInfo = "";
      if (handle.url) {
        try {
          const r = await httpGet(handle.url, 5000);
          probeInfo = r
            ? ` | url="${handle.url}" status=${r.status} bodyHead=${JSON.stringify((r.body || "").slice(0, 200))}`
            : ` | url="${handle.url}" httpGet=null(超时/无响应)`;
        } catch (e) { probeInfo = ` | probeError=${e.message}`; }
      }
      why = `等待就绪超时${probeInfo} | stdout尾部: ${(snap.stdout || "无").slice(-500)} | stderr尾部: ${(snap.stderr || "无").slice(-500)}`;
    }
    log(`端口 ${port} (${kind}) 启动失败: ${why}`);
    // 关键:被放弃的那次启动必须杀掉。否则它会在后台继续启动完成,变成"孤儿内核":
    // 既占着端口、又和后来那次并存,两边还会各自重写插件的模块镜像。
    killTree(handle.child);
    if (serverProc === handle) serverProc = null;
  }
  return false;
}

/** 启动(或复用)服务器,成功后设置 serverUrl / serverOwned。 */
async function startServer() {
  // 0) 强制端口模式:不探测、不复用,直接自建
  if (FORCE_PORT !== null) {
    const ports = FORCE_PORT === 0 ? [0] : [FORCE_PORT];
    for (const port of ports) {
      if (await trySpawn(port)) return;
    }
    throw new Error(`无法在端口 ${FORCE_PORT} 启动 dsh web 服务器`);
  }

  // 1) 默认端口已有官方 dsh 服务器(例如浏览器版正在运行)→ 直接复用
  const primary = `http://${HOST}:${DEFAULT_PORT}`;
  if ((await probe(primary)) === "dsh") {
    serverUrl = primary;
    serverOwned = false;
    log(`复用已有服务器: ${serverUrl}`);
    return;
  }

  // 2) 自己托管一个:3080 空闲就优先用 3080,否则让 OS 分配空闲端口
  const ports = (await probe(primary)) === "none" ? [DEFAULT_PORT, 0] : [0];
  for (const port of ports) {
    if (await trySpawn(port)) return;
  }
  throw new Error("无法启动 dsh web 服务器(请检查端口占用、Node 环境或 @deepseek-ai/dsh 安装)");
}

/**
 * 结束服务器进程树。Windows 下 child.kill() 只杀直接子进程:
 * npx 路径(spawn cmd.exe → npx → node)会留下孤儿 node 继续占端口,
 * 必须用 taskkill /T 杀掉整棵树。
 */
function killTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === "win32") {
    try {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        windowsHide: true, stdio: "ignore",
      });
    } catch { /* 已退出 */ }
  }
  try { child.kill(); } catch { /* 已退出 */ }
}

function stopServer() {
  if (serverProc && serverOwned) {
    const h = serverProc;
    serverProc = null;
    killTree(h.child);
  }
}

/** 托管的服务器进程退出时自动重启(不弹窗打扰)。 */
function watchServerCrash() {
  if (!serverProc) return;
  const h = serverProc;
  h.child.on("exit", (code) => {
    if (serverProc !== h) return; // 已被替换,旧句柄退出无需处理
    serverProc = null;
    if (quitting || SMOKE) return;
    log(`内置服务器退出 code=${code},自动恢复…`);
    handleServerDown();
  });
}

/**
 * 服务器不可用(复用的外部服务器被关闭 / 托管进程崩溃 / 无响应)。
 * 自动重新获取服务器并重载页面;失败则通知用户。防重入。
 */
function handleServerDown() {
  if (quitting || SMOKE) return Promise.resolve();
  if (restarting) return restarting;
  restarting = (async () => {
    spawnReason = "recovery";
    log("服务器不可用,自动恢复…");
    if (serverProc) { killTree(serverProc.child); serverProc = null; }
    serverUrl = null;
    serverOwned = false;
    try {
      await startServer();
      if (mainWindow && !mainWindow.isDestroyed() && serverUrl) {
        mainWindow.loadURL(serverUrl).catch((e) => log("恢复后重载失败:", (e && e.message) || e));
      }
      log("自动恢复完成:", serverUrl);
    } catch (e) {
      log("自动恢复失败:", (e && e.message) || e);
      logError("handleServerDown", e);
      try {
        new Notification({
          title: "DeepSeek Harness",
          body: "服务器自动恢复失败,将稍后重试。",
        }).show();
      } catch (e2) { log("通知失败:", (e2 && e2.message) || e2); }
      // 补丁组 3:恢复失败后继续重试。旧逻辑此时 serverUrl 为空、探活直接 return,
      // 应用会一直坏在那里,只能手动重启。
      if (!quitting && restartTimer === null) {
        log("自动恢复失败,10 秒后继续重试…");
        restartTimer = setInterval(async () => {
          if (quitting || serverUrl) {
            clearInterval(restartTimer);
            restartTimer = null;
            return;
          }
          spawnReason = "recovery-retry";
          try {
            await startServer();
            if (serverUrl) {
              clearInterval(restartTimer);
              restartTimer = null;
              log("恢复重试成功:", serverUrl);
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.loadURL(serverUrl).catch((e3) => log("重载失败:", (e3 && e3.message) || e3));
              }
              startHealthWatch();
            }
          } catch (e3) { log("恢复重试仍失败:", (e3 && e3.message) || e3); }
        }, 10000);
      }
    } finally {
      restarting = null;
    }
  })();
  return restarting;
}

/** 运行期探活:每 5 秒确认服务器仍在,掉线即自动恢复。 */
function startHealthWatch() {
  if (healthTimer) clearInterval(healthTimer);
  healthChecks = 0;
  healthTimer = setInterval(async () => {
    if (quitting || !serverUrl || restarting) return;
    // 补丁组 3:旧逻辑"一次 1.5 秒探活失败 → killTree 杀内核重启",在本地模型或重活把
    // 整机压满时会误杀正在服务的内核 → 窗口重载/会话中断(=闪退)。
    if ((await probe(serverUrl, HEALTH_TIMEOUT_MS)) === "dsh") {
      if (healthChecks > 0) log(`探活恢复(此前连续失败 ${healthChecks} 次)`);
      healthChecks = 0;
      return;
    }
    healthChecks += 1;
    log(`探活失败 ${healthChecks}/${HEALTH_FAIL_LIMIT}: ${serverUrl} 无响应`);
    if (healthChecks >= HEALTH_FAIL_LIMIT) {
      healthChecks = 0;
      handleServerDown();
    }
  }, 5000);
}

/** 页面加载失败(例如服务器在加载瞬间退出)→ 自动恢复并重载。 */
async function handleLoadFailure() {
  if (quitting || SMOKE) return;
  log("页面加载失败,尝试重新获取服务器…");
  await handleServerDown();
}
// ---------------------------------------------------------------------------
// 窗口 / 状态页
// ---------------------------------------------------------------------------
const boundsFile = () => path.join(app.getPath("userData"), "window-state.json");
function loadBounds() {
  try {
    const b = JSON.parse(fs.readFileSync(boundsFile(), "utf8"));
    if (typeof b.width === "number" && typeof b.height === "number") return b;
  } catch { /* 首次运行 */ }
  return null;
}
function saveBounds() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try { fs.writeFileSync(boundsFile(), JSON.stringify(mainWindow.getBounds())); } catch { /* 忽略 */ }
}

/** 在窗口内显示状态页(启动中 / 失败重试),避免白屏与闪退观感。 */
function showStatus(title, detail) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  statusPageActive = true;
  mainWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(buildStatusHtml(title, detail))).catch(() => {});
}

function createWindow() {
  const bounds = loadBounds();
  mainWindow = new BrowserWindow({
    ...(bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
               : { width: 1280, height: 800, center: true }),
    minWidth: 920,
    minHeight: 600,
    show: false,
    backgroundColor: "#0b0e14",
    title: "DeepSeek Harness",
    icon: iconPath() || undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  showStatus("正在启动服务器…", "首次启动或复用外部服务器时可能需要几秒到几十秒。");

  // 外链交给系统浏览器,不在应用内跳转(保持 1:1 页面)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (e, url) => {
    if (url.startsWith("data:")) return; // 状态页允许
    if (serverUrl && url.startsWith(serverUrl)) return;
    e.preventDefault();
    if (/^https?:/.test(url)) shell.openExternal(url);
  });

  // 无菜单栏后的键盘快捷键(替代原"文件/编辑/视图"菜单):
  //   Ctrl+Shift+I 开发者工具 | Ctrl+R / F5 重载 | Ctrl+Shift+O 在浏览器中打开
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") return;
    const ctrl = input.control || input.meta;
    const key = String(input.key).toLowerCase();
    if (ctrl && input.shift && key === "i") {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    } else if ((ctrl && key === "r") || input.key === "F5") {
      mainWindow.webContents.reload();
      event.preventDefault();
    } else if (ctrl && input.shift && key === "o") {
      if (serverUrl) shell.openExternal(serverUrl);
      event.preventDefault();
    }
  });

  // 关闭 → 最小化到托盘(可关闭)
  mainWindow.on("close", (e) => {
    if (settings.closeToTray && !quitting && !SMOKE) {
      e.preventDefault();
      mainWindow.hide();
      return;
    }
    saveBounds();
  });
  mainWindow.on("closed", () => { mainWindow = null; });
  mainWindow.on("move", saveBounds);
  mainWindow.on("resize", saveBounds);
  mainWindow.webContents.on("did-fail-load", (_e, code, desc, url) => {
    if (url.startsWith("data:")) return;
    if (code === -3) return; // ERR_ABORTED:主动中断(如重新加载)不算失败
    log(`did-fail-load ${code} ${desc}`);
    handleLoadFailure().catch((e) => log("加载失败处理异常:", (e && e.message) || e));
  });
}

/** 服务器就绪后加载官方 UI。 */
function loadMainUi() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (!serverUrl) return;
  // 自动更新进行中:保持鲸鱼状态页显示进度,更新流程结束后再载入(见 resumeAfterUpdate)
  if (isUpdating()) { pendingLoadUi = true; return; }
  statusPageActive = false;
  mainWindow.loadURL(serverUrl).catch((e) => log("loadURL 失败:", (e && e.message) || e));
  if (SMOKE) runSmoke();
}

// ---------------------------------------------------------------------------
// 冒烟测试:加载成功后校验 __DSH_BOOT__ 注入与标题,然后退出
// ---------------------------------------------------------------------------
function runSmoke() {
  mainWindow.webContents.once("did-finish-load", async () => {
    try {
      const result = await mainWindow.webContents.executeJavaScript(
        `({ title: document.title, boot: !!window.__DSH_BOOT__, url: location.href })`);
      try { console.log("[smoke]", JSON.stringify(result)); } catch { /* stdout 已失效 */ }
      // 官方 dsh 0.1.2 起 token URL 会 303 重定向到 `/`(浏览器最终地址无 token),
      // 因此按 origin 而非完整 URL 比对,避免误判。
      let serverOrigin = serverUrl;
      try { serverOrigin = new URL(serverUrl).origin; } catch { /* 保留原值 */ }
      const ok = result.boot && String(result.title).includes("DeepSeek Harness")
        && String(result.url).startsWith(serverOrigin);
      finishSmoke(ok ? 0 : 1, JSON.stringify(result));
    } catch (e) {
      try { console.log("[smoke] 校验失败:", e); } catch { /* stdout 已失效 */ }
      finishSmoke(1, String(e));
    }
  });
  // 超时上限:默认 60 秒(真机行为与上游一致,未改)。
  // CI 的 Windows runner 是无 GPU 的虚拟机,冷启动官方服务器 + 加载前端可能
  // 远超 60 秒,导致冒烟测试在 CI 上稳定误报 timeout。因此允许用
  // DSH_SMOKE_TIMEOUT_MS 环境变量放宽 —— 只在 CI 里设置,不影响真机。
  const smokeTimeoutMs = (() => {
    const v = Number(process.env.DSH_SMOKE_TIMEOUT_MS);
    return Number.isFinite(v) && v > 0 ? v : 60000;
  })();
  setTimeout(() => { console.log("[smoke] 超时"); finishSmoke(2, "timeout"); }, smokeTimeoutMs).unref();
}

/** 冒烟测试结束:结果写入 userData/smoke-result.json(不依赖 stdout 捕获,可被自动化读取),再退出。 */
function finishSmoke(code, note = "") {
  try {
    fs.writeFileSync(
      path.join(app.getPath("userData"), "smoke-result.json"),
      JSON.stringify({ code, ok: code === 0, note, time: Date.now() }));
  } catch { /* 忽略 */ }
  stopServer();
  setTimeout(() => app.exit(code), 200);
}

// ---------------------------------------------------------------------------
// 托盘 / 菜单
// ---------------------------------------------------------------------------
function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible() && mainWindow.isFocused()) mainWindow.hide();
  else { mainWindow.show(); mainWindow.focus(); }
}

function createTray() {
  const p = iconPath(true);
  const img = p ? nativeImage.createFromPath(p) : nativeImage.createEmpty();
  tray = new Tray(img.isEmpty() ? nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==") : img);
  tray.setToolTip(`DeepSeek Harness\n${serverUrl || ""}`);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "显示 / 隐藏主窗口", click: toggleWindow },
    { label: "在浏览器中打开", enabled: !!serverUrl, click: () => serverUrl && shell.openExternal(serverUrl) },
    { type: "separator" },
    { label: "关于", click: () => {
      dialog.showMessageBox({
        type: "info",
        title: "关于 DeepSeek Harness",
        message: "DeepSeek Harness 桌面版",
        detail: [
          `版本: ${app.getVersion()}`,
          `Electron: ${process.versions.electron}`,
          `服务器: ${serverUrl || "未启动"}`,
          `服务器模式: ${serverOwned ? "内置(本应用托管)" : "复用外部实例"}`,
          `工作目录: ${settings.workspace || os.homedir()}`,
        ].join("\n"),
        buttons: ["确定"],
      });
    } },
    { type: "separator" },
    { label: "退出", click: () => { quitting = true; app.quit(); } },
  ]));
  tray.on("click", toggleWindow);
}

// ---------------------------------------------------------------------------
// 启动
// ---------------------------------------------------------------------------
async function bootstrap() {
  loadSettings();
  createWindow(); // 先出窗口(状态页),服务器后台启动
  Menu.setApplicationMenu(null); // 纯净窗口:无菜单栏,快捷键见 createWindow
  // 自动更新(仅打包版;--no-update 可跳过;未配置更新源时静默跳过)
  if (app.isPackaged && !SMOKE && !process.argv.includes("--no-update")) {
    startAutoUpdate({
      onStatus: (t, d) => showStatus(t, d),
      onProgress: (p) => {
        if (!statusPageActive || !mainWindow || mainWindow.isDestroyed()) return;
        mainWindow.webContents.executeJavaScript(
          `window.__setProgress && window.__setProgress(${JSON.stringify(p)})`).catch(() => { });
      },
      onDone: () => {
        if (pendingLoadUi && serverUrl) { pendingLoadUi = false; loadMainUi(); }
      },
    });
  }
  if (!SMOKE) { try { createTray(); } catch (e) { log("托盘创建失败:", (e && e.message) || e); } }
  try {
    spawnReason = "bootstrap";
    await startServer();
    loadMainUi();
    startHealthWatch();
    if (serverOwned && !settings.firstRunDone) {
      settings.firstRunDone = true;
      saveSettings();
      try {
        new Notification({
          title: "DeepSeek Harness 已启动",
          body: `服务器运行于 ${serverUrl}\n关闭窗口后应用会驻留托盘,可随时恢复。`,
        }).show();
      } catch (e3) { log("通知失败:", (e3 && e3.message) || e3); }
    }
  } catch (e) {
    const msg = String((e && e.message) || e);
    log("启动失败:", msg);
    logError("bootstrap", e);
    if (SMOKE) {
      try {
        fs.writeFileSync(
          path.join(app.getPath("userData"), "smoke-result.json"),
          JSON.stringify({ code: 1, ok: false, note: msg, time: Date.now() }));
      } catch { /* 忽略 */ }
      stopServer();
      app.exit(1);
      return;
    }
    // 窗口内显示失败状态并每 10 秒自动重试(不闪退、不弹窗打断)
    showStatus("服务器启动失败,自动重试中…", `${msg}\n\n内核日志(含插件报错): ${serverLogFile()}`);
    retryTimer = setInterval(async () => {
      if (quitting || serverUrl) { clearInterval(retryTimer); retryTimer = null; return; }
      try {
        spawnReason = "retry";
        await startServer();
        if (serverUrl) {
          clearInterval(retryTimer);
          retryTimer = null;
          loadMainUi();
          startHealthWatch();
        }
      } catch (e2) {
        log("重试失败:", (e2 && e2.message) || e2);
        showStatus("服务器启动失败,自动重试中…", (e2 && e2.message) || String(e2));
      }
    }, 10000);
  }
}

app.setAppUserModelId("ai.deepseek.harness.desktop");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  // SMOKE 用退出码 9 区分"被单实例锁拒绝"(否则会与冒烟成功 exit 0 混淆,造成假阳性)
  log("另一个实例正在运行,当前实例退出");
  app.exit(SMOKE ? 9 : 0);
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
  app.on("before-quit", () => {
    quitting = true;
    if (healthTimer) clearInterval(healthTimer);
    if (retryTimer) clearInterval(retryTimer);
    if (restartTimer) clearInterval(restartTimer);
    stopServer();
  });
  // Windows/Linux: 窗口全关后保持托盘驻留(托盘"退出"才会真正退出)
  app.on("window-all-closed", () => { /* 保留在托盘 */ });
  app.whenReady().then(bootstrap);
}
