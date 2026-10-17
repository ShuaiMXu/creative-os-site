import {iconMarkup} from '../../packages/ui/icons.ts';
import './design-systems.css';


export function quartzPrompt(language, existing) {
  const zh = language === 'zh';
  const goal = zh
    ? existing ? '将本项目的一个页面迁移到 Quartz。先检查现有设计规范、技术栈、组件和业务流程，提出迁移范围后再修改。保留已批准品牌、文案、业务行为和数据。' : '在本项目中使用 Quartz 构建第一个页面。先确认技术栈和页面任务；如果已经有 UI，改为逐页迁移，保留现有业务行为。'
    : existing ? 'Migrate one screen in this project to Quartz. Inspect existing design rules, the stack, components and workflows first, then define the migration scope. Preserve approved branding, copy, business behavior and data.' : 'Build the first screen in this project with Quartz. Check the stack and the screen task first. If UI already exists, migrate one screen at a time and preserve its behavior.';
  return goal + '\n\n' + (zh ? [
    '1. 阅读 https://design.how/r/quartz/skill.json 和 https://design.how/r/quartz/registry.json。检查 React、Tailwind、路径别名和 shadcn 的兼容性；不能因为缺 components.json 就直接重置项目。',
    '2. 确认兼容后，用项目的包管理器初始化必要配置并添加 https://design.how/r/quartz/theme.json。记录依赖版本和锁文件。按照官方说明导入样式、设置 quartz 作用域及 QuartzPortalProvider；不要影响其他应用或被审阅页面。',
    '3. 先读组件文档 https://design.how/systems/quartz/components/<name>.md，再通过 https://design.how/r/quartz/<name>.json 安装所需组件。整屏可参考 project-home、agent-session、tool-approval 或 run-trace；用真实数据替换演示数据，不添加虚构指标。',
    '4. 阅读并审核 arla6ka/skills 中的 migrate-design-system 和 ui-review，记录采用的版本。Quartz 规则只用于本次约定的 UI 范围；逐页迁移，确认没有使用方后才删除旧样式。',
    '5. 按 https://design.how/r/quartz/lint.json 配置 lint 及其依赖，检查迁移文件。再检查构建、中文和英文、390/768/1280px、键盘焦点、加载/空/错误状态和原业务流程。lint 通过不代替浏览器验收。',
    '6. 交付改动、前后截图、版本与来源、验证结果和剩余限制。不自动部署，不把未验证的项目标为设计系统已对齐。'
  ] : [
    '1. Read https://design.how/r/quartz/skill.json and https://design.how/r/quartz/registry.json. Check React, Tailwind, aliases and shadcn compatibility; a missing components.json alone is not a reason to reset the project.',
    '2. Once compatible, use the project package manager to initialize required configuration and add https://design.how/r/quartz/theme.json. Record dependency versions and the lockfile. Import styles and configure the quartz scope and QuartzPortalProvider as documented, without affecting other apps or reviewed pages.',
    '3. Read https://design.how/systems/quartz/components/<name>.md before adding https://design.how/r/quartz/<name>.json. Consider project-home, agent-session, tool-approval or run-trace blocks. Replace demo data with real data; do not invent metrics.',
    '4. Read and review migrate-design-system and ui-review from arla6ka/skills, recording the adopted revision. Apply Quartz only to the agreed UI scope. Migrate screen by screen and remove old styles only when unused.',
    '5. Configure lint and its dependencies from https://design.how/r/quartz/lint.json for migrated files. Check the build, Chinese and English, 390/768/1280px layouts, keyboard focus, loading/empty/error states and existing workflows. Lint does not replace browser review.',
    '6. Deliver changes, before/after screenshots, versions and sources, verification results and remaining limits. Do not deploy automatically or claim unverified design-system alignment.'
  ]).join('\n');
}

export function designSystemsMarkup(language) {
  const t = (zh,en) => language === 'zh' ? zh : en;
  return `<div class="system-collection">
    <article class="system-feature system-feature-primary" id="happyhands" aria-labelledby="happyhands-title">
      <div><p class="kicker">${t('我们的设计系统','Our design system')}</p><h3 id="happyhands-title">HappyHands</h3><p>${t('统一页面的颜色、字体和操作反馈。这套规范已用于本站和主题工作室，你可以直接试用。','Consistent colors, type and feedback across pages. Try the same design rules used by this website and Theme Studio.')}</p><div class="system-feature-actions"><a class="button button-primary" href="/systems/happyhands/">${t('探索 HappyHands','Explore HappyHands')}</a><a class="text-link" href="/systems/happyhands/#components">${t('试用组件','Try components')}</a></div></div>
      <div class="system-specimen" aria-hidden="true"><span>HappyHands</span><strong>${t('清楚、克制、亲和。','Clear. Considered. Human.')}</strong><div class="specimen-colors"><i></i><i></i><i></i><i></i></div><p>${t('品牌规范 · 双模式主题 · 组件状态','Brand rules · Light & dark · Component states')}</p></div>
    </article>
    <article class="system-feature system-feature-secondary" id="quartz" aria-labelledby="quartz-title"><div><p class="kicker">${t('外部设计系统 · design.how','External system · design.how')}</p><h3 id="quartz-title">Quartz</h3><p>${t('面向 AI 产品和代理工作流。查看组件目录、页面模板与接入说明，再判断是否适合你的项目。','For AI products and agent workflows. Explore its component catalog, screen blocks and setup guidance to see whether it fits your project.')}</p></div><a class="button button-secondary" href="/systems/quartz/">${t('了解 Quartz','Explore Quartz')}</a></article>
    <div class="system-studio-link"><div><h3>${t('调出适合你产品的主题','Make a theme for your product')}</h3><p>${t('选颜色和字体，看看实际效果，再下载到你的项目。','Choose colors and fonts, preview them, then download the theme for your project.')}</p></div><a class="text-link" href="/apps/studio/">${t('打开主题工作室','Open Theme Studio')} ${iconMarkup('right')}</a></div>
  </div>`;
}
