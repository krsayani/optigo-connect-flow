import type {
  FrameInput,
  LabLensOffering,
  LensConfigDatabase,
  LensConfigurationSelection,
  RoutingRule,
  RxEye,
} from "./types";

export type ValidationIssue = { field: string; message: string };

export function validateRange(
  min: number | null,
  max: number | null,
  label: string,
): ValidationIssue[] {
  if (min != null && max != null && min > max) {
    return [{ field: label, message: `${label} minimum cannot exceed maximum.` }];
  }
  return [];
}

export function validateEffectiveDates(
  start: string | null,
  end: string | null,
): ValidationIssue[] {
  if (start && end && start > end) {
    return [
      { field: "effectiveStartDate", message: "Effective start date cannot be after end date." },
    ];
  }
  return [];
}

export function validateOffering(
  offering: LabLensOffering,
  db: LensConfigDatabase,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (offering.cost != null && offering.cost < 0)
    issues.push({ field: "cost", message: "Cost cannot be negative." });
  if (offering.rushCost != null && offering.rushCost < 0) {
    issues.push({ field: "rushCost", message: "Rush cost cannot be negative." });
  }
  if (
    offering.estimatedTurnaroundBusinessDays != null &&
    offering.estimatedTurnaroundBusinessDays < 0
  ) {
    issues.push({ field: "turnaround", message: "Turnaround cannot be negative." });
  }
  issues.push(...validateRange(offering.sphereMin, offering.sphereMax, "sphere"));
  issues.push(...validateRange(offering.cylinderMin, offering.cylinderMax, "cylinder"));
  issues.push(...validateRange(offering.addMin, offering.addMax, "add"));
  issues.push(...validateEffectiveDates(offering.effectiveStartDate, offering.effectiveEndDate));

  const link = db.productMaterials.find(
    (row) =>
      row.lensProductId === offering.lensProductId &&
      row.lensMaterialId === offering.lensMaterialId &&
      row.active,
  );
  if (!link) {
    issues.push({
      field: "lensMaterialId",
      message: "Selected material is not supported by this lens product.",
    });
  }

  if (offering.photochromicProductId && offering.photochromicColorId) {
    const colorOk = db.photochromicProductColors.some(
      (row) =>
        row.active &&
        row.photochromicProductId === offering.photochromicProductId &&
        row.photochromicColorId === offering.photochromicColorId,
    );
    if (!colorOk) {
      issues.push({
        field: "photochromicColorId",
        message: "Photochromic color is not compatible with the selected product.",
      });
    }
  }
  if (offering.photochromicProductId && !offering.photochromicColorId) {
    const hasColors = db.photochromicProductColors.some(
      (row) => row.active && row.photochromicProductId === offering.photochromicProductId,
    );
    if (hasColors) {
      issues.push({
        field: "photochromicColorId",
        message: "Photochromic color is required for this product.",
      });
    }
  }
  if (!offering.photochromicProductId && offering.photochromicColorId) {
    issues.push({
      field: "photochromicColorId",
      message: "Photochromic color is not allowed when photochromic is None.",
    });
  }
  return issues;
}

export function validateSelection(
  selection: LensConfigurationSelection,
  db: LensConfigDatabase,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const design = db.lensDesigns.find((row) => row.id === selection.lensDesignId);
  const product = db.products.find((row) => row.id === selection.lensProductId);
  if (product && !product.active) {
    issues.push({
      field: "lensProductId",
      message: "Deactivated products cannot be used for new orders.",
    });
  }
  const materialOk = db.productMaterials.some(
    (row) =>
      row.active &&
      row.lensProductId === selection.lensProductId &&
      row.lensMaterialId === selection.lensMaterialId,
  );
  if (!materialOk) {
    issues.push({
      field: "lensMaterialId",
      message: "Selected material is not supported by this lens product.",
    });
  }
  if (design?.requiresAddPower) {
    /* checked against Rx later */
  }
  if (selection.photochromicProductId) {
    const hasColors = db.photochromicProductColors.some(
      (row) => row.active && row.photochromicProductId === selection.photochromicProductId,
    );
    if (hasColors && !selection.photochromicColorId) {
      issues.push({
        field: "photochromicColorId",
        message: "Photochromic color is required when the chosen product offers colors.",
      });
    }
  } else if (selection.photochromicColorId) {
    issues.push({
      field: "photochromicColorId",
      message: "Photochromic color is not allowed when photochromic is None.",
    });
  }

  const tint = selection.tintOptionId
    ? db.tintOptions.find((row) => row.id === selection.tintOptionId)
    : undefined;
  if (tint && tint.tintType !== "NONE") {
    if (tint.tintType === "GRADIENT" || tint.tintType === "DOUBLE_GRADIENT") {
      if (selection.tintStartDensityPercent == null || selection.tintEndDensityPercent == null) {
        issues.push({
          field: "tintStartDensityPercent",
          message: "Gradient tint requires start and end density.",
        });
      }
    } else if (
      tint.therapeuticFilter ||
      tint.tintType === "SOLID" ||
      tint.tintType === "FL_41" ||
      tint.tintType === "MEDICAL_FILTER"
    ) {
      if (
        selection.tintStartDensityPercent == null &&
        selection.requestedTransmissionPercent == null
      ) {
        issues.push({
          field: "tintStartDensityPercent",
          message: "Tint density is required for this tint.",
        });
      }
    }
  }

  const photo = selection.photochromicProductId
    ? db.photochromicProducts.find((row) => row.id === selection.photochromicProductId)
    : undefined;
  const pol = selection.polarizationOptionId
    ? db.polarizationOptions.find((row) => row.id === selection.polarizationOptionId)
    : undefined;
  const polarizedFixed = pol != null && pol.code !== "NONE";
  if (
    photo &&
    (photo.permanentlyPolarized || photo.photochromicType === "PHOTOCHROMIC_POLARIZED") &&
    polarizedFixed
  ) {
    issues.push({
      field: "polarizationOptionId",
      message:
        "Fixed polarization cannot be combined with a photochromic-polarized product unless that combination is explicitly supported.",
    });
  }
  return issues;
}

