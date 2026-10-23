import React, { useEffect, useRef, useState } from "react";

// Only visible tiles mount a preview. Leaving the viewport releases canvases and timers.
export function ComponentTile({
  id,
  name,
  category,
  dark,
  lang,
  onSelect,
}: {
  id: string;
  name: string;
  category: string;
  dark: boolean;
  lang: string;
  onSelect: (id: string) => void;
}) {
  const node = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (node.current) observer.observe(node.current);
    return () => observer.disconnect();
  }, []);
  return (
    <a
      ref={node}
      className="component-tile"
      href={`?provider=cult-ui&component=${encodeURIComponent(id)}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onSelect(id);
      }}
    >
      <div className="component-tile-art" aria-hidden="true">
        {visible && (
          <iframe
            title={`${name} preview`}
            src={`/components/preview/?component=${encodeURIComponent(id)}&theme=${dark ? "dark" : "light"}&lang=${lang}&motion=off`}
            tabIndex={-1}
            inert
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <div className="component-tile-caption">
        <h2>{name}</h2>
        <span>{category}</span>
      </div>
    </a>
  );
}
