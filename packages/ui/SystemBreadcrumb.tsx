export function SystemBreadcrumb({
  current,
  lang,
}: {
  current: string;
  lang: string;
}) {
  const zh = lang === "zh";
  return (
    <nav
      className="system-breadcrumb"
      aria-label={zh ? "面包屑" : "Breadcrumb"}
    >
      <a href="/apps/portal/">{zh ? "官网" : "Home"}</a>
      <span aria-hidden="true">/</span>
      <a href="/apps/portal/#explore">{zh ? "设计系统" : "Design systems"}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
