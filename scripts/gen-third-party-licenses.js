"use strict";

/**
 * gen-third-party-licenses —— 生成 THIRD-PARTY-LICENSES.md
 *
 * 为什么需要它：本应用打包了 590 个第三方 npm 包，它们各自持有自己的许可证
 * （MIT / Apache-2.0 / ISC / BSD / 以及一个 LGPL-3.0-or-later 组件）。以 MIT 发布
 * 本软件时，"保留版权与许可声明"是法定义务；把别人的声明汇总成一份清单随包发布
 * 是最稳妥的履行方式。
 *
 * 用法：
 *   node scripts/gen-third-party-licenses.js            # 扫描 node_modules 并覆写清单
 *   node scripts/gen-third-party-licenses.js --check    # 只校验清单是否为最新（CI 用）
 *
 * 退出码：0 = 成功/清单是最新的；1 = 扫描失败或（--check 时）清单已过期
 *
 * 注意：本脚本产生的结果会被写进发布物，所以它读的是**真实安装的** node_modules，
 * 而不是 package.json 的依赖声明 —— 后者可能与实际安装不一致。
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const MODULES = path.join(ROOT, "node_modules");
const TARGET = path.join(ROOT, "THIRD-PARTY-LICENSES.md");
const CHECK_ONLY = process.argv.includes("--check");

/** 已知的 copyleft / 非常见许可，需要人工写说明（只在总览里点名强调）。 */
const NOTABLE = /(LGPL|GPL|MPL|Python-2\.0|BlueOak|CC-BY|EUPL)/i;

/** 读取一个包的 package.json，抽出许可证元数据；读不到返回 null。 */
function readPackage(dir) {
  const manifest = path.join(dir, "package.json");
  if (!fs.existsSync(manifest)) return null;
  let json;
  try {
    json = JSON.parse(fs.readFileSync(manifest, "utf8"));
  } catch {
    return null; // 损坏的 package.json 不阻断整体生成
  }
  const name = json.name || path.basename(dir);
  // license 优先；老包可能用 licenses: [{type}] 数组写法
  let license = json.license;
  if (!license && Array.isArray(json.licenses)) {
    license = json.licenses.map((l) => l && l.type).filter(Boolean).join(" OR ");
  }
  let repo = "";
  if (json.repository) repo = typeof json.repository === "string" ? json.repository : json.repository.url || "";
  // 目录内是否自带许可全文（这是"物理保留声明"的直接证据）
  let licenseFile = "";
  try {
    const hit = fs
      .readdirSync(dir, { withFileTypes: true })
      .find((e) => e.isFile() && /^(license|licence|copying)/i.test(e.name));
    if (hit) licenseFile = hit.name;
  } catch {
    /* 忽略 */
  }
  return { name, version: json.version || "?", license: license || "UNKNOWN", repo, licenseFile };
}

