/* HappyHands preview protocol v1. Install only on a controlled development preview.
   Configure data-studio-origin explicitly on the script tag. Never accept arbitrary origins. */
(() => {
  const script=document.currentScript;
  const allowed=script?.dataset.studioOrigin;
  if(!allowed || window.parent===window) return;
  let origin;
  try {origin=new URL(allowed).origin;} catch {return;}
  const probe=document.createElement('span').style;
  window.addEventListener('message',event=>{
    const message=event.data;
    if(event.source!==window.parent||event.origin!==origin||!message||message.protocol!=='happyhands-preview-v1'||typeof message.nonce!=='string'||message.nonce.length>100) return;
    const reply=(type)=>window.parent.postMessage({protocol:message.protocol,nonce:message.nonce,type},origin);
    if(message.type==='PING'){reply('READY');return;}
    if(message.type!=='THEME'||!['light','dark'].includes(message.mode)||!message.variables||typeof message.variables!=='object')return;
    const entries=Object.entries(message.variables);
    if(entries.length>100) return;
    for(const [key,value] of entries){
      if(!/^--[a-z0-9-]+$/.test(key)||typeof value!=='string'||value.length>500||/[;{}<>]|url\s*\(|@import/i.test(value))return;
      probe.setProperty(key,value);
    }
    for(const [key,value] of entries)document.documentElement.style.setProperty(key,value);
    document.documentElement.classList.toggle('dark',message.mode==='dark');
    document.documentElement.style.colorScheme=message.mode;
    reply('APPLIED');
  });
})();
