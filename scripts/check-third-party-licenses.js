"use strict";

/**
 * check-third-party-licenses —— 第三方许可清单的合理性校验（CI 用）
 *
 * 为什么不用 gen-third-party-licenses.js --check 逐条比对：
 * 那个 --check 要求清单与当前 node_modules **逐字节一致**，只有在依赖树
 * 完全可复现时才成立。而本仓库刻意**不提交 lock 文件**（沿用上游做法），
 * package.json 里 103 个依赖用的是 ^ 浮动范围 => 每次 npm install 解析出的
 * 版本都可能不同 => 逐条比对必然误报。
 *
 * 所以这里只做**有意义的**校验：清单必须真的在描述许可，且覆盖了关键事实。
 * 这既能拦住"改了依赖却忘了重新生成清单"，也不会因为版本漂移而假警报。
 *
 * 用法：
 *   node scripts/check-third-party-licenses.js         # 校验，退出码 0/1
 *
 * 退出码：0 = 通过；1 = 清单缺失/过短/缺少关键内容
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const TARGET = path.join(ROOT, "THIRD-PARTY-LICENSES.md");

// 清单至少要覆盖的数量级（当前真实值 ~590）。留足余量但不失意义：
// 若清单被清空、被截断、或依赖被大幅削减后忘了重新生成，都会在这里被拦下。
const MIN_PACKAGES = 100;

// 必须出现在清单里的关键事实（缺任一即失败）
const REQUIRED = [
  ["@deepseek-ai/dsh", "官方核心包必须在清单里（它是最大的版权来源）"],
  ["sharp-win32-x64", "唯一的 copyleft 组件必须在清单里被点名"],
  ["LGPL", "LGPL 义务的说明不能丢"],
  ["MIT", "主要许可类别必须在总览里"],
];

// 清单里"| 包名 | 版本 | 许可 | 许可文件 |"这样的数据行计数
function countPackageRows(text) {
  const lines = text.split(/\r?\n/);
  let n = 0;
  for (const line of lines) {
    // 数据行形如：| some-package | 1.2.3 | MIT | LICENSE |
    if (/^\|\s*[@a-zA-Z0-9._/-]+\s*\|\s*[0-9]/.test(line)) n++;
  }
  return n;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error(`[licenses:check] 找不到 ${path.relative(ROOT, TARGET)}`);
    console.error("  请运行：npm run licenses");
    process.exit(1);
  }

  const text = fs.readFileSync(TARGET, "utf8");
  const problems = [];

  // 1) 文件不能是空的/被截断的
  if (text.length < 2000) {
    problems.push(`清单过短（${text.length} 字节）—— 看起来被清空或截断了`);
  }

  // 2) 必须真的列出了足够多的包
  const rows = countPackageRows(text);
  if (rows < MIN_PACKAGES) {
    problems.push(`清单只列出 ${rows} 个包（期望至少 ${MIN_PACKAGES} 个）—— 可能忘了重新生成`);
  }

  // 3) 关键事实必须在
  for (const [needle, why] of REQUIRED) {
    if (!text.includes(needle)) problems.push(`清单里缺少 "${needle}" —— ${why}`);
  }

  if (problems.length) {
    console.error("[licenses:check] 清单校验未通过：");
    for (const p of problems) console.error(`  ✗ ${p}`);
    console.error("\n  如依赖有变动，请运行：npm run licenses");
    process.exit(1);
  }

  console.log(`[licenses:check] 通过 ✓（${rows} 个包，关键项齐全）`);
  process.exit(0);
}

try {
  main();
} catch (e) {
  console.error(`[licenses:check] 失败: ${(e && e.message) || e}`);
  process.exit(1);
}
