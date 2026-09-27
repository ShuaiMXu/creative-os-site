export const apps = [
  {
    "index": "01",
    "state": "本地可用",
    "title": "审阅产品",
    "description": "采集桌面、移动端和指定任务状态的证据，诊断并排序。确认问题仍然存在，再选择一个范围明确的修改。",
    "meta": [
      "截图 · 诊断 · 优先级"
    ],
    "action": "阅读采集指南",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md"
  },
  {
    "index": "02",
    "state": "有界实现",
    "title": "整理设计系统",
    "description": "从源码提取品牌、令牌、组件与状态候选。人工批准并冻结版本后，才成为修改和新页面的约束。",
    "meta": [
      "品牌 · 组件 · 版本批准"
    ],
    "action": "查看设计基础",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/README.md#design-a-new-surface"
  },
  {
    "index": "03",
    "state": "本地可用",
    "title": "修正问题",
    "description": "将限定任务交给 Codex 或 Claude Code，在隔离工作区修改；保留修改简报、代码差异和执行记录。",
    "meta": [
      "隔离修改 · diff.patch"
    ],
    "action": "查看执行流程",
    "href": "https://github.com/ShuaiMXu/creative-os/blob/main/docs/harness.md#choosing-a-coding-agent"
  },
  {
    "index": "04",
    "state": "人工复核",
    "title": "验证与沉淀",
    "description": "同状态重拍，运行结构检查并附加独立视觉复核。记录接受或拒绝的理由，为下一轮留下证据。",
    "meta": [
      "前后对照 · 判断记录"
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
    "title": "语义令牌",
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
  "copy": "为已经能跑的产品补上设计闭环：整理品牌与组件，定位体验问题，约束代码修改，用前后证据和你的判断验证结果。",
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
    "title": "产品做完之后",
    "copy": "审阅、整理设计系统、修正问题、体验优化——每一步的产出，都是下一步的输入。",
    "link": "在 GitHub 查看源码 ↗"
  },
  "explore": {
    "kicker": "02 / 设计系统",
    "title": "设计系统档案",
    "copy": "品牌档案、真实审阅案例与预设方向分别标注状态；示意内容不代表可安装的组件库。"
  },
  "screens": {
    "kicker": "03 / 前后对比",
    "title": "改了什么，一目了然",
    "copy": "HappyClaw 仓库基线的历史审阅，桌面 1280×800、移动 390×844。独立视觉复核未通过：桌面品牌标识被裁切，仍需修复与重拍。不是线上部署效果或转化验证。",
    "link": "查看完整审阅 ↗"
  },
  "elements": {
    "kicker": "04 / 组件",
    "title": "常用组件",
    "copy": "设计系统中的九类组件示意。用于讨论用途与状态，尚未提供可安装的组件包。"
  },
  "getStarted": {
    "kicker": "05 / 开始使用",
    "title": "试一个真实产品",
    "titleLine2": "从本地证据开始",
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
    "安装主仓库依赖，配置目标仓库、预览命令和 Experience Spec。"
  ],
  [
    "02",
    "采集并诊断",
    "保存基线，提取设计基础，确认一个值得修改的问题。"
  ],
  [
    "03",
    "修改并复核",
    "隔离执行、重拍、附加视觉复核，再记录接受或拒绝及理由。"
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
    "href": "/brand/happyhands-logo-paper.png",
    "action": "查看品牌标识"
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
  "githubLink": "GitHub ↗",
  "footer": {
    "left": "HappyHands · AI Product Designer",
    "middle": "先看证据，再下结论",
    "right": "查看源码 ↗"
  }
};

export const delivery = {
  "title": "每一轮，都留下可检查的结果",
  "copy": "Harness 负责执行顺序与证据门槛；Skills 提供设计方法；编码 Agent 执行修改；你决定结果是否接受。",
  "items": [
    [
      "项目与证据",
      "产品目标、源码基线、任务状态与桌面 / 移动截图。"
    ],
    [
      "设计基础",
      "品牌、语义令牌、组件状态与模式；观察候选和批准版本分开保存。"
    ],
    [
      "修改与复核",
      "范围明确的简报、代码差异、重拍结果、结构检查和独立视觉意见。"
    ],
    [
      "判断与下一轮",
      "接受 / 拒绝、理由、未解决问题及运行记录。新页面从批准的设计基础开始。"
    ]
  ],
  "status": "当前为本地工程：27 个版本化 Skill 契约，其中 17 个有界处理器、10 个契约占位。尚无 Skill 达到 operational；持续托管监控、自动学习、校准后的 Experience Score 和订阅服务仍需建设。",
  "link": "阅读完整 Harness 指南 ↗"
};
