export const ROLES = ["administrator", "optician", "read_only"] as const;
export type Role = (typeof ROLES)[number];

export const ORDERING_METHODS = [
  "API",
  "EDI",
  "PORTAL",
  "EMAIL",
  "FAX",
  "MANUAL",
  "OTHER",
] as const;
export type OrderingMethod = (typeof ORDERING_METHODS)[number];

export const COATING_TIERS = [
  "UNCOATED",
  "SCRATCH_RESISTANT",
  "STANDARD_AR",
  "PREMIUM_AR",
  "ULTRA_PREMIUM_AR",
  "BLUE_FILTERING_AR",
  "MIRROR",
  "SPECIALTY",
] as const;
export type CoatingTier = (typeof COATING_TIERS)[number];

export const AR_LEVELS = ["NONE", "STANDARD", "PREMIUM", "ULTRA_PREMIUM"] as const;
export type ArLevel = (typeof AR_LEVELS)[number];

export const BLUE_LIGHT_FILTER_TYPES = [
  "NONE",
  "CLEAR_FILTER",
  "REFLECTIVE_FILTER",
  "MATERIAL_INTEGRATED",
] as const;
export type BlueLightFilterType = (typeof BLUE_LIGHT_FILTER_TYPES)[number];

export const PHOTOCHROMIC_TYPES = [
  "STANDARD",
  "EXTRA_DARK",
  "IN_CAR",
  "PHOTOCHROMIC_POLARIZED",
  "FIXED_POLARIZED_PHOTOCHROMIC",
  "BLUE_FILTERING",
  "SUN_TO_SUN",
  "GLASS_PHOTOCHROMIC",
  "HOUSE_BRAND",
  "OTHER",
] as const;
export type PhotochromicType = (typeof PHOTOCHROMIC_TYPES)[number];

export const TINT_TYPES = [
  "NONE",
  "SOLID",
  "GRADIENT",
  "DOUBLE_GRADIENT",
  "FASHION",
  "THERAPEUTIC",
  "MEDICAL_FILTER",
  "FL_41",
  "BLUE_FILTER",
  "FIXED_SUN",
  "SAMPLE_MATCHED",
  "OTHER",
] as const;
export type TintType = (typeof TINT_TYPES)[number];

export const MIRROR_TYPES = ["NONE", "SOLID", "FLASH", "GRADIENT"] as const;
export type MirrorType = (typeof MIRROR_TYPES)[number];

export const FRAME_TYPES = [
  "full_rim",
  "rimless",
  "drill_mount",
  "groove",
  "wrap",
  "safety",
] as const;
export type FrameType = (typeof FRAME_TYPES)[number];

export type Actor = {
  userId: string;
  organizationId: string;
  role: Role;
  canViewCost: boolean;
};

