# 官网依赖审计

Vercel 部署 #20 时 npm audit 报告 8 项告警。逐项核对后，仅更新兼容补丁 source-map-js 1.2.1 → 1.2.2，保留现有功能和 Tailwind 3 导出测试，不执行 audit fix --force。

依据：[source-map-js 官方修复公告](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)。此包由 PostCSS 和 Tailwind 构建工具引入；不据此声称当前官网已被利用或存在已证实的网络攻击路径。

干净隔离安装并验证：

- npm ci --ignore-scripts：锁定依赖可安装。
- npm audit --omit=dev：0 vulnerabilities。
- npm run typecheck：通过。
- npm run test:studio：18/18，包含 CSS 导入、往返导出与 Tailwind 3/4 实际编译。
- npm run build：通过，输出的官网主要 JS 文件摘要与上一版本一致。历史参考页仍有两条缺失图片警告，不能宣称整个资源目录无缺失。

## 保留的开发依赖告警

完整 audit 仍为 7 项（5 high、2 moderate），来自 tailwindcss-v3 兼容测试依赖链。该编译器只在 tests/studio-core.test.ts 使用，不在主题编辑器的运行时入口导入。

- braces 3.0.3 及受影响的 chokidar/micromatch/fast-glob/Tailwind 链：[公告当前没有补丁版本](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)。测试使用固定本仓库生成的 raw content，不接收外部 glob 模式。
- postcss-selector-parser 6.1.4 与 postcss-nested：[修复版本为 7.1.6](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)。当前 Tailwind 3 链要求旧主版本；不可仅为 audit 归零删除兼容测试或强制替换整个 Tailwind 主版本。公告将风险限定于不可信选择器的同步处理；此处为固定测试输入，仍保留升级待办。

后续应验证 Tailwind 3 兼容依赖的维护补丁或受控替代方案，并重复完整导出编译测试。运行依赖 audit 为零不是全站安全认证，也不代表上述开发依赖已修复。

## 2026-10-21 Alpha 收口

官网 Vite 更新至8.3.5，修复8.3.0–8.3.2的launch-editor公告；核心Harness同样升级。选择器解析器通过固定override更新至7.1.7，18项Studio核心/bridge测试、Tailwind3真实兼容编译、组件目录构建和类型检查通过，修正原来的2项moderate链。

生产依赖audit为0。完整audit仍有5项high，全部来自仅在`tests/studio-core.test.ts`导入的Tailwind3兼容编译器：braces3.0.3深层模式展开DoS及其传播链（chokidar/fast-glob/micromatch/tailwindcss）。registry当前没有braces修复版；测试使用本仓库固定输入，不接收远端用户模式，编译器不进入运行时入口。保留兼容测试，不以删除测试、禁用audit或强升Tailwind4冒充修复。该已知开发测试依赖风险继续列入官网#22，不宣称全依赖无漏洞；上游修复后再锁定升级。
