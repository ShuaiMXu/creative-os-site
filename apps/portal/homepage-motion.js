// A lightweight, illustrative product sequence; no real review is run here.
export function setupHomepageMotion(lang) {
  const zh = lang === 'zh';
  const t = (a, b) => zh ? a : b;
  const hero = document.querySelector('.hero');
  hero.querySelector('.whirl')?.remove();
  hero.querySelector('.hero-demo')?.remove();
  const steps = [
    [t('发现问题', 'Find the friction'), t('操作挤在一起，用户难以判断下一步。', 'Competing actions make the next step hard to find.')],
    [t('统一组件', 'Bring it together'), t('统一间距与控件，突出主要操作。', 'Align spacing and controls. Give the main action room.')],
    [t('前后复核', 'Review the change'), t('对照调整效果，再确认是否采用。', 'Compare the result before accepting the change.')],
  ];
  const demo = document.createElement('section');
  demo.className = 'hero-demo';
  demo.setAttribute('aria-label', t('体验优化交互示例', 'Interactive experience improvement example'));
  demo.innerHTML = `
    <div class="demo-caption"><span><i aria-hidden="true"></i> ${t('从细节，到体验', 'Small details. Better experiences.')}</span><span>${t('交互示例', 'Illustrative demo')}</span></div>
    <div class="demo-canvas" data-step="0">
      <div class="demo-sheet" aria-hidden="true">
        <div class="demo-sheet-head"><span>Workspace</span><span class="demo-avatar">H</span></div>
        <div class="demo-sheet-body"><span class="demo-overline">${t('项目 / 概览', 'PROJECT / OVERVIEW')}</span>
        <h2>${t('下一步，更清楚。', 'A clearer next step.')}</h2>
        <p>${t('把想法变成值得交付的产品。', 'Turn your idea into a product worth shipping.')}</p>
        <div class="demo-task"><span class="demo-task-icon">✓</span><div><b>${t('产品首页', 'Product homepage')}</b><small>${t('布局 · 组件 · 交互', 'Layout · Components · Interaction')}</small></div><span class="demo-task-dot"></span></div>
        <div class="demo-actions"><span class="demo-action-secondary">${t('查看详情', 'View details')}</span><span class="demo-action-primary">${t('开始审阅', 'Start review')} <span>↗</span></span></div>
        </div>
        <div class="demo-sheet-foot"><span>HappyHands</span><span>${t('项目工作空间', 'Project workspace')}</span></div>
      </div>
      <div class="demo-callout" aria-hidden="true"><span class="demo-callout-symbol">↗</span><div><b></b><span></span></div></div>
      <div class="demo-scan" aria-hidden="true"></div>
    </div>
    <div class="demo-controls" role="group" aria-label="${t('演示步骤', 'Demo steps')}">${steps.map(([label], i) => `<button type="button" data-demo-step="${i}" aria-pressed="${i === 0}" aria-controls="demo-description"><span>0${i + 1}</span>${label}<i aria-hidden="true"></i></button>`).join('')}</div>
    <div class="demo-description-row"><p id="demo-description"></p><button class="demo-pause" type="button"></button></div>`;
  hero.appendChild(demo);
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = media.matches, visible = false, timer;
  const buttons = [...demo.querySelectorAll('[data-demo-step]')];
  const pause = demo.querySelector('.demo-pause');
  const canvas = demo.querySelector('.demo-canvas');
  function paint() {
    canvas.dataset.step = String(index);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    demo.querySelector('#demo-description').textContent = steps[index][1];
    demo.querySelector('.demo-callout b').textContent = steps[index][0];
    demo.querySelector('.demo-callout div>span').textContent = [t('明确主次', 'Clear priorities'), t('间距与样式一致', 'Consistent spacing'), t('保留你的判断', 'You make the call')][index];
    pause.textContent = paused ? t('播放', 'Play') : t('暂停', 'Pause');
    pause.setAttribute('aria-label', paused ? t('播放演示', 'Play demo') : t('暂停演示', 'Pause demo'));
    demo.classList.toggle('demo-running', !paused && visible && !document.hidden);
  }
  function schedule() {
    clearTimeout(timer);
    paint();
    if (!paused && visible && !document.hidden) timer = setTimeout(() => { index = (index + 1) % 3; schedule(); }, 4200);
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => { paused = true; index = i; schedule(); }));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  const onFocus = () => { paused = true; schedule(); };
  canvas.addEventListener('pointerenter', onFocus);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold: 0.15});
  observer.observe(demo);
  const onVisibility = () => schedule();
  const onMotion = () => { paused = media.matches; schedule(); };
  document.addEventListener('visibilitychange', onVisibility);
  media.addEventListener('change', onMotion);
  paint();
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('motion-arrived'); reveal.unobserve(entry.target); }
  }), {threshold: 0.08});
  document.querySelectorAll('.section-head, .app-card, .case-links article, .get-started-copy').forEach(el => {
    el.classList.add('motion-reveal'); reveal.observe(el);
  });
  return () => {
    clearTimeout(timer); observer.disconnect(); reveal.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    media.removeEventListener('change', onMotion);
    demo.remove();
  };
}