export function validateRxAndFrame(
  selection: LensConfigurationSelection,
  db: LensConfigDatabase,
  rightEye: RxEye,
  leftEye: RxEye,
  frame: FrameInput,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const design = db.lensDesigns.find((row) => row.id === selection.lensDesignId);
  if (design?.requiresAddPower) {
    if (rightEye.add == null || leftEye.add == null) {
      issues.push({ field: "add", message: "Add power is required for this lens design." });
    }
  }
  if (design?.requiresSegmentHeight && frame.segmentHeight == null) {
    issues.push({
      field: "segmentHeight",
      message: "Segment height is required for lined multifocals.",
    });
  }
  if (design?.requiresFittingHeight && frame.fittingHeight == null) {
    issues.push({
      field: "fittingHeight",
      message: "Fitting height is required for this lens design.",
    });
  }
  return issues;
}

export function offeringMatchesSelection(
  offering: LabLensOffering,
  selection: LensConfigurationSelection,
): boolean {
  return (
    offering.lensProductId === selection.lensProductId &&
    offering.lensMaterialId === selection.lensMaterialId &&
    (offering.coatingId ?? null) === (selection.coatingId ?? null) &&
    (offering.photochromicProductId ?? null) === (selection.photochromicProductId ?? null) &&
    (offering.photochromicColorId ?? null) === (selection.photochromicColorId ?? null) &&
    (offering.polarizationOptionId ?? null) === (selection.polarizationOptionId ?? null) &&
    (offering.tintOptionId ?? null) === (selection.tintOptionId ?? null) &&
    (offering.mirrorOptionId ?? null) === (selection.mirrorOptionId ?? null)
  );
}

export function isDateEffective(
  start: string | null,
  end: string | null,
  orderDate: string,
): boolean {
  const day = orderDate.slice(0, 10);
  if (start && day < start) return false;
  if (end && day > end) return false;
  return true;
}

function eyeInRange(value: number, min: number | null, max: number | null): boolean {
  if (min != null && value < min) return false;
  if (max != null && value > max) return false;
  return true;
}

