# 改动记录 / Changelog

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。
版本号沿用上游 `0.1.2-rc.1`，本定制版以 `+community.N` 后缀区分。

## [0.1.2-rc.1+community.0] — 2026-09-19

### 合规改造（本次）

> 目标：让本仓库可以作为"自己的社区版"合法推送到公开仓库。
> **本次改动不涉及任何运行时代码逻辑** —— 只改文档、许可与打包配置。

#### 新增
- **`THIRD-PARTY-LICENSES.md`** —— 590 个第三方依赖的完整许可清单（自动生成）。
  其中点名了唯一的 copyleft 组件 `@img/sharp-win32-x64`（`Apache-2.0 AND LGPL-3.0-or-later`），
  并说明其 LGPL 义务的履行方式（独立 DLL 动态加载，可替换）。
- **`scripts/gen-third-party-licenses.js`** —— 许可清单生成器，支持 `--check` 供 CI 校验，
  保证清单永远与 `node_modules` 实际内容一致（不会随依赖变动而过期）。
- **`docs/ARCHITECTURE.md`** —— 架构分层、进程数据流、自愈机制、扩展点。
- **`docs/CHANGELOG.md`** —— 本文件。
- **`CONTRIBUTING.md`** —— 开发约定与"只改 src/"等硬规则。
- **`SECURITY.md`** —— 漏洞报告方式。
- `docs/历史-合规交接-2026-09-18.md` —— 归档上一场对话的合规交接文档。

#### 变更
- **`LICENSE`** —— 版权行由泛化的 `DeepSeek Harness Desktop contributors`
  改为**三层明确署名**：DeepSeek（官方核心）、chyra-moon（桌面外壳原作者）、
  本定制版作者。**MIT 正文一字未改。**
  > 这是本次最重要的合规修复：MIT 强制要求版权声明随所有副本保留，
  > 而原 `LICENSE` 未点名外壳原作者。
- **`README.md`** —— 重写。增加三层归因表、钉死的官方版本号与 rc 风险提示、
  "本定制版相对上游改了什么"（10 项改动逐条列出）、仓库框架说明与三条硬规则。
- **`package.json`**
  - `author` 具体化为实际作者；新增 `contributors` 记录两层上游。
  - 新增 `homepage` / `repository` / `bugs`。
  - `version` 加 `+community.0` 后缀。
  - `build.copyright` 修正**编码乱码**（原为 `Copyright 漏 2026 …`）。
  - `build.files` 纳入 `LICENSE` / `THIRD-PARTY-LICENSES.md` / `README.md`，
    并排除 `src/**/*.bak-*` 与 `**/*.map`。
  - 新增脚本 `licenses`、`licenses:check`；`dist` 前置自动跑 `licenses`。
- **`.gitignore`** —— 补充忽略 `*.bak-*`、`dist-log.txt`、`_gen-*` 等。

#### 移除
- **`src/main.js.bak-*`（6 个）** —— 上游迭代备份，改由 git 历史承担。
- **`dist-log.txt`** —— 构建产物日志，含本机路径。
- **根目录的 `00-合规交接-给打包对话.md`** —— 交接文档不应随分发包发布，已移入 `docs/` 归档。

---

## 上游历史

本版本之前的所有改动（相对 chyra-moon 原版）见 `README.md` 的
"本定制版相对上游改了什么"一节，或 `git log`。

### 相对上游已做的桌面层改动（汇总）

1. `FreeConsole` 脱离父控制台
2. `disableHardwareAcceleration()` 规避 GPU fail-fast
3. `BUNDLED_DSH_SPEC` 版本钉死（防插件镜像被跨世代重写）
4. `profile.txt` profile 覆盖开关（含回退防呆）
5. 外壳日志 `shell.log` 落盘
6. 探活阈值放宽（1.5s→5s，1 次→3 次）
7. 恢复失败后持续重试
8. 内核退出诊断（被杀/自崩、时长、原因）
9. 放弃的启动强制 `killTree`（防孤儿内核）
10. 目录选择器 `browse` 模式（绕过远程桌面原生对话框崩溃）
