import { useEffect, useRef, useState, type ReactNode } from "react";

export function SystemDirectory({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const directory = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(
    () => matchMedia("(min-width:900px)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(min-width:900px)");
    const sync = () => setOpen(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const links = [
      ...(directory.current?.querySelectorAll<HTMLAnchorElement>(
        'nav a[href^="#"]',
      ) || []),
    ];
    const sections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const update = () => {
      frame = 0;
      const current =
        sections
          .filter(
            (section) =>
              section.getBoundingClientRect().top <= innerHeight * 0.25,
          )
          .at(-1) || sections[0];
      links.forEach((link) => {
        if (link.hash === `#${current?.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);
  return (
    <details
      ref={directory}
      className="system-directory"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>{label}</summary>
      {children}
    </details>
  );
}
