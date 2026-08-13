import { describe, expect, it } from "vitest";
import {
  COAT,
  COLOR,
  DEMO_ORG_ID,
  LAB,
  LD,
  LOC_MAIN,
  LOC_NORTH,
  MAT,
  MIRROR,
  OTHER_ORG_ID,
  PHOTO,
  POL,
  PROD,
  TINT,
  VT,
  applyOfferingImport,
  bulkDeactivateOfferings,
  canManageCatalog,
  databaseFromSeed,
  deactivateProduct,
  demoActor,
  exportOfferingsCsv,
  offeringMatchesSelection,
  previewOfferingImport,
  resolveLabForLensConfiguration,
  routingConflict,
  seedDemoDatabase,
  submitOpticalOrder,
  upsertOffering,
  upsertProduct,
  upsertRoutingRule,
  validateOffering,
  validateSelection,
  type FrameInput,
  type ResolveLabInput,
  type RxEye,
} from "../index";
import { isLensConfigDatabase } from "../guard";

const eye = (sphere = -1.25, extra: Partial<RxEye> = {}): RxEye => ({
  sphere,
  cylinder: -0.5,
  add: extra.add ?? null,
  prismHorizontal: extra.prismHorizontal ?? null,
  prismVertical: extra.prismVertical ?? null,
  ...extra,
});

const frame = (extra: Partial<FrameInput> = {}): FrameInput => ({
  type: "full_rim",
  a: 52,
  b: 34,
  dbl: 18,
  ed: 55,
  wrappingAngle: 0,
  fittingHeight: 18,
  segmentHeight: null,
  blankSize: 70,
  decentration: 2,
  ...extra,
});

function baseInput(overrides: Partial<ResolveLabInput> = {}): ResolveLabInput {
  return {
    organizationId: DEMO_ORG_ID,
    locationId: LOC_MAIN,
    visionTypeId: VT.sv,
    lensDesignId: LD.convSv,
    lensProductId: PROD.svClear,
    lensMaterialId: MAT.poly,
    coatingId: COAT.premiumAr,
    photochromicProductId: null,
    photochromicColorId: null,
    polarizationOptionId: POL.none,
    tintOptionId: TINT.none,
    tintStartDensityPercent: null,
    tintEndDensityPercent: null,
    requestedTransmissionPercent: null,
    customColorDescription: null,
    mirrorOptionId: MIRROR.none,
    insurancePlanId: null,
    rightEye: eye(-1),
    leftEye: eye(-1.25),
    frame: frame(),
    rush: false,
    orderDate: "2026-06-01",
    ...overrides,
  };
}

describe("organization isolation and permissions", () => {
  it("keeps org-specific labs and offerings isolated", () => {
    const a = seedDemoDatabase(DEMO_ORG_ID);
    const b = seedDemoDatabase(OTHER_ORG_ID);
    expect(a.labs.every((lab) => lab.organizationId === DEMO_ORG_ID)).toBe(true);
    expect(b.labs.every((lab) => lab.organizationId === OTHER_ORG_ID)).toBe(true);
    expect(a.offerings.some((row) => row.organizationId === OTHER_ORG_ID)).toBe(false);
  });

  it("blocks catalog management for opticians and read-only users", () => {
    expect(canManageCatalog("optician")).toBe(false);
    expect(canManageCatalog("read_only")).toBe(false);
    expect(canManageCatalog("administrator")).toBe(true);
  });

  it("rejects upserts into another organization", () => {
    const db = databaseFromSeed();
    const actor = demoActor();
    const offering = { ...db.offerings[0]!, organizationId: OTHER_ORG_ID, id: "off_stolen" };
    expect(() => upsertOffering(db, actor, offering)).toThrow(/another organization/i);
  });
});

