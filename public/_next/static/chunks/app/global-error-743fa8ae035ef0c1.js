(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4219],{9216:(e,t,n)=>{"use strict";n.d(t,{E5:()=>u,QG:()=>d,db:()=>m,fM:()=>l});let a="a2_jma1yrs6vrsd",r=void 0===a?"a2_jma1yrs6vrsd":a.trim(),o=r.startsWith("a2_"),i="https://www.redditstatic.com/ads/pixel.js";function c(){if("function"!=typeof window.rdt){let e=(...t)=>{e.sendEvent?e.sendEvent(...t):e.callQueue.push(t)};e.callQueue=[],window.rdt=e}return window.rdt}let s=!1;function l(){if(o&&!s&&(s=!0,c()("init",r,{useDecimalCurrencyValues:!0}),!document.querySelector(`script[src="${i}"]`))){let e=document.createElement("script");e.src=i,e.async=!0,document.head.appendChild(e)}}function d(){o&&c()("track","PageVisit")}function u(e){if(!o)return;let t={};e?.email&&(t.email=e.email),c()("track","SignUp",t)}function m(e){if(!o)return;let t={transactionId:e.transactionId,conversionId:e.transactionId,itemCount:1};"number"==typeof e.amountCents&&(t.value=e.amountCents/100,t.currency=(e.currency||"usd").toUpperCase()),e.email&&(t.email=e.email),c()("track","Purchase",t)}},24940:(e,t,n)=>{"use strict";n.d(t,{Ce:()=>h,R2:()=>g,Sl:()=>o,ZO:()=>m,_Y:()=>i,sx:()=>u});var a=n(9216);let r="G-L40YBXRWFP",o=void 0===r?"G-L40YBXRWFP":r.trim(),i=o.startsWith("G-"),c="AW-18347074430",s=void 0===c?"AW-18347074430":c.trim(),l=i&&s.startsWith("AW-");function d(){return window.dataLayer=window.dataLayer||[],"function"!=typeof window.gtag&&(window.gtag=function(){window.dataLayer.push(arguments)}),window.gtag}function u(e,t){i&&d()("event",e,t)}function m(){l&&d()("config",s)}function g(e){let t="number"==typeof e.amountCents?{value:e.amountCents/100,currency:(e.currency||"usd").toUpperCase()}:{};if(l){let n=d();e.email&&n("set","user_data",{email:e.email}),n("event","conversion",{send_to:`${s}/vpihCPH0z9ccEP7GyKxE`,transaction_id:e.transactionId,...t})}i&&d()("event","purchase",{transaction_id:e.transactionId,...t}),(0,a.db)(e)}function h(e){i&&d()("event",e.name,{value:Math.round("CLS"===e.name?1e3*e.value:e.value),metric_id:e.id,metric_value:e.value,metric_delta:e.delta,metric_rating:e.rating,non_interaction:!0})}},38034:(e,t,n)=>{"use strict";n.d(t,{bq:()=>d,cv:()=>o,l:()=>c,ul:()=>u});let a=[/ChunkLoadError/i,/Loading chunk [^\s]+ failed/i,/Loading CSS chunk/i,/Failed to fetch dynamically imported module/i,/error loading dynamically imported module/i,/Importing a module script failed/i,/'text\/html' is not a valid JavaScript MIME type/i,/Unexpected token '<'/];function r(e,t=0){if(null==e||t>4)return[];if("string"==typeof e)return[e];let n=[];return"object"==typeof e&&("string"==typeof e.name&&n.push(e.name),"string"==typeof e.message&&n.push(e.message),n.push(...r(e.cause,t+1)),n.push(...r(e.reason,t+1))),n}function o(e){return r(e).some(e=>a.some(t=>t.test(e)))}let i=[/Failed to fetch/i,/^Load failed$/i,/NetworkError when attempting to fetch/i,/fetch failed/i,/ERR_NETWORK|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/i,/network connection was lost/i,/^TimeoutError$/];function c(e){return r(e).some(e=>i.some(t=>t.test(e)))}let s="appllama:nav-recovery",l=null;function d(){var e,t;let n=null;try{n=window.sessionStorage}catch{n=null}let{allow:a,next:r}=(e=n?function(e){try{let t=e.getItem(s);if(!t)return null;let n=JSON.parse(t);if("number"!=typeof n?.t||"number"!=typeof n?.n)return null;return n}catch{return null}}(n):l,t=Date.now(),!e||t-e.t>9e4?{allow:!0,next:{t:t,n:1}}:e.n<2?{allow:!0,next:{t:e.t,n:e.n+1}}:{allow:!1,next:e});if(!a)return!1;l=r;try{n?.setItem(s,JSON.stringify(r))}catch{}return window.location.reload(),!0}function u(){return d()}},52538:(e,t,n)=>{Promise.resolve().then(n.bind(n,54690))},54690:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>s});var a=n(95155),r=n(12115),o=n(24940),i=n(38034);let c=`
:root {
  --ge-bg: #141414;
  --ge-text: #f7f7f7;
  --ge-secondary: #adadad;
  --ge-tertiary: #7a7a7a;
  --ge-accent: #f0dcc8;
  --ge-accent-hover: #fbebd9;
  --ge-accent-ink: #2b2725;
  --ge-focus: #f0dcc8;
  color-scheme: dark;
}
:root[data-theme='light'] {
  --ge-bg: #ffffff;
  --ge-text: #111111;
  --ge-secondary: #4b4b4b;
  --ge-tertiary: #676767;
  --ge-accent: #111111;
  --ge-accent-hover: #2b2b2b;
  --ge-accent-ink: #ffffff;
  --ge-focus: #111111;
  color-scheme: light;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ge-bg);
  color: var(--ge-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 24px;
}
.ge-main { }
.ge-title {
  margin: 0 0 12px;
  color: var(--ge-text);
  font-size: 32px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.02em;
}
.ge-copy { margin: 0 0 28px; color: var(--ge-secondary); font-size: 15px; }
.ge-refreshing { margin: 0; color: var(--ge-tertiary); font-size: 15px; }
.ge-button {
  border: 0;
  border-radius: 999px;
  background: var(--ge-accent);
  color: var(--ge-accent-ink);
  padding: 12px 26px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}
.ge-home-wrap { margin: 16px 0 0; }
.ge-home { color: var(--ge-secondary); font-size: 14px; text-underline-offset: 4px; }
:root[data-theme='light'] body { -webkit-font-smoothing: antialiased; }
:root[data-theme='light'] .ge-main { width: 100%; max-width: 448px; }
:root[data-theme='light'] .ge-title {
  font-size: clamp(32px, 7vw, 40px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}
:root[data-theme='light'] .ge-copy { line-height: 1.6; }
:root[data-theme='light'] .ge-button {
  padding: 13px 27px;
  font-weight: 600;
  transition: background-color 160ms ease, transform 160ms ease;
}
:root[data-theme='light'] .ge-button:hover { background: var(--ge-accent-hover); }
:root[data-theme='light'] .ge-button:active { transform: scale(0.98); }
:root[data-theme='light'] .ge-button:focus-visible,
:root[data-theme='light'] .ge-home:focus-visible {
  outline: 2px solid var(--ge-focus);
  outline-offset: 4px;
}
:root[data-theme='light'] .ge-home-wrap { margin-top: 17px; }
:root[data-theme='light'] .ge-home:hover { color: var(--ge-text); }
@media (prefers-reduced-motion: reduce) { .ge-button { transition: none; } }
`;function s({error:e}){let[t,n]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let t=(0,i.cv)(e);((0,o.sx)("client_error",{error_kind:t?"stale_build_root":"root_layout",error_message:String(e?.message??e).slice(0,150),error_digest:e?.digest??""}),t&&(0,i.ul)())?n(!0):(0,i.l)(e)&&(0,i.bq)()&&n(!0)},[e]),(0,a.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,a.jsxs)("head",{children:[(0,a.jsx)("meta",{name:"theme-color",content:"#141414"}),(0,a.jsx)("script",{"data-cfasync":"false",dangerouslySetInnerHTML:{__html:"(()=>{try{var d=document.documentElement,k='appllama:theme';function read(v){return v==='light'||v==='dark'?v:'dark'}function paint(p){d.dataset.theme=p;d.dataset.themePreference=p;d.style.colorScheme=p;var m=document.querySelector('meta[name=\"theme-color\"]');if(m)m.setAttribute('content',p==='light'?'#ffffff':'#141414')}var p=read(localStorage.getItem(k));localStorage.setItem(k,p);paint(p);addEventListener('storage',function(e){if(e.key===k||e.key===null)paint(read(e.newValue))})}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.dataset.themePreference='dark';document.documentElement.style.colorScheme='dark'}})()"}}),(0,a.jsx)("style",{dangerouslySetInnerHTML:{__html:c}})]}),(0,a.jsx)("body",{children:t?(0,a.jsx)("p",{className:"ge-refreshing",children:"Refreshing…"}):(0,a.jsxs)("main",{className:"ge-main",children:[(0,a.jsx)("h1",{className:"ge-title",children:"This page hit a snag."}),(0,a.jsx)("p",{className:"ge-copy",children:"It's us, not you. A refresh usually clears it."}),(0,a.jsx)("button",{type:"button",onClick:()=>window.location.reload(),className:"ge-button",children:"Reload the page"}),(0,a.jsx)("p",{className:"ge-home-wrap",children:(0,a.jsx)("a",{href:"/",className:"ge-home",children:"Go home"})})]})})]})}}},e=>{e.O(0,[8441,3794,7358],()=>e(e.s=52538)),_N_E=e.O()}]);