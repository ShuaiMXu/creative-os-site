// Keep the production Hero untouched; enhance only the content below it.
export function setupHomepageMotion() {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('motion-arrived'); reveal.unobserve(entry.target); }
  }), {threshold: 0.08});
  document.querySelectorAll('.section-head, .app-card, .case-links article, .get-started-copy').forEach(el => {
    el.classList.add('motion-reveal'); reveal.observe(el);
  });
  return () => reveal.disconnect();
}
