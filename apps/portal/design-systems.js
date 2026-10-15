import './design-systems.css';

const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

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
  const zh = language === 'zh';
  const text = (cn,en) => zh ? cn : en;
  const prompts = [false,true].map(existing => {
    const title = existing ? text('已有项目 · 逐页迁移','Existing project · migrate a screen') : text('新项目 · 从首屏开始','New project · start with one screen');
    const prompt = escape(quartzPrompt(language, existing));
    return `<details class="system-prompt"><summary>${title}</summary><p>${text('复制给你的编程助手。指令会先检查兼容性，再实施约定范围。','Copy this to your coding assistant. It checks compatibility before changing the agreed scope.')}</p><pre tabindex="0">${prompt}</pre><button type="button" class="button button-secondary" data-copy="${prompt}">${text('复制接入指令','Copy setup prompt')}</button></details>`;
  }).join('');
  return `<article class="system-feature" id="quartz" aria-labelledby="quartz-title">
    <div class="system-feature-intro"><p class="kicker">${text('外部设计系统 · design.how','External design system · design.how')}</p><h3 id="quartz-title">Quartz</h3><p>${text('为 AI 产品与代理工作台准备的组件、页面模板和设计规则。先看真实组件，再决定是否适合你的项目。','Components, screen blocks and design rules for AI products and agent consoles. Explore the real components before choosing it for your project.')}</p><div class="system-feature-actions"><a class="button button-primary" href="/systems/quartz/">${text('探索 Quartz','Explore Quartz')}</a><a class="text-link" href="/systems/quartz/#components">${text('组件目录','Component registry')}</a></div><p class="system-source">${text('来源：design.how · 资料核对：2026-10-16。这里只收录说明与接入指令；组件版本、许可及使用条款以官方为准。','Source: design.how · checked 2026-10-16. This listing provides guidance and setup prompts; component versions, licenses and terms are maintained upstream.')}</p></div>
    <div class="system-feature-guide"><dl><div><dt>${text('适合','Best for')}</dt><dd>${text('代理会话、工具审批、运行记录与管理界面','Agent sessions, tool approvals, run traces and admin interfaces')}</dd></div><div><dt>${text('技术基础','Stack')}</dt><dd>React · Tailwind CSS · shadcn</dd></div><div><dt>${text('已有品牌','Existing brand')}</dt><dd>${text('保留你的设计规范，先确认迁移范围；不默认替换整个产品。','Keep approved design rules and agree on scope before migration.')}</dd></div></dl>${prompts}<p class="system-next">${text('修改完成后，可按本地工作台指引接入项目，采集页面并核对修改结果。','After implementation, follow the local workbench guide to connect your project and review captured results.')} <a href="https://github.com/ShuaiMXu/creative-os/blob/main/docs/local-workbench.md">${text('查看启动指引','Read the startup guide')}</a></p></div>
  </article>`;
}