describe("compatibility", () => {
  it("only allows materials linked to the lens product", () => {
    const db = databaseFromSeed();
    const offering = {
      ...db.offerings.find((row) => row.id === "off_sv_poly_ar_mw")!,
      lensMaterialId: MAT.glass,
    };
    const issues = validateOffering(offering, db);
    expect(issues.some((issue) => /material is not supported/i.test(issue.message))).toBe(true);
  });

  it("requires a compatible photochromic color", () => {
    const db = databaseFromSeed();
    const issues = validateSelection(
      {
        visionTypeId: VT.sv,
        lensDesignId: LD.convSv,
        lensProductId: PROD.svClear,
        lensMaterialId: MAT.poly,
        coatingId: COAT.premiumAr,
        photochromicProductId: PHOTO.genS,
        photochromicColorId: null,
        polarizationOptionId: POL.none,
        tintOptionId: TINT.none,
        tintStartDensityPercent: null,
        tintEndDensityPercent: null,
        requestedTransmissionPercent: null,
        customColorDescription: null,
        mirrorOptionId: MIRROR.none,
      },
      db,
    );
    expect(issues.some((issue) => /color is required/i.test(issue.message))).toBe(true);
  });

  it("rejects a color when photochromic is none", () => {
    const db = databaseFromSeed();
    const issues = validateSelection(
      {
        visionTypeId: VT.sv,
        lensDesignId: LD.convSv,
        lensProductId: PROD.svClear,
        lensMaterialId: MAT.poly,
        coatingId: COAT.premiumAr,
        photochromicProductId: null,
        photochromicColorId: COLOR.gray,
        polarizationOptionId: POL.none,
        tintOptionId: TINT.none,
        tintStartDensityPercent: null,
        tintEndDensityPercent: null,
        requestedTransmissionPercent: null,
        customColorDescription: null,
        mirrorOptionId: MIRROR.none,
      },
      db,
    );
    expect(
      issues.some((issue) => /not allowed when photochromic is none/i.test(issue.message)),
    ).toBe(true);
  });
});

describe("resolveLabForLensConfiguration fixtures", () => {
  it("1. routes clear SV poly premium AR to the preferred lab", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(baseInput(), db);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.selectedLab.id).toBe(LAB.midwest);
      expect(result.selectedOffering.labProductCode).toBe("MW-SV-POLY-PAR");
      expect(result.routingRule?.priority).toBe(1);
    }
  });

  it("2. routes clear progressive 1.67 ultra-premium AR", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        visionTypeId: VT.pg,
        lensDesignId: LD.ffPg,
        lensProductId: PROD.pgClear,
        lensMaterialId: MAT.hi167,
        coatingId: COAT.ultraAr,
        rightEye: eye(-2, { add: 2 }),
        leftEye: eye(-2.25, { add: 2 }),
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_pg_167_ultra_mw");
  });

  it("3. routes SV poly Transitions GEN S Gray premium AR", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        photochromicProductId: PHOTO.genS,
        photochromicColorId: COLOR.gray,
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_sv_poly_gens_mw");
  });

  it("4. routes progressive 1.67 Transitions XTRActive Brown", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        visionTypeId: VT.pg,
        lensDesignId: LD.ffPg,
        lensProductId: PROD.pgClear,
        lensMaterialId: MAT.hi167,
        photochromicProductId: PHOTO.xtractive,
        photochromicColorId: COLOR.brown,
        rightEye: eye(-1.5, { add: 1.75 }),
        leftEye: eye(-1.75, { add: 1.75 }),
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_pg_167_xtr_br_mw");
  });

  it("5. routes SV polarized gray backside AR", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        lensDesignId: LD.asphericSv,
        lensProductId: PROD.svSun,
        coatingId: COAT.backsideAr,
        polarizationOptionId: POL.gray,
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_sv_poly_pol_ss");
  });

  it("6. routes progressive polarized brown premium AR", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        visionTypeId: VT.pg,
        lensDesignId: LD.ffPg,
        lensProductId: PROD.pgSun,
        lensMaterialId: MAT.hi167,
        polarizationOptionId: POL.brown,
        rightEye: eye(-1, { add: 2 }),
        leftEye: eye(-1, { add: 2 }),
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_pg_pol_br_ss");
  });

  it("7. routes photochromic-polarized configuration", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        photochromicProductId: PHOTO.xtractivePol,
        photochromicColorId: COLOR.gray,
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_sv_xtrpol_mw");
  });

  it("8. routes FL-41 medical tint", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        coatingId: COAT.hard,
        tintOptionId: TINT.fl41,
        tintStartDensityPercent: 50,
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_sv_fl41_ss");
  });

  it("9. routes mirrored polarized sun lens", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({
        lensDesignId: LD.asphericSv,
        lensProductId: PROD.svSun,
        coatingId: COAT.backsideAr,
        polarizationOptionId: POL.gray,
        mirrorOptionId: MIRROR.blue,
      }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedOffering.id).toBe("off_sv_mirror_ss");
  });

  it("10. uses backup lab when preferred cannot handle the Rx", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({ rightEye: eye(-6), leftEye: eye(-6.25) }),
      db,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.selectedLab.id).toBe(LAB.coastal);
      expect(result.selectedOffering.id).toBe("off_sv_poly_ar_co");
      expect(result.routingRule?.priority).toBe(2);
    }
  });
});

