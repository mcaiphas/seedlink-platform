begin;

-- ============================================================================
-- Seedlink initial notification templates
-- Compatible with current hybrid notification_templates schema
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Order acceptance email
-- Event: order.acceptance_requested
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'order_acceptance_email_v1', 'email',
  'Your Seedlink order is ready for review', 'Order review required',
  'Hello {{customer_name}}, your order {{order_number}} is ready for review. Total: {{currency_code}} {{total_amount}}. Complete checkout here: {{checkout_url}}',
  true, null, null,
  'Order Acceptance Email', 'transactional',
  '["customer_name","order_number","currency_code","total_amount","checkout_url"]'::jsonb,
  'active', null, null,
  'order_acceptance_email_v1', 'order.acceptance_requested', 'en',
  'Your Seedlink order is ready for review',
  'Hello {{customer_name}}, your order {{order_number}} is ready for review. Total: {{currency_code}} {{total_amount}}. Complete checkout here: {{checkout_url}}'
where not exists (
  select 1 from public.notification_templates where code = 'order_acceptance_email_v1'
     or template_key = 'order_acceptance_email_v1'
);

-- ----------------------------------------------------------------------------
-- 2) Customer order confirmation email
-- Event: order.created_by_customer
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'order_created_customer_email_v1', 'email',
  'We received your Seedlink order', 'Order received',
  'Hello {{customer_name}}, we received your order {{order_number}}. Total: {{currency_code}} {{total_amount}}. We will keep you updated.',
  true, null, null,
  'Customer Order Confirmation Email', 'transactional',
  '["customer_name","order_number","currency_code","total_amount"]'::jsonb,
  'active', null, null,
  'order_created_customer_email_v1', 'order.created_by_customer', 'en',
  'We received your Seedlink order',
  'Hello {{customer_name}}, we received your order {{order_number}}. Total: {{currency_code}} {{total_amount}}. We will keep you updated.'
where not exists (
  select 1 from public.notification_templates where code = 'order_created_customer_email_v1'
     or template_key = 'order_created_customer_email_v1'
);

-- ----------------------------------------------------------------------------
-- 3) Payment received email
-- Event: order.payment_received
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'payment_received_email_v1', 'email',
  'Payment received for your Seedlink order', 'Payment received',
  'Hello {{customer_name}}, payment has been received for order {{order_number}}. Amount paid: {{currency_code}} {{total_amount}}.',
  true, null, null,
  'Payment Received Email', 'transactional',
  '["customer_name","order_number","currency_code","total_amount"]'::jsonb,
  'active', null, null,
  'payment_received_email_v1', 'order.payment_received', 'en',
  'Payment received for your Seedlink order',
  'Hello {{customer_name}}, payment has been received for order {{order_number}}. Amount paid: {{currency_code}} {{total_amount}}.'
where not exists (
  select 1 from public.notification_templates where code = 'payment_received_email_v1'
     or template_key = 'payment_received_email_v1'
);

-- ----------------------------------------------------------------------------
-- 4) Order cancelled email
-- Event: order.cancelled
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'order_cancelled_email_v1', 'email',
  'Update on your Seedlink order', 'Order cancelled',
  'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you need assistance.',
  true, null, null,
  'Order Cancelled Email', 'transactional',
  '["customer_name","order_number"]'::jsonb,
  'active', null, null,
  'order_cancelled_email_v1', 'order.cancelled', 'en',
  'Update on your Seedlink order',
  'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you need assistance.'
where not exists (
  select 1 from public.notification_templates where code = 'order_cancelled_email_v1'
     or template_key = 'order_cancelled_email_v1'
);

-- ----------------------------------------------------------------------------
-- 5) Internal in-app notification: order created
-- Event: internal.order.created
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code
)
select
  'order_created_internal_in_app_v1', 'in_app',
  'New order created', 'A new order {{order_number}} has been created.',
  true, null, null,
  'Internal Order Created In-App', 'in_app',
  '["order_number"]'::jsonb,
  'active', null, null,
  'order_created_internal_in_app_v1', 'internal.order.created', 'en'
where not exists (
  select 1 from public.notification_templates where code = 'order_created_internal_in_app_v1'
     or template_key = 'order_created_internal_in_app_v1'
);

-- ----------------------------------------------------------------------------
-- 6) Customer in-app notification: order acceptance requested
-- Event: order.acceptance_requested
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code
)
select
  'order_acceptance_in_app_v1', 'in_app',
  'Order waiting for acceptance', 'Order {{order_number}} is waiting for your acceptance.',
  true, null, null,
  'Order Acceptance In-App', 'in_app',
  '["order_number"]'::jsonb,
  'active', null, null,
  'order_acceptance_in_app_v1', 'order.acceptance_requested', 'en'
