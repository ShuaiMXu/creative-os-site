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
    "action": "查看设计基础",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/README.md#design-a-new-surface"
  },
  {
    "index": "03",
    "state": "本地可用",
    "title": "可检查的修改",
    "description": "保留独立工作副本与代码差异，能查看具体改了什么。",
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
    "description": "打字、生成中、出错，每一步用户都得看得见。"
  },
  {
    "kind": "status",
    "title": "AI 标签",
    "description": "AI 参与的内容要能认出来，已批准和待审核不能搞混。"
  },
  {
    "kind": "tokens",
    "title": "设计变量",
    "description": "别在代码里写死色值，用变量。改一处，处处生效。"
  },
  {
    "kind": "tabs",
    "title": "标签页",
    "description": "诊断、设计系统、视觉复核共用一套导航，不另起一套。"
  },
  {
    "kind": "progress",
    "title": "步骤指示",
    "description": "现在走到哪、卡在哪、下一步做什么，扫一眼就知道。"
  },
  {
    "kind": "empty",
    "title": "空状态",
    "description": "没内容的时候告诉用户该干嘛，不是放个图标就完了。"
  },
  {
    "kind": "dialog",
    "title": "确认弹窗",
    "description": "高风险操作说清后果，给用户反悔的机会。"
  },
  {
    "kind": "card",
    "title": "内容卡片",
    "description": "标题、状态、证据、操作，一张卡片讲完一件事。"
  }
];

export const hero = {
  "eyebrow": [
    "面向独立开发者",
    "开源 · 本地运行"
  ],
  "h1": "让产品，",
  "h1Accent": "真正专业",
  "h1Suffix": "。",
  "copy": "发现界面问题，整理设计规范，让 AI 帮你修改。对比修改前后的页面，由你决定是否保留。",
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
    "title": "每次审阅，会留下什么",
    "copy": "问题、设计规范、代码改动和复核结果，都有记录可查。",
    "link": "在 GitHub 查看源码"
  },
  "explore": {
    "kicker": "02 / 设计系统",
    "title": "选择你的设计系统",
    "copy": "先了解 HappyHands 的规范与组件，再选择适合项目的设计基础。已有品牌可以保留，从整理自己的规则开始。"
  },
  "screens": {
    "kicker": "03 / 前后对比",
    "title": "改了什么，一目了然",
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
    "title": "试一个真实产品",
    "titleLine2": "从一个页面开始",
    "copy": "在主仓库安装依赖，准备 Node.js 22.15+、pnpm 11.19+ 和 Chrome 或 Edge。按指南配置目标仓库与预览；首次采集不等于完成设计审阅。",
    "quickstartLabel": "快速开始",
    "quickstartTitle": "配置完成后，启动首次采集",
    "copyBtn": "复制命令"
  }
};

export const steps = [
  [
    "01",
    "准备项目",
    "按设置指南安装工具，选择项目并配置页面预览。"
  ],
  [
    "02",
    "采集并诊断",
    "保存原始页面，整理设计规范，选择要修改的问题。"
  ],
  [
    "03",
    "修改并复核",
    "对比前后页面，检查使用效果，决定是否保留修改。"
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
    "description": "原生 App 这条路还没走通，先记下来。",
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
  "scrollNote": "往下看",
  "githubLink": "GitHub",
  "footer": {
    "left": "HappyHands · AI Product Designer",
    "middle": "让每个页面更好用",
    "right": "查看源码"
  }
};

export const delivery = {
  "title": "每次修改，都可以回看",
  "copy": "工具整理页面和修改建议，AI 按确认的范围修改代码。你可以随时查看原页面、改动和检查结果。",
  "items": [
    [
      "了解项目",
      "记录产品用途，保存电脑和手机上的原始页面。"
    ],
    [
      "设计基础",
      "整理颜色、字体和组件，区分待确认内容与已采用的规范。"
    ],
    [
      "修改与复核",
      "查看修改说明、代码变化、前后截图和检查结果。"
    ],
    [
      "决定是否保留",
      "保留满意的修改，记录还需改进的地方。新页面沿用已确认的设计规范。"
    ]
  ],
  "status": "目前需要在本地安装和运行。自动监控、自动学习和订阅服务尚未开放。各项功能的实现情况见开发指南。",
  "link": "查看开发指南"
};
