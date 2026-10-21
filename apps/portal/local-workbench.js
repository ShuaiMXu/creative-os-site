import {assertSiteHandoff,localWorkbenchURL} from '../../packages/contracts/site-handoff.js';

const key='happyhands-local-handoff-v1';
let last=null,draft=null;
try { const stored=JSON.parse(sessionStorage.getItem(key)||'null');if(stored){assertSiteHandoff(stored.handoff);localWorkbenchURL(stored.address,stored.handoff);last=stored;} } catch { /* Invalid or unavailable storage cannot initiate a connection. */ }
export function localWorkbenchMarkup(lang) {
  const zh=lang==='zh';
  return `<div class="local-workbench-connect"><h3>${zh?'连接你的本地项目':'Connect your local project'}</h3><p>${zh?'资料只在此标签页保留，通过本地链接交接。打开后先确认项目、规范来源和采集范围。':'Details stay in this tab and travel through a local link. Confirm the project, design sources and capture scope in the workbench.'}</p><label for="handoff-repo">${zh?'项目仓库目录':'Repository directory'}</label><input id="handoff-repo" autocomplete="off" placeholder="/Users/you/projects/my-app"><label for="handoff-task">${zh?'核心用户任务':'Key user task'}</label><input id="handoff-task" autocomplete="off"><label for="handoff-sources">${zh?'设计规范来源（仓库相对路径，每行一项）':'Design sources (repository-relative paths, one per line)'}</label><textarea id="handoff-sources" rows="3" placeholder="DESIGN.md&#10;src/styles/tokens.css&#10;src/components"></textarea><details><summary>${zh?'本地工作台地址':'Local workbench address'}</summary><label for="handoff-address">${zh?'使用启动命令实际显示的地址':'Use the address shown by your startup command'}</label><input id="handoff-address" autocomplete="off" value="http://127.0.0.1:4190/apps/designer/"></details><div class="connect-actions"><a id="handoff-open" class="button button-primary" target="_blank" rel="noopener noreferrer">${zh?'在本地工作台继续':'Continue in local workbench'}</a><a id="handoff-result" class="text-link" target="_blank" rel="noopener noreferrer" hidden>${zh?'查看本次记录':'View this record'}</a></div><p id="handoff-status" role="status"></p><p class="connect-note">${zh?'先在主仓库运行 pnpm workbench。此入口不会上传源码、批准规范或直接修改代码。':'Run pnpm workbench in the core repository first. This entry does not upload source, approve rules or edit code.'}</p></div>`;
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
