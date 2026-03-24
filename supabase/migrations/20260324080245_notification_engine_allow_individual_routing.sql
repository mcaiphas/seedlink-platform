alter table public.notification_events
drop constraint if exists notification_events_company_id_not_nil;

alter table public.notification_events
alter column company_id drop not null;

alter table public.notification_logs
alter column company_id drop not null;

alter table public.user_notifications
alter column company_id drop not null;
