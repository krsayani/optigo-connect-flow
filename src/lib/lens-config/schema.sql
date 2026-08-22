-- LensFlow lens configuration schema (Supabase / Postgres).
-- Apply in the Cloud SQL editor if tables are not created automatically.
-- Do not drop existing tables.

-- Global reference tables use stable codes. Practice tables are organization-scoped.
-- The live demo workspace currently persists the working document in lens_config_state.

create table if not exists lens_manufacturers (
  id text primary key,
  name text not null,
  active boolean not null default true,
  organization_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vision_types (
  id text primary key,
  code text not null unique,
  name text not null,
  description text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists lens_designs (
  id text primary key,
  vision_type_id text not null references vision_types(id),
  code text not null unique,
  name text not null,
  description text not null default '',
  requires_add_power boolean not null default false,
  requires_segment_height boolean not null default false,
  requires_fitting_height boolean not null default false,
  requires_position_of_wear boolean not null default false,
  minimum_fitting_height numeric,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists lens_materials (
  id text primary key,
  code text not null unique,
  name text not null,
  refractive_index numeric not null,
  abbe_value numeric,
  specific_gravity numeric,
  impact_resistant boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists lens_products (
  id text primary key,
  organization_id text,
  manufacturer_id text not null references lens_manufacturers(id),
  vision_type_id text not null references vision_types(id),
  lens_design_id text not null references lens_designs(id),
  product_name text not null,
  product_code text,
  description text not null default '',
  active boolean not null default true,
  position_of_wear_supported boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists lens_product_materials (
  id text primary key,
  lens_product_id text not null references lens_products(id),
  lens_material_id text not null references lens_materials(id),
  active boolean not null default true,
  unique (lens_product_id, lens_material_id)
);

create table if not exists coatings (
  id text primary key,
  organization_id text,
  manufacturer_id text references lens_manufacturers(id),
  name text not null,
  code text not null,
  coating_tier text not null,
  hard_coat boolean not null default false,
  ar_level text not null,
  front_surface_ar boolean not null default false,
  back_surface_ar boolean not null default false,
  blue_light_filter_type text not null,
  uv_protection boolean not null default true,
  hydrophobic boolean not null default false,
  oleophobic boolean not null default false,
  anti_static boolean not null default false,
  anti_smudge boolean not null default false,
  dust_resistant boolean not null default false,
  anti_fog boolean not null default false,
  reflection_color text,
  warranty_months integer,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists photochromic_products (
  id text primary key,
  organization_id text,
  manufacturer_id text references lens_manufacturers(id),
  name text not null,
  code text not null,
  photochromic_type text not null,
  activates_behind_windshield boolean not null default false,
  polarized_when_activated boolean not null default false,
  permanently_polarized boolean not null default false,
  blue_light_filtering boolean not null default false,
  indoor_state_description text not null default '',
  outdoor_state_description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists photochromic_colors (
  id text primary key,
  name text not null,
  code text not null unique,
  hex_color text,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists photochromic_product_colors (
  id text primary key,
  photochromic_product_id text not null references photochromic_products(id),
  photochromic_color_id text not null references photochromic_colors(id),
  active boolean not null default true,
  unique (photochromic_product_id, photochromic_color_id)
);

create table if not exists polarization_options (
  id text primary key,
  name text not null,
  code text not null unique,
  color text not null,
  active boolean not null default true
);

create table if not exists tint_options (
  id text primary key,
  organization_id text,
  name text not null,
  code text not null,
  tint_type text not null,
  color text not null,
  default_density_percent numeric,
  transmission_percent numeric,
  therapeutic_filter boolean not null default false,
  active boolean not null default true
);

create table if not exists mirror_options (
  id text primary key,
  organization_id text,
  name text not null,
  code text not null,
  mirror_type text not null,
  color text not null,
  active boolean not null default true
);

create table if not exists practice_locations (
  id text primary key,
  organization_id text not null,
  name text not null,
  active boolean not null default true
);

create table if not exists labs (
  id text primary key,
  organization_id text not null,
  name text not null,
  account_number text,
  contact_name text,
  phone text,
  email text,
  ordering_method text not null,
  active boolean not null default true,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists lab_lens_offerings (
  id text primary key,
  organization_id text not null,
  location_id text,
  lab_id text not null references labs(id),
  lens_product_id text not null references lens_products(id),
  lens_material_id text not null references lens_materials(id),
  coating_id text references coatings(id),
  photochromic_product_id text references photochromic_products(id),
  photochromic_color_id text references photochromic_colors(id),
  polarization_option_id text references polarization_options(id),
  tint_option_id text references tint_options(id),
  mirror_option_id text references mirror_options(id),
  lab_product_name text not null,
  lab_product_code text,
  lab_coating_code text,
  lab_photochromic_code text,
  lab_material_code text,
  cost numeric check (cost is null or cost >= 0),
  retail_price numeric,
  estimated_turnaround_business_days integer check (estimated_turnaround_business_days is null or estimated_turnaround_business_days >= 0),
  rush_available boolean not null default false,
  rush_cost numeric,
  active boolean not null default true,
  effective_start_date date,
  effective_end_date date,
  warranty_months integer,
  remake_policy text,
  notes text not null default '',
  sphere_min numeric,
  sphere_max numeric,
  cylinder_min numeric,
  cylinder_max numeric,
  add_min numeric,
  add_max numeric,
  prism_horizontal_max numeric,
  prism_vertical_max numeric,
  total_prism_max numeric,
  minimum_fitting_height numeric,
  minimum_blank_size numeric,
  maximum_blank_size numeric,
  minimum_center_thickness numeric,
  maximum_decentration numeric,
  drill_mount_allowed boolean not null default true,
  groove_allowed boolean not null default true,
  rimless_allowed boolean not null default true,
  wrap_allowed boolean not null default false,
  safety_frame_allowed boolean not null default true,
  edge_polish_available boolean not null default true,
  roll_and_polish_available boolean not null default true,
  special_base_curve_required boolean not null default false,
  supported_base_curves text,
  restrictions_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text,
  check (effective_start_date is null or effective_end_date is null or effective_start_date <= effective_end_date),
  check (sphere_min is null or sphere_max is null or sphere_min <= sphere_max)
);

create table if not exists lab_routing_rules (
  id text primary key,
  organization_id text not null,
  location_id text,
  name text not null,
  vision_type_id text references vision_types(id),
  lens_design_id text references lens_designs(id),
  lens_product_id text references lens_products(id),
  lens_material_id text references lens_materials(id),
  coating_id text references coatings(id),
  photochromic_product_id text references photochromic_products(id),
  photochromic_color_id text references photochromic_colors(id),
  polarization_option_id text references polarization_options(id),
  tint_option_id text references tint_options(id),
  mirror_option_id text references mirror_options(id),
  insurance_plan_id text,
  priority integer not null check (priority >= 1),
  lab_lens_offering_id text not null references lab_lens_offerings(id),
  active boolean not null default true,
  effective_start_date date,
  effective_end_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text
);

create table if not exists optical_orders (
  id text primary key,
  organization_id text not null,
  location_id text,
  status text not null,
  vision_type_id text,
  lens_design_id text,
  lens_product_id text,
  lens_material_id text,
  coating_id text,
  photochromic_product_id text,
  photochromic_color_id text,
  polarization_option_id text,
  tint_option_id text,
  mirror_option_id text,
  lab_id text,
  lab_offering_id text,
  routing_rule_id text,
  snapshot jsonb not null,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null
);

create table if not exists lens_config_audit (
  id text primary key,
  organization_id text not null,
  user_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  previous_values jsonb,
  new_values jsonb,
  timestamp timestamptz not null default now()
);

create table if not exists lens_config_state (
  organization_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists lab_offerings_org_idx on lab_lens_offerings (organization_id, active);
create index if not exists lab_offerings_lookup_idx on lab_lens_offerings (organization_id, lens_product_id, lens_material_id, coating_id, lab_id);
create index if not exists routing_rules_org_idx on lab_routing_rules (organization_id, location_id, active, priority);
create index if not exists optical_orders_org_idx on optical_orders (organization_id, created_at desc);

alter table lens_config_state enable row level security;

drop policy if exists lens_config_state_select on lens_config_state;
drop policy if exists lens_config_state_insert on lens_config_state;
drop policy if exists lens_config_state_update on lens_config_state;

create policy lens_config_state_select on lens_config_state
  for select using (organization_id = 'org_demo');
create policy lens_config_state_insert on lens_config_state
  for insert with check (organization_id = 'org_demo');
create policy lens_config_state_update on lens_config_state
  for update using (organization_id = 'org_demo') with check (organization_id = 'org_demo');
