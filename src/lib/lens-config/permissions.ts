import type { Actor, Role } from "./types";

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export class IsolationError extends Error {
  constructor(message = "Cannot access another organization's data.") {
    super(message);
    this.name = "IsolationError";
  }
}

export function canManageCatalog(role: Role): boolean {
  return role === "administrator";
}

export function canSubmitOrders(role: Role): boolean {
  return role === "administrator" || role === "optician";
}

export function canViewCost(actor: Actor): boolean {
  return actor.canViewCost && actor.role === "administrator";
}

export function assertManage(actor: Actor): void {
  if (!canManageCatalog(actor.role)) {
    throw new PermissionError("Only administrators can manage lens and lab configuration.");
  }
}

export function assertSubmit(actor: Actor): void {
  if (!canSubmitOrders(actor.role)) {
    throw new PermissionError("This role cannot submit optical orders.");
  }
}

export function assertOrg(actor: Actor, organizationId: string): void {
  if (actor.organizationId !== organizationId) {
    throw new IsolationError();
  }
}

export function demoActor(overrides: Partial<Actor> = {}): Actor {
  return {
    userId: "user_optigo",
    organizationId: "org_demo",
    role: "administrator",
    canViewCost: true,
    ...overrides,
  };
}
