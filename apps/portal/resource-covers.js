import {iconMarkup} from '../../packages/ui/icons.ts';
import './resource-covers.css';

export function resourceCovers(language) {
  const t=(zh,en)=>language==='zh'?zh:en;
  const system=`<svg viewBox="0 0 600 380" fill="none" aria-hidden="true" focusable="false">
    <rect width="600" height="380" fill="#E9E6DF"/>
    <path d="M0 76H600M0 304H600M76 0V380M524 0V380" stroke="#D7D3CA" stroke-width=".75"/>
    <text x="28" y="36" class="cover-signature" fill="#4D4941">HappyHands</text><text x="572" y="36" text-anchor="end" class="cover-index" fill="#756F65">01 — FOUNDATIONS</text>
    <circle cx="464" cy="139" r="93" fill="#F57F28"/>
    <g transform="translate(86 78) rotate(-7 135 116)">
      <rect x="0" y="8" width="270" height="232" rx="12" fill="#25221D" opacity=".07"/>
      <rect width="270" height="232" rx="12" fill="#FAF9F6" stroke="#D0CBC0"/>
      <text x="22" y="29" class="cover-index" fill="#787168">TYPOGRAPHY</text><text x="248" y="29" text-anchor="end" class="cover-index" fill="#787168">Aa / 01</text>
      <path d="M22 58H248M22 176H248M40 48V190M228 48V190" stroke="#DED9D0" stroke-dasharray="3 4"/>
      <text x="26" y="168" font-size="137" font-weight="500" letter-spacing="-10" fill="#242320">Aa</text>
      <text x="22" y="210" font-size="12" fill="#625C52">Sans / 500</text>
    </g>
    <g transform="translate(325 119) rotate(5 90 78)">
      <rect y="7" width="190" height="157" rx="13" fill="#32271E" opacity=".09"/>
      <rect width="190" height="157" rx="13" fill="#262623"/>
      <text x="18" y="27" class="cover-index" fill="#BDB9AE">COMPONENTS</text>
      <rect x="18" y="44" width="154" height="38" rx="9" fill="#F9F7EF"/>
      <text x="32" y="68" font-size="12" fill="#262623">${t('保存修改','Save changes')}</text><path d="m149 57 5 6-5 6" stroke="#262623" stroke-width="1.5"/>
      <rect x="18" y="98" width="70" height="36" rx="18" fill="#F57F28"/><circle cx="70" cy="116" r="12" fill="#FFF6E8"/>
      <rect x="103" y="98" width="69" height="36" rx="9" stroke="#69675E"/><path d="m126 116 6 6 12-14" stroke="#E8E6DE" stroke-width="2"/>
    </g>
    <g transform="translate(207 273) rotate(-2 112 27)">
      <rect y="5" width="231" height="55" rx="10" fill="#282725" opacity=".07"/>
      <rect width="231" height="55" rx="10" fill="#F9F8F4" stroke="#D4CFC4"/>
      <rect x="9" y="9" width="39" height="37" rx="5" fill="#292927"/><rect x="52" y="9" width="39" height="37" rx="5" fill="#8B857A"/><rect x="95" y="9" width="39" height="37" rx="5" fill="#E8E2D6"/><rect x="138" y="9" width="39" height="37" rx="5" fill="#F57F28"/><rect x="181" y="9" width="41" height="37" rx="5" fill="#F8D7B7"/>
    </g>
    <text x="28" y="356" class="cover-index" fill="#756F65">${t('从规则，到体验。','FROM RULES TO EXPERIENCE.')}</text><text x="572" y="356" text-anchor="end" class="cover-index" fill="#756F65">COLOR / TYPE / COMPONENTS</text>
  </svg>`;
  const studio=`<svg viewBox="0 0 600 380" fill="none" aria-hidden="true" focusable="false">
    <rect width="600" height="380" fill="#203D35"/>
    <circle cx="405" cy="196" r="206" stroke="#365148"/><circle cx="405" cy="196" r="146" stroke="#365148"/>
    <text x="28" y="36" class="cover-signature" fill="#F3F2E9">HappyHands</text><text x="572" y="36" text-anchor="end" class="cover-index" fill="#ACBEB3">02 — THEME STUDIO</text>
    <g transform="translate(109 77) rotate(-10 170 115)"><rect width="344" height="232" rx="14" fill="#E6B492"/><path d="M20 37H324" stroke="#C38F6E"/><circle cx="22" cy="20" r="4" fill="#9E6747"/></g>
    <g transform="translate(153 83) rotate(7 170 115)"><rect width="344" height="232" rx="14" fill="#A3BCAC" stroke="#BDD0C2"/><path d="M20 37H324" stroke="#7E9C8A"/></g>
    <g transform="translate(132 79)">
      <rect x="0" y="10" width="344" height="232" rx="14" fill="#071D15" opacity=".2"/>
      <rect width="344" height="232" rx="14" fill="#F8F7EF"/>
      <text x="22" y="28" font-size="11" fill="#43594B">${t('我的空间','Your space')}</text><circle cx="315" cy="24" r="10" fill="#E2E6D9"/><path d="M0 47H344" stroke="#E3E4D9"/>
      <text x="22" y="90" font-size="28" font-weight="600" fill="#263E31">${t('我的工作空间','My workspace')}</text>
      <rect x="22" y="106" width="190" height="5" rx="2" fill="#C3CCBE"/><rect x="22" y="119" width="139" height="5" rx="2" fill="#D5DBCF"/>
      <rect x="22" y="145" width="111" height="34" rx="8" fill="#294C39"/><text x="36" y="166" font-size="11" fill="#FAFAF5">${t('开始新项目','New project')}</text><path d="m114 157 5 5-5 5" stroke="#FAFAF5" stroke-width="1.5"/>
      <rect x="22" y="197" width="91" height="15" rx="4" fill="#E5E9DF"/><rect x="124" y="197" width="91" height="15" rx="4" fill="#E5E9DF"/><rect x="226" y="197" width="96" height="15" rx="4" fill="#E5E9DF"/>
    </g>
    <g transform="translate(315 263) rotate(-4 116 30)">
      <rect y="6" width="226" height="62" rx="14" fill="#071D15" opacity=".18"/>
      <rect width="226" height="62" rx="14" fill="#FFFDF7" stroke="#E1E2D7"/>
      <circle cx="31" cy="31" r="16" fill="#294C39"/><path d="m24 31 5 5 9-10" stroke="#F7F6EF" stroke-width="2"/>
      <circle cx="73" cy="31" r="16" fill="#C39478"/><circle cx="115" cy="31" r="16" fill="#292927"/>
      <path d="M147 15V47" stroke="#DDDCD3"/><text x="164" y="40" font-size="27" fill="#293D31">Aa</text>
    </g>
    <text x="28" y="356" class="cover-index" fill="#ACBEB3">${t('同一个界面，不同的表达。','ONE INTERFACE. YOUR EXPRESSION.')}</text><text x="572" y="356" text-anchor="end" class="cover-index" fill="#ACBEB3">CUSTOMIZE / PREVIEW / EXPORT</text>
  </svg>`;
  return `<div class="resource-covers">${[
    {href:'/components/?provider=systems',art:system,title:t('设计系统','Design systems'),copy:t('从视觉规范到组件，建立一致的产品体验。','Build a consistent experience, from visual rules to components.')},
    {href:'/apps/studio/',art:studio,title:t('主题工作室','Theme Studio'),copy:t('调整颜色与字体，即时预览，导出到项目。','Adjust colors and type, preview instantly, then export to your project.')}
  ].map(({href,art,title,copy})=>`<a class="resource-cover" href="${href}"><div class="resource-cover-art">${art}</div><div class="resource-cover-caption"><div><h3>${title}</h3><p>${copy}</p></div>${iconMarkup('right')}</div></a>`).join('')}</div>`;
}
