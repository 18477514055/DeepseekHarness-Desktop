# 贡献指南 / Contributing

感谢你有兴趣改进本项目。动手前请先读 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)。

## 一、三条硬规则

1. **只改 `src/`。**
   `node_modules/` 下是官方运行时（229 个 `@deepseek-ai/*` 包 + 361 个第三方包）。
   修改它们**会被 `npm install` 覆盖**，而且等于 fork 官方内核 ——
   会让所有 dsh 插件的服务身份校验失败。**不要改。**

2. **不要动 `BUNDLED_DSH_SPEC` 的钉版本逻辑。**
   它是刻意钉死的，用于防止 npx 回退解析到跨世代内核、进而重写插件的模块镜像
   （症状：装了插件后应用再也起不来，重装也没用）。
   详见 `docs/ARCHITECTURE.md` 的"服务器获取策略"。

3. **改了依赖或升级官方版本后，必须跑 `npm run licenses`。**
   否则 `THIRD-PARTY-LICENSES.md` 会过期，发布物将不满足 MIT 的保留义务。
   CI 会用 `npm run licenses:check` 拦下过期清单。

## 二、开发流程

```bash
git clone https://github.com/18477514055/DeepseekHarness-Desktop.git
cd DeepseekHarness-Desktop
npm install
npm start              # 直接运行
npm run smoke          # 冒烟测试（校验官方前端是否正常注入 __DSH_BOOT__）
```

改完代码后：

```bash
npm run licenses:check    # 确认第三方清单未过期
npm run dist              # 出包（会自动完整性校验）
```

## 三、提交规范

- 提交信息用**中文或英文均可**，但请说明**为什么**改，而不只是改了什么。
- 涉及 `src/` 的行为变更，请在 `docs/CHANGELOG.md` 的"未发布"区加一条。
- 一次提交只做一件事，不要把重构和功能混在一起。

## 四、许可与署名（重要）

本项目是 MIT 衍生作品。**提交代码即表示你同意以 MIT 许可授权你的贡献。**

- **不要删除** `LICENSE` 里的任何一层版权行，也不要删除 `THIRD-PARTY-LICENSES.md`。
- 如果你的贡献引入了**新的第三方依赖**，必须：
  1. 跑 `npm run licenses` 重新生成清单；
  2. 若引入的是 copyleft（GPL/LGPL/AGPL/MPL）组件，**请在 PR 描述里显式说明**
     并论证其义务如何履行 —— 这类依赖可能影响本项目的分发方式。
- 本项目的**原始著作权**归三层作者所有，不接受"移除上游署名"的改动。

## 五、什么改动大概率会被接受

| 欢迎 | 慎重 / 可能被拒 |
|---|---|
| 桌面层健壮性改进（自愈、日志、错误处理） | 改 `node_modules/` 下的官方包 |
| 窗口/托盘/原生集成体验优化 | 注入或魔改官方前端 UI |
| 文档、CI、构建流程改进 | 把 `BUNDLED_DSH_SPEC` 改成浮动版本 |
| 新增可选的设置项（保持向后兼容默认值） | 引入 copyleft 依赖而不说明 |
| 让桌面层更薄的重构 | 在桌面层塞入本应做成 dsh 插件的业务功能 |

> 💡 **想加功能？优先做成 dsh 插件。** 插件层位于 `~/.dsh/profiles/<profile>/`，
> 通过 `package.json` 的 `dsh.profile.bundles` 注册，与本仓库物理隔离 ——
> 这样既不用改桌面层，也不会被官方升级打断。

## 六、报告问题

请提供：应用版本、Windows 版本、复现步骤，以及这两个日志文件的内容：

- `%APPDATA%\DeepSeek Harness\shell.log` —— 外壳日志（探活、恢复、内核退出）
- `%APPDATA%\DeepSeek Harness\server.log` —— 内核日志（含插件报错）

安全漏洞请走 [`SECURITY.md`](SECURITY.md) 的私下渠道，**不要开公开 issue**。
