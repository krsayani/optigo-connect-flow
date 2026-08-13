import { describe, expect, it } from "vitest";
import { pbkdf2, secretsMatch, timingSafeEqual } from "../crypto.server";
import { consumeRateLimit } from "../rate-limit.server";

describe("timingSafeEqual", () => {
  it("accepts identical bytes", () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    expect(timingSafeEqual(a, new Uint8Array([1, 2, 3, 4]))).toBe(true);
  });

  it("rejects different values and lengths", () => {
    expect(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2]))).toBe(false);
  });
});

describe("secretsMatch", () => {
  it("matches the same secret against itself", async () => {
    await expect(secretsMatch("correct-horse", "correct-horse", "salt")).resolves.toBe(true);
  });

  it("rejects a different secret", async () => {
    await expect(secretsMatch("wrong", "correct-horse", "salt")).resolves.toBe(false);
  });

  it("produces a 32-byte key", async () => {
    const bits = await pbkdf2("secret", "salt");
    expect(bits.byteLength).toBe(32);
  });
});

describe("consumeRateLimit", () => {
  it("allows requests under the cap and then locks the key", () => {
    const key = `test:${Date.now()}:${Math.random()}`;
    expect(consumeRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(consumeRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(consumeRateLimit(key, 3, 60_000).ok).toBe(true);
    expect(consumeRateLimit(key, 3, 60_000).ok).toBe(false);
  });
});
