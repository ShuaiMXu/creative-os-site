import React, {useEffect,useRef,useState} from 'react';
type Design={slug:string;title:string;description:string;image:string|null;fullImage:string|null;source:string|null;product:string;styles:string[]};
export function KageGallery({lang}:{lang:string}) {
 const t=(zh:string,en:string)=>lang==='zh'?zh:en;
 const [query,setQuery]=useState(''),[items,setItems]=useState<Design[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[searched,setSearched]=useState(false),[selected,setSelected]=useState<Design|null>(null);
 const controller=useRef<AbortController|null>(null);
 useEffect(()=>()=>controller.current?.abort(),[]);
 async function search(e:React.FormEvent){e.preventDefault();controller.current?.abort();const c=new AbortController();controller.current=c;setBusy(true);setError('');setSelected(null);setItems([]);setSearched(true);
 try {const r=await fetch(`/api/kage?query=${encodeURIComponent(query.trim())}`,{signal:c.signal});if(!r.ok)throw Error();const data=await r.json();setItems(data.designs);}
 catch(e){if(!c.signal.aborted)setError(t('暂时无法获取参考，请重试。','Unable to load references. Please retry.'));}
 finally{if(!c.signal.aborted)setBusy(false);}}
 return <section className="kage-gallery">
 <p>{t('输入产品名称或风格，每次展示最多 6 个相关参考。','Enter a product or style to see up to six relevant references.')}</p>
 <form onSubmit={search} className="kage-search"><label>{t('产品或风格','Product or style')}<input type="search" maxLength={160} required value={query} onChange={e=>setQuery(e.target.value)} placeholder="Linear, minimal, dashboard…" /></label><button disabled={busy || !query.trim()}>{busy?t('查询中…','Searching…'):t('查找参考','Search references')}</button></form>
 <p role="status">{error || (!busy && searched && !items.length ? t('没有找到匹配的参考。','No matching references.') : '')}</p>
 <div className="kage-grid">{items.map(x=><button className="kage-card" key={x.slug} onClick={()=>setSelected(x)}>{x.image&&<img src={x.image} alt={x.title} loading="lazy" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.hidden=true}}/>}<strong>{x.title}</strong><span>{x.product} · {x.styles.join(' / ')}</span><span>{t('查看设计分析','View design analysis')}</span></button>)}</div>
 {selected&&<section className="kage-detail" aria-label={t('设计详情','Design details')}><button onClick={()=>setSelected(null)}>{t('收起详情','Close details')}</button><h3>{selected.title}</h3>{selected.fullImage&&<img src={selected.fullImage} alt={selected.title} referrerPolicy="no-referrer"/>}<p>{selected.description}</p>{selected.source&&<a href={selected.source} target="_blank" rel="noreferrer">{t('查看 Kage 来源','View Kage source')}</a>}<p>{t('截图属于原产品，仅用于设计参考。设计分析为上游原文。','Screenshots belong to their products and are for reference. Analysis is the original source text.')}</p></section>}
 </section>
}
