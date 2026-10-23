import {assertSiteHandoff,localWorkbenchURL} from '../../packages/contracts/site-handoff.js';

const key='happyhands-local-handoff-v1';
let last=null,draft=null;
try { const stored=JSON.parse(sessionStorage.getItem(key)||'null');if(stored){assertSiteHandoff(stored.handoff);localWorkbenchURL(stored.address,stored.handoff);last=stored;} } catch { /* Invalid or unavailable storage cannot initiate a connection. */ }
export function localWorkbenchMarkup(lang) {
  const zh=lang==='zh';
  return `<div class="local-workbench-connect">
    <header><h3>${zh?'连接项目':'Connect a project'}</h3><p>${zh?'在本地工作台继续修改。先提供项目位置和目标，设计规范随后整理与确认。':'Continue editing in the local workbench. Start with the project location and goal; review design rules afterward.'}</p></header>
    <div class="handoff-field"><label for="handoff-repo">${zh?'项目文件夹':'Project folder'}</label><input id="handoff-repo" autocomplete="off" placeholder="${zh?'例如：C:/Projects/my-app':'e.g. /Users/you/projects/my-app'}" aria-describedby="handoff-repo-help"><small id="handoff-repo-help">${zh?'填写电脑上的项目路径，不是网站地址。':'Use the project path on your computer, not a website URL.'}</small></div>
    <div class="handoff-field"><label for="handoff-task">${zh?'希望改善什么':'What would you like to improve?'}</label><input id="handoff-task" autocomplete="off" placeholder="${zh?'例如：让用户更容易完成注册':'e.g. Make signing up easier'}"></div>
    <details class="handoff-options"><summary>${zh?'补充配置（可选）':'Additional settings (optional)'}</summary><div class="handoff-field"><label for="handoff-sources">${zh?'已有设计规范':'Existing design rules'}</label><textarea id="handoff-sources" rows="3" aria-describedby="handoff-sources-help" placeholder="DESIGN.md&#10;src/styles/tokens.css"></textarea><small id="handoff-sources-help">${zh?'可留空。如已有规范文件，填写相对项目的路径，每行一项。后续结合组件与样式整理规范，再由你确认。':'Leave blank if unknown. If rule files exist, enter project-relative paths, one per line. Review rules alongside components and styles before confirming them.'}</small></div><div class="handoff-field"><label for="handoff-address">${zh?'本地工作台地址':'Local workbench address'}</label><input id="handoff-address" autocomplete="off" value="http://127.0.0.1:4190/apps/designer/" aria-describedby="handoff-address-help"><small id="handoff-address-help">${zh?'通常无需修改；端口不同时，使用启动后显示的地址。':'Keep the default unless the workbench starts on a different port.'}</small></div></details>
    <div class="connect-actions"><a id="handoff-open" class="button button-primary" target="_blank" rel="noopener noreferrer">${zh?'在本地工作台继续':'Continue in local workbench'}</a><a id="handoff-result" class="text-link" target="_blank" rel="noopener noreferrer" hidden>${zh?'查看本次记录':'View this record'}</a></div>
    <p id="handoff-status" role="status"></p><p class="connect-note">${zh?'请先启动本地工作台。信息仅在此标签页保存，打开链接后仍需确认，不会立即修改代码。':'Start the local workbench first. Details stay in this tab. Opening the link requires confirmation before any code changes.'}</p>
  </div>`;
}
export function setupLocalWorkbench(lang) {
  const zh=lang==='zh',repo=document.getElementById('handoff-repo'),task=document.getElementById('handoff-task'),sources=document.getElementById('handoff-sources'),address=document.getElementById('handoff-address'),open=document.getElementById('handoff-open'),result=document.getElementById('handoff-result'),status=document.getElementById('handoff-status');
  if(last){repo.value=last.handoff.repo;task.value=last.handoff.task;sources.value=last.handoff.designSources.join('\n');address.value=last.address;result.href=localWorkbenchURL(last.address,last.handoff);result.hidden=false;}
  if(draft){repo.value=draft.repo;task.value=draft.task;sources.value=draft.sources;address.value=draft.address;}
  let prepared=null;
  function prepare(){
    const input={repo:repo.value.trim(),task:task.value.trim(),designSources:[...new Set(sources.value.split(/\r?\n/).map(path=>path.trim()).filter(Boolean))]};
    const same=value=>value&&value.repo===input.repo&&value.task===input.task&&JSON.stringify(value.designSources)===JSON.stringify(input.designSources);
    const id=same(prepared)?prepared.id:same(last?.handoff)?last.handoff.id:crypto.randomUUID();
    prepared=assertSiteHandoff({schemaVersion:'0.1',id,...input});
    open.href=localWorkbenchURL(address.value.trim(),prepared);
    return prepared;
  }
  for(const field of [repo,task,sources,address])field.addEventListener('input',()=>{draft={repo:repo.value,task:task.value,sources:sources.value,address:address.value};try{prepare();status.textContent='';}catch{open.removeAttribute('href');}});
  open.addEventListener('click',event=>{
    try {
      const handoff=prepare();last={address:address.value.trim(),handoff};
      let saved=true;
      try{sessionStorage.setItem(key,JSON.stringify(last));}catch{saved=false;}
      result.href=open.href;result.hidden=false;
      status.textContent=!saved?(zh?'浏览器未保存交接链接，请保留本地页面。':'The browser did not save this link. Keep the local page open.') : zh?'交接链接已准备。若本地页面无法打开，先启动 pnpm workbench，再点此入口；重复打开会回到同一任务。':'Handoff prepared. If the local page is unavailable, start pnpm workbench and try again. Reopening returns to the same task.';
    } catch(error) {event.preventDefault();status.textContent=(zh?'请填写项目目录、任务并核对设计来源和本地地址。 ':'Enter a repository and task, and check design sources and the local address. ')+error.message;}
  });
  if(last||draft){try{prepare();}catch{open.removeAttribute('href');}}
}