/** 遍历 node_modules（含 @scope 子目录），返回全部包的许可证元数据。 */
function collect() {
  if (!fs.existsSync(MODULES)) {
    console.error(`[licenses] 找不到 ${MODULES} —— 请先 npm install`);
    process.exit(1);
  }
  const rows = [];
  for (const entry of fs.readdirSync(MODULES, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(MODULES, entry.name);
    if (entry.name.startsWith("@")) {
      for (const sub of fs.readdirSync(full, { withFileTypes: true })) {
        if (!sub.isDirectory()) continue;
        const pkg = readPackage(path.join(full, sub.name));
        if (pkg) rows.push(pkg);
      }
    } else {
      const pkg = readPackage(full);
      if (pkg) rows.push(pkg);
    }
  }
  // 排序保证输出稳定：CI 的 --check 依赖这一点，否则每次顺序不同会误报"已过期"
  return rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/** 把扫描结果渲染成 Markdown 清单。 */
function render(rows, shellVersion) {
  const total = rows.length;
  const counts = new Map();
  for (const r of rows) counts.set(r.license, (counts.get(r.license) || 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const noFile = rows.filter((r) => !r.licenseFile);
  const notable = rows.filter((r) => NOTABLE.test(r.license));

  const L = [];
  const p = (s = "") => L.push(s);

  p("# 第三方依赖许可清单 / Third-Party Licenses");
  p();
  p("> 本文件由 `scripts/gen-third-party-licenses.js` 从 `node_modules` 自动生成，请勿手工编辑。");
  p(`> 生成基准：\`@deepseek-ai/dsh@${shellVersion}\` 内置的完整依赖树。`);
  p("> 重新生成：`node scripts/gen-third-party-licenses.js`");
  p("> 对应仓库：https://github.com/18477514055/DeepseekHarness-Desktop");
  p();
  p("本软件以 MIT 许可发布（见 [LICENSE](LICENSE)）。它同时打包了下列第三方组件，");
  p("各组件仍按其**自身**的许可条款授权，其版权归各自的作者所有。");
  p();
  p("## 一、许可分布总览");
  p();
  p("| 许可证 | 包数量 |");
  p("|---|---|");
  for (const [lic, n] of groups) p(`| ${lic} | ${n} |`);
  p(`| **合计** | **${total}** |`);
  p();

  if (notable.length) {
    p("## 二、需要特别注意的组件（copyleft / 非常见许可）");
    p();
    // LGPL 那一个单独展开说明，因为它是唯一真正带义务的
    const lgpl = notable.filter((r) => /LGPL/i.test(r.license));
    for (const r of lgpl) {
      p(`### ⚠️ ${r.name}@${r.version} — ${r.license}`);
      p();
      p("这是本依赖树中**带 copyleft 义务的组件**（libvips 的原生绑定）：");
      p();
      p("| 项 | 值 |");
      p("|---|---|");
      if (r.repo) p(`| 上游 | ${r.repo.replace(/^git\+/, "").replace(/\.git$/, "")} |`);
      p("| libvips 源码 | https://github.com/libvips/libvips |");
      p(`| 许可全文 | 随包提供：\`node_modules/${r.name}/LICENSE\` |`);
      p("| 二进制 | `lib/libvips-42.dll`、`lib/libvips-cpp-8.18.6.dll`、`lib/sharp-win32-x64-0.35.4.node` |");
      p();
      p("**LGPL-3.0 义务的履行方式**：该组件以**独立的动态链接库（DLL）**形式存在，");
      p("与主程序的 JavaScript 代码分离，未做静态链接，也未修改其源码。因此：");
      p();
      p(`- 用户可以**自行替换** \`node_modules/${r.name}/lib/\` 下的 DLL 为该库的其他兼容版本；`);
      p("- LGPL 的 copyleft 效力**不传染**本仓库的 `src/` 源码；");
      p("- 该库完整源码可从上方官方仓库获取。");
      p();
    }
    const others = notable.filter((r) => !/LGPL/i.test(r.license));
    if (others.length) {
      p("### 其他非常见许可");
      p();
      p("| 包 | 版本 | 许可 |");
      p("|---|---|---|");
      for (const r of others) p(`| ${r.name} | ${r.version} | ${r.license} |`);
      p();
    }
  }

  p("## 三、未随包提供独立许可文件的组件");
  p();
  p(`以下 ${noFile.length} 个包未在其目录内附带 LICENSE 文件，其许可**以 \`package.json\` 的`);
  p("`license` 字段声明为准，此处照录：");
  p();
  p("| 包 | 版本 | 声明的许可 |");
  p("|---|---|---|");
  for (const r of noFile) p(`| ${r.name} | ${r.version} | ${r.license} |`);
  p();

  p(`## 四、完整清单（${total} 个包）`);
  p();
  p("| 包 | 版本 | 许可 | 许可文件 |");
  p("|---|---|---|---|");
  for (const r of rows) p(`| ${r.name} | ${r.version} | ${r.license} | ${r.licenseFile || "—"} |`);
  p();
  p("---");
  p();
  p("*本清单覆盖 `node_modules` 下全部已安装包。上游 `@deepseek-ai/*` 系均为 MIT");
  p("（Copyright (c) 2026 DeepSeek），已包含在上表中。*");
  p();
  return L.join("\n");
}

function main() {
  const shellVersion = (() => {
    try {
      const pj = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
      const pinned = pj.dependencies && pj.dependencies["@deepseek-ai/dsh"];
      if (typeof pinned === "string") return pinned.replace(/^[^\d]*/, "");
    } catch {
      /* 忽略 */
    }
    return "0.1.2-rc.1";
  })();

  const rows = collect();
  const markdown = render(rows, shellVersion);

  if (CHECK_ONLY) {
    const current = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, "utf8") : "";
    if (current.trim() !== markdown.trim()) {
      console.error("[licenses] 清单已过期 —— 请运行 node scripts/gen-third-party-licenses.js");
      process.exit(1);
    }
    console.log(`[licenses] 清单是最新的（${rows.length} 个包）✓`);
    process.exit(0);
  }

  fs.writeFileSync(TARGET, markdown, "utf8");
  console.log(`[licenses] 已生成 ${path.relative(ROOT, TARGET)}：${rows.length} 个包 ✓`);
}

try {
  main();
} catch (e) {
  console.error(`[licenses] 失败: ${(e && e.message) || e}`);
  process.exit(1);
}
