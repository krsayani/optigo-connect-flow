import type {
  LensConfigDatabase,
  LensConfigurationSelection,
  OrderSnapshot,
  ResolveLabResult,
} from "./types";

export function configurationSummary(
  db: LensConfigDatabase,
  selection: LensConfigurationSelection,
): string {
  const product = db.products.find((row) => row.id === selection.lensProductId);
  const design = db.lensDesigns.find((row) => row.id === selection.lensDesignId);
  const material = db.materials.find((row) => row.id === selection.lensMaterialId);
  const coating = selection.coatingId
    ? db.coatings.find((row) => row.id === selection.coatingId)
    : undefined;
  const photo = selection.photochromicProductId
    ? db.photochromicProducts.find((row) => row.id === selection.photochromicProductId)
    : undefined;
  const color = selection.photochromicColorId
    ? db.photochromicColors.find((row) => row.id === selection.photochromicColorId)
    : undefined;
  const parts = [
    design?.name ?? "Lens",
    product?.productName,
    material ? String(material.refractiveIndex) : null,
    coating?.name,
    photo ? `${photo.name}${color ? ` ${color.name}` : ""}` : null,
  ].filter((part): part is string => Boolean(part));
  return parts.join(" · ");
}

export function buildOrderSnapshot(
  db: LensConfigDatabase,
  selection: LensConfigurationSelection,
  result: ResolveLabResult,
): OrderSnapshot {
  const product = db.products.find((row) => row.id === selection.lensProductId);
  const manufacturer = product
    ? db.manufacturers.find((row) => row.id === product.manufacturerId)
    : undefined;
  const design = db.lensDesigns.find((row) => row.id === selection.lensDesignId);
  const material = db.materials.find((row) => row.id === selection.lensMaterialId);
  const coating = selection.coatingId
    ? db.coatings.find((row) => row.id === selection.coatingId)
    : undefined;
  const photo = selection.photochromicProductId
    ? db.photochromicProducts.find((row) => row.id === selection.photochromicProductId)
    : undefined;
  const color = selection.photochromicColorId
    ? db.photochromicColors.find((row) => row.id === selection.photochromicColorId)
    : undefined;
  const pol = selection.polarizationOptionId
    ? db.polarizationOptions.find((row) => row.id === selection.polarizationOptionId)
    : undefined;
  const tint = selection.tintOptionId
    ? db.tintOptions.find((row) => row.id === selection.tintOptionId)
    : undefined;
  const mirror = selection.mirrorOptionId
    ? db.mirrorOptions.find((row) => row.id === selection.mirrorOptionId)
    : undefined;

  const none = "None";
  return {
    lensProductName: product?.productName ?? "Unknown product",
    manufacturer: manufacturer?.name ?? "Unknown",
    design: design?.name ?? "Unknown",
    material: material?.name ?? "Unknown",
    refractiveIndex: material?.refractiveIndex ?? 0,
    coating: coating?.name ?? none,
    photochromicProduct: photo?.name ?? none,
    photochromicColor: color?.name ?? none,
    polarization: pol?.name ?? none,
    tint: tint?.name ?? none,
    mirror: mirror?.name ?? none,
    readableSummary: configurationSummary(db, selection),
    labName: result.ok ? result.selectedLab.name : "Unassigned",
    labProductCodes: result.ok
      ? result.labProductCodes
      : { product: null, coating: null, photochromic: null, material: null },
    costAtSubmission: result.ok ? result.cost : null,
    turnaroundEstimateAtSubmission: result.ok ? result.turnaround : null,
    routingExplanation: result.ok ? result.explanation : result.reason,
    configuration: { ...selection },
  };
}

export function offeringWarnings(offering: {
  active: boolean;
  cost: number | null;
  labProductCode: string | null;
}): string[] {
  const warnings: string[] = [];
  if (!offering.active) warnings.push("Preferred lab offering is inactive.");
  if (offering.cost == null) warnings.push("Missing price.");
  if (!offering.labProductCode) warnings.push("Missing lab product code.");
  return warnings;
}
