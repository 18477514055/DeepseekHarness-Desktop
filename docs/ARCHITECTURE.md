# 架构说明

> 本文档描述本定制版的分层结构、边界与数据流。**动手改代码前请先读这份**。

## 一、总体分层

```
┌─────────────────────────────────────────────────────────────┐
│  ① 桌面封装层  src/                    ← 你唯一该改的地方      │
│     主进程：服务器托管、窗口、托盘、单实例、自动更新、自愈      │
└────────────────────────┬────────────────────────────────────┘
                         │ spawn (ELECTRON_RUN_AS_NODE)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ② 官方内核  node_modules/@deepseek-ai/dsh@0.1.2-rc.1        │
│     提供 `dsh web` 服务器 + 官方前端 dist                     │
│     ⛔ 不要改 —— 改了会被 npm install 覆盖，且等于 fork 内核  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (127.0.0.1:3080)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ③ 官方前端 UI（由内核提供）            ⛔ 不要注入/魔改      │
└─────────────────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────┐
        │  ④ 插件层  ~/.dsh/profiles/<name>/          │  ← 在本仓库之外
        │     dsh-crosshub / dsh-connect-workbuddy …  │     与你自己的仓库物理隔离
        └────────────────────────────────────────────┘
```

**关键设计意图**：桌面层**只做原生外壳**，UI 与网页版**一比一**
（直接 `loadURL` 官方服务器，不注入、不魔改官方前端）。
这是上游的原始设计，也是本项目刻意保持的边界 —— 它让"官方升级"不会打断桌面层。

## 二、进程与数据流

### 启动链

```
package.json:main → src/main.js
  └─ app.requestSingleInstanceLock()      抢单实例锁（抢不到就退出）
  └─ app.whenReady() → bootstrap()
       ├─ loadSettings()                   读 userData/settings.json
       ├─ createWindow()                   先出窗口（显示状态页，避免白屏）
       ├─ Menu.setApplicationMenu(null)    去掉菜单栏
       ├─ startAutoUpdate()                打包版才启用
       ├─ createTray()                     托盘驻留
       └─ startServer()                    ★ 服务器获取（见下）
            ├─ loadMainUi()                载入官方 UI
            └─ startHealthWatch()          每 5 秒探活
```

### 服务器获取策略（三段式）

```
① 探测 127.0.0.1:3080
     有官方 dsh 服务器（含浏览器版/CLI 已开的）？ → 直接复用（attach，serverOwned=false）
② 否则自建
     用内嵌 node_modules/@deepseek-ai/dsh 的 bin.js 起一个
③ 内嵌失败 → 回退 `npx -y @deepseek-ai/dsh@<钉死版本> web`
```

> ⚠️ **`BUNDLED_DSH_SPEC` 的钉版本是刻意的**。若让 npx 解析成"最新版"，
> 一旦与外壳自带内核不同世代，那次启动会把 `~/.dsh/profiles/node_modules`
> （插件共用的模块镜像）整体重写成另一世代的副本，此后插件解析到的
> `@deepseek-ai/*` 与宿主内核不是同一份 → 服务身份不一致 → **激活失败 →
> 表现为"装了插件后应用再也起不来，重装也没用"**。**不要改成浮动版本。**

### 自愈机制

| 场景 | 处理 |
|---|---|
| 托管的内核退出 | `watchServerCrash()` → `handleServerDown()` → 自动重启并重载页面 |
| 复用的外部服务器被关 | 探活失败累计 3 次 → `handleServerDown()` |
| 页面加载失败 | `did-fail-load`（排除 -3 ERR_ABORTED）→ `handleLoadFailure()` |
| 恢复本身失败 | 每 10 秒持续重试，直到成功（旧版在这里会永久卡死） |
| 首次启动失败 | 显示失败状态页 + 每 10 秒重试，**不闪退、不弹窗** |

### 关键参数（`src/main.js`）

| 常量 | 值 | 含义 |
|---|---|---|
| `HOST` / `DEFAULT_PORT` | `127.0.0.1` / `3080` | 固定回环地址与默认端口 |
| `HEALTH_TIMEOUT_MS` | `5000` | 单次探活超时（上游原为 1500，太重会误判） |
| `HEALTH_FAIL_LIMIT` | `3` | 连续失败几次才判定掉线（上游原为 1 次就杀内核） |
| 探活间隔 | `5000` | `startHealthWatch` 的 setInterval |
| 恢复重试间隔 | `10000` | 恢复失败后的继续重试 |
| `SHELL_LOG_MAX_BYTES` | `4 MiB` | `shell.log` 超过即轮转为 `.log.1` |