export function offeringCompatibilityRejection(
  offering: LabLensOffering,
  rightEye: RxEye,
  leftEye: RxEye,
  frame: FrameInput,
  rush: boolean,
  orderDate: string,
): string | null {
  if (!offering.active) return "Offering is inactive.";
  if (!isDateEffective(offering.effectiveStartDate, offering.effectiveEndDate, orderDate)) {
    return "Offering is expired or not yet effective.";
  }
  if (rush && !offering.rushAvailable) return "Rush is not available for this offering.";

  for (const eye of [rightEye, leftEye]) {
    if (!eyeInRange(eye.sphere, offering.sphereMin, offering.sphereMax)) {
      return "Prescription is outside the sphere range.";
    }
    if (!eyeInRange(eye.cylinder, offering.cylinderMin, offering.cylinderMax)) {
      return "Prescription is outside the cylinder range.";
    }
    if (eye.add != null && !eyeInRange(eye.add, offering.addMin, offering.addMax)) {
      return "Add power is outside the allowed range.";
    }
    const h = Math.abs(eye.prismHorizontal ?? 0);
    const v = Math.abs(eye.prismVertical ?? 0);
    if (offering.prismHorizontalMax != null && h > offering.prismHorizontalMax) {
      return "Horizontal prism exceeds the lab limit.";
    }
    if (offering.prismVerticalMax != null && v > offering.prismVerticalMax) {
      return "Vertical prism exceeds the lab limit.";
    }
    if (offering.totalPrismMax != null && h + v > offering.totalPrismMax) {
      return "Total prism exceeds the lab limit.";
    }
  }

  if (
    offering.minimumFittingHeight != null &&
    frame.fittingHeight != null &&
    frame.fittingHeight < offering.minimumFittingHeight
  ) {
    return "Fitting height is below the minimum for this offering.";
  }
  if (frame.type === "drill_mount" && !offering.drillMountAllowed)
    return "Drill mount is not allowed.";
  if (frame.type === "groove" && !offering.grooveAllowed) return "Groove is not allowed.";
  if (frame.type === "rimless" && !offering.rimlessAllowed) return "Rimless is not allowed.";
  if (frame.type === "wrap" && !offering.wrapAllowed) return "Wrap frames are not allowed.";
  if (frame.type === "safety" && !offering.safetyFrameAllowed)
    return "Safety frames are not allowed.";
  if (
    offering.minimumBlankSize != null &&
    frame.blankSize != null &&
    frame.blankSize < offering.minimumBlankSize
  ) {
    return "Blank size is below the minimum.";
  }
  if (
    offering.maximumBlankSize != null &&
    frame.blankSize != null &&
    frame.blankSize > offering.maximumBlankSize
  ) {
    return "Blank size exceeds the maximum.";
  }
  if (
    offering.maximumDecentration != null &&
    frame.decentration != null &&
    frame.decentration > offering.maximumDecentration
  ) {
    return "Decentration exceeds the maximum.";
  }
  return null;
}

export function routingRuleSpecificity(rule: RoutingRule): number {
  const fields: Array<string | null> = [
    rule.visionTypeId,
    rule.lensDesignId,
    rule.lensProductId,
    rule.lensMaterialId,
    rule.coatingId,
    rule.photochromicProductId,
    rule.photochromicColorId,
    rule.polarizationOptionId,
    rule.tintOptionId,
    rule.mirrorOptionId,
    rule.insurancePlanId,
  ];
  return fields.filter((value) => value != null).length;
}

export function ruleMatchesSelection(
  rule: RoutingRule,
  selection: LensConfigurationSelection,
  insurancePlanId: string | null,
): boolean {
  const pairs: Array<[string | null, string | null]> = [
    [rule.visionTypeId, selection.visionTypeId],
    [rule.lensDesignId, selection.lensDesignId],
    [rule.lensProductId, selection.lensProductId],
    [rule.lensMaterialId, selection.lensMaterialId],
    [rule.coatingId, selection.coatingId],
    [rule.photochromicProductId, selection.photochromicProductId],
    [rule.photochromicColorId, selection.photochromicColorId],
    [rule.polarizationOptionId, selection.polarizationOptionId],
    [rule.tintOptionId, selection.tintOptionId],
    [rule.mirrorOptionId, selection.mirrorOptionId],
    [rule.insurancePlanId, insurancePlanId],
  ];
  return pairs.every(([ruleValue, selected]) => ruleValue == null || ruleValue === selected);
}

export function datesOverlap(
  aStart: string | null,
  aEnd: string | null,
  bStart: string | null,
  bEnd: string | null,
): boolean {
  const a0 = aStart ?? "0000-01-01";
  const a1 = aEnd ?? "9999-12-31";
  const b0 = bStart ?? "0000-01-01";
  const b1 = bEnd ?? "9999-12-31";
  return a0 <= b1 && b0 <= a1;
}

export function routingConflict(candidate: RoutingRule, existing: RoutingRule[]): string | null {
  if (candidate.priority < 1 || !Number.isInteger(candidate.priority)) {
    return "Priority must be a positive integer.";
  }
  const dup = existing.find(
    (row) =>
      row.id !== candidate.id &&
      row.organizationId === candidate.organizationId &&
      row.locationId === candidate.locationId &&
      row.visionTypeId === candidate.visionTypeId &&
      row.lensDesignId === candidate.lensDesignId &&
      row.lensProductId === candidate.lensProductId &&
      row.lensMaterialId === candidate.lensMaterialId &&
      row.coatingId === candidate.coatingId &&
      row.photochromicProductId === candidate.photochromicProductId &&
      row.photochromicColorId === candidate.photochromicColorId &&
      row.polarizationOptionId === candidate.polarizationOptionId &&
      row.tintOptionId === candidate.tintOptionId &&
      row.mirrorOptionId === candidate.mirrorOptionId &&
      row.insurancePlanId === candidate.insurancePlanId &&
      row.priority === candidate.priority &&
      datesOverlap(
        row.effectiveStartDate,
        row.effectiveEndDate,
        candidate.effectiveStartDate,
        candidate.effectiveEndDate,
      ),
  );
  if (dup)
    return "Duplicate routing priority for the same configuration, location, and effective period.";
  return null;
}
