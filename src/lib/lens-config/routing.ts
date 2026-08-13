import type {
  CompatibleOffering,
  LabLensOffering,
  LensConfigDatabase,
  LensConfigurationSelection,
  ResolveLabInput,
  ResolveLabResult,
  RoutingRule,
} from "./types";
import {
  offeringCompatibilityRejection,
  offeringMatchesSelection,
  routingRuleSpecificity,
  ruleMatchesSelection,
  isDateEffective,
} from "./validation";

/**
 * Most-specific rule:
 * 1. Location-specific rules always outrank organization-wide rules.
 * 2. Among the same location scope, a rule with more populated configuration
 *    dimensions outranks a more general (wildcard) rule.
 * 3. Ties break by lower numeric priority, then by rule id.
 */
export function compareRules(a: RoutingRule, b: RoutingRule): number {
  const aLoc = a.locationId ? 1 : 0;
  const bLoc = b.locationId ? 1 : 0;
  if (aLoc !== bLoc) return bLoc - aLoc;
  const spec = routingRuleSpecificity(b) - routingRuleSpecificity(a);
  if (spec !== 0) return spec;
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.id.localeCompare(b.id);
}

export function matchingOfferings(
  db: LensConfigDatabase,
  organizationId: string,
  selection: {
    lensProductId?: string | null | undefined;
    lensMaterialId?: string | null | undefined;
    coatingId?: string | null | undefined;
    photochromicProductId?: string | null | undefined;
    photochromicColorId?: string | null | undefined;
    polarizationOptionId?: string | null | undefined;
    tintOptionId?: string | null | undefined;
    mirrorOptionId?: string | null | undefined;
  },
  locationId: string | null = null,
): LabLensOffering[] {
  return db.offerings.filter((offering) => {
    if (offering.organizationId !== organizationId) return false;
    if (offering.locationId && locationId && offering.locationId !== locationId) return false;
    if (selection.lensProductId && offering.lensProductId !== selection.lensProductId) return false;
    if (selection.lensMaterialId && offering.lensMaterialId !== selection.lensMaterialId)
      return false;
    if (
      selection.coatingId !== undefined &&
      selection.coatingId !== null &&
      offering.coatingId !== selection.coatingId
    ) {
      return false;
    }
    if (
      selection.photochromicProductId !== undefined &&
      selection.photochromicProductId !== null &&
      offering.photochromicProductId !== selection.photochromicProductId
    ) {
      return false;
    }
    if (
      selection.photochromicColorId !== undefined &&
      selection.photochromicColorId !== null &&
      offering.photochromicColorId !== selection.photochromicColorId
    ) {
      return false;
    }
    if (
      selection.polarizationOptionId !== undefined &&
      selection.polarizationOptionId !== null &&
      offering.polarizationOptionId !== selection.polarizationOptionId
    ) {
      return false;
    }
    if (
      selection.tintOptionId !== undefined &&
      selection.tintOptionId !== null &&
      offering.tintOptionId !== selection.tintOptionId
    ) {
      return false;
    }
    if (
      selection.mirrorOptionId !== undefined &&
      selection.mirrorOptionId !== null &&
      offering.mirrorOptionId !== selection.mirrorOptionId
    ) {
      return false;
    }
    return true;
  });
}

