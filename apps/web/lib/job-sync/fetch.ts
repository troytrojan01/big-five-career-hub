const DEFAULT_HEADERS = {
  "accept-language": "en-US,en;q=0.9",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
};

function withTimeout(timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timer);
    },
  };
}

export async function fetchText(url: string, timeoutMs = 20_000) {
  const timeout = withTimeout(timeoutMs);

  try {
    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: timeout.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request to ${url} failed with status ${response.status}.`);
    }

    return response.text();
  } finally {
    timeout.clear();
  }
}

export async function fetchJson<T>(url: string, timeoutMs = 20_000) {
  const text = await fetchText(url, timeoutMs);
  return JSON.parse(text) as T;
}

export async function mapWithConcurrency<TInput, TOutput>(
  values: TInput[],
  concurrency: number,
  mapper: (value: TInput, index: number) => Promise<TOutput>,
) {
  const results: TOutput[] = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= values.length) {
        return;
      }

      results[currentIndex] = await mapper(values[currentIndex] as TInput, currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  return results;
}
