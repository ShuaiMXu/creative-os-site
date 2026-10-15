import { useEffect, useState, type ReactNode } from "react";

export function SystemDirectory({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(
    () => matchMedia("(min-width:900px)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(min-width:900px)");
    const sync = () => setOpen(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <details
      className="system-directory"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>{label}</summary>
      {children}
    </details>
  );
}