describe("routing rules", () => {
  it("prefers location overrides over organization-wide rules", () => {
    const db = databaseFromSeed();
    const coastal = db.offerings.find((row) => row.id === "off_sv_poly_ar_co")!;
    upsertRoutingRule(db, demoActor(), {
      id: "rr_loc_override",
      organizationId: DEMO_ORG_ID,
      locationId: LOC_NORTH,
      name: "North prefers Coastal",
      visionTypeId: VT.sv,
      lensDesignId: LD.convSv,
      lensProductId: PROD.svClear,
      lensMaterialId: MAT.poly,
      coatingId: COAT.premiumAr,
      photochromicProductId: null,
      photochromicColorId: null,
      polarizationOptionId: POL.none,
      tintOptionId: TINT.none,
      mirrorOptionId: MIRROR.none,
      insurancePlanId: null,
      priority: 1,
      labLensOfferingId: coastal.id,
      active: true,
      effectiveStartDate: "2026-01-01",
      effectiveEndDate: null,
      notes: "",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdBy: "user_optigo",
    });
    const result = resolveLabForLensConfiguration(baseInput({ locationId: LOC_NORTH }), db);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.selectedLab.id).toBe(LAB.coastal);
  });

  it("rejects inactive and expired offerings", () => {
    const db = databaseFromSeed();
    const inactive = resolveLabForLensConfiguration(baseInput({ lensMaterialId: MAT.trivex }), db);
    expect(inactive.ok).toBe(false);

    const expired = resolveLabForLensConfiguration(baseInput({ lensMaterialId: MAT.cr39 }), db);
    expect(expired.ok).toBe(false);
    if (!expired.ok) expect(expired.reason).toMatch(/expired|not yet effective|no lab/i);
  });

  it("rejects prism and frame restrictions", () => {
    const db = databaseFromSeed();
    const prism = resolveLabForLensConfiguration(
      baseInput({ rightEye: eye(-1, { prismHorizontal: 8 }) }),
      db,
    );
    expect(prism.ok).toBe(false);

    const wrap = resolveLabForLensConfiguration(baseInput({ frame: frame({ type: "wrap" }) }), db);
    expect(wrap.ok).toBe(false);
  });

  it("prevents duplicate routing priorities", () => {
    const db = databaseFromSeed();
    const existing = db.routingRules.find((row) => row.id === "rr_sv_poly_ar_1")!;
    const message = routingConflict({ ...existing, id: "rr_dup" }, db.routingRules);
    expect(message).toMatch(/duplicate routing priority/i);
  });

  it("is deterministic when two compatible labs exist", () => {
    const db = databaseFromSeed();
    const a = resolveLabForLensConfiguration(baseInput(), db);
    const b = resolveLabForLensConfiguration(baseInput(), db);
    expect(a.ok && b.ok && a.ok ? a.selectedOffering.id : null).toBe(
      b.ok ? b.selectedOffering.id : "missing",
    );
  });

  it("returns a clear failure when nothing matches", () => {
    const db = databaseFromSeed();
    const result = resolveLabForLensConfiguration(
      baseInput({ lensProductId: "prod_missing", lensMaterialId: MAT.specialty }),
      db,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason.length).toBeGreaterThan(8);
  });
});

