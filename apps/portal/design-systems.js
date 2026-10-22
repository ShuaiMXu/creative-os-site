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
  const card = ({name,tag,copy,href,tone,coverage}) => `<article class="resource-tile" id="${name.toLowerCase().replaceAll(' ','-')}">
    <div class="resource-tile-art resource-tile-art-${tone}" aria-hidden="true"><span>${name}</span><div class="tile-window"><i></i><i></i><i></i><div class="tile-lines"><b></b><b></b><b></b></div><div class="tile-blocks"><b></b><b></b><b></b></div></div></div>
    <div class="resource-tile-body"><p class="resource-tile-tag">${tag}</p><h4>${name}</h4><p>${copy}</p>${coverage ? `<p class="resource-tile-coverage">${coverage}</p>` : ""}<a class="text-link" href="${href}">${t('查看详情','View details')} ${iconMarkup('right')}</a></div>
  </article>`;
  const sections = [
    {id:'system-components-title',title:t('组件库','Component libraries'),copy:t('预览组件效果，选择适合项目的交互。','Preview components and choose interactions that fit your project.'),items:[
      {name:'Cult UI',tag:t('组件与交互','Components and interactions'),copy:t('按钮、卡片、导航与页面区块，提供预览和源码。','Buttons, cards, navigation and sections with previews and source.'),href:'/components/?provider=cult-ui',tone:'cult'}
    ]},
    {id:'system-references-title',title:t('设计参考','Design references'),copy:t('浏览页面布局与视觉风格，完善自己的设计。','Explore layouts and visual styles to refine your own design.'),items:[
      {name:'Kage',tag:t('页面与区块','Pages and sections'),copy:t('按产品或风格查找截图，查看页面结构与设计分析。','Find screenshots by product or style and explore design analysis.'),href:'/components/?provider=kage',tone:'kage'},
      {name:'Refero Styles',tag:t('风格与规范 · DESIGN.md','Style guidelines · DESIGN.md'),copy:t('了解颜色、字体与间距规则。目前提供来源与使用说明。','Explore color, type and spacing rules. Source and usage guidance available.'),href:'/components/?provider=refero',tone:'refero'}
    ]}
  ];
  return `<div class="system-collection resource-collection">${sections.map(section => `<section class="system-resource-section" aria-labelledby="${section.id}"><header class="system-resource-heading"><h3 id="${section.id}">${section.title}</h3><p>${section.copy}</p></header><div class="resource-tile-grid">${section.items.map(card).join('')}</div></section>`).join('')}</div>`;
}
