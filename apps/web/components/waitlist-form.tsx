"use client";

import { FormEvent, useState, useTransition } from "react";

import { track } from "@/lib/analytics";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setMessage("");

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "homepage-hero" }),
      });

      const payload = (await response.json()) as { message: string };
      setMessage(payload.message);

      if (response.ok) {
        setEmail("");
        track("newsletter_signup", { source: "homepage-hero" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-4xl border border-ink/10 bg-white p-6 shadow-float">
      <label className="block text-sm font-medium text-ink" htmlFor="waitlist-email">
        Join the launch list
      </label>
      <p className="mt-2 text-sm text-slate">Get new role drops, prep updates, and launch notes.</p>
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="min-h-12 flex-1 rounded-full border border-ink/10 bg-sand px-5 text-ink outline-none ring-0 transition placeholder:text-slate focus:border-ink/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-12 rounded-full bg-ink px-6 font-medium text-sand transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Joining..." : "Join waitlist"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm text-slate">{message}</p> : null}
    </form>
  );
}