export type Manufacturer = {
  id: string;
  name: string;
  active: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VisionType = {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
};

export type LensDesign = {
  id: string;
  visionTypeId: string;
  code: string;
  name: string;
  description: string;
  requiresAddPower: boolean;
  requiresSegmentHeight: boolean;
  requiresFittingHeight: boolean;
  requiresPositionOfWear: boolean;
  minimumFittingHeight: number | null;
  active: boolean;
  sortOrder: number;
};

export type LensMaterial = {
  id: string;
  code: string;
  name: string;
  refractiveIndex: number;
  abbeValue: number | null;
  specificGravity: number | null;
  impactResistant: boolean;
  active: boolean;
  sortOrder: number;
};

export type LensProduct = {
  id: string;
  organizationId: string | null;
  manufacturerId: string;
  visionTypeId: string;
  lensDesignId: string;
  productName: string;
  productCode: string | null;
  description: string;
  active: boolean;
  positionOfWearSupported: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type LensProductMaterial = {
  id: string;
  lensProductId: string;
  lensMaterialId: string;
  active: boolean;
};

export type Coating = {
  id: string;
  organizationId: string | null;
  manufacturerId: string | null;
  name: string;
  code: string;
  coatingTier: CoatingTier;
  hardCoat: boolean;
  arLevel: ArLevel;
  frontSurfaceAr: boolean;
  backSurfaceAr: boolean;
  blueLightFilterType: BlueLightFilterType;
  uvProtection: boolean;
  hydrophobic: boolean;
  oleophobic: boolean;
  antiStatic: boolean;
  antiSmudge: boolean;
  dustResistant: boolean;
  antiFog: boolean;
  reflectionColor: string | null;
  warrantyMonths: number | null;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type PhotochromicProduct = {
  id: string;
  organizationId: string | null;
  manufacturerId: string | null;
  name: string;
  code: string;
  photochromicType: PhotochromicType;
  activatesBehindWindshield: boolean;
  polarizedWhenActivated: boolean;
  permanentlyPolarized: boolean;
  blueLightFiltering: boolean;
  indoorStateDescription: string;
  outdoorStateDescription: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type PhotochromicColor = {
  id: string;
  name: string;
  code: string;
  hexColor: string | null;
  active: boolean;
  sortOrder: number;
};

export type PhotochromicProductColor = {
  id: string;
  photochromicProductId: string;
  photochromicColorId: string;
  active: boolean;
};

export type PolarizationOption = {
  id: string;
  name: string;
  code: string;
  color: string;
  active: boolean;
};

export type TintOption = {
  id: string;
  organizationId: string | null;
  name: string;
  code: string;
  tintType: TintType;
  color: string;
  defaultDensityPercent: number | null;
  transmissionPercent: number | null;
  therapeuticFilter: boolean;
  active: boolean;
};

export type MirrorOption = {
  id: string;
  organizationId: string | null;
  name: string;
  code: string;
  mirrorType: MirrorType;
  color: string;
  active: boolean;
};

export type Lab = {
  id: string;
  organizationId: string;
  name: string;
  accountNumber: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  orderingMethod: OrderingMethod;
  active: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type PracticeLocation = {
  id: string;
  organizationId: string;
  name: string;
  active: boolean;
};

export type LabLensOffering = {
  id: string;
  organizationId: string;
  locationId: string | null;
  labId: string;
  lensProductId: string;
  lensMaterialId: string;
  coatingId: string | null;
  photochromicProductId: string | null;
  photochromicColorId: string | null;
  polarizationOptionId: string | null;
  tintOptionId: string | null;
  mirrorOptionId: string | null;
  labProductName: string;
  labProductCode: string | null;
  labCoatingCode: string | null;
  labPhotochromicCode: string | null;
  labMaterialCode: string | null;
  cost: number | null;
  retailPrice: number | null;
  estimatedTurnaroundBusinessDays: number | null;
  rushAvailable: boolean;
  rushCost: number | null;
  active: boolean;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  warrantyMonths: number | null;
  remakePolicy: string | null;
  notes: string;
  sphereMin: number | null;
  sphereMax: number | null;
  cylinderMin: number | null;
  cylinderMax: number | null;
  addMin: number | null;
  addMax: number | null;
  prismHorizontalMax: number | null;
  prismVerticalMax: number | null;
  totalPrismMax: number | null;
  minimumFittingHeight: number | null;
  minimumBlankSize: number | null;
  maximumBlankSize: number | null;
  minimumCenterThickness: number | null;
  maximumDecentration: number | null;
  drillMountAllowed: boolean;
  grooveAllowed: boolean;
  rimlessAllowed: boolean;
  wrapAllowed: boolean;
  safetyFrameAllowed: boolean;
  edgePolishAvailable: boolean;
  rollAndPolishAvailable: boolean;
  specialBaseCurveRequired: boolean;
  supportedBaseCurves: string | null;
  restrictionsJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type RoutingRule = {
  id: string;
  organizationId: string;
  locationId: string | null;
  name: string;
  visionTypeId: string | null;
  lensDesignId: string | null;
  lensProductId: string | null;
  lensMaterialId: string | null;
  coatingId: string | null;
  photochromicProductId: string | null;
  photochromicColorId: string | null;
  polarizationOptionId: string | null;
  tintOptionId: string | null;
  mirrorOptionId: string | null;
  insurancePlanId: string | null;
  priority: number;
  labLensOfferingId: string;
  active: boolean;
  effectiveStartDate: string | null;
  effectiveEndDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type AuditRecord = {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValues: unknown;
  newValues: unknown;
  timestamp: string;
};

export type RxEye = {
  sphere: number;
  cylinder: number;
  add: number | null;
  prismHorizontal: number | null;
  prismVertical: number | null;
};

export type FrameInput = {
  type: FrameType;
  a: number | null;
  b: number | null;
  dbl: number | null;
  ed: number | null;
  wrappingAngle: number | null;
  fittingHeight: number | null;
  segmentHeight: number | null;
  blankSize: number | null;
  decentration: number | null;
};

export type LensConfigurationSelection = {
  visionTypeId: string;
  lensDesignId: string;
  lensProductId: string;
  lensMaterialId: string;
  coatingId: string | null;
  photochromicProductId: string | null;
  photochromicColorId: string | null;
  polarizationOptionId: string | null;
  tintOptionId: string | null;
  tintStartDensityPercent: number | null;
  tintEndDensityPercent: number | null;
  requestedTransmissionPercent: number | null;
  customColorDescription: string | null;
  mirrorOptionId: string | null;
};

export type OrderSnapshot = {
  lensProductName: string;
  manufacturer: string;
  design: string;
  material: string;
  refractiveIndex: number;
  coating: string;
  photochromicProduct: string;
  photochromicColor: string;
  polarization: string;
  tint: string;
  mirror: string;
  readableSummary: string;
  labName: string;
  labProductCodes: {
    product: string | null;
    coating: string | null;
    photochromic: string | null;
    material: string | null;
  };
  costAtSubmission: number | null;
  turnaroundEstimateAtSubmission: number | null;
  routingExplanation: string;
  configuration: LensConfigurationSelection;
};

export type OpticalOrder = {
  id: string;
  organizationId: string;
  locationId: string | null;
  status: "created" | "routed" | "manual_review";
  visionTypeId: string;
  lensDesignId: string;
  lensProductId: string;
  lensMaterialId: string;
  coatingId: string | null;
  photochromicProductId: string | null;
  photochromicColorId: string | null;
  polarizationOptionId: string | null;
  tintOptionId: string | null;
  mirrorOptionId: string | null;
  labId: string | null;
  labOfferingId: string | null;
  routingRuleId: string | null;
  snapshot: OrderSnapshot;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type LensConfigDatabase = {
  manufacturers: Manufacturer[];
  visionTypes: VisionType[];
  lensDesigns: LensDesign[];
  materials: LensMaterial[];
  products: LensProduct[];
  productMaterials: LensProductMaterial[];
  coatings: Coating[];
  photochromicProducts: PhotochromicProduct[];
  photochromicColors: PhotochromicColor[];
  photochromicProductColors: PhotochromicProductColor[];
  polarizationOptions: PolarizationOption[];
  tintOptions: TintOption[];
  mirrorOptions: MirrorOption[];
  labs: Lab[];
  locations: PracticeLocation[];
  offerings: LabLensOffering[];
  routingRules: RoutingRule[];
  orders: OpticalOrder[];
  auditLog: AuditRecord[];
};

export type CompatibleOffering = {
  offering: LabLensOffering;
  lab: Lab;
  rule: RoutingRule | null;
  rejection: string | null;
};

export type ResolveLabInput = LensConfigurationSelection & {
  organizationId: string;
  locationId: string | null;
  insurancePlanId: string | null;
  rightEye: RxEye;
  leftEye: RxEye;
  frame: FrameInput;
  rush: boolean;
  orderDate: string;
};

export type ResolveLabSuccess = {
  ok: true;
  selectedLab: Lab;
  selectedOffering: LabLensOffering;
  labProductCodes: OrderSnapshot["labProductCodes"];
  routingRule: RoutingRule | null;
  alternatives: CompatibleOffering[];
  cost: number | null;
  turnaround: number | null;
  warnings: string[];
  explanation: string;
};

export type ResolveLabFailure = {
  ok: false;
  reason: string;
  warnings: string[];
  alternatives: CompatibleOffering[];
};

export type ResolveLabResult = ResolveLabSuccess | ResolveLabFailure;
