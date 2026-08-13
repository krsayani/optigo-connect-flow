import { createId, nowIso } from "./ids";
import type { Actor, LabLensOffering, LensConfigDatabase } from "./types";
import { upsertOffering } from "./catalog";
import { validateOffering } from "./validation";

export const CSV_HEADERS = [
  "id",
  "lab",
  "manufacturer",
  "visionType",
  "design",
  "lensProduct",
  "material",
  "coating",
  "photochromicProduct",
  "photochromicColor",
  "polarization",
  "tint",
  "mirror",
  "labProductName",
  "labSku",
  "cost",
  "turnaround",
  "sphereMin",
  "sphereMax",
  "cylinderMin",
  "cylinderMax",
  "addMin",
  "addMax",
  "fittingHeightMin",
  "drillMountAllowed",
  "grooveAllowed",
  "rimlessAllowed",
  "wrapAllowed",
  "safetyFrameAllowed",
  "effectiveStart",
  "effectiveEnd",
  "location",
  "active",
] as const;

function csvEscape(value: string | number | boolean | null | undefined): string {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function labelOf(row: { name?: string; productName?: string }): string {
  return (row.name ?? row.productName ?? "").toLowerCase();
}

function byName<T extends { active: boolean; id: string; name?: string; productName?: string }>(
  rows: T[],
  name: string,
): T | undefined {
  const needle = (name ?? "").trim().toLowerCase();
  if (!needle || needle === "none") return undefined;
  return rows.find((row) => labelOf(row) === needle);
}

function num(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : Number.NaN;
}

function bool(value: string, fallback = true): boolean {
  if (!value.trim()) return fallback;
  return ["1", "true", "yes", "y"].includes(value.trim().toLowerCase());
}

export function exportOfferingsCsv(db: LensConfigDatabase, organizationId: string): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const offering of db.offerings.filter((row) => row.organizationId === organizationId)) {
    const lab = db.labs.find((row) => row.id === offering.labId);
    const product = db.products.find((row) => row.id === offering.lensProductId);
    const manufacturer = product
      ? db.manufacturers.find((row) => row.id === product.manufacturerId)
      : undefined;
    const vision = product
      ? db.visionTypes.find((row) => row.id === product.visionTypeId)
      : undefined;
    const design = product
      ? db.lensDesigns.find((row) => row.id === product.lensDesignId)
      : undefined;
    const material = db.materials.find((row) => row.id === offering.lensMaterialId);
    const coating = offering.coatingId
      ? db.coatings.find((row) => row.id === offering.coatingId)
      : undefined;
    const photo = offering.photochromicProductId
      ? db.photochromicProducts.find((row) => row.id === offering.photochromicProductId)
      : undefined;
    const color = offering.photochromicColorId
      ? db.photochromicColors.find((row) => row.id === offering.photochromicColorId)
      : undefined;
    const pol = offering.polarizationOptionId
      ? db.polarizationOptions.find((row) => row.id === offering.polarizationOptionId)
      : undefined;
    const tint = offering.tintOptionId
      ? db.tintOptions.find((row) => row.id === offering.tintOptionId)
      : undefined;
    const mirror = offering.mirrorOptionId
      ? db.mirrorOptions.find((row) => row.id === offering.mirrorOptionId)
      : undefined;
    const location = offering.locationId
      ? db.locations.find((row) => row.id === offering.locationId)
      : undefined;
    const values = [
      offering.id,
      lab?.name,
      manufacturer?.name,
      vision?.name,
      design?.name,
      product?.productName,
      material?.name,
      coating?.name ?? "None",
      photo?.name ?? "None",
      color?.name ?? "None",
      pol?.name ?? "None",
      tint?.name ?? "None",
      mirror?.name ?? "None",
      offering.labProductName,
      offering.labProductCode,
      offering.cost,
      offering.estimatedTurnaroundBusinessDays,
      offering.sphereMin,
      offering.sphereMax,
      offering.cylinderMin,
      offering.cylinderMax,
      offering.addMin,
      offering.addMax,
      offering.minimumFittingHeight,
      offering.drillMountAllowed,
      offering.grooveAllowed,
      offering.rimlessAllowed,
      offering.wrapAllowed,
      offering.safetyFrameAllowed,
      offering.effectiveStartDate,
      offering.effectiveEndDate,
      location?.name ?? "",
      offering.active,
    ];
    lines.push(values.map((value) => csvEscape(value)).join(","));
  }
  return lines.join("\n");
}

