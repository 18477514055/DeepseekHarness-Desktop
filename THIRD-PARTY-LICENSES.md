# 第三方依赖许可清单 / Third-Party Licenses

> 本文件由 `scripts/gen-third-party-licenses.js` 从 `node_modules` 自动生成，请勿手工编辑。
> 生成基准：`@deepseek-ai/dsh@0.1.2-rc.1` 内置的完整依赖树。
> 重新生成：`node scripts/gen-third-party-licenses.js`
> 对应仓库：https://github.com/18477514055/DeepseekHarness-Desktop

本软件以 MIT 许可发布（见 [LICENSE](LICENSE)）。它同时打包了下列第三方组件，
各组件仍按其**自身**的许可条款授权，其版权归各自的作者所有。

## 一、许可分布总览

| 许可证 | 包数量 |
|---|---|
| MIT | 503 |
| Apache-2.0 | 55 |
| BSD-3-Clause | 15 |
| ISC | 11 |
| BSD-2-Clause | 2 |
| Apache-2.0 AND LGPL-3.0-or-later | 1 |
| Python-2.0 | 1 |
| BlueOak-1.0.0 | 1 |
| 0BSD | 1 |
| **合计** | **590** |

## 二、需要特别注意的组件（copyleft / 非常见许可）

### ⚠️ @img/sharp-win32-x64@0.35.4 — Apache-2.0 AND LGPL-3.0-or-later

这是本依赖树中**带 copyleft 义务的组件**（libvips 的原生绑定）：

| 项 | 值 |
|---|---|
| 上游 | https://github.com/lovell/sharp |
| libvips 源码 | https://github.com/libvips/libvips |
| 许可全文 | 随包提供：`node_modules/@img/sharp-win32-x64/LICENSE` |
| 二进制 | `lib/libvips-42.dll`、`lib/libvips-cpp-8.18.6.dll`、`lib/sharp-win32-x64-0.35.4.node` |

**LGPL-3.0 义务的履行方式**：该组件以**独立的动态链接库（DLL）**形式存在，
与主程序的 JavaScript 代码分离，未做静态链接，也未修改其源码。因此：

- 用户可以**自行替换** `node_modules/@img/sharp-win32-x64/lib/` 下的 DLL 为该库的其他兼容版本；
- LGPL 的 copyleft 效力**不传染**本仓库的 `src/` 源码；
- 该库完整源码可从上方官方仓库获取。

### 其他非常见许可

| 包 | 版本 | 许可 |
|---|---|---|
| argparse | 2.0.1 | Python-2.0 |
| sax | 1.6.1 | BlueOak-1.0.0 |

## 三、未随包提供独立许可文件的组件

以下 10 个包未在其目录内附带 LICENSE 文件，其许可**以 `package.json` 的
`license` 字段声明为准，此处照录：

| 包 | 版本 | 声明的许可 |
|---|---|---|
| @aws-sdk/credential-provider-http | 3.972.72 | Apache-2.0 |
| @aws-sdk/credential-provider-login | 3.972.77 | Apache-2.0 |
| @aws-sdk/nested-clients | 3.997.44 | Apache-2.0 |
| @cfworker/json-schema | 4.1.1 | MIT |
| @earendil-works/pi-ai | 0.84.4 | MIT |
| @earendil-works/pi-telemetry | 0.84.4 | MIT |
| @koromix/koffi-win32-x64 | 3.2.0 | MIT |
| @xterm/headless | 6.0.0 | MIT |
| data-uri-to-buffer | 4.0.1 | MIT |
| lazy-val | 1.0.5 | MIT |

## 四、完整清单（590 个包）

