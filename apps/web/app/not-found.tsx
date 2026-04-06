import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-5xl text-ink">Page not found</h1>
      <p className="mt-6 text-lg leading-8 text-slate">
        That page is missing or the role has likely aged out of the current verification window.
      </p>
      <Link href="/jobs" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-medium text-sand">
        Back to jobs
      </Link>
    </div>
  );
}
