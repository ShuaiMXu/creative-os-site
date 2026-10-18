// Reuse full system pages inside the resource library without duplicating the shell.
if (new URLSearchParams(location.search).get('embedded') === '1') {
  document.documentElement.classList.add('system-embedded');
  const update = () => parent.postMessage({type:'system-content-height',height:document.body.scrollHeight},location.origin);
  const observer = new ResizeObserver(update);
  observer.observe(document.body);
  addEventListener('load',update);
}