where not exists (
  select 1 from public.notification_templates where code = 'order_acceptance_in_app_v1'
     or template_key = 'order_acceptance_in_app_v1'
);

-- ----------------------------------------------------------------------------
-- 7) Customer in-app notification: payment received
-- Event: order.payment_received
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code
)
select
  'payment_received_in_app_v1', 'in_app',
  'Payment received', 'Payment received for order {{order_number}}.',
  true, null, null,
  'Payment Received In-App', 'in_app',
  '["order_number"]'::jsonb,
  'active', null, null,
  'payment_received_in_app_v1', 'order.payment_received', 'en'
where not exists (
  select 1 from public.notification_templates where code = 'payment_received_in_app_v1'
     or template_key = 'payment_received_in_app_v1'
);

-- ----------------------------------------------------------------------------
-- 8) Customer order created email
-- Event: order.created_by_customer
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'order_created_customer_in_app_v1', 'in_app',
  'Order received', 'Order received',
  'Hello {{customer_name}}, your order {{order_number}} is created and pending review.',
  true, null, null,
  'Customer Order Created In-App', 'in_app',
  '["customer_name","order_number"]'::jsonb,
  'active', null, null,
  'order_created_customer_in_app_v1', 'order.created_by_customer', 'en',
  'Order received', 'Hello {{customer_name}}, your order {{order_number}} is created and pending review.'
where not exists (
  select 1 from public.notification_templates where code = 'order_created_customer_in_app_v1'
     or template_key = 'order_created_customer_in_app_v1'
);

-- ----------------------------------------------------------------------------
-- 9) Payment received email (customer)
-- Event: order.payment_received
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'payment_received_email_v1', 'email',
  'Payment received for your Seedlink order', 'Payment received',
  'Hello {{customer_name}}, payment has been received for order {{order_number}}. Amount paid: {{currency_code}} {{total_amount}}.',
  true, null, null,
  'Payment Received Email', 'transactional',
  '["customer_name","order_number","currency_code","total_amount"]'::jsonb,
  'active', null, null,
  'payment_received_email_v1', 'order.payment_received', 'en',
  'Payment received for your Seedlink order', 'Hello {{customer_name}}, payment has been received for order {{order_number}}. Amount paid: {{currency_code}} {{total_amount}}.'
where not exists (
  select 1 from public.notification_templates where code = 'payment_received_email_v1'
     or template_key = 'payment_received_email_v1'
);

-- ----------------------------------------------------------------------------
-- 10) Payment success in-app
-- Event: order.payment_received
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code
)
select
  'payment_received_in_app_v2', 'in_app',
  'Payment received', 'Payment has been received for order {{order_number}}.',
  true, null, null,
  'Payment Received In-App V2', 'in_app',
  '["order_number"]'::jsonb,
  'active', null, null,
  'payment_received_in_app_v2', 'order.payment_received', 'en'
where not exists (
  select 1 from public.notification_templates where code = 'payment_received_in_app_v2'
     or template_key = 'payment_received_in_app_v2'
);

-- ----------------------------------------------------------------------------
-- 11) Delivery update email
-- Event: delivery.status_update
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, subject, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'delivery_status_email_v1', 'email',
  'Delivery status update', 'Delivery status update',
  'Hello {{customer_name}}, the delivery status of your order {{order_number}} has been updated.',
  true, null, null,
  'Delivery Status Email', 'transactional',
  '["customer_name","order_number"]'::jsonb,
  'active', null, null,
  'delivery_status_email_v1', 'delivery.status_update', 'en',
  'Delivery status update',
  'Hello {{customer_name}}, the delivery status of your order {{order_number}} has been updated.'
where not exists (
  select 1 from public.notification_templates where code = 'delivery_status_email_v1'
     or template_key = 'delivery_status_email_v1'
);

-- ----------------------------------------------------------------------------
-- 12) Customer in-app order acceptance notification
-- Event: order.acceptance_requested
-- ----------------------------------------------------------------------------
insert into public.notification_templates (
  code, channel, title, body, is_active,
  created_by, tenant_id, name, type, variables_json, status,
  updated_by, company_id, template_key, event_type, language_code,
  subject_template, body_template
)
select
  'order_acceptance_in_app_v2', 'in_app',
  'Order pending acceptance', 'Order {{order_number}} is pending acceptance.',
  true, null, null,
  'Order Acceptance In-App V2', 'in_app',
  '["order_number"]'::jsonb,
  'active', null, null,
  'order_acceptance_in_app_v2', 'order.acceptance_requested', 'en',
  'Order pending acceptance', 'Order {{order_number}} is pending acceptance.'
where not exists (
  select 1 from public.notification_templates where code = 'order_acceptance_in_app_v2'
     or template_key = 'order_acceptance_in_app_v2'
);

commit;
