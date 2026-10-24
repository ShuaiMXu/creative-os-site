# Lime 设计系统目录

按用户提供的 https://design.how/systems/lime 收录第三套设计系统。官网入口与详情仍保留 HappyHands 壳层，Lime 配色仅用于卡片示意和独立示例。

## 内容与来源

- 首页设计系统横滑卡片：HappyHands、Quartz、Lime；Lime 详情为本站 `/systems/lime/`。
- 设计资源 `/components/?provider=systems&system=lime` 复用同一份站内详情，保留来源切换、浏览器返回和内嵌自动高度。
- 完整注册目录：64 项元数据，其中 5 个页面模板，支持中英文分类、搜索、分批展开、用途说明与复制安装命令。目录来源为 `https://design.how/r/lime/registry.json`，快照含 UTC 检查日期和原始响应 SHA-256。
- 配色来自 `https://design.how/r/lime/theme.json` 的作用域变量，仅摘录 20 个配色/圆角值，深色继承基础值后合并覆盖；不是全部 Lime token 的镜像。`palette.json` 保留主题响应的来源与哈希。上游使用 Hanken Grotesk，本地示例使用系统字体，未复制或加载上游字体。
- 独立编写出行提醒示例，演示选择、空选择禁用、提醒时间、确认、操作回执和撤销。确认后焦点到结果，撤销后回到主要操作；局部外观切换不改变官网外观。不创建真实通知，不联系他人，不涉及资金执行。
- 新/已有项目接入指令包含作用域、LimePortalProvider、按组件读取文档、保留既有品牌及执行范围，和后续 lint/浏览器验证。复制指令不执行命令；目录不冒充上游组件原样运行。

## 共享实现

Quartz 与 Lime 复用 `packages/ui/SystemCatalog.tsx`，传入 `lang`、受限的 `system` 和完整 `registry` 元数据，不从当前 URL 拼接任意来源。类名仍保留各系统的独立测试入口；补充用途说明为本站撰写。`npm run quartz:sync` / `npm run lime:sync` 通过同一同步脚本更新经过字段、名称及重复项校验的元数据；构建及访问不依赖上游在线。

## 验证

类型检查和生产构建通过。`npm run test:lime:browser` 覆盖正常 390/768/1280px、深浅色、中英文，验证首页本地跳转、64 项无遗漏、5 模板筛选、原生命令准确复制、接入模式、复制失败、示例禁用/键盘/焦点/撤销、外观隔离、内嵌加载及浏览器返回。HappyHands/Quartz 的变量、导出、目录和内嵌回归通过。

官网展示补充，合入后按发布流程部署。没有安装上游组件、复制完整样式/字体或伪造 Foundation 批准。
