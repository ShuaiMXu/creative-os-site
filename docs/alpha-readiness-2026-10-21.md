# Local Web Alpha 收口 · 2026-10-21

本轮发布范围是有人指导的本地Web试用，官网提供准确接入说明、方法来源、只读历史案例和主题工具。当前本地工作台通过项目目录与核心任务开始；预览等高级配置按需补充。官网不连接仓库、不执行修改，模型QA不代替人工判断。

## 对齐内容

快速开始统一为安装依赖后运行`pnpm workbench`，中英文步骤、Agent提示词、README和设计规范链接一致。案例入口指向核心仓库的真实反证重审记录；当前限定修改的独立复核通过，原fail和两项finding的逐项反证保留，最终人工接受尚未记录。旧`/apps/web/`通过Vercel重定向和静态后备页面统一到门户；历史探索页与只读示例导航也不再引导到旧产品入口。

主要五页具有独立title/description、canonical、Open Graph和现有品牌图标；robots与sitemap只列出当前主页面，示例工作台noindex。构建生成release.json，记录源码revision、已知或未知的dirty状态。验证器核对它与Git HEAD/provider commit一致；不会将缺.git的provider环境误记为本地干净。

## 已完成的本地验收

- 类型检查、18项Studio核心/bridge测试、2项组件目录测试、生产构建、构建产物身份与SEO校验通过；154目录项/77本地源码预览/167模块保留完整。
- 官网导出Foundation经当前Harness的真实store/schema/brief消费通过，原品牌与组件保留。这是隔离集成测试，不是人类项目批准。
- Cua真实浏览器检查5页 × 390/768/1280尺寸 × 双主题（中英文）共30个明确尺寸组合，无页面横向溢出。手机跨页偏好延续、字体选择、导出代码与实际CSS下载、Escape关闭及焦点返回已验证。原生文件/项目命名对话框自动化有局限，不把未完成的新建项目命名算通过。
- 桌面Lighthouse：门户92/100/100/100、HappyHands100/100/100/100、Quartz100/100/100/100、Studio100/98/100/100、组件页100/100/100/100（顺序为Performance/Accessibility/Best Practices/SEO）。门户移动端86/100/100/100。首次门户桌面94/97/96/100发现页脚对比度与favicon404，已按现有token/品牌资源修复并保留前后报告。工具分数不代替完整无障碍或物理设备验收。
- Vite8.3.5与解析器7.1.7修复有补丁的依赖公告。生产依赖audit零；5项已知high仅在Tailwind3固定输入兼容测试链，当前braces无补丁，详见dependency-audit-2026-10-18.md，不隐瞒、不删除兼容测试。
- 独立review提出的未跟踪源码漏计、旧入口漏改、版本核验缺失已修正；最终增量review No findings。完整Skill及vendor原文未删改。

## 生产验收门槛仍需真实记录

本机Vercel CLI当前token无效，不能凭本地通过宣布新版已部署。合并后检查Git集成是否自动发布，以公开release.json的准确revision核对；只有确认线上版本后才能把本轮的元数据、导航/主题/导出和Lighthouse检查记为生产验收。若没有自动发布，需要用户恢复Vercel登录后继续部署与复测，不能绕过登录或静默绑定其他项目。官网#22保持开放。

#7仍需真实新用户反馈及最终判断；#29的完整Foundation/Firefly验收和#9/#10/#11的治理/增量/回滚不由本次Alpha收口代替。远端GitHub Actions未执行。原始截图、下载文件、测试日志和Lighthouse JSON保存在本地verification，不提交私有证据。
