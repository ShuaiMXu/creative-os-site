export const apps = [
  {
    "index": "01",
    "state": "本地可用",
    "title": "问题清单",
    "description": "每个问题带有页面截图、位置与影响说明，便于判断先改哪一处。",
    "meta": [
      "截图 · 问题 · 优先级"
    ],
    "action": "阅读采集指南",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md"
  },
  {
    "index": "02",
    "state": "需要确认",
    "title": "项目设计规范",
    "description": "汇总项目已有的颜色、字体与组件，并标出仍需确认的规则。",
    "meta": [
      "品牌 · 组件 · 使用规则"
    ],
    "action": "查看设计规范",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/reusable-design-system-extraction.md"
  },
  {
    "index": "03",
    "state": "本地可用",
    "title": "代码修改记录",
    "description": "保留独立工作副本与代码差异，方便核对每处修改。",
    "meta": [
      "工作副本 · 代码差异"
    ],
    "action": "查看执行流程",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#choosing-a-coding-agent"
  },
  {
    "index": "04",
    "state": "人工复核",
    "title": "前后对照记录",
    "description": "在相同尺寸与页面状态下比较结果，保留接受或拒绝修改的理由。",
    "meta": [
      "前后截图 · 复核记录"
    ],
    "action": "查看复核流程",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#screenshot-aware-visual-review"
  }
];

export const elements = [
  {
    "kind": "button",
    "title": "按钮",
    "description": "主要操作用墨色实底，不用品牌橙，一屏只放一个。"
  },
  {
    "kind": "input",
    "title": "输入框",
    "description": "明确呈现输入、加载与错误状态。"
  },
  {
    "kind": "status",
    "title": "AI 标签",
    "description": "标识 AI 生成内容，区分已批准与待审核状态。"
  },
  {
    "kind": "tokens",
    "title": "设计变量",
    "description": "使用设计变量管理颜色，保持组件样式一致。"
  },
  {
    "kind": "tabs",
    "title": "标签页",
    "description": "诊断、设计系统、视觉复核共用一套导航，不另起一套。"
  },
  {
    "kind": "progress",
    "title": "步骤指示",
    "description": "查看当前进度、阻塞原因和下一步操作。"
  },
  {
    "kind": "empty",
    "title": "空状态",
    "description": "说明当前状态，并提供明确的下一步操作。"
  },
  {
    "kind": "dialog",
    "title": "确认弹窗",
    "description": "说明操作影响，并提供确认与取消选项。"
  },
  {
    "kind": "card",
    "title": "内容卡片",
    "description": "集中呈现相关标题、状态、证据与操作。"
  }
];

export const hero = {
  "eyebrow": [
    "面向独立开发者",
    "Alpha · 开源 · 本地运行"
  ],
  "h1": "让你的产品，",
  "h1Accent": "更专业",
  "h1Suffix": "。",
  "copy": "系统优化页面布局、交互流程与组件一致性。结合 AI 辅助修改与效果复核，提升产品体验。",
  "cta": "了解能力",
  "ctaSecondary": "查看真实审阅"
};

export const screenPairs = [
  {
    "title": "首页 · 桌面端",
    "task": "信息层级",
    "beforeLabel": "改前",
    "afterLabel": "改后",
    "before": {
      "src": "/runs/06dabc2c/before/desktop.png",
      "caption": "改之前的首页，信息层级有问题"
    },
    "after": {
      "src": "/runs/06dabc2c/after/desktop.png",
      "caption": "改之后，同一视口"
    },
    "result": "视觉复核未通过"
  },
  {
    "title": "首页 · 移动端",
    "task": "任务连贯",
    "beforeLabel": "改前",
    "afterLabel": "改后",
    "before": {
      "src": "/runs/06dabc2c/before/mobile.png",
      "caption": "手机端基线"
    },
    "after": {
      "src": "/runs/06dabc2c/after/mobile.png",
      "caption": "同一页面，改后"
    },
    "result": "静态截图对照"
  }
];

