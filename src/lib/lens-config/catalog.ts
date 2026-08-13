import { createId, nowIso } from "./ids";
import {
  IsolationError,
  PermissionError,
  assertManage,
  assertOrg,
  assertSubmit,
  canViewCost,
} from "./permissions";
import type {
  Actor,
  AuditRecord,
  Coating,
  Lab,
  LabLensOffering,
  LensConfigDatabase,
  LensProduct,
  OpticalOrder,
  ResolveLabInput,
  RoutingRule,
} from "./types";
import {
  routingConflict,
  validateOffering,
  validateSelection,
  validateRxAndFrame,
} from "./validation";
import { resolveLabForLensConfiguration } from "./routing";
import { buildOrderSnapshot } from "./summary";

function audit(
  db: LensConfigDatabase,
  actor: Actor,
  action: string,
  entityType: string,
  entityId: string,
  previousValues: unknown,
  newValues: unknown,
): void {
  const record: AuditRecord = {
    id: createId("aud"),
    organizationId: actor.organizationId,
    userId: actor.userId,
    action,
    entityType,
    entityId,
    previousValues,
    newValues,
    timestamp: nowIso(),
  };
  db.auditLog.unshift(record);
}

function scoped<T extends { organizationId?: string | null }>(
  actor: Actor,
  rows: T[],
  orgField: keyof T | "organizationId" = "organizationId",
): T[] {
  return rows.filter((row) => {
    const org = row[orgField as keyof T];
    return org == null || org === actor.organizationId;
  });
}

export function listForOrg<T extends { organizationId?: string | null }>(
  actor: Actor,
  rows: T[],
): T[] {
  return scoped(actor, rows);
}

export function upsertProduct(
  db: LensConfigDatabase,
  actor: Actor,
  product: LensProduct,
  materialIds: string[],
): LensProduct {
  assertManage(actor);
  if (product.organizationId && product.organizationId !== actor.organizationId) {
    throw new IsolationError();
  }
  const prev = db.products.find((row) => row.id === product.id) ?? null;
  const next: LensProduct = { ...product, updatedAt: nowIso() };
  db.products = prev
    ? db.products.map((row) => (row.id === next.id ? next : row))
    : [...db.products, next];
  db.productMaterials = [
    ...db.productMaterials.filter((row) => row.lensProductId !== next.id),
    ...materialIds.map((lensMaterialId) => ({
      id: createId("pm"),
      lensProductId: next.id,
      lensMaterialId,
      active: true,
    })),
  ];
  audit(db, actor, prev ? "update" : "create", "lens_product", next.id, prev, next);
  return next;
}

export function deactivateProduct(db: LensConfigDatabase, actor: Actor, productId: string): void {
  assertManage(actor);
  const product = db.products.find((row) => row.id === productId);
  if (!product) throw new Error("Product not found.");
  if (product.organizationId && product.organizationId !== actor.organizationId) {
    throw new IsolationError();
  }
  const prev = { ...product };
  product.active = false;
  product.updatedAt = nowIso();
  audit(db, actor, "deactivate", "lens_product", product.id, prev, product);
}

export function duplicateProduct(
  db: LensConfigDatabase,
  actor: Actor,
  productId: string,
): LensProduct {
  assertManage(actor);
  const product = db.products.find((row) => row.id === productId);
  if (!product) throw new Error("Product not found.");
  const copy: LensProduct = {
    ...product,
    id: createId("prod"),
    organizationId: actor.organizationId,
    productName: `${product.productName} (copy)`,
    productCode: product.productCode ? `${product.productCode}-COPY` : null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    createdBy: actor.userId,
  };
  const materials = db.productMaterials
    .filter((row) => row.lensProductId === product.id && row.active)
    .map((row) => row.lensMaterialId);
  return upsertProduct(db, actor, copy, materials);
}

export function upsertCoating(db: LensConfigDatabase, actor: Actor, coating: Coating): Coating {
  assertManage(actor);
  if (coating.organizationId && coating.organizationId !== actor.organizationId) {
    throw new IsolationError();
  }
  const prev = db.coatings.find((row) => row.id === coating.id) ?? null;
  const next = { ...coating, updatedAt: nowIso() };
  db.coatings = prev
    ? db.coatings.map((row) => (row.id === next.id ? next : row))
    : [...db.coatings, next];
  audit(db, actor, prev ? "update" : "create", "coating", next.id, prev, next);
  return next;
}

export function upsertLab(db: LensConfigDatabase, actor: Actor, lab: Lab): Lab {
  assertManage(actor);
  assertOrg(actor, lab.organizationId);
  const prev = db.labs.find((row) => row.id === lab.id) ?? null;
  const next = { ...lab, updatedAt: nowIso() };
  db.labs = prev ? db.labs.map((row) => (row.id === next.id ? next : row)) : [...db.labs, next];
  audit(db, actor, prev ? "update" : "create", "lab", next.id, prev, next);
  return next;
}

