export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl text-ink md:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-slate">{description}</p>
    </div>
  );
}
