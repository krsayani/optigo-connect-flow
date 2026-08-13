export function createId(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export const SEED_TS = "2026-01-01T00:00:00.000Z";

export const DEMO_ORG_ID = "org_demo";
export const OTHER_ORG_ID = "org_other";
export const DEMO_USER_ID = "user_optigo";
export const LOC_MAIN = "loc_main";
export const LOC_NORTH = "loc_north";

export const MFR = {
  essilor: "mfr_ESSILOR",
  hoya: "mfr_HOYA",
  zeiss: "mfr_ZEISS",
  shamir: "mfr_SHAMIR",
  iot: "mfr_IOT",
  younger: "mfr_YOUNGER",
  kodak: "mfr_KODAK",
  seiko: "mfr_SEIKO",
  house: "mfr_HOUSE",
  other: "mfr_OTHER",
  transitions: "mfr_TRANSITIONS",
} as const;

export const VT = {
  sv: "vt_SINGLE_VISION",
  dsv: "vt_DIGITAL_SINGLE_VISION",
  af: "vt_ANTI_FATIGUE",
  bf: "vt_BIFOCAL",
  bbf: "vt_BLENDED_BIFOCAL",
  tf: "vt_TRIFOCAL",
  pg: "vt_PROGRESSIVE",
  occ: "vt_OCCUPATIONAL",
  computer: "vt_COMPUTER",
  myopia: "vt_MYOPIA_CONTROL",
  spec: "vt_SPECIALTY",
} as const;

export const LD = {
  convSv: "ld_CONVENTIONAL_SV",
  asphericSv: "ld_ASPHERIC_SV",
  digitalSv: "ld_DIGITAL_SV",
  personalSv: "ld_PERSONALIZED_DSV",
  lowBoost: "ld_LOW_BOOST",
  medBoost: "ld_MED_BOOST",
  highBoost: "ld_HIGH_BOOST",
  ft28: "ld_FT28",
  ft35: "ld_FT35",
  ft45: "ld_FT45",
  execBf: "ld_EXEC_BF",
  roundSeg: "ld_ROUND_SEG",
  blendedRound: "ld_BLENDED_ROUND",
  ft7x28: "ld_FT_7X28",
  ft8x35: "ld_FT_8X35",
  execTf: "ld_EXEC_TF",
  stdPg: "ld_STD_PG",
  ffPg: "ld_FF_PG",
  personalPg: "ld_PERSONAL_PG",
  shortPg: "ld_SHORT_PG",
  softPg: "ld_SOFT_PG",
  hardPg: "ld_HARD_PG",
  distPg: "ld_DIST_PG",
  nearPg: "ld_NEAR_PG",
  wrapPg: "ld_WRAP_PG",
  officePg: "ld_OFFICE_PG",
  computerPg: "ld_COMPUTER_PG",
  enhancedNear: "ld_ENHANCED_NEAR",
  doubleD: "ld_DOUBLE_D",
  occBf: "ld_OCC_BF",
  defocus: "ld_DEFOCUS_MC",
  lenslet: "ld_LENSLET_MC",
  otherMc: "ld_OTHER_MC",
  doubleSeg: "ld_DOUBLE_SEG",
  franklin: "ld_FRANKLIN",
  lenticular: "ld_LENTICULAR",
  slabOff: "ld_SLAB_OFF",
  reverseSlab: "ld_REV_SLAB",
  safety: "ld_SAFETY",
  sports: "ld_SPORTS",
} as const;

export const MAT = {
  glass: "mat_CROWN_GLASS",
  hiGlass: "mat_HI_GLASS",
  cr39: "mat_CR39",
  trivex: "mat_TRIVEX",
  mid156: "mat_156",
  poly: "mat_POLY",
  hi160: "mat_160",
  hi167: "mat_167",
  hi170: "mat_170",
  uhi174: "mat_174",
  uhi176: "mat_176",
  specialty: "mat_SPECIALTY",
} as const;

export const COAT = {
  uncoated: "coat_UNCOATED",
  hard: "coat_HARD",
  standardAr: "coat_STD_AR",
  premiumAr: "coat_PREMIUM_AR",
  ultraAr: "coat_ULTRA_AR",
  blueAr: "coat_BLUE_AR",
  backsideAr: "coat_BACK_AR",
  antiFog: "coat_ANTI_FOG",
  specialty: "coat_SPECIALTY",
} as const;

export const PHOTO = {
  genS: "photo_TRANSITIONS_GEN_S",
  xtractive: "photo_TRANSITIONS_XTRACTIVE",
  xtractivePol: "photo_TRANSITIONS_XTRACTIVE_POL",
  drivewear: "photo_TRANSITIONS_DRIVEWEAR",
  style: "photo_TRANSITIONS_STYLE",
  sensity: "photo_SENSITY",
  sensityDark: "photo_SENSITY_DARK",
  sensityFast: "photo_SENSITY_FAST",
  photofusion: "photo_PHOTOFUSION_X",
  colormatic: "photo_COLORMATIC",
  liferx: "photo_LIFERX",
  house: "photo_HOUSE",
  other: "photo_OTHER",
} as const;

export const COLOR = {
  gray: "pcol_GRAY",
  brown: "pcol_BROWN",
  graphiteGreen: "pcol_GRAPHITE_GREEN",
  emerald: "pcol_EMERALD",
  sapphire: "pcol_SAPPHIRE",
  amethyst: "pcol_AMETHYST",
  amber: "pcol_AMBER",
  ruby: "pcol_RUBY",
  grayGreen: "pcol_GRAY_GREEN",
  copper: "pcol_COPPER",
  blue: "pcol_BLUE",
  violet: "pcol_VIOLET",
  rose: "pcol_ROSE",
  other: "pcol_OTHER",
} as const;

export const POL = {
  none: "pol_NONE",
  gray: "pol_GRAY",
  brown: "pol_BROWN",
  green: "pol_GREEN",
  copper: "pol_COPPER",
  blue: "pol_BLUE",
  rose: "pol_ROSE",
  yellow: "pol_YELLOW",
  other: "pol_OTHER",
} as const;

export const TINT = {
  none: "tint_NONE",
  fl41: "tint_FL41",
  solidGray: "tint_SOLID_GRAY",
} as const;

export const MIRROR = {
  none: "mirror_NONE",
  silver: "mirror_SILVER",
  gold: "mirror_GOLD",
  blue: "mirror_BLUE",
  green: "mirror_GREEN",
  red: "mirror_RED",
  orange: "mirror_ORANGE",
  rose: "mirror_ROSE",
  purple: "mirror_PURPLE",
  black: "mirror_BLACK",
  custom: "mirror_CUSTOM",
} as const;

export const LAB = {
  midwest: "lab_midwest",
  coastal: "lab_coastal",
  specialty: "lab_specialty",
} as const;

export const PROD = {
  svClear: "prod_sv_clear",
  pgClear: "prod_pg_clear",
  svSun: "prod_sv_sun",
  pgSun: "prod_pg_sun",
} as const;
