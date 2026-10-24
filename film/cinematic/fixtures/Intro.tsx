// Fictional Northstar fixture, authored for the film. Before: space-4; after: space-8.
const tagline = 'Digital products, thoughtfully put together.';

export function Intro() {
  return <section className="hero">
    <h2>Good ideas. Built well.</h2>
    <div className="intro-actions">
      <p>{tagline}</p>
      <ActionLink />
    </div>
  </section>;
}

function ActionLink() {
  return <a className="action-link" href="#work">Explore our work <span>↗</span></a>;
}
