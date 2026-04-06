import Link from "next/link";

const navItems = [
  { href: "/jobs", label: "Jobs" },
  { href: "/prep", label: "Interview Prep" },
  { href: "/resources", label: "Resources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-sand/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sand">
            B5
          </span>
          Big Five Career Hub
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