export function resolveLabForLensConfiguration(
  input: ResolveLabInput,
  db: LensConfigDatabase,
): ResolveLabResult {
  const warnings: string[] = [];
  const selection: LensConfigurationSelection = {
    visionTypeId: input.visionTypeId,
    lensDesignId: input.lensDesignId,
    lensProductId: input.lensProductId,
    lensMaterialId: input.lensMaterialId,
    coatingId: input.coatingId,
    photochromicProductId: input.photochromicProductId,
    photochromicColorId: input.photochromicColorId,
    polarizationOptionId: input.polarizationOptionId,
    tintOptionId: input.tintOptionId,
    tintStartDensityPercent: input.tintStartDensityPercent,
    tintEndDensityPercent: input.tintEndDensityPercent,
    requestedTransmissionPercent: input.requestedTransmissionPercent,
    customColorDescription: input.customColorDescription,
    mirrorOptionId: input.mirrorOptionId,
  };

  const orgRules = db.routingRules.filter(
    (rule) =>
      rule.organizationId === input.organizationId &&
      rule.active &&
      isDateEffective(rule.effectiveStartDate, rule.effectiveEndDate, input.orderDate) &&
      ruleMatchesSelection(rule, selection, input.insurancePlanId),
  );

  const locationRules = orgRules.filter(
    (rule) => rule.locationId === input.locationId && input.locationId,
  );
  const scoped =
    locationRules.length > 0 ? locationRules : orgRules.filter((rule) => rule.locationId == null);

  if (locationRules.length > 0 && orgRules.some((rule) => rule.locationId == null)) {
    warnings.push("Location-specific routing overrides organization-wide rules.");
  }

  const ranked = [...scoped].sort(compareRules);
  const topSpecificity = ranked[0] ? routingRuleSpecificity(ranked[0]) : 0;
  const topIsLocation = ranked[0]?.locationId != null;
  const group = ranked.filter(
    (rule) =>
      routingRuleSpecificity(rule) === topSpecificity &&
      (rule.locationId != null) === topIsLocation,
  );

  const evaluated: CompatibleOffering[] = [];
  const seen = new Set<string>();

  for (const rule of group.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))) {
    const offering = db.offerings.find((row) => row.id === rule.labLensOfferingId);
    const lab = offering ? db.labs.find((row) => row.id === offering.labId) : undefined;
    if (!offering || !lab) {
      warnings.push(`Routing rule ${rule.name} points to a missing offering.`);
      continue;
    }
    if (seen.has(offering.id)) continue;
    seen.add(offering.id);
    if (!offeringMatchesSelection(offering, selection)) {
      warnings.push(
        `Routing rule ${rule.name} offering does not match the selected configuration.`,
      );
      continue;
    }
    const rejection = offeringCompatibilityRejection(
      offering,
      input.rightEye,
      input.leftEye,
      input.frame,
      input.rush,
      input.orderDate,
    );
    if (!offering.active) warnings.push("Preferred lab offering is inactive.");
    if (offering.cost == null)
      warnings.push(`Offering ${offering.labProductName} is missing a price.`);
    if (!offering.labProductCode)
      warnings.push(`Offering ${offering.labProductName} is missing a lab product code.`);
    evaluated.push({ offering, lab, rule, rejection });
  }

  const direct = db.offerings.filter(
    (offering) =>
      offering.organizationId === input.organizationId &&
      offeringMatchesSelection(offering, selection) &&
      (!offering.locationId || offering.locationId === input.locationId),
  );
  for (const offering of direct) {
    if (seen.has(offering.id)) continue;
    const lab = db.labs.find((row) => row.id === offering.labId);
    if (!lab || !lab.active) continue;
    const rejection = offeringCompatibilityRejection(
      offering,
      input.rightEye,
      input.leftEye,
      input.frame,
      input.rush,
      input.orderDate,
    );
    evaluated.push({ offering, lab, rule: null, rejection });
  }

  if (evaluated.length === 0) {
    return {
      ok: false,
      reason: "No lab supports this configuration.",
      warnings: [...warnings, "No lab supports the configuration."],
      alternatives: [],
    };
  }

  const compatible = evaluated.filter((row) => row.rejection == null && row.lab.active);
  const winner = compatible[0];
  if (!winner) {
    return {
      ok: false,
      reason:
        evaluated[0]?.rejection ?? "No compatible lab exists for this prescription and frame.",
      warnings,
      alternatives: evaluated,
    };
  }

  const alternatives = compatible.slice(1);
  const explanation = winner.rule
    ? `Matched ${winner.rule.locationId ? "location-specific" : "organization-wide"} rule "${winner.rule.name}" (specificity ${routingRuleSpecificity(winner.rule)}, priority ${winner.rule.priority}) and selected ${winner.lab.name}.`
    : `No routing rule matched; selected the first compatible offering at ${winner.lab.name}. This order should be reviewed before automatic submission.`;

  if (!winner.rule) {
    warnings.push("No routing rule matched; automatic submission requires manual review.");
  }

  return {
    ok: true,
    selectedLab: winner.lab,
    selectedOffering: winner.offering,
    labProductCodes: {
      product: winner.offering.labProductCode,
      coating: winner.offering.labCoatingCode,
      photochromic: winner.offering.labPhotochromicCode,
      material: winner.offering.labMaterialCode,
    },
    routingRule: winner.rule,
    alternatives,
    cost: winner.offering.cost,
    turnaround: winner.offering.estimatedTurnaroundBusinessDays,
    warnings,
    explanation,
  };
}
