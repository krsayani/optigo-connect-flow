const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_KEY = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function consumeRateLimit(key: string, max = MAX_PER_KEY, windowMs = WINDOW_MS) {
  const now = Date.now();
  prune(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: max - 1 };
  }
  if (existing.count >= max) {
    return { ok: false as const, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { ok: true as const, remaining: max - existing.count };
}
