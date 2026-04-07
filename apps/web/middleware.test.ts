import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { middleware } from "./middleware";

function requestWithAuth(username?: string, password?: string) {
  const headers = new Headers();

  if (username && password) {
    headers.set("authorization", `Basic ${btoa(`${username}:${password}`)}`);
  }

  return new NextRequest("http://localhost:3000/admin/jobs", {
    headers,
  });
}

function requestForUrl(url: string) {
  return new NextRequest(url);
}

describe("admin middleware", () => {
  it("allows requests with configured credentials", () => {
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");

    const response = middleware(requestWithAuth("admin", "secret"));

    expect(response.status).toBe(200);
  });

  it("rejects requests without credentials when admin auth is configured", () => {
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");

    const response = middleware(requestWithAuth());

    expect(response.status).toBe(401);
  });

  it("redirects www traffic to the apex domain", () => {
    const response = middleware(requestForUrl("https://www.bigtechjob.com/jobs?company=amazon"));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://bigtechjob.com/jobs?company=amazon");
  });

  it("does not require admin auth on public pages", () => {
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "secret");

    const response = middleware(requestForUrl("https://bigtechjob.com/jobs"));

    expect(response.status).toBe(200);
  });
});