export const sections = {
  "apps": {
    "kicker": "01 / 应用",
    "title": "完整的设计审阅",
    "copy": "涵盖体验诊断、设计规范、代码修改与效果复核，支持查看各阶段的结果。",
    "link": "在 GitHub 查看源码"
  },
  "explore": {
    "kicker": "02 / 设计系统",
    "title": "产品设计的规范、组件与参考",
    "copy": "从设计规范开始，选择适合的组件，再用页面与风格参考完善细节。已有品牌和项目规则始终是基础。"
  },
  "screens": {
    "kicker": "03 / 前后对比",
    "title": "对照修改前后的页面",
    "copy": "HappyClaw 仓库基线的历史审阅，桌面 1280×800、移动 390×844。独立视觉复核未通过：桌面品牌标识被裁切，仍需修复与重拍。不是线上部署效果或转化验证。",
    "link": "查看完整审阅"
  },
  "elements": {
    "kicker": "04 / 组件",
    "title": "常用组件",
    "copy": "设计系统中的九类组件示意。用于讨论用途与状态，尚未提供可安装的组件包。"
  },
  "getStarted": {
    "kicker": "05 / 开始使用",
    "title": "开始产品体验审阅",
    "titleLine2": "选择首个审阅页面",
    "copy": "工作台在本地运行，代码修改由你确认。安装并启动后，连接项目，选择要检查的页面，再查看建议与修改结果。",
    "quickstartLabel": "快速开始",
    "quickstartTitle": "首次安装并启动工作台",
    "copyBtn": "复制命令"
  }
};

export const steps = [
  [
    "01",
    "准备项目",
    "运行 pnpm workbench，填写项目目录和核心任务，核对建议的采集范围。"
  ],
  [
    "02",
    "采集并诊断",
    "保存原始页面，整理设计规范，选择要修改的问题。"
  ],
  [
    "03",
    "修改并复核",
    "对比前后页面，复核使用效果，确认修改结果。"
  ]
];

export const systems = [
  {
    "tag": "设计系统",
    "title": "HappyHands",
    "description": "深色打底，品牌橙只用在关键处。",
    "values": [
      "#111111",
      "#F7F6F3",
      "#F57F28",
      "#96918A"
    ],
    "traits": [
      "专业",
      "克制",
      "亲和"
    ],
    "href": "/systems/happyhands/",
    "action": "探索设计系统"
  },
  {
    "tag": "审阅案例",
    "title": "HappyClaw",
    "description": "保留截图、修改与复核记录的真实案例；当前展示的历史运行有未解决的视觉问题。",
    "values": [
      "改前",
      "改后",
      "判定"
    ],
    "traits": [
      "网页",
      "审阅",
      "证据"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/happyclaw-case.md",
    "action": "阅读案例"
  },
  {
    "tag": "参考案例",
    "title": "萤火虫",
    "description": "先把系统建好再画页面的尝试。",
    "values": [
      "令牌",
      "状态",
      "模式"
    ],
    "traits": [
      "系统先行",
      "存档"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/firefly-ui-kit-case.md",
    "action": "阅读案例"
  },
  {
    "tag": "预设方向 · 规划中",
    "title": "SaaS 基础",
    "description": "用于后续设计基础的预设方向，尚未发布可复用模板包。",
    "values": [
      "框架",
      "数据",
      "表单"
    ],
    "traits": [
      "SaaS",
      "桌面",
      "模板"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "查看规划"
  },
  {
    "tag": "预设方向 · 规划中",
    "title": "移动端基础",
    "description": "用于后续设计基础的预设方向，尚未发布可复用模板包。",
    "values": [
      "导航",
      "内容",
      "付费"
    ],
    "traits": [
      "移动",
      "消费",
      "模板"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "查看规划"
  },
  {
    "tag": "规划",
    "title": "SwiftUI",
    "description": "原生应用支持处于规划阶段，尚未提供可用实现。",
    "values": [
      "颜色",
      "字体",
      "动效"
    ],
    "traits": [
      "SwiftUI",
      "规划中"
    ],
    "href": "https://github.com/ShuaiMXu/creative-os/issues",
    "action": "查看规划"
  }
];

export const ui = {
  "scrollNote": "浏览产品能力",
  "githubLink": "GitHub",
  "footer": {
    "left": "HappyHands · AI Product Designer",
    "middle": "产品体验优化",
    "right": "查看源码"
  }
};

export const delivery = {
  "title": "修改与复核流程",
  "copy": "基于页面证据形成修改建议，由 AI 在确认范围内执行。原始页面、代码差异与复核结果均可查阅。",
  "items": [
    [
      "了解项目",
      "记录产品用途，保存电脑和手机上的原始页面。"
    ],
    [
      "整理规范",
      "整理颜色、字体和组件，区分待确认内容与已采用的规范。"
    ],
    [
      "修改与复核",
      "查看修改说明、代码变化、前后截图和检查结果。"
    ],
    [
      "确认修改结果",
      "依据复核结果接受或拒绝修改，记录待解决的问题。新页面沿用已确认的设计规范。"
    ]
  ],
  "status": "采集、修改与复核的配置说明见开发指南。",
  "link": "查看开发指南"
};
