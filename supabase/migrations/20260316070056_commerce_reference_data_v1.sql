-- =========================================================
-- SEEDLINK COMMERCE REFERENCE DATA
-- aligned to current schema
-- =========================================================

-- =========================================================
-- 1) PRODUCT CATEGORIES
-- update existing rows by name, then insert missing
-- =========================================================
update public.product_categories
set
  code = 'SEED',
  sku_prefix = 'SD',
  slug = coalesce(slug, 'seed'),
  description = coalesce(description, 'Seeds and planting material'),
  is_active = true
where name = 'Seed';

update public.product_categories
set
  code = 'CROP_PROTECTION',
  sku_prefix = 'CP',
  slug = coalesce(slug, 'crop-protection'),
  description = coalesce(description, 'Herbicides, fungicides, insecticides and related products'),
  is_active = true
where name = 'Crop Protection';

update public.product_categories
set
  code = 'FERTILISER',
  sku_prefix = 'FZ',
  slug = coalesce(slug, 'fertiliser'),
  description = coalesce(description, 'Granular, liquid and specialty fertilisers'),
  is_active = true
where name = 'Fertiliser';

update public.product_categories
set
  code = 'EQUIPMENT',
  sku_prefix = 'EQ',
  slug = coalesce(slug, 'equipment'),
  description = coalesce(description, 'Agricultural tools and equipment'),
  is_active = true
where name = 'Equipment';

update public.product_categories
set
  code = 'TRAINING',
  sku_prefix = 'TR',
  slug = coalesce(slug, 'training'),
  description = coalesce(description, 'Courses, workshops and learning products'),
  is_active = true
where name = 'Training';

update public.product_categories
set
  code = 'SERVICES',
  sku_prefix = 'SV',
  slug = coalesce(slug, 'services'),
  description = coalesce(description, 'Consulting and advisory services'),
  is_active = true
where name = 'Services';

update public.product_categories
set
  code = 'LIME',
  sku_prefix = 'LM',
  slug = coalesce(slug, 'lime-soil-amendments'),
  description = coalesce(description, 'Lime, gypsum and soil amendment products'),
  is_active = true
where name = 'Lime & Soil Amendments';

update public.product_categories
set
  code = 'IRRIGATION',
  sku_prefix = 'IR',
  slug = coalesce(slug, 'irrigation'),
  description = coalesce(description, 'Irrigation and water management products'),
  is_active = true
where name = 'Irrigation';

update public.product_categories
set
  code = 'PACKAGING',
  sku_prefix = 'PK',
  slug = coalesce(slug, 'packaging'),
  description = coalesce(description, 'Packaging and consumables'),
  is_active = true
where name = 'Packaging';

update public.product_categories
set
  code = 'MARKETPLACE_COMMODITY',
  sku_prefix = 'MC',
  slug = coalesce(slug, 'marketplace-commodity'),
  description = coalesce(description, 'Marketplace commodity listings'),
  is_active = true
where name = 'Marketplace Commodity';

insert into public.product_categories (name, slug, code, sku_prefix, description, is_active, sort_order)
select *
from (
  values
    ('Seed', 'seed', 'SEED', 'SD', 'Seeds and planting material', true, 10),
    ('Crop Protection', 'crop-protection', 'CROP_PROTECTION', 'CP', 'Herbicides, fungicides, insecticides and related products', true, 20),
    ('Fertiliser', 'fertiliser', 'FERTILISER', 'FZ', 'Granular, liquid and specialty fertilisers', true, 30),
    ('Equipment', 'equipment', 'EQUIPMENT', 'EQ', 'Agricultural tools and equipment', true, 40),
    ('Training', 'training', 'TRAINING', 'TR', 'Courses, workshops and learning products', true, 50),
    ('Services', 'services', 'SERVICES', 'SV', 'Consulting and advisory services', true, 60),
    ('Lime & Soil Amendments', 'lime-soil-amendments', 'LIME', 'LM', 'Lime, gypsum and soil amendment products', true, 70),
    ('Irrigation', 'irrigation', 'IRRIGATION', 'IR', 'Irrigation and water management products', true, 80),
    ('Packaging', 'packaging', 'PACKAGING', 'PK', 'Packaging and consumables', true, 90),
    ('Marketplace Commodity', 'marketplace-commodity', 'MARKETPLACE_COMMODITY', 'MC', 'Marketplace commodity listings', true, 100)
) as v(name, slug, code, sku_prefix, description, is_active, sort_order)
where not exists (
  select 1
  from public.product_categories pc
  where pc.name = v.name
);