export type CsvImportRowError = { row: number; message: string };
export type CsvImportPreview = {
  rows: LabLensOffering[];
  errors: CsvImportRowError[];
  duplicates: string[];
};

export function previewOfferingImport(
  db: LensConfigDatabase,
  organizationId: string,
  csvText: string,
): CsvImportPreview {
  const table = parseCsv(csvText);
  const header = table[0];
  const errors: CsvImportRowError[] = [];
  const rows: LabLensOffering[] = [];
  const duplicates: string[] = [];
  if (!header) return { rows, errors: [{ row: 0, message: "CSV is empty." }], duplicates };

  const index = new Map(header.map((name, i) => [name.trim(), i]));
  const col = (row: string[], name: string) => row[index.get(name) ?? -1] ?? "";

  table.slice(1).forEach((raw, offset) => {
    const rowNumber = offset + 2;
    try {
      const lab = byName(
        db.labs.filter((l) => l.organizationId === organizationId),
        col(raw, "lab"),
      );
      const product = byName(db.products, col(raw, "lensProduct"));
      const material = byName(db.materials, col(raw, "material"));
      if (!lab) throw new Error(`Unknown lab "${col(raw, "lab")}".`);
      if (!product) throw new Error(`Unknown lens product "${col(raw, "lensProduct")}".`);
      if (!material) throw new Error(`Unknown material "${col(raw, "material")}".`);
      const coatingName = col(raw, "coating");
      const coating =
        !coatingName || coatingName.toLowerCase() === "none"
          ? undefined
          : byName(db.coatings, coatingName);
      if (coatingName && coatingName.toLowerCase() !== "none" && !coating) {
        throw new Error(`Unknown coating "${coatingName}".`);
      }
      const photoName = col(raw, "photochromicProduct");
      const photo =
        !photoName || photoName.toLowerCase() === "none"
          ? undefined
          : byName(db.photochromicProducts, photoName);
      const colorName = col(raw, "photochromicColor");
      const color =
        !colorName || colorName.toLowerCase() === "none"
          ? undefined
          : byName(db.photochromicColors, colorName);
      const polName = col(raw, "polarization");
      const pol =
        byName(db.polarizationOptions, polName) ??
        db.polarizationOptions.find((p) => p.code === "NONE");
      const tintName = col(raw, "tint");
      const tint =
        byName(db.tintOptions, tintName) ?? db.tintOptions.find((t) => t.code === "NONE");
      const mirrorName = col(raw, "mirror");
      const mirror =
        byName(db.mirrorOptions, mirrorName) ?? db.mirrorOptions.find((m) => m.code === "NONE");
      const locationName = col(raw, "location");
      const location = locationName ? byName(db.locations, locationName) : undefined;

      const cost = num(col(raw, "cost"));
      if (Number.isNaN(cost)) throw new Error("Cost must be numeric.");
      const turnaround = num(col(raw, "turnaround"));
      if (Number.isNaN(turnaround)) throw new Error("Turnaround must be numeric.");

      const id = col(raw, "id").trim() || createId("off");
      const offering: LabLensOffering = {
        id,
        organizationId,
        locationId: location?.id ?? null,
        labId: lab.id,
        lensProductId: product.id,
        lensMaterialId: material.id,
        coatingId: coating?.id ?? null,
        photochromicProductId: photo?.id ?? null,
        photochromicColorId: color?.id ?? null,
        polarizationOptionId: pol?.id ?? null,
        tintOptionId: tint?.id ?? null,
        mirrorOptionId: mirror?.id ?? null,
        labProductName: col(raw, "labProductName") || product.productName,
        labProductCode: col(raw, "labSku") || null,
        labCoatingCode: null,
        labPhotochromicCode: null,
        labMaterialCode: null,
        cost,
        retailPrice: null,
        estimatedTurnaroundBusinessDays: turnaround,
        rushAvailable: false,
        rushCost: null,
        active: bool(col(raw, "active")),
        effectiveStartDate: col(raw, "effectiveStart") || null,
        effectiveEndDate: col(raw, "effectiveEnd") || null,
        warrantyMonths: null,
        remakePolicy: null,
        notes: "",
        sphereMin: num(col(raw, "sphereMin")),
        sphereMax: num(col(raw, "sphereMax")),
        cylinderMin: num(col(raw, "cylinderMin")),
        cylinderMax: num(col(raw, "cylinderMax")),
        addMin: num(col(raw, "addMin")),
        addMax: num(col(raw, "addMax")),
        prismHorizontalMax: null,
        prismVerticalMax: null,
        totalPrismMax: null,
        minimumFittingHeight: num(col(raw, "fittingHeightMin")),
        minimumBlankSize: null,
        maximumBlankSize: null,
        minimumCenterThickness: null,
        maximumDecentration: null,
        drillMountAllowed: bool(col(raw, "drillMountAllowed")),
        grooveAllowed: bool(col(raw, "grooveAllowed")),
        rimlessAllowed: bool(col(raw, "rimlessAllowed")),
        wrapAllowed: bool(col(raw, "wrapAllowed"), false),
        safetyFrameAllowed: bool(col(raw, "safetyFrameAllowed")),
        edgePolishAvailable: true,
        rollAndPolishAvailable: true,
        specialBaseCurveRequired: false,
        supportedBaseCurves: null,
        restrictionsJson: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        createdBy: null,
      };
      const issues = validateOffering(offering, db);
      if (issues.length) throw new Error(issues.map((i) => i.message).join(" "));
      const existing = db.offerings.find(
        (row) =>
          row.id === offering.id ||
          (row.labId === offering.labId &&
            row.lensProductId === offering.lensProductId &&
            row.lensMaterialId === offering.lensMaterialId &&
            row.coatingId === offering.coatingId &&
            row.photochromicProductId === offering.photochromicProductId &&
            row.photochromicColorId === offering.photochromicColorId &&
            row.polarizationOptionId === offering.polarizationOptionId &&
            row.tintOptionId === offering.tintOptionId &&
            row.mirrorOptionId === offering.mirrorOptionId &&
            row.locationId === offering.locationId),
      );
      if (existing && existing.id !== offering.id) duplicates.push(offering.labProductName);
      if (existing) offering.id = existing.id;
      rows.push(offering);
    } catch (error) {
      errors.push({
        row: rowNumber,
        message: error instanceof Error ? error.message : "Invalid row.",
      });
    }
  });

  return { rows, errors, duplicates };
}

export function applyOfferingImport(
  db: LensConfigDatabase,
  actor: Actor,
  preview: CsvImportPreview,
  importValidRowsOnly: boolean,
): { imported: number; skipped: number } {
  if (preview.errors.length && !importValidRowsOnly) {
    throw new Error("Import blocked because some rows are invalid.");
  }
  let imported = 0;
  for (const row of preview.rows) {
    upsertOffering(db, actor, row);
    imported += 1;
  }
  return { imported, skipped: preview.errors.length };
}

export function errorReportCsv(errors: CsvImportRowError[]): string {
  return ["row,message", ...errors.map((e) => `${e.row},${csvEscape(e.message)}`)].join("\n");
}