describe("orders, snapshots, and csv", () => {
  it("preserves historical snapshots after catalog edits", () => {
    const db = databaseFromSeed();
    const actor = demoActor();
    const order = submitOpticalOrder(db, actor, baseInput());
    const originalName = order.snapshot.lensProductName;
    const product = db.products.find((row) => row.id === PROD.svClear)!;
    upsertProduct(db, actor, { ...product, productName: "Renamed product" }, [MAT.poly, MAT.hi167]);
    const stored = db.orders.find((row) => row.id === order.id)!;
    expect(stored.snapshot.lensProductName).toBe(originalName);
    expect(db.products.find((row) => row.id === PROD.svClear)?.productName).toBe("Renamed product");
  });

  it("soft-deactivates products instead of deleting them", () => {
    const db = databaseFromSeed();
    deactivateProduct(db, demoActor(), PROD.svClear);
    expect(db.products.find((row) => row.id === PROD.svClear)?.active).toBe(false);
    expect(db.products.find((row) => row.id === PROD.svClear)).toBeTruthy();
  });

  it("validates CSV import and can import valid rows only", () => {
    const db = databaseFromSeed();
    const csv = exportOfferingsCsv(db, DEMO_ORG_ID);
    const preview = previewOfferingImport(db, DEMO_ORG_ID, csv);
    expect(preview.errors).toEqual([]);
    const bad = `${csv}\n,,Nope,Bad,Bad,Unknown,Unknown,None,None,None,None,None,None,Bad,BAD,abc,3`;
    const badPreview = previewOfferingImport(db, DEMO_ORG_ID, bad);
    expect(badPreview.errors.length).toBeGreaterThan(0);
    expect(() => applyOfferingImport(db, demoActor(), badPreview, false)).toThrow(/invalid/i);
    const result = applyOfferingImport(db, demoActor(), badPreview, true);
    expect(result.imported).toBe(badPreview.rows.length);
  });

  it("detects offering matches without cartesian explosion", () => {
    const db = databaseFromSeed();
    const offering = db.offerings.find((row) => row.id === "off_sv_poly_gens_mw")!;
    expect(
      offeringMatchesSelection(offering, {
        visionTypeId: VT.sv,
        lensDesignId: LD.convSv,
        lensProductId: PROD.svClear,
        lensMaterialId: MAT.poly,
        coatingId: COAT.premiumAr,
        photochromicProductId: PHOTO.genS,
        photochromicColorId: COLOR.gray,
        polarizationOptionId: POL.none,
        tintOptionId: TINT.none,
        tintStartDensityPercent: null,
        tintEndDensityPercent: null,
        requestedTransmissionPercent: null,
        customColorDescription: null,
        mirrorOptionId: MIRROR.none,
      }),
    ).toBe(true);
    expect(
      offeringMatchesSelection(offering, {
        visionTypeId: VT.sv,
        lensDesignId: LD.convSv,
        lensProductId: PROD.svClear,
        lensMaterialId: MAT.poly,
        coatingId: COAT.premiumAr,
        photochromicProductId: null,
        photochromicColorId: null,
        polarizationOptionId: POL.none,
        tintOptionId: TINT.none,
        tintStartDensityPercent: null,
        tintEndDensityPercent: null,
        requestedTransmissionPercent: null,
        customColorDescription: null,
        mirrorOptionId: MIRROR.none,
      }),
    ).toBe(false);
  });

  it("bulk deactivates offerings", () => {
    const db = databaseFromSeed();
    bulkDeactivateOfferings(db, demoActor(), ["off_sv_poly_ar_mw"]);
    expect(db.offerings.find((row) => row.id === "off_sv_poly_ar_mw")?.active).toBe(false);
  });

  it("accepts a seeded workspace document", () => {
    expect(isLensConfigDatabase(databaseFromSeed())).toBe(true);
    expect(isLensConfigDatabase({ products: [] })).toBe(false);
  });
});