-- =========================================================
-- 2) PRODUCT SUBCATEGORIES
-- =========================================================
insert into public.product_subcategories
(category_id, name, slug, code, description, is_active, sort_order)
select c.id, v.name, v.slug, v.code, v.description, true, v.sort_order
from (
  values
    ('Seed', 'Maize Seed', 'maize-seed', 'MAIZE_SEED', 'Maize hybrids and varieties', 10),
    ('Seed', 'Soybean Seed', 'soybean-seed', 'SOYBEAN_SEED', 'Soybean seed products', 20),
    ('Seed', 'Sunflower Seed', 'sunflower-seed', 'SUNFLOWER_SEED', 'Sunflower seed products', 30),
    ('Seed', 'Vegetable Seed', 'vegetable-seed', 'VEGETABLE_SEED', 'Vegetable seed products', 40),
    ('Crop Protection', 'Herbicides', 'herbicides', 'HERBICIDES', 'Herbicide products', 50),
    ('Crop Protection', 'Fungicides', 'fungicides', 'FUNGICIDES', 'Fungicide products', 60),
    ('Crop Protection', 'Insecticides', 'insecticides', 'INSECTICIDES', 'Insecticide products', 70),
    ('Fertiliser', 'NPK Fertilisers', 'npk-fertilisers', 'NPK', 'Compound fertilisers', 80),
    ('Fertiliser', 'Nitrogen Fertilisers', 'nitrogen-fertilisers', 'NITROGEN', 'Nitrogen fertiliser products', 90),
    ('Fertiliser', 'Foliar Feed', 'foliar-feed', 'FOLIAR', 'Foliar nutrition products', 100),
    ('Training', 'Online Courses', 'online-courses', 'ONLINE_COURSES', 'Self-paced or online courses', 110),
    ('Training', 'Workshops', 'workshops', 'WORKSHOPS', 'In-person and field workshops', 120)
) as v(category_name, name, slug, code, description, sort_order)
join public.product_categories c
  on c.name = v.category_name
where not exists (
  select 1
  from public.product_subcategories ps
  where ps.category_id = c.id
    and ps.name = v.name
);

-- =========================================================
-- 3) PACK SIZES
-- =========================================================

-- =========================================================
-- 4) PRODUCT ATTRIBUTES
-- align to existing schema: attribute_code, data_type, is_variant_driver
-- =========================================================

-- Crop
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'CROP', 'Crop', 'Crop classification', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'CROP'
);

-- Maturity Classification
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'MATURITY_CLASSIFICATION', 'Maturity Classification', 'Seed maturity classification', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'MATURITY_CLASSIFICATION'
);

-- Seed Type
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'SEED_TYPE', 'Seed Type', 'Seed type', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'SEED_TYPE'
);

-- Seed Class
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'SEED_CLASS', 'Seed Class', 'Seed class', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'SEED_CLASS'
);

-- Treatment
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'TREATMENT', 'Treatment', 'Seed or product treatment', 'text', false, true, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'TREATMENT'
);

-- Germination %
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'GERMINATION_PERCENT', 'Germination %', 'Germination percentage', 'number', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'GERMINATION_PERCENT'
);

-- Purity %
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'PURITY_PERCENT', 'Purity %', 'Purity percentage', 'number', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'PURITY_PERCENT'
);

-- Active Ingredient
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'ACTIVE_INGREDIENT', 'Active Ingredient', 'Active ingredient', 'text', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'ACTIVE_INGREDIENT'
);

-- Concentration
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'CONCENTRATION', 'Concentration', 'Product concentration', 'text', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'CONCENTRATION'
);

-- Course Delivery Mode
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'COURSE_DELIVERY_MODE', 'Course Delivery Mode', 'Training delivery mode', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'COURSE_DELIVERY_MODE'
);