| 包 | 版本 | 许可 | 许可文件 |
|---|---|---|---|
| @agentclientprotocol/sdk | 1.4.0 | Apache-2.0 | LICENSE |
| @anthropic-ai/sdk | 0.91.1 | MIT | LICENSE |
| @aws-crypto/sha256-browser | 5.2.0 | Apache-2.0 | LICENSE |
| @aws-crypto/sha256-js | 5.2.0 | Apache-2.0 | LICENSE |
| @aws-crypto/supports-web-crypto | 5.2.0 | Apache-2.0 | LICENSE |
| @aws-crypto/util | 5.2.0 | Apache-2.0 | LICENSE |
| @aws-sdk/client-bedrock-runtime | 3.1048.0 | Apache-2.0 | LICENSE |
| @aws-sdk/core | 3.977.9 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-env | 3.972.70 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-http | 3.972.72 | Apache-2.0 | — |
| @aws-sdk/credential-provider-ini | 3.973.15 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-login | 3.972.77 | Apache-2.0 | — |
| @aws-sdk/credential-provider-node | 3.972.82 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-process | 3.972.70 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-sso | 3.973.14 | Apache-2.0 | LICENSE |
| @aws-sdk/credential-provider-web-identity | 3.972.76 | Apache-2.0 | LICENSE |
| @aws-sdk/eventstream-handler-node | 3.972.34 | Apache-2.0 | LICENSE |
| @aws-sdk/middleware-eventstream | 3.972.29 | Apache-2.0 | LICENSE |
| @aws-sdk/middleware-websocket | 3.972.52 | Apache-2.0 | LICENSE |
| @aws-sdk/nested-clients | 3.997.44 | Apache-2.0 | — |
| @aws-sdk/signature-v4-multi-region | 3.996.46 | Apache-2.0 | LICENSE |
| @aws-sdk/token-providers | 3.1048.0 | Apache-2.0 | LICENSE |
| @aws-sdk/types | 3.974.5 | Apache-2.0 | LICENSE |
| @aws-sdk/util-locate-window | 3.965.10 | Apache-2.0 | LICENSE |
| @aws-sdk/xml-builder | 3.972.40 | Apache-2.0 | LICENSE |
| @aws/lambda-invoke-store | 0.3.0 | Apache-2.0 | LICENSE |
| @babel/code-frame | 7.29.7 | MIT | LICENSE |
| @babel/helper-validator-identifier | 7.29.7 | MIT | LICENSE |
| @babel/runtime | 7.29.7 | MIT | LICENSE |
| @cfworker/json-schema | 4.1.1 | MIT | — |
| @deepseek-ai/cordis | 4.0.2 | MIT | LICENSE |
| @deepseek-ai/cordis-plugin-group | 1.0.1 | MIT | LICENSE |
| @deepseek-ai/cordis-plugin-hmr | 1.0.17 | MIT | LICENSE |
| @deepseek-ai/cordis-plugin-include | 1.0.7 | MIT | LICENSE |
| @deepseek-ai/cordis-plugin-loader | 1.0.3 | MIT | LICENSE |
| @deepseek-ai/cordis-plugin-timer | 1.1.4 | MIT | LICENSE |
| @deepseek-ai/cosmokit | 1.8.3 | MIT | LICENSE |
| @deepseek-ai/dsh | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-acp | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-acp-app | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent-default-model | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent-instructions | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent-loop | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent-presets | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-agent-tool-presentation | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-anonymous-user-id | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-api-gateway | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-api-remotes | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-api-session-controller | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-api-settings-controller | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-api-workspace-controller | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-app-boot | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-atomic-write | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-attachment | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-attachment-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-authorization | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-base | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-bash-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-bash-sandbox | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-brand | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-connection | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-hmr | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-locale | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-modules | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-runtime | 0.1.1-rc.2 | MIT | LICENSE |
| @deepseek-ai/dsh-client-schema-form | 0.1.0-rc.7 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-agent-preset | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-approval | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-attachment | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-brand-official | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-chat | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-commands | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-conversation | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-cordis | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-deliverables | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-directory-picker-browse | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-directory-picker-native | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-goal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-input-trigger | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-jobs | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-layout | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-message-feedback | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-model-selection | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-permission-presets | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-plan | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-primitives | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-reference | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-renderer | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-schedule | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-session | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-settings | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-settings-general | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-settings-models | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-settings-plugin-inventory | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-settings-plugins | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-sidebar | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-skill | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-slots | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-subagent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-theme | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-tool | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-trajectory | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-user-questions | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-workflow-run | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-ui-workspace | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-client-web-react | 0.1.0-rc.7 | MIT | LICENSE |
| @deepseek-ai/dsh-cmdline | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-code-runtime | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-code-runtime-worker-thread | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-command-compact | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-command-feedback | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-command-goal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-commands | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-compaction | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-compaction-basic | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-compaction-tool-result-pruner | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-cordis-client-runner | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-cordis-host-runner | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-credentials | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-credentials-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-deepseek-llm-api-extensions | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-deque | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-file-reference | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-file-reference-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-fs | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-fs-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-fs-observation-policy | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-fs-sandbox | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-goal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-goal-round-driver | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-headless | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-home-paths | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-hook-protocol | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-hooks-claude-code | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-hooks-codex | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-apiproxy | 0.1.1-rc.2 | MIT | LICENSE |
| @deepseek-ai/dsh-host-directory-picker | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-directory-picker-auto | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-directory-picker-browse | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-directory-picker-native | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-frontend-static | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-plugin-inventory | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-host-webserver | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-invariants | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-jobs | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-jobs-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-launch-environment | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-llm | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-llm-deepseek | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-llm-pi-ai | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-llm-retry | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-mcp-client | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-message-feedback | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-native-command | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-output-retention | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-permission-presets | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-persona | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-plan-mode | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-plugin-package-inventory-deepseek | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-pwsh-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-pwsh-sandbox | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-repeat-tool-reminder | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sandbox | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sandbox-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sandbox-policy | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sandbox-windows-acl | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-schedule | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-scope | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sdk-app | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sdk-jsonrpc-server | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sdk-minimal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-sdk-protocol | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-checkpoint-policy | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-log-deepseek | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-log-export | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-persistence | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-persistence-jsonl | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-projection | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-projection-cache | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-query | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-query-sqlite | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-reference | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-stats | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-telemetry | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-telemetry-otel | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-title | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-title-first-prompt-llm | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-title-llm | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-session-turn-outline | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-settings | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-settings-file | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-shell | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-shell-env | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-skill | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-skill-badge | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-skill-filesystem | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-spill | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-spill-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-spill-policy | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-storage | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-storage-domain | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-storage-json | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subagent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subagent-fork-in-process | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subagent-in-process-driver | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subagent-spawn-in-process | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subprocess | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-subprocess-local | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-system-prompt | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-terminal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-terminal-bash | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-time-context | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-timeout | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tmux-context | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-token-meter | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-ask-user | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-bash | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-bash-persistent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-call-timeout-policy | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-cordis | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-fs | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-fs-search | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-goal | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-jobs | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-pwsh | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-pwsh-persistent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-ralph | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-skill | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-str-replace-editor | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-subagent | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-subagent-control | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-todo | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-web | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tool-workflow | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-tools | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-typert-loader | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-typert-protocol | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-typert-registry | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-user-approval | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-user-questions | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-util-crypto | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-util-time | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-util-values | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-util-workspace-path | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-web | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-web-app | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-web-fetch-http | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-web-frontend | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-web-search-deepseek | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-webhook | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-webhook-github | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-win32-process | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-workflow | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-workflow-worker-thread | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/dsh-workspace | 0.1.2-rc.1 | MIT | LICENSE |
| @deepseek-ai/node-addon-landlock-run | 0.1.1 | BSD-3-Clause | LICENSE |
| @deepseek-ai/schemastery | 3.18.2 | MIT | LICENSE |
| @earendil-works/pi-ai | 0.84.4 | MIT | — |
| @earendil-works/pi-telemetry | 0.84.4 | MIT | — |
| @google/genai | 1.52.0 | Apache-2.0 | LICENSE |
| @hono/node-server | 2.1.1 | MIT | LICENSE |
| @img/colour | 1.1.0 | MIT | LICENSE.md |
| @img/sharp-win32-x64 | 0.35.4 | Apache-2.0 AND LGPL-3.0-or-later | LICENSE |
| @joplin/turndown-plugin-gfm | 1.0.67 | MIT | LICENSE |
| @koromix/koffi-win32-x64 | 3.2.0 | MIT | — |
| @lexical/clipboard | 0.49.0 | MIT | LICENSE |
| @lexical/dragon | 0.49.0 | MIT | LICENSE |
| @lexical/extension | 0.49.0 | MIT | LICENSE |
| @lexical/history | 0.49.0 | MIT | LICENSE |
| @lexical/html | 0.49.0 | MIT | LICENSE |
| @lexical/internal | 0.49.0 | MIT | LICENSE |
| @lexical/list | 0.49.0 | MIT | LICENSE |
| @lexical/plain-text | 0.49.0 | MIT | LICENSE |
| @lexical/selection | 0.49.0 | MIT | LICENSE |
| @lexical/text | 0.49.0 | MIT | LICENSE |
| @lexical/utils | 0.49.0 | MIT | LICENSE |
| @mixmark-io/domino | 2.2.0 | BSD-2-Clause | LICENSE |
| @modelcontextprotocol/sdk | 1.30.0 | MIT | LICENSE |
| @octokit/openapi-types | 29.0.1 | MIT | LICENSE |
| @octokit/openapi-webhooks-types | 12.1.0 | MIT | LICENSE |
| @octokit/request-error | 7.1.2 | MIT | LICENSE |
| @octokit/types | 18.0.0 | MIT | LICENSE |
| @octokit/webhooks | 14.2.0 | MIT | LICENSE.md |
| @octokit/webhooks-methods | 6.0.0 | MIT | LICENSE |
| @opentelemetry/api | 1.9.1 | Apache-2.0 | LICENSE |
| @opentelemetry/api-logs | 0.220.0 | Apache-2.0 | LICENSE |
| @opentelemetry/core | 2.9.0 | Apache-2.0 | LICENSE |
| @opentelemetry/exporter-logs-otlp-http | 0.220.0 | Apache-2.0 | LICENSE |
| @opentelemetry/otlp-exporter-base | 0.220.0 | Apache-2.0 | LICENSE |
| @opentelemetry/otlp-transformer | 0.220.0 | Apache-2.0 | LICENSE |
| @opentelemetry/resources | 2.11.0 | Apache-2.0 | LICENSE |
| @opentelemetry/sdk-logs | 0.220.0 | Apache-2.0 | LICENSE |
| @opentelemetry/sdk-metrics | 2.9.0 | Apache-2.0 | LICENSE |
| @opentelemetry/sdk-trace | 2.9.0 | Apache-2.0 | LICENSE |
| @opentelemetry/semantic-conventions | 1.43.0 | Apache-2.0 | LICENSE |
| @preact/signals-core | 1.14.4 | MIT | LICENSE |
| @protobufjs/aspromise | 1.1.2 | BSD-3-Clause | LICENSE |
| @protobufjs/base64 | 1.1.2 | BSD-3-Clause | LICENSE |
| @protobufjs/codegen | 2.0.5 | BSD-3-Clause | LICENSE |
| @protobufjs/eventemitter | 1.1.1 | BSD-3-Clause | LICENSE |
| @protobufjs/fetch | 1.1.1 | BSD-3-Clause | LICENSE |
| @protobufjs/float | 1.0.2 | BSD-3-Clause | LICENSE |
| @protobufjs/path | 1.1.2 | BSD-3-Clause | LICENSE |
| @protobufjs/pool | 1.1.0 | BSD-3-Clause | LICENSE |
| @protobufjs/utf8 | 1.1.2 | BSD-3-Clause | LICENSE |
| @shikijs/core | 4.4.3 | MIT | LICENSE |
| @shikijs/engine-javascript | 4.4.3 | MIT | LICENSE |
| @shikijs/engine-oniguruma | 4.4.3 | MIT | LICENSE |
| @shikijs/langs | 4.4.3 | MIT | LICENSE |
| @shikijs/primitive | 4.4.3 | MIT | LICENSE |
| @shikijs/themes | 4.4.3 | MIT | LICENSE |
| @shikijs/types | 4.4.3 | MIT | LICENSE |
| @shikijs/vscode-textmate | 10.0.2 | MIT | LICENSE.md |
| @smithy/core | 3.33.3 | Apache-2.0 | LICENSE |
| @smithy/credential-provider-imds | 4.5.2 | Apache-2.0 | LICENSE |
| @smithy/fetch-http-handler | 5.8.0 | Apache-2.0 | LICENSE |
| @smithy/is-array-buffer | 2.2.0 | Apache-2.0 | LICENSE |
| @smithy/node-http-handler | 4.7.3 | Apache-2.0 | LICENSE |
| @smithy/signature-v4 | 5.7.3 | Apache-2.0 | LICENSE |
| @smithy/types | 4.18.0 | Apache-2.0 | LICENSE |
| @smithy/util-buffer-from | 2.2.0 | Apache-2.0 | LICENSE |
| @smithy/util-utf8 | 2.3.0 | Apache-2.0 | LICENSE |
| @standard-schema/spec | 1.1.0 | MIT | LICENSE |
| @tanstack/react-virtual | 3.14.10 | MIT | LICENSE |
| @tanstack/virtual-core | 3.17.8 | MIT | LICENSE |
| @types/debug | 4.1.13 | MIT | LICENSE |
| @types/hast | 3.0.5 | MIT | LICENSE |
| @types/katex | 0.16.8 | MIT | LICENSE |
| @types/mdast | 4.0.4 | MIT | LICENSE |
| @types/ms | 2.1.0 | MIT | LICENSE |
| @types/node | 22.20.1 | MIT | LICENSE |
| @types/retry | 0.12.0 | MIT | LICENSE |
| @types/trusted-types | 2.0.7 | MIT | LICENSE |
| @types/unist | 3.0.3 | MIT | LICENSE |
| @ungap/structured-clone | 1.3.3 | ISC | LICENSE |
| @vscode/ripgrep | 1.18.0 | MIT | LICENSE |
| @vscode/ripgrep-win32-x64 | 1.18.0 | MIT | LICENSE |
| @xterm/headless | 6.0.0 | MIT | — |
| accepts | 2.0.0 | MIT | LICENSE |
| agent-base | 7.1.4 | MIT | LICENSE |
| ajv | 8.20.0 | MIT | LICENSE |
| ajv-formats | 3.0.1 | MIT | LICENSE |
| anser | 2.3.5 | MIT | LICENSE |
| argparse | 2.0.1 | Python-2.0 | LICENSE |
| base64-js | 1.5.1 | MIT | LICENSE |
| bignumber.js | 9.3.1 | MIT | LICENCE.md |
| body-parser | 2.3.0 | MIT | LICENSE |
| bowser | 2.14.1 | MIT | LICENSE |
| buffer-equal-constant-time | 1.0.1 | BSD-3-Clause | LICENSE.txt |
| bundle-name | 4.1.0 | MIT | license |
| bytes | 3.1.2 | MIT | LICENSE |
| call-bind-apply-helpers | 1.0.2 | MIT | LICENSE |
| call-bound | 1.0.4 | MIT | LICENSE |
| ccount | 2.0.1 | MIT | license |
| character-entities | 2.0.2 | MIT | license |
| character-entities-html4 | 2.1.0 | MIT | license |
| character-entities-legacy | 3.0.0 | MIT | license |
| chokidar | 4.0.3 | MIT | LICENSE |
| clsx | 2.1.1 | MIT | license |
| comma-separated-tokens | 2.0.3 | MIT | license |
| commander | 15.0.0 | MIT | LICENSE |
| compressible | 2.0.18 | MIT | LICENSE |
| compression | 1.8.1 | MIT | LICENSE |
| content-disposition | 1.1.0 | MIT | LICENSE |
| content-type | 1.0.5 | MIT | LICENSE |
| cookie | 0.7.2 | MIT | LICENSE |
| cookie-signature | 1.2.2 | MIT | LICENSE |
| cors | 2.8.6 | MIT | LICENSE |
| cross-spawn | 7.0.6 | MIT | LICENSE |
| data-uri-to-buffer | 4.0.1 | MIT | — |
| debug | 4.4.3 | MIT | LICENSE |
| decode-named-character-reference | 1.3.0 | MIT | license |
| default-browser | 5.5.1 | MIT | license |
| default-browser-id | 5.0.1 | MIT | license |
| define-lazy-prop | 3.0.0 | MIT | license |
| depd | 2.0.0 | MIT | LICENSE |
| dequal | 2.0.3 | MIT | license |
| detect-libc | 2.1.2 | Apache-2.0 | LICENSE |
| devlop | 1.1.0 | MIT | license |
| diff | 9.0.0 | BSD-3-Clause | LICENSE |
| dunder-proto | 1.0.1 | MIT | LICENSE |
| ecdsa-sig-formatter | 1.0.11 | Apache-2.0 | LICENSE |
| ee-first | 1.1.1 | MIT | LICENSE |
| electron-updater | 6.6.0 | MIT | LICENSE |
| encodeurl | 2.0.0 | MIT | LICENSE |
| es-define-property | 1.0.1 | MIT | LICENSE |
| es-errors | 1.3.0 | MIT | LICENSE |
| es-object-atoms | 1.1.2 | MIT | LICENSE |
| escape-html | 1.0.3 | MIT | LICENSE |
| etag | 1.8.1 | MIT | LICENSE |
| eventsource | 3.0.7 | MIT | LICENSE |
| eventsource-parser | 3.1.1 | MIT | LICENSE |
| express | 5.2.1 | MIT | LICENSE |
| express-rate-limit | 8.7.0 | MIT | license |
| extend | 3.0.2 | MIT | LICENSE |
| fast-deep-equal | 3.1.3 | MIT | LICENSE |
| fast-uri | 3.1.5 | BSD-3-Clause | LICENSE |
| fetch-blob | 3.2.0 | MIT | LICENSE |
| fflate | 0.8.3 | MIT | LICENSE |
| finalhandler | 2.1.1 | MIT | LICENSE |
| formdata-polyfill | 4.0.10 | MIT | LICENSE |
| forwarded | 0.2.0 | MIT | LICENSE |
| fresh | 2.0.0 | MIT | LICENSE |
| function-bind | 1.1.2 | MIT | LICENSE |
| gaxios | 7.3.1 | Apache-2.0 | LICENSE |
| gcp-metadata | 8.1.2 | Apache-2.0 | LICENSE |
| get-intrinsic | 1.3.0 | MIT | LICENSE |
| get-proto | 1.0.1 | MIT | LICENSE |
| google-auth-library | 10.9.1 | Apache-2.0 | LICENSE |
| google-logging-utils | 1.1.3 | Apache-2.0 | LICENSE |
| gopd | 1.2.0 | MIT | LICENSE |
| graceful-fs | 4.2.11 | ISC | LICENSE |
| has-symbols | 1.1.0 | MIT | LICENSE |
| hasown | 2.0.4 | MIT | LICENSE |
| hast-util-to-html | 9.0.5 | MIT | license |
| hast-util-whitespace | 3.0.0 | MIT | license |
| hono | 4.13.5 | MIT | LICENSE |
| html-void-elements | 3.0.0 | MIT | license |
| http-errors | 2.0.1 | MIT | LICENSE |
| http-proxy-agent | 7.0.2 | MIT | LICENSE |
| https-proxy-agent | 7.0.6 | MIT | LICENSE |
| iconv-lite | 0.7.3 | MIT | LICENSE |
| immer | 10.2.0 | MIT | LICENSE |
| inherits | 2.0.4 | ISC | LICENSE |
| ip-address | 10.7.0 | MIT | LICENSE |
| ipaddr.js | 2.5.0 | MIT | LICENSE |
| is-in-ssh | 1.0.0 | MIT | license |
| is-inside-container | 1.0.0 | MIT | license |
| is-promise | 4.0.0 | MIT | LICENSE |
| isexe | 2.0.0 | ISC | LICENSE |
| jose | 6.2.10 | MIT | LICENSE.md |
| js-tokens | 4.0.0 | MIT | LICENSE |
| js-yaml | 4.3.1 | MIT | LICENSE |
| json-bigint | 1.0.0 | MIT | LICENSE |
| json-schema-to-ts | 3.1.1 | MIT | LICENSE |
| json-schema-traverse | 1.0.0 | MIT | LICENSE |
| json-schema-typed | 8.0.2 | BSD-2-Clause | LICENSE.md |
| jwa | 2.0.1 | MIT | LICENSE |
| jws | 4.0.1 | MIT | LICENSE |
| katex | 0.16.47 | MIT | LICENSE |
| koffi | 3.2.0 | MIT | LICENSE.txt |
| lazy-val | 1.0.5 | MIT | — |
| lexical | 0.49.0 | MIT | LICENSE |
| lodash.escaperegexp | 4.1.2 | MIT | LICENSE |
| lodash.isequal | 4.5.0 | MIT | LICENSE |
| long | 5.3.2 | Apache-2.0 | LICENSE |
| longest-streak | 3.1.0 | MIT | license |
| loose-envify | 1.4.0 | MIT | LICENSE |
| markdown-table | 3.0.4 | MIT | license |
| math-intrinsics | 1.1.0 | MIT | LICENSE |
| mdast-util-find-and-replace | 3.0.2 | MIT | license |
| mdast-util-from-markdown | 2.0.3 | MIT | license |
| mdast-util-gfm | 3.1.0 | MIT | license |
| mdast-util-gfm-autolink-literal | 2.0.1 | MIT | license |
| mdast-util-gfm-footnote | 2.1.0 | MIT | license |
| mdast-util-gfm-strikethrough | 2.0.0 | MIT | license |
| mdast-util-gfm-table | 2.0.0 | MIT | license |
| mdast-util-gfm-task-list-item | 2.0.0 | MIT | license |
| mdast-util-math | 3.0.0 | MIT | license |
| mdast-util-phrasing | 4.1.0 | MIT | license |
| mdast-util-to-hast | 13.2.1 | MIT | license |
| mdast-util-to-markdown | 2.1.2 | MIT | license |
| mdast-util-to-string | 4.0.0 | MIT | license |
| media-typer | 1.1.1 | MIT | LICENSE |
| merge-descriptors | 2.0.0 | MIT | license |
| micromark | 4.0.2 | MIT | license |
| micromark-core-commonmark | 2.0.3 | MIT | license |
| micromark-extension-gfm | 3.0.0 | MIT | license |
| micromark-extension-gfm-autolink-literal | 2.1.0 | MIT | license |
| micromark-extension-gfm-footnote | 2.1.0 | MIT | license |
| micromark-extension-gfm-strikethrough | 2.1.0 | MIT | license |
| micromark-extension-gfm-table | 2.1.1 | MIT | license |
| micromark-extension-gfm-tagfilter | 2.0.0 | MIT | license |
| micromark-extension-gfm-task-list-item | 2.1.0 | MIT | license |
| micromark-extension-math | 3.1.0 | MIT | license |
| micromark-factory-destination | 2.0.1 | MIT | license |
| micromark-factory-label | 2.0.1 | MIT | license |
| micromark-factory-space | 2.0.1 | MIT | license |
| micromark-factory-title | 2.0.1 | MIT | license |
| micromark-factory-whitespace | 2.0.1 | MIT | license |
| micromark-util-character | 2.1.1 | MIT | license |
| micromark-util-chunked | 2.0.1 | MIT | license |
| micromark-util-classify-character | 2.0.1 | MIT | license |
| micromark-util-combine-extensions | 2.0.1 | MIT | license |
| micromark-util-decode-numeric-character-reference | 2.0.2 | MIT | license |
| micromark-util-decode-string | 2.0.1 | MIT | license |
| micromark-util-encode | 2.0.1 | MIT | license |
| micromark-util-html-tag-name | 2.0.1 | MIT | license |
| micromark-util-normalize-identifier | 2.0.1 | MIT | license |
| micromark-util-resolve-all | 2.0.1 | MIT | license |
| micromark-util-sanitize-uri | 2.0.1 | MIT | license |
| micromark-util-subtokenize | 2.1.0 | MIT | license |
| micromark-util-symbol | 2.0.1 | MIT | license |
| micromark-util-types | 2.0.2 | MIT | license |
| mime-db | 1.54.0 | MIT | LICENSE |
| mime-types | 3.0.2 | MIT | LICENSE |
| ms | 2.1.3 | MIT | license.md |
| negotiator | 1.1.0 | MIT | LICENSE |
| node-addon-api | 7.1.1 | MIT | LICENSE.md |
| node-addon-native-custom-loader | 0.1.4 | MIT | LICENSE |
| node-addon-require-builtin | 0.1.4 | MIT | LICENSE |
| node-addon-require-builtin-win32-x64-msvc | 0.1.4 | MIT | LICENSE |
| node-domexception | 1.0.0 | MIT | LICENSE |
| node-fetch | 3.3.2 | MIT | LICENSE.md |
| node-pty | 1.2.0-beta.15 | MIT | LICENSE |
| object-assign | 4.1.1 | MIT | license |
| object-inspect | 1.13.4 | MIT | LICENSE |
| on-finished | 2.4.1 | MIT | LICENSE |
| on-headers | 1.1.0 | MIT | LICENSE |
| once | 1.4.0 | ISC | LICENSE |
| oniguruma-parser | 0.12.2 | MIT | LICENSE |
| oniguruma-to-es | 4.3.6 | MIT | LICENSE |
| open | 11.0.2 | MIT | license |
| openai | 6.40.0 | Apache-2.0 | LICENSE |
| p-retry | 4.6.2 | MIT | license |
| parseurl | 1.3.3 | MIT | LICENSE |
| partial-json | 0.1.7 | MIT | LICENSE |
| path-key | 3.1.1 | MIT | license |
| path-to-regexp | 8.4.2 | MIT | LICENSE |
| picocolors | 1.1.1 | ISC | LICENSE |
| picomatch | 4.0.5 | MIT | LICENSE |
| pkce-challenge | 5.0.1 | MIT | LICENSE |
| powershell-utils | 0.2.1 | MIT | license |
| property-information | 7.2.0 | MIT | license |
| protobufjs | 7.6.6 | BSD-3-Clause | LICENSE |
| proxy-addr | 2.0.7 | MIT | LICENSE |
| qs | 6.16.0 | BSD-3-Clause | LICENSE.md |
| range-parser | 1.3.0 | MIT | LICENSE |
| raw-body | 3.0.2 | MIT | LICENSE |
| react | 18.3.1 | MIT | LICENSE |
| react-dom | 18.3.1 | MIT | LICENSE |
| readdirp | 4.1.2 | MIT | LICENSE |
| regex | 6.1.0 | MIT | LICENSE |
| regex-recursion | 6.0.2 | MIT | LICENSE |
| regex-utilities | 2.3.0 | MIT | LICENSE |
| require-from-string | 2.0.2 | MIT | license |
| resolve.exports | 2.0.3 | MIT | license |
| retry | 0.13.1 | MIT | License |
| router | 2.2.0 | MIT | LICENSE |
| run-applescript | 7.1.0 | MIT | license |
| safe-buffer | 5.2.1 | MIT | LICENSE |
| safer-buffer | 2.1.2 | MIT | LICENSE |
| sax | 1.6.1 | BlueOak-1.0.0 | LICENSE.md |
| scheduler | 0.23.2 | MIT | LICENSE |
| send | 1.2.1 | MIT | LICENSE |
| serve-static | 2.2.1 | MIT | LICENSE |
| setprototypeof | 1.2.0 | ISC | LICENSE |
| sharp | 0.35.4 | Apache-2.0 | LICENSE |
| shebang-command | 2.0.0 | MIT | license |
| shebang-regex | 3.0.0 | MIT | license |
| shiki | 4.4.3 | MIT | LICENSE |
| side-channel | 1.1.1 | MIT | LICENSE |
| side-channel-list | 1.0.1 | MIT | LICENSE |
| side-channel-map | 1.0.1 | MIT | LICENSE |
| side-channel-weakmap | 1.0.2 | MIT | LICENSE |
| space-separated-tokens | 2.0.2 | MIT | license |
| statuses | 2.0.2 | MIT | LICENSE |
| stringify-entities | 4.0.4 | MIT | license |
| tiny-typed-emitter | 2.1.0 | MIT | LICENSE |
| toidentifier | 1.0.1 | MIT | LICENSE |
| trim-lines | 3.0.1 | MIT | license |
| ts-algebra | 2.0.0 | MIT | LICENSE |
| tslib | 2.8.1 | 0BSD | LICENSE.txt |
| turndown | 7.2.4 | MIT | LICENSE |
| type-is | 2.1.0 | MIT | LICENSE |
| typebox | 1.3.7 | MIT | license |
| undici-types | 6.21.0 | MIT | LICENSE |
| unist-util-is | 6.0.1 | MIT | license |
| unist-util-position | 5.0.0 | MIT | license |
| unist-util-remove-position | 5.0.0 | MIT | license |
| unist-util-stringify-position | 4.0.0 | MIT | license |
| unist-util-visit | 5.1.0 | MIT | license |
| unist-util-visit-parents | 6.0.2 | MIT | license |
| unpipe | 1.0.0 | MIT | LICENSE |
| use-sync-external-store | 1.2.0 | MIT | LICENSE |
| vary | 1.1.2 | MIT | LICENSE |
| vfile | 6.0.3 | MIT | license |
| vfile-message | 4.0.3 | MIT | license |
| web-streams-polyfill | 3.3.3 | MIT | LICENSE |
| which | 2.0.2 | ISC | LICENSE |
| wrappy | 1.0.2 | ISC | LICENSE |
| ws | 8.21.3 | MIT | LICENSE |
| wsl-utils | 1.0.0 | MIT | license |
| yaml | 2.9.0 | ISC | LICENSE |
| zod | 4.5.4 | MIT | LICENSE |
| zod-to-json-schema | 3.25.2 | ISC | LICENSE |
| zustand | 4.4.7 | MIT | LICENSE |
| zwitch | 2.0.4 | MIT | license |

---

*本清单覆盖 `node_modules` 下全部已安装包。上游 `@deepseek-ai/*` 系均为 MIT
（Copyright (c) 2026 DeepSeek），已包含在上表中。*
