"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) {
    return;
  }

  posthog.init(apiKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
  });

  initialized = true;
}

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  if (!initialized) {
    return;
  }

  posthog.capture(event, properties);
}