-- Course Level
insert into public.product_attributes
(attribute_code, name, description, data_type, is_required, is_variant_driver, is_active)
select 'COURSE_LEVEL', 'Course Level', 'Training course level', 'select', false, false, true
where not exists (
  select 1 from public.product_attributes where attribute_code = 'COURSE_LEVEL'
);

-- Attach some attributes to Seed category where applicable
update public.product_attributes
set applies_to_category_id = pc.id
from public.product_categories pc
where pc.name = 'Seed'
  and public.product_attributes.attribute_code in (
    'CROP',
    'MATURITY_CLASSIFICATION',
    'SEED_TYPE',
    'SEED_CLASS',
    'TREATMENT',
    'GERMINATION_PERCENT',
    'PURITY_PERCENT'
  )
  and public.product_attributes.applies_to_category_id is null;

-- =========================================================
-- 5) ATTRIBUTE OPTIONS
-- =========================================================

-- Maturity Classification options
insert into public.product_attribute_options (attribute_id, option_value, display_label, sort_order)
select pa.id, v.option_value, v.display_label, v.sort_order
from public.product_attributes pa
cross join (
  values
    ('ULTRA_EARLY', 'Ultra Early', 10),
    ('EARLY', 'Early', 20),
    ('MEDIUM', 'Medium', 30),
    ('LATE', 'Late', 40)
) as v(option_value, display_label, sort_order)
where pa.attribute_code = 'MATURITY_CLASSIFICATION'
  and not exists (
    select 1
    from public.product_attribute_options o
    where o.attribute_id = pa.id
      and o.option_value = v.option_value
  );

-- Course Delivery Mode options
insert into public.product_attribute_options (attribute_id, option_value, display_label, sort_order)
select pa.id, v.option_value, v.display_label, v.sort_order
from public.product_attributes pa
cross join (
  values
    ('ONLINE_SELF_PACED', 'Online Self-Paced', 10),
    ('LIVE_ONLINE', 'Live Online', 20),
    ('IN_PERSON', 'In-Person', 30),
    ('HYBRID', 'Hybrid', 40),
    ('WORKSHOP', 'Workshop', 50),
    ('MASTERCLASS', 'Masterclass', 60),
    ('CERTIFICATION_PROGRAMME', 'Certification Programme', 70)
) as v(option_value, display_label, sort_order)
where pa.attribute_code = 'COURSE_DELIVERY_MODE'
  and not exists (
    select 1
    from public.product_attribute_options o
    where o.attribute_id = pa.id
      and o.option_value = v.option_value
  );

-- Course Level options
insert into public.product_attribute_options (attribute_id, option_value, display_label, sort_order)
select pa.id, v.option_value, v.display_label, v.sort_order
from public.product_attributes pa
cross join (
  values
    ('BEGINNER', 'Beginner', 10),
    ('INTERMEDIATE', 'Intermediate', 20),
    ('ADVANCED', 'Advanced', 30),
    ('PROFESSIONAL', 'Professional', 40),
    ('EXECUTIVE', 'Executive', 50)
) as v(option_value, display_label, sort_order)
where pa.attribute_code = 'COURSE_LEVEL'
  and not exists (
    select 1
    from public.product_attribute_options o
    where o.attribute_id = pa.id
      and o.option_value = v.option_value
  );

-- =========================================================
-- 6) COURSE CLASSIFICATIONS
-- =========================================================
insert into public.course_classifications (name, classification_type, code)
values
('Online Self-Paced', 'delivery_mode', 'ONLINE_SELF_PACED'),
('Live Online', 'delivery_mode', 'LIVE_ONLINE'),
('In-Person', 'delivery_mode', 'IN_PERSON'),
('Hybrid', 'delivery_mode', 'HYBRID'),
('Workshop', 'delivery_mode', 'WORKSHOP'),
('Masterclass', 'delivery_mode', 'MASTERCLASS'),
('Certification Programme', 'delivery_mode', 'CERTIFICATION_PROGRAMME'),
('Beginner', 'course_level', 'BEGINNER'),
('Intermediate', 'course_level', 'INTERMEDIATE'),
('Advanced', 'course_level', 'ADVANCED'),
('Professional', 'course_level', 'PROFESSIONAL'),
('Executive', 'course_level', 'EXECUTIVE')
on conflict (classification_type, name) do nothing;

