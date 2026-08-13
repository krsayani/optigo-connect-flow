import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";
import { getSupabase } from "@/lib/supabase/server";
import { isLensConfigDatabase } from "./guard";

const orgSchema = z.object({
  organizationId: z.string().trim().min(1).max(80),
});

const persistSchema = orgSchema.extend({
  payload: z.string().min(2),
  updatedBy: z.string().trim().max(80).optional(),
});

export type RemoteLoadResult =
  | { ok: true; configured: false; payload: null }
  | { ok: true; configured: true; payload: string | null }
  | { ok: false; configured: true; error: string; payload: null };

export const fetchLensConfig = createServerFn({ method: "POST" })
  .validator((input: unknown) => orgSchema.parse(input))
  .handler(async ({ data }): Promise<RemoteLoadResult> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { ok: true, configured: false, payload: null };
    }

    const { data: row, error } = await supabase
      .from("lens_config_state")
      .select("payload")
      .eq("organization_id", data.organizationId)
      .maybeSingle();

    if (error) {
      console.error("lens_config_state read failed:", error.message);
      return { ok: false, configured: true, error: error.message, payload: null };
    }
    if (!row) {
      return { ok: true, configured: true, payload: null };
    }
    if (!isLensConfigDatabase(row.payload)) {
      return { ok: false, configured: true, error: "Invalid workspace payload.", payload: null };
    }
    return { ok: true, configured: true, payload: JSON.stringify(row.payload) };
  });

export const persistLensConfig = createServerFn({ method: "POST" })
  .validator((input: unknown) => persistSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { ok: true as const, configured: false as const };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(data.payload) as unknown;
    } catch {
      return { ok: false as const, configured: true as const, error: "Invalid workspace payload." };
    }
    if (!isLensConfigDatabase(parsed)) {
      return { ok: false as const, configured: true as const, error: "Invalid workspace payload." };
    }

    const { error } = await supabase.from("lens_config_state").upsert({
      organization_id: data.organizationId,
      payload: parsed as unknown as Json,
      updated_at: new Date().toISOString(),
      updated_by: data.updatedBy ?? null,
    });

    if (error) {
      console.error("lens_config_state write failed:", error.message);
      return { ok: false as const, configured: true as const, error: error.message };
    }
    return { ok: true as const, configured: true as const };
  });