export function upsertOffering(
  db: LensConfigDatabase,
  actor: Actor,
  offering: LabLensOffering,
): LabLensOffering {
  assertManage(actor);
  assertOrg(actor, offering.organizationId);
  const issues = validateOffering(offering, db);
  if (issues.length) throw new Error(issues.map((issue) => issue.message).join(" "));
  const prev = db.offerings.find((row) => row.id === offering.id) ?? null;
  const next = { ...offering, updatedAt: nowIso() };
  db.offerings = prev
    ? db.offerings.map((row) => (row.id === next.id ? next : row))
    : [...db.offerings, next];
  const action = !prev ? "create" : prev.active !== next.active ? "status_change" : "update";
  audit(db, actor, action, "lab_lens_offering", next.id, prev, next);
  return next;
}

export function duplicateOffering(
  db: LensConfigDatabase,
  actor: Actor,
  offeringId: string,
): LabLensOffering {
  const offering = db.offerings.find((row) => row.id === offeringId);
  if (!offering) throw new Error("Offering not found.");
  return upsertOffering(db, actor, {
    ...offering,
    id: createId("off"),
    labProductName: `${offering.labProductName} (copy)`,
    labProductCode: offering.labProductCode ? `${offering.labProductCode}-COPY` : null,
    createdAt: nowIso(),
    createdBy: actor.userId,
  });
}

export function bulkDeactivateOfferings(db: LensConfigDatabase, actor: Actor, ids: string[]): void {
  assertManage(actor);
  for (const id of ids) {
    const offering = db.offerings.find((row) => row.id === id);
    if (!offering) continue;
    assertOrg(actor, offering.organizationId);
    const prev = { ...offering };
    offering.active = false;
    offering.updatedAt = nowIso();
    audit(db, actor, "deactivate", "lab_lens_offering", offering.id, prev, offering);
  }
}

export function upsertRoutingRule(
  db: LensConfigDatabase,
  actor: Actor,
  rule: RoutingRule,
): RoutingRule {
  assertManage(actor);
  assertOrg(actor, rule.organizationId);
  const conflict = routingConflict(
    rule,
    db.routingRules.filter((row) => row.organizationId === actor.organizationId),
  );
  if (conflict) throw new Error(conflict);
  const prev = db.routingRules.find((row) => row.id === rule.id) ?? null;
  const next = { ...rule, updatedAt: nowIso() };
  db.routingRules = prev
    ? db.routingRules.map((row) => (row.id === next.id ? next : row))
    : [...db.routingRules, next];
  const preferredChanged = prev != null && prev.labLensOfferingId !== next.labLensOfferingId;
  audit(
    db,
    actor,
    preferredChanged ? "change_preferred_lab" : prev ? "update" : "create",
    "routing_rule",
    next.id,
    prev,
    next,
  );
  return next;
}

export function reorderRoutingPriorities(
  db: LensConfigDatabase,
  actor: Actor,
  idsInOrder: string[],
): void {
  assertManage(actor);
  idsInOrder.forEach((id, index) => {
    const rule = db.routingRules.find((row) => row.id === id);
    if (!rule) return;
    assertOrg(actor, rule.organizationId);
    const prev = { ...rule };
    rule.priority = index + 1;
    rule.updatedAt = nowIso();
    audit(db, actor, "change_priority", "routing_rule", rule.id, prev, rule);
  });
}

export function hideCost<T extends { cost?: number | null; rushCost?: number | null }>(
  actor: Actor,
  row: T,
): T {
  if (canViewCost(actor)) return row;
  return { ...row, cost: null, rushCost: null };
}

export function submitOpticalOrder(
  db: LensConfigDatabase,
  actor: Actor,
  input: ResolveLabInput,
): OpticalOrder {
  assertSubmit(actor);
  assertOrg(actor, input.organizationId);
  const selectionIssues = [
    ...validateSelection(input, db),
    ...validateRxAndFrame(input, db, input.rightEye, input.leftEye, input.frame),
  ];
  if (selectionIssues.length) {
    throw new Error(selectionIssues.map((issue) => issue.message).join(" "));
  }
  const result = resolveLabForLensConfiguration(input, db);
  const snapshot = buildOrderSnapshot(db, input, result);
  const order: OpticalOrder = {
    id: createId("ord"),
    organizationId: actor.organizationId,
    locationId: input.locationId,
    status: result.ok ? (result.routingRule ? "routed" : "manual_review") : "manual_review",
    visionTypeId: input.visionTypeId,
    lensDesignId: input.lensDesignId,
    lensProductId: input.lensProductId,
    lensMaterialId: input.lensMaterialId,
    coatingId: input.coatingId,
    photochromicProductId: input.photochromicProductId,
    photochromicColorId: input.photochromicColorId,
    polarizationOptionId: input.polarizationOptionId,
    tintOptionId: input.tintOptionId,
    mirrorOptionId: input.mirrorOptionId,
    labId: result.ok ? result.selectedLab.id : null,
    labOfferingId: result.ok ? result.selectedOffering.id : null,
    routingRuleId: result.ok ? (result.routingRule?.id ?? null) : null,
    snapshot,
    failureReason: result.ok ? null : result.reason,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    createdBy: actor.userId,
  };
  db.orders = [order, ...db.orders];
  audit(db, actor, "submit_order", "optical_order", order.id, null, order);
  return order;
}

export { PermissionError, IsolationError };
