"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-5xl text-ink">Something broke</h1>
      <p className="mt-6 text-lg leading-8 text-slate">{error.message}</p>
      <button onClick={reset} className="mt-8 rounded-full bg-ink px-6 py-3 font-medium text-sand">
        Try again
      </button>
    </div>
  );
}
