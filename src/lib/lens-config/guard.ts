import type { LensConfigDatabase } from "./types";

export function isLensConfigDatabase(value: unknown): value is LensConfigDatabase {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    Array.isArray(row["manufacturers"]) &&
    Array.isArray(row["visionTypes"]) &&
    Array.isArray(row["lensDesigns"]) &&
    Array.isArray(row["materials"]) &&
    Array.isArray(row["products"]) &&
    Array.isArray(row["labs"]) &&
    Array.isArray(row["locations"]) &&
    Array.isArray(row["offerings"]) &&
    Array.isArray(row["routingRules"]) &&
    Array.isArray(row["orders"])
  );
}
