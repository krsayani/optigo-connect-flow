const encoder = new TextEncoder();

function toBytes(buffer: ArrayBuffer) {
  return new Uint8Array(buffer);
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i += 1) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

export async function pbkdf2(secret: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: 120_000,
    },
    key,
    256,
  );
  return toBytes(bits);
}

export async function secretsMatch(candidate: string, expected: string, salt: string) {
  const [left, right] = await Promise.all([pbkdf2(candidate, salt), pbkdf2(expected, salt)]);
  return timingSafeEqual(left, right);
}