-- =========================================================
-- 7) MARKETPLACE COMMODITIES
-- align to existing fields: commodity_code, category, unit_of_measure
-- =========================================================
update public.marketplace_commodities
set
  category = coalesce(category, 'grain'),
  description = coalesce(description, 'White maize commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-WMZ';

update public.marketplace_commodities
set
  category = coalesce(category, 'grain'),
  description = coalesce(description, 'Yellow maize commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-YMZ';

update public.marketplace_commodities
set
  category = coalesce(category, 'oilseed'),
  description = coalesce(description, 'Soybean commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-SOY';

update public.marketplace_commodities
set
  category = coalesce(category, 'oilseed'),
  description = coalesce(description, 'Sunflower commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-SFN';

update public.marketplace_commodities
set
  category = coalesce(category, 'grain'),
  description = coalesce(description, 'Sorghum commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-SRG';

update public.marketplace_commodities
set
  category = coalesce(category, 'grain'),
  description = coalesce(description, 'Wheat commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-WHT';

update public.marketplace_commodities
set
  category = coalesce(category, 'other'),
  description = coalesce(description, 'Dry bean commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-DRYBEAN';

update public.marketplace_commodities
set
  category = coalesce(category, 'oilseed'),
  description = coalesce(description, 'Groundnut commodity'),
  unit_of_measure = coalesce(unit_of_measure, 'ton'),
  is_active = true
where commodity_code = 'MC-GN';

insert into public.marketplace_commodities
(commodity_code, name, category, description, unit_of_measure, is_active, metadata)
select *
from (
  values
    ('MC-WMZ', 'White Maize', 'grain', 'White maize commodity', 'ton', true, '{}'::jsonb),
    ('MC-YMZ', 'Yellow Maize', 'grain', 'Yellow maize commodity', 'ton', true, '{}'::jsonb),
    ('MC-SOY', 'Soybeans', 'oilseed', 'Soybean commodity', 'ton', true, '{}'::jsonb),
    ('MC-SFN', 'Sunflower', 'oilseed', 'Sunflower commodity', 'ton', true, '{}'::jsonb),
    ('MC-SRG', 'Sorghum', 'grain', 'Sorghum commodity', 'ton', true, '{}'::jsonb),
    ('MC-WHT', 'Wheat', 'grain', 'Wheat commodity', 'ton', true, '{}'::jsonb),
    ('MC-DRYBEAN', 'Dry Beans', 'other', 'Dry bean commodity', 'ton', true, '{}'::jsonb),
    ('MC-GN', 'Groundnuts', 'oilseed', 'Groundnut commodity', 'ton', true, '{}'::jsonb)
) as v(commodity_code, name, category, description, unit_of_measure, is_active, metadata)
where not exists (
  select 1
  from public.marketplace_commodities mc
  where mc.commodity_code = v.commodity_code
);

-- =========================================================
-- 8) MARKETPLACE COMMODITY GRADES
-- =========================================================
insert into public.marketplace_commodity_grades (commodity_id, name, code, description)
select
  mc.id,
  v.name,
  mc.commodity_code || '-' || v.code_suffix as code,
  v.description
from public.marketplace_commodities mc
cross join (
  values
    ('Food Grade', 'FOOD', 'Food-grade commodity'),
    ('Feed Grade', 'FEED', 'Feed-grade commodity'),
    ('Seed Grade', 'SEED', 'Seed-grade commodity'),
    ('Export Grade', 'EXPORT', 'Export-grade commodity'),
    ('Milling Grade', 'MILLING', 'Milling-grade commodity')
) as v(name, code_suffix, description)
where mc.commodity_code in ('MC-WMZ', 'MC-YMZ', 'MC-SOY', 'MC-SFN', 'MC-SRG', 'MC-WHT', 'MC-DRYBEAN', 'MC-GN')
  and not exists (
    select 1
    from public.marketplace_commodity_grades g
    where g.commodity_id = mc.id
      and g.name = v.name
  );

