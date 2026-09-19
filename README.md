# DeepSeek Harness 桌面版 · 社区定制版

![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20x64-blue)
![Base](https://img.shields.io/badge/base-%40deepseek--ai%2Fdsh%400.1.2--rc.1-informational)

> ⚠️ **社区修改版，非官方出品。**
> 本项目是以下两层的 **MIT 衍生作品**，与 DeepSeek 官方及 chyra-moon 原版均**无隶属或背书关系**：
> DeepSeek Harness 本体、`@deepseek-ai/*` 软件包与官方前端版权归 [deepseek-ai](https://github.com/deepseek-ai) 及其贡献者所有。

把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 官方网页版装进 Windows 桌面应用 —— **同一个界面、同一个服务器，双击即用**。

---

## 一、归因与来源（Attribution）

本仓库**不是从零开始的项目**，而是在社区桌面封装的基础上做了重度定制。三层归属如下：

| 层 | 版权人 | 原始项目 | 许可证 |
|---|---|---|---|
| ① 官方核心 | DeepSeek | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | MIT |
| ② 桌面外壳（基底） | chyra-moon | [chyra-moon/deepseek-harness-desktop](https://github.com/chyra-moon/deepseek-harness-desktop) | MIT |
| ③ **本定制版** | 陈黛华 / [18477514055](https://github.com/18477514055) | [18477514055/DeepseekHarness-Desktop](https://github.com/18477514055/DeepseekHarness-Desktop) | MIT |

**钉死的官方版本**：内嵌 `@deepseek-ai/dsh@0.1.2-rc.1`（见 `package.json` 的 `dependencies`，
以及 `src/main.js` 的 `BUNDLED_DSH_SPEC`）。

> ⚠️ **rc 版本风险提示**：本项目基于官方**尚未正式发布**的 rc（release candidate）版本。
> 官方后续版本可能引入不兼容变更，本项目**不保证**与之向前或向后兼容。

### 本定制版相对上游改了什么

改动**全部集中在桌面封装层**，核心边界是 **`src/main.js` 一个文件**。
内嵌的官方运行时 `@deepseek-ai/*`（229 个包）**未作任何修改**，仅通过 `require` 加载。

| # | 改动 | 位置 |
|---|---|---|
| 1 | `FreeConsole` 主动脱离父控制台，消除残留空终端窗口 | `src/main.js` |
| 2 | `disableHardwareAcceleration()` 规避远程桌面 / 无 GPU 环境的 Chromium fail-fast | `src/main.js` |
| 3 | **版本钉死** `BUNDLED_DSH_SPEC`：防止 npx 回退解析到跨世代内核、重写插件模块镜像导致应用起不来 | `src/main.js` |
| 4 | **profile 覆盖开关**：`profile.txt` 可切换启动 profile，含"指向已删除 profile 时回退 web"防呆 | `src/main.js` |
| 5 | **外壳日志落盘**（`shell.log`）：打包版无控制台时，探活失败/自动恢复/内核退出等关键行不再丢失 | `src/main.js` |
| 6 | **探活阈值放宽**：单次探活 1.5s→5s，连续失败 1 次→3 次才判定掉线（避免重活时误杀正在服务的内核） | `src/main.js` |
| 7 | **恢复失败后持续重试**：旧逻辑在恢复失败后 `serverUrl` 为空、探活直接 return，应用会永久卡死 | `src/main.js` |
| 8 | **内核退出诊断**：记录"被杀还是自崩、运行时长、由谁启动"，用于定位闪退 | `src/main.js` |
| 9 | 被放弃的启动必须 `killTree`，防止孤儿内核占端口并重写插件镜像 | `src/main.js` |
| 10 | 目录选择器 `browse` 模式（借 `SSH_CONNECTION` 绕过远程桌面下原生对话框崩溃） | `src/main.js` |

---

## 二、功能特性

- 🎯 **零配置**：不用装 Node.js、不用敲命令，装完双击就是官方界面（一比一加载官方前端，不是仿制皮肤）
- 🐳 **服务器内置**：应用自己托管官方 dsh 服务器；你已开着网页版/CLI 时自动复用，会话数据互通
- 🔄 **断线自愈**：外部服务器被关掉？应用 5 秒内自动接管重启，页面自动恢复，不会"界面还在但发不了消息"
- 🖥 **正经桌面体验**：托盘驻留、窗口记忆、单实例、崩溃自动重启、无菜单栏纯净窗口
- 🐋 **鲸鱼加载动画**：官方鲸鱼由蓝/白光点构成，呼吸式起伏

快捷键：`Ctrl+Shift+I` 开发者工具 · `Ctrl+R` / `F5` 重载 · `Ctrl+Shift+O` 在浏览器打开。
关闭窗口会驻留托盘，托盘右键可退出或查看关于信息。

---

## 三、从源码构建

```bash
npm install            # 安装依赖（postinstall 会给官方包打中文路径补丁）
npm start              # 直接运行
npm run dist           # 打包（安装版 + 便携版 + 解压版，并自动完整性校验）
```

其他常用命令：

```bash
npm run verify              # 单独跑打包完整性校验
npm run smoke               # 冒烟测试（校验官方前端是否正常注入 __DSH_BOOT__）
npm run licenses            # 重新生成 THIRD-PARTY-LICENSES.md
npm run licenses:check      # 校验第三方清单是否为最新（CI 用）
npm run update:dsh          # 一键升级官方 dsh 并重新出包
```

---

## 四、仓库框架说明（给后续开发）

> 本节是为**后续大量功能迭代**准备的骨架说明。改动前请先读
> [`CONTRIBUTING.md`](CONTRIBUTING.md) 与 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

```
.
├── src/                          # ★ 桌面封装层 —— 你的主战场
│   ├── main.js                   #   主进程（服务器托管 / 窗口 / 托盘 / 自愈）
│   ├── preload.js                #   预加载脚本（contextIsolation 开启）
│   ├── status-page.js            #   启动/更新状态页（鲸鱼动画）
│   ├── updater.js                #   自动更新
│   └── whale-path.json           #   鲸鱼动画路径数据
├── scripts/                      # 构建与合规脚本
│   ├── gen-third-party-licenses.js  # ★ 生成第三方许可清单
│   ├── patch-dsh.js              #   官方包中文路径 UTF-16 补丁
│   ├── verify-package.js         #   出包完整性校验
│   └── update-dsh.js             #   官方版本升级助手
├── docs/                         # ★ 架构与开发文档
│   ├── ARCHITECTURE.md           #   架构分层与边界
│   └── CHANGELOG.md              #   改动记录
├── .github/workflows/ci.yml      # CI
├── LICENSE                       # MIT（三层署名）
├── THIRD-PARTY-LICENSES.md       # 590 个第三方包的许可清单（自动生成）
└── package.json                  # 依赖 + electron-builder 打包配置
```

### 三条硬规则（改代码前务必知道）

1. **只改 `src/`** —— `node_modules/` 下是官方运行时，改了会被 `npm install` 覆盖，
   而且等于 fork 官方内核，会让所有插件失效。
2. **不要动 `BUNDLED_DSH_SPEC` 的钉版本逻辑** —— 它是刻意钉死的，防止跨世代内核重写插件镜像。
3. **改了依赖或升级官方版本后，必须跑 `npm run licenses`** —— 否则第三方许可清单会过期，
   发布物将不满足 MIT 的保留义务（CI 会用 `licenses:check` 拦下）。

---

## 五、常见问题

- **杀毒软件报毒**：社区未签名应用的常见误报；源码全部公开，可自行审计或从源码构建
- **不想关窗口驻留托盘**：在应用数据目录的 `settings.json` 里设置 `"closeToTray": false`
- **工作区选择器打不开**（远程桌面环境）：`settings.json` 里设置 `"directoryPicker": "browse"`
- **中文路径添加工作区失败**：官方 0.1.1 系列原生目录选择器存在 UTF-16 截断 bug，
  本项目已在打包时自动修复（见 `scripts/patch-dsh.js`）
- **想用最新官方版**：跑官方最新的 `npx @deepseek-ai/dsh web`，桌面版会自动复用

---

## 六、许可

本项目以 **[MIT](LICENSE)** 协议发布 —— 与它的两层上游一致。

- MIT 允许你自由使用、修改、分发（含闭源分发），**但要求保留版权与许可声明**。
- 因此本仓库的 [`LICENSE`](LICENSE) 保留了 **DeepSeek**、**chyra-moon** 与本定制版作者的
  三层版权行；[`THIRD-PARTY-LICENSES.md`](THIRD-PARTY-LICENSES.md) 汇总了全部 590 个
  第三方依赖的许可，其中包含 **1 个 LGPL-3.0-or-later 组件**
  （`@img/sharp-win32-x64`，以独立 DLL 动态加载，详见该文件第二节）。
