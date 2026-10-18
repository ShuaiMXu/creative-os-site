import React,{useEffect,useState,useRef} from 'react';
export function SystemLibrary({lang}:{lang:string}) {
 const t=(zh:string,en:string)=>lang==='zh'?zh:en;
 const read=()=>new URLSearchParams(location.search).get('system')==='quartz'?'quartz':'happyhands';
 const [selected,setSelected]=useState(read);
 useEffect(()=>{const update=()=>setSelected(read());addEventListener('popstate',update);return()=>removeEventListener('popstate',update);},[]);
 const frame=useRef<HTMLIFrameElement>(null);
 const [height,setHeight]=useState(1200);
 useEffect(()=>{setHeight(1200);},[selected]);
 useEffect(()=>{const resize=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=='system-content-height')return;const value=event.data.height;if(typeof value==='number'&&Number.isFinite(value)&&value>0)setHeight(Math.min(30000,Math.ceil(value)));};addEventListener('message',resize);return()=>removeEventListener('message',resize);},[]);
 const quartz=selected==='quartz';
 const name=quartz?'Quartz':'HappyHands';
 const base=quartz?'/systems/quartz/':'/systems/happyhands/';
 return <>
 <nav className="provider-navigation" aria-label={t('资源来源','Resource sources')}>{[['happyhands','HappyHands'],['quartz','Quartz']].map(([id,label])=><a href={`?provider=systems&system=${id}`} key={id} aria-current={selected===id?'page':undefined} onClick={e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();setSelected(id);history.pushState(null,'',`?provider=systems&system=${id}`);}}><strong>{label}</strong></a>)}</nav>
 <main id="catalog-main" className="system-library-full">
 <iframe ref={frame} key={selected} title={t(`${name} 完整设计规范`,`${name} complete design system`)} src={`${base}?embedded=1`} style={{height}} />
 </main></>;
}