## 三、运行时文件（都在 `app.getPath("userData")` 下）

| 文件 | 用途 |
|---|---|
| `settings.json` | `closeToTray` / `workspace` / `directoryPicker` / `firstRunDone` |
| `window-state.json` | 窗口位置与大小记忆 |
| `shell.log` | 外壳日志（探活失败、自动恢复、内核退出） |
| `server.log` | 内核 stdout/stderr（含插件报错） |
| `error.log` | 主进程未捕获异常 |
| `smoke-result.json` | 冒烟测试结果（供自动化读取，不依赖 stdout） |
| `profile.txt` | **可选**：覆盖启动 profile（内容须匹配 `[A-Za-z0-9_-]{1,40}`） |

## 四、安全边界

| 项 | 设置 | 位置 |
|---|---|---|
| `contextIsolation` | `true` | `createWindow()` webPreferences |
| `nodeIntegration` | `false` | 同上 |
| `sandbox` | `true` | 同上 |
| 外链 | 一律 `shell.openExternal`，应用内不跳转 | `setWindowOpenHandler` |
| 导航拦截 | 只允许 `serverUrl` 与 `data:`（状态页） | `will-navigate` |

> `preload.js` 暴露的能力**刻意保持最小**。若要扩大它，请先评估对
> `contextIsolation` 边界的影响，并在 `docs/CHANGELOG.md` 记录理由。

## 五、扩展点（后续加功能建议走这些口子）

| 想做的事 | 建议位置 | 注意 |
|---|---|---|
| 加原生菜单/快捷键 | `createWindow()` 的 `before-input-event` | 目前无菜单栏，快捷键在此集中处理 |
| 加托盘项 | `createTray()` 的 `Menu.buildFromTemplate` | |
| 加设置项 | `loadSettings()` 的默认值 + `saveSettings()` | 保持向后兼容的默认值 |
| 加状态页样式 | `src/status-page.js` | 该文件目前是上游原版 |
| 加自愈策略 | `handleServerDown()` / `startHealthWatch()` | 注意防重入（`restarting` 变量） |
| **加业务功能** | **优先做成 dsh 插件**，放 `~/.dsh/profiles/` | 与仓库物理隔离，不污染桌面层 |

> 💡 **架构建议**：桌面层应当**尽量薄**。绝大多数"功能"更适合做成 dsh 插件
> （插件层在 `~/.dsh/profiles/<profile>/`，通过 `dsh.profile.bundles` 注册）。
> 桌面层只负责那些插件**做不到**的事：进程生命周期、窗口、托盘、原生集成。

## 六、依赖可复现性与许可清单

### 为什么没有提交 lock 文件

本仓库**刻意沿用上游做法，不提交 `package-lock.json`**。
`package.json` 里 104 个依赖中有 103 个用的是 `^` 浮动范围。

**后果（必须知道）**：任何人 `npm install` 解析出的版本都可能与本机不同。
这带来两个连锁影响：

1. **构建不可复现** —— 官方发新 rc 版后，clone 下来装出来的依赖树会漂移。
2. **`THIRD-PARTY-LICENSES.md` 无法逐条比对** —— 它记录的是"生成那一刻实际装了什么"，
   天然会随版本漂移而"过期"。

> ⚠️ 因此 CI 里用的是 **`scripts/check-third-party-licenses.js`**（合理性校验），
> 而**不是** `gen-third-party-licenses.js --check`（逐字节比对）。
> 后者只在依赖树完全可复现时才成立，用在浮动依赖上会 100% 假警报。
> 详见 `docs/CHANGELOG.md` 的对应条目。

### 将来若要开启可复现构建

若希望构建可复现、并让清单可以严格比对，需要做三件事：

1. 提交 `package-lock.json`；
2. 把 `package.json` 的 `^` 收紧为精确版本；
3. 把 CI 的 `npm install` 换回 `npm ci`，并给 `setup-node` 加回 `cache: npm`，
   同时把 `licenses:check` 换回 `gen-third-party-licenses.js --check`。

在那之前，第三方清单靠**人工在改依赖后跑 `npm run licenses`** 来维护，
CI 负责拦住"忘了跑"的情况。

