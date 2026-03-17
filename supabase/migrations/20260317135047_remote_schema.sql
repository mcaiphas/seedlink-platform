drop extension if exists "pg_net";

create sequence "public"."advisory_session_seq";

create sequence "public"."agro_rec_number_seq";

create sequence "public"."ccn_number_seq";

create sequence "public"."ci_number_seq";

create sequence "public"."gr_number_seq";

create sequence "public"."je_number_seq";

create sequence "public"."logistics_delivery_seq";

create sequence "public"."po_number_seq";

create sequence "public"."refund_number_seq";

create sequence "public"."sa_number_seq";

create sequence "public"."scn_number_seq";

create sequence "public"."si_number_seq";

create sequence "public"."sp_number_seq";

create sequence "public"."stock_count_seq";

create sequence "public"."support_ticket_seq";

drop trigger if exists "trg_addresses_updated_at" on "public"."addresses";

drop trigger if exists "trg_advisor_conversations_updated_at" on "public"."advisor_conversations";

drop trigger if exists "trg_advisor_escalation_rules_updated_at" on "public"."advisor_escalation_rules";

drop trigger if exists "trg_advisor_execution_runs_updated_at" on "public"."advisor_execution_runs";

drop trigger if exists "trg_advisor_guardrails_updated_at" on "public"."advisor_guardrails";

drop trigger if exists "trg_advisor_profile_model_configs_updated_at" on "public"."advisor_profile_model_configs";

drop trigger if exists "trg_advisor_profiles_updated_at" on "public"."advisor_profiles";

drop trigger if exists "trg_advisor_prompt_templates_updated_at" on "public"."advisor_prompt_templates";

drop trigger if exists "trg_advisor_tools_updated_at" on "public"."advisor_tools";

drop trigger if exists "trg_agronomy_tool_runs_updated_at" on "public"."agronomy_tool_runs";

drop trigger if exists "trg_agronomy_tool_templates_updated_at" on "public"."agronomy_tool_templates";

drop trigger if exists "trg_agronomy_tools_updated_at" on "public"."agronomy_tools";

drop trigger if exists "trg_ai_models_updated_at" on "public"."ai_models";

drop trigger if exists "trg_ai_providers_updated_at" on "public"."ai_providers";

drop trigger if exists "trg_cart_items_updated_at" on "public"."cart_items";

drop trigger if exists "trg_carts_updated_at" on "public"."carts";

drop trigger if exists "trg_coupon_codes_updated_at" on "public"."coupon_codes";

drop trigger if exists "trg_course_categories_updated_at" on "public"."course_categories";

drop trigger if exists "trg_course_modules_updated_at" on "public"."course_modules";

drop trigger if exists "trg_courses_updated_at" on "public"."courses";

drop trigger if exists "trg_crop_calendar_plans_updated_at" on "public"."crop_calendar_plans";

drop trigger if exists "trg_crop_recommendations_updated_at" on "public"."crop_recommendations";

drop trigger if exists "trg_customer_credit_accounts_updated_at" on "public"."customer_credit_accounts";

drop trigger if exists "trg_apply_credit_ledger_effect" on "public"."customer_credit_ledger";

drop trigger if exists "trg_customer_invoices_updated_at" on "public"."customer_invoices";

drop trigger if exists "trg_post_customer_invoice_cogs_journal" on "public"."customer_invoices";

drop trigger if exists "trg_post_customer_invoice_journal" on "public"."customer_invoices";

drop trigger if exists "trg_delivery_requests_updated_at" on "public"."delivery_requests";

drop trigger if exists "trg_depot_zones_updated_at" on "public"."depot_zones";

drop trigger if exists "trg_depots_updated_at" on "public"."depots";

drop trigger if exists "trg_enrollments_updated_at" on "public"."enrollments";

drop trigger if exists "trg_farm_activities_updated_at" on "public"."farm_activities";

drop trigger if exists "trg_fertiliser_recommendations_updated_at" on "public"."fertiliser_recommendations";

drop trigger if exists "trg_fields_updated_at" on "public"."fields";

drop trigger if exists "trg_fulfillment_batches_updated_at" on "public"."fulfillment_batches";

drop trigger if exists "trg_goods_receipts_updated_at" on "public"."goods_receipts";

drop trigger if exists "trg_post_goods_receipt_journal" on "public"."goods_receipts";

drop trigger if exists "trg_harvest_records_updated_at" on "public"."harvest_records";

drop trigger if exists "trg_inventory_batches_updated_at" on "public"."inventory_batches";

drop trigger if exists "trg_irrigation_plans_updated_at" on "public"."irrigation_plans";

drop trigger if exists "trg_journal_entries_updated_at" on "public"."journal_entries";

drop trigger if exists "trg_knowledge_documents_updated_at" on "public"."knowledge_documents";

drop trigger if exists "trg_knowledge_ingestion_jobs_updated_at" on "public"."knowledge_ingestion_jobs";

drop trigger if exists "trg_knowledge_sources_updated_at" on "public"."knowledge_sources";

drop trigger if exists "trg_lessons_updated_at" on "public"."lessons";

drop trigger if exists "trg_lime_recommendations_updated_at" on "public"."lime_recommendations";

drop trigger if exists "trg_marketplace_buyer_requests_updated_at" on "public"."marketplace_buyer_requests";

drop trigger if exists "trg_marketplace_commodities_updated_at" on "public"."marketplace_commodities";

drop trigger if exists "trg_marketplace_disputes_updated_at" on "public"."marketplace_disputes";

drop trigger if exists "trg_marketplace_listings_updated_at" on "public"."marketplace_listings";

drop trigger if exists "trg_marketplace_offers_updated_at" on "public"."marketplace_offers";

drop trigger if exists "trg_marketplace_payouts_updated_at" on "public"."marketplace_payouts";

drop trigger if exists "trg_marketplace_settlements_updated_at" on "public"."marketplace_settlements";

drop trigger if exists "trg_marketplace_trades_updated_at" on "public"."marketplace_trades";

drop trigger if exists "trg_notification_preferences_updated_at" on "public"."notification_preferences";

drop trigger if exists "trg_notification_templates_updated_at" on "public"."notification_templates";

drop trigger if exists "trg_auto_generate_invoice_from_order" on "public"."orders";

drop trigger if exists "trg_orders_updated_at" on "public"."orders";

drop trigger if exists "trg_organization_members_updated_at" on "public"."organization_members";

drop trigger if exists "trg_organizations_updated_at" on "public"."organizations";

drop trigger if exists "trg_payment_gateways_updated_at" on "public"."payment_gateways";

drop trigger if exists "trg_payment_transactions_updated_at" on "public"."payment_transactions";

drop trigger if exists "trg_auto_generate_invoice_from_payment" on "public"."payments";

drop trigger if exists "trg_payments_updated_at" on "public"."payments";

drop trigger if exists "trg_permissions_updated_at" on "public"."permissions";

drop trigger if exists "trg_pick_tasks_updated_at" on "public"."pick_tasks";

drop trigger if exists "trg_pick_waves_updated_at" on "public"."pick_waves";

drop trigger if exists "trg_planting_records_updated_at" on "public"."planting_records";

drop trigger if exists "trg_product_attributes_updated_at" on "public"."product_attributes";

drop trigger if exists "trg_product_categories_updated_at" on "public"."product_categories";

drop trigger if exists "trg_product_collections_updated_at" on "public"."product_collections";

drop trigger if exists "trg_product_pack_sizes_updated_at" on "public"."product_pack_sizes";

drop trigger if exists "trg_product_subcategories_updated_at" on "public"."product_subcategories";

drop trigger if exists "trg_product_variants_updated_at" on "public"."product_variants";

drop trigger if exists "trg_products_updated_at" on "public"."products";

drop trigger if exists "trg_profiles_updated_at" on "public"."profiles";

drop trigger if exists "trg_purchase_order_items_updated_at" on "public"."purchase_order_items";

drop trigger if exists "trg_purchase_orders_updated_at" on "public"."purchase_orders";

drop trigger if exists "trg_roles_updated_at" on "public"."roles";

drop trigger if exists "trg_seed_product_details_updated_at" on "public"."seed_product_details";

drop trigger if exists "trg_soil_tests_updated_at" on "public"."soil_tests";

drop trigger if exists "trg_spray_programs_updated_at" on "public"."spray_programs";

drop trigger if exists "trg_stock_adjustments_updated_at" on "public"."stock_adjustments";

drop trigger if exists "trg_stock_transfers_updated_at" on "public"."stock_transfers";

drop trigger if exists "trg_storage_bins_updated_at" on "public"."storage_bins";

drop trigger if exists "trg_subscription_plans_updated_at" on "public"."subscription_plans";

drop trigger if exists "trg_subscriptions_updated_at" on "public"."subscriptions";

drop trigger if exists "trg_post_supplier_invoice_journal" on "public"."supplier_invoices";

drop trigger if exists "trg_supplier_invoices_updated_at" on "public"."supplier_invoices";

drop trigger if exists "trg_suppliers_updated_at" on "public"."suppliers";

drop trigger if exists "trg_system_settings_updated_at" on "public"."system_settings";

drop trigger if exists "trg_user_role_assignments_updated_at" on "public"."user_role_assignments";

drop trigger if exists "trg_wallets_updated_at" on "public"."wallets";

drop trigger if exists "trg_website_crawl_targets_updated_at" on "public"."website_crawl_targets";

drop trigger if exists "trg_yield_estimator_runs_updated_at" on "public"."yield_estimator_runs";

drop policy "product_pack_sizes_admin_or_supplier_manage" on "public"."product_pack_sizes";

drop policy "product_pack_sizes_read_authenticated" on "public"."product_pack_sizes";

drop policy "product_subcategories_admin_manage" on "public"."product_subcategories";

drop policy "product_subcategories_public_read" on "public"."product_subcategories";

drop policy "product_variant_attribute_values_admin_or_supplier_manage" on "public"."product_variant_attribute_values";

drop policy "product_variants_admin_or_supplier_manage" on "public"."product_variants";

drop policy "product_variants_read_authenticated" on "public"."product_variants";

drop policy "addresses_manage_own_or_admin" on "public"."addresses";

drop policy "addresses_select_own_or_admin" on "public"."addresses";

drop policy "advisor_conversations_insert_own_or_admin" on "public"."advisor_conversations";

drop policy "advisor_conversations_select_own_or_admin" on "public"."advisor_conversations";

drop policy "advisor_conversations_update_own_or_admin" on "public"."advisor_conversations";

drop policy "advisor_escalation_rules_admin_manage" on "public"."advisor_escalation_rules";

drop policy "advisor_escalation_rules_admin_or_trainer_read" on "public"."advisor_escalation_rules";

drop policy "advisor_execution_runs_insert_own_or_admin" on "public"."advisor_execution_runs";

drop policy "advisor_execution_runs_select_own_or_admin" on "public"."advisor_execution_runs";

drop policy "advisor_execution_runs_update_admin_only" on "public"."advisor_execution_runs";

drop policy "advisor_feedback_select_own_or_admin" on "public"."advisor_feedback";

drop policy "advisor_feedback_update_own_or_admin" on "public"."advisor_feedback";

drop policy "advisor_guardrails_admin_manage" on "public"."advisor_guardrails";

drop policy "advisor_guardrails_admin_or_trainer_read" on "public"."advisor_guardrails";

drop policy "advisor_message_sources_manage_admin_only" on "public"."advisor_message_sources";

drop policy "advisor_message_sources_select_own_message_or_admin" on "public"."advisor_message_sources";

drop policy "advisor_messages_insert_own_conversation_or_admin" on "public"."advisor_messages";

drop policy "advisor_messages_select_own_conversation_or_admin" on "public"."advisor_messages";

drop policy "advisor_profile_guardrails_admin_manage" on "public"."advisor_profile_guardrails";

drop policy "advisor_profile_guardrails_admin_or_trainer_read" on "public"."advisor_profile_guardrails";

drop policy "advisor_profile_model_configs_admin_manage" on "public"."advisor_profile_model_configs";

drop policy "advisor_profile_model_configs_admin_read" on "public"."advisor_profile_model_configs";

drop policy "advisor_profile_tools_manage_admin" on "public"."advisor_profile_tools";

drop policy "advisor_profiles_manage_admin" on "public"."advisor_profiles";

drop policy "advisor_profiles_read_authenticated" on "public"."advisor_profiles";

drop policy "advisor_prompt_templates_admin_only_manage" on "public"."advisor_prompt_templates";

drop policy "advisor_prompt_templates_admin_or_trainer_read" on "public"."advisor_prompt_templates";

drop policy "advisor_query_logs_manage_admin_only" on "public"."advisor_query_logs";

drop policy "advisor_query_logs_select_own_or_admin" on "public"."advisor_query_logs";

drop policy "advisor_retrieval_logs_manage_admin_only" on "public"."advisor_retrieval_logs";

drop policy "advisor_retrieval_logs_select_own_or_admin" on "public"."advisor_retrieval_logs";

drop policy "advisor_retrieval_results_manage_admin_only" on "public"."advisor_retrieval_results";

drop policy "advisor_retrieval_results_select_own_or_admin" on "public"."advisor_retrieval_results";

drop policy "advisor_run_events_manage_admin_only" on "public"."advisor_run_events";

drop policy "advisor_run_events_select_own_or_admin" on "public"."advisor_run_events";

drop policy "advisor_source_rules_admin_manage" on "public"."advisor_source_rules";

drop policy "advisor_source_rules_admin_or_trainer_read" on "public"."advisor_source_rules";

drop policy "advisor_tools_manage_admin" on "public"."advisor_tools";

drop policy "advisor_tools_read_authenticated" on "public"."advisor_tools";

drop policy "advisor_usage_records_manage_admin_only" on "public"."advisor_usage_records";

drop policy "advisor_usage_records_select_own_or_admin" on "public"."advisor_usage_records";

drop policy "advisor_web_search_logs_manage_admin_only" on "public"."advisor_web_search_logs";

drop policy "advisor_web_search_logs_select_own_or_admin" on "public"."advisor_web_search_logs";

drop policy "advisor_web_search_results_manage_admin_only" on "public"."advisor_web_search_results";

drop policy "advisor_web_search_results_select_own_or_admin" on "public"."advisor_web_search_results";

drop policy "agronomy_tool_runs_insert_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_runs_select_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_runs_update_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_templates_manage_admin_or_trainer" on "public"."agronomy_tool_templates";

drop policy "agronomy_tool_templates_read_by_access_level" on "public"."agronomy_tool_templates";

drop policy "agronomy_tools_manage_admin_or_trainer" on "public"."agronomy_tools";

drop policy "agronomy_tools_read_authenticated" on "public"."agronomy_tools";

drop policy "ai_models_admin_only" on "public"."ai_models";

drop policy "ai_providers_admin_only" on "public"."ai_providers";

drop policy "audit_logs_admin_only" on "public"."audit_logs";

drop policy "cart_items_manage_own_or_admin" on "public"."cart_items";

drop policy "cart_items_select_own_or_admin" on "public"."cart_items";

drop policy "carts_manage_own_or_admin" on "public"."carts";

drop policy "carts_select_own_or_admin" on "public"."carts";

drop policy "coupon_codes_admin_only" on "public"."coupon_codes";

drop policy "coupon_codes_admin_only_read" on "public"."coupon_codes";

drop policy "course_categories_admin_or_trainer_manage" on "public"."course_categories";

drop policy "course_modules_manage_admin_or_trainer" on "public"."course_modules";

drop policy "course_modules_read_if_enrolled_or_admin_or_trainer" on "public"."course_modules";

drop policy "courses_manage_admin_or_trainer" on "public"."courses";

drop policy "crop_calendar_events_manage_via_plan_owner" on "public"."crop_calendar_events";

drop policy "crop_calendar_events_select_via_plan_owner" on "public"."crop_calendar_events";

drop policy "crop_calendar_plans_manage_own_or_admin" on "public"."crop_calendar_plans";

drop policy "crop_calendar_plans_select_own_or_admin" on "public"."crop_calendar_plans";

drop policy "crop_recommendations_manage_admin_or_trainer" on "public"."crop_recommendations";

drop policy "crop_recommendations_select_owner_or_admin" on "public"."crop_recommendations";

drop policy "crops_manage_farm_owner_or_admin" on "public"."crops";

drop policy "crops_select_farm_owner_or_admin" on "public"."crops";

drop policy "customer_invoice_items_admin_manage" on "public"."customer_invoice_items";

drop policy "customer_invoice_items_select_owner_or_admin" on "public"."customer_invoice_items";

drop policy "customer_invoices_admin_manage" on "public"."customer_invoices";

drop policy "customer_invoices_select_owner_or_admin" on "public"."customer_invoices";

drop policy "delivery_requests_insert_owner_or_admin" on "public"."delivery_requests";

drop policy "delivery_requests_select_owner_or_admin" on "public"."delivery_requests";

drop policy "delivery_requests_update_admin_or_logistics" on "public"."delivery_requests";

drop policy "delivery_status_logs_manage_admin_or_logistics" on "public"."delivery_status_logs";

drop policy "delivery_status_logs_select_owner_admin_logistics" on "public"."delivery_status_logs";

drop policy "depot_zones_admin_only" on "public"."depot_zones";

drop policy "depots_admin_only" on "public"."depots";

drop policy "enrollments_insert_own_or_admin" on "public"."enrollments";

drop policy "enrollments_select_own_or_admin" on "public"."enrollments";

drop policy "enrollments_update_own_or_admin" on "public"."enrollments";

drop policy "farm_activities_manage_owner_or_admin" on "public"."farm_activities";

drop policy "farm_activities_select_owner_or_admin" on "public"."farm_activities";

drop policy "farms_manage_team_owner_or_admin" on "public"."farms";

drop policy "farms_select_team_owner_or_admin" on "public"."farms";

drop policy "fertiliser_plan_items_manage_via_recommendation_owner" on "public"."fertiliser_plan_items";

drop policy "fertiliser_plan_items_select_via_recommendation_owner" on "public"."fertiliser_plan_items";

drop policy "fertiliser_recommendations_manage_own_or_admin" on "public"."fertiliser_recommendations";

drop policy "fertiliser_recommendations_select_own_or_admin" on "public"."fertiliser_recommendations";

drop policy "fields_manage_farm_owner_or_admin" on "public"."fields";

drop policy "fields_select_farm_owner_or_admin" on "public"."fields";

drop policy "fulfillment_batches_admin_only" on "public"."fulfillment_batches";

drop policy "goods_receipt_items_admin_only" on "public"."goods_receipt_items";

drop policy "goods_receipts_admin_only" on "public"."goods_receipts";

drop policy "inventory_batches_admin_only" on "public"."inventory_batches";

drop policy "irrigation_plan_events_manage_via_plan_owner" on "public"."irrigation_plan_events";

drop policy "irrigation_plan_events_select_via_plan_owner" on "public"."irrigation_plan_events";

drop policy "irrigation_plans_manage_own_or_admin" on "public"."irrigation_plans";

drop policy "irrigation_plans_select_own_or_admin" on "public"."irrigation_plans";

drop policy "knowledge_document_chunks_manage_admin_or_trainer" on "public"."knowledge_document_chunks";

drop policy "knowledge_document_chunks_read_via_document_access" on "public"."knowledge_document_chunks";

drop policy "knowledge_documents_manage_admin_or_trainer" on "public"."knowledge_documents";

drop policy "knowledge_documents_read_by_access_level" on "public"."knowledge_documents";

drop policy "knowledge_ingestion_jobs_admin_or_trainer_manage" on "public"."knowledge_ingestion_jobs";

drop policy "knowledge_sources_manage_admin_or_trainer" on "public"."knowledge_sources";

drop policy "knowledge_sources_read_authenticated_or_admin" on "public"."knowledge_sources";

drop policy "lesson_resources_manage_admin_or_trainer" on "public"."lesson_resources";

drop policy "lesson_resources_read_if_enrolled_or_admin_or_trainer" on "public"."lesson_resources";

drop policy "lessons_manage_admin_or_trainer" on "public"."lessons";

drop policy "lessons_read_if_enrolled_or_admin_or_trainer" on "public"."lessons";

drop policy "lime_recommendations_manage_own_or_admin" on "public"."lime_recommendations";

drop policy "lime_recommendations_select_own_or_admin" on "public"."lime_recommendations";

drop policy "marketplace_buyer_requests_manage_owner_or_admin" on "public"."marketplace_buyer_requests";

drop policy "marketplace_buyer_requests_read_owner_or_published_or_admin" on "public"."marketplace_buyer_requests";

drop policy "marketplace_commodities_admin_manage" on "public"."marketplace_commodities";

drop policy "marketplace_commodities_read_authenticated" on "public"."marketplace_commodities";

drop policy "marketplace_disputes_manage_related_parties_or_admin" on "public"."marketplace_disputes";

drop policy "marketplace_disputes_read_related_parties_or_admin" on "public"."marketplace_disputes";

drop policy "marketplace_listing_documents_manage_owner_or_admin" on "public"."marketplace_listing_documents";

drop policy "marketplace_listing_documents_read_owner_or_admin" on "public"."marketplace_listing_documents";

drop policy "marketplace_listing_images_manage_owner_or_admin" on "public"."marketplace_listing_images";

drop policy "marketplace_listing_images_read_via_listing" on "public"."marketplace_listing_images";

drop policy "marketplace_listing_lots_manage_owner_or_admin" on "public"."marketplace_listing_lots";

drop policy "marketplace_listing_lots_read_via_listing" on "public"."marketplace_listing_lots";

drop policy "marketplace_listing_statuses_admin_manage" on "public"."marketplace_listing_statuses";

drop policy "marketplace_listings_manage_owner_or_admin" on "public"."marketplace_listings";

drop policy "marketplace_listings_read_by_visibility" on "public"."marketplace_listings";

drop policy "marketplace_matches_admin_manage" on "public"."marketplace_matches";

drop policy "marketplace_matches_read_related_parties_or_admin" on "public"."marketplace_matches";

drop policy "marketplace_offer_messages_manage_related_parties_or_admin" on "public"."marketplace_offer_messages";

drop policy "marketplace_offer_messages_read_related_parties_or_admin" on "public"."marketplace_offer_messages";

drop policy "marketplace_offers_manage_related_parties_or_admin" on "public"."marketplace_offers";

drop policy "marketplace_offers_read_related_parties_or_admin" on "public"."marketplace_offers";

drop policy "marketplace_payouts_manage_admin_only" on "public"."marketplace_payouts";

drop policy "marketplace_payouts_read_related_seller_or_admin" on "public"."marketplace_payouts";

drop policy "marketplace_price_observations_admin_manage" on "public"."marketplace_price_observations";

drop policy "marketplace_quality_attributes_manage_owner_or_admin" on "public"."marketplace_quality_attributes";

drop policy "marketplace_quality_attributes_read_via_listing" on "public"."marketplace_quality_attributes";

drop policy "marketplace_settlements_manage_admin_only" on "public"."marketplace_settlements";

drop policy "marketplace_settlements_read_related_parties_or_admin" on "public"."marketplace_settlements";

drop policy "marketplace_trades_manage_admin_only" on "public"."marketplace_trades";

drop policy "marketplace_trades_read_related_parties_or_admin" on "public"."marketplace_trades";

drop policy "notification_preferences_manage_own_or_admin" on "public"."notification_preferences";

drop policy "notification_preferences_select_own_or_admin" on "public"."notification_preferences";

drop policy "notification_templates_admin_only" on "public"."notification_templates";

drop policy "notifications_manage_admin_only" on "public"."notifications";

drop policy "notifications_select_own_or_admin" on "public"."notifications";

drop policy "order_items_manage_admin_only" on "public"."order_items";

drop policy "order_items_select_order_owner_or_admin" on "public"."order_items";

drop policy "orders_insert_own_or_admin" on "public"."orders";

drop policy "orders_select_own_or_admin" on "public"."orders";

drop policy "orders_update_admin_only" on "public"."orders";

drop policy "organization_members_manage_admin" on "public"."organization_members";

drop policy "organization_members_select_member_or_admin" on "public"."organization_members";

drop policy "organizations_manage_admin" on "public"."organizations";

drop policy "organizations_select_member_or_admin" on "public"."organizations";

drop policy "payment_gateways_admin_only" on "public"."payment_gateways";

drop policy "payment_transactions_manage_admin_only" on "public"."payment_transactions";

drop policy "payment_transactions_select_own_or_admin" on "public"."payment_transactions";

drop policy "permissions_manage_admin" on "public"."permissions";

drop policy "permissions_select_admin" on "public"."permissions";

drop policy "pick_tasks_admin_only" on "public"."pick_tasks";

drop policy "pick_waves_admin_only" on "public"."pick_waves";

drop policy "product_attribute_assignments_admin_or_supplier_manage" on "public"."product_attribute_assignments";

drop policy "product_attribute_options_admin_manage" on "public"."product_attribute_options";

drop policy "product_attribute_options_admin_or_trainer_read" on "public"."product_attribute_options";

drop policy "product_attributes_admin_manage" on "public"."product_attributes";

drop policy "product_attributes_admin_or_trainer_read" on "public"."product_attributes";

drop policy "product_categories_manage_admin" on "public"."product_categories";

drop policy "product_collections_manage_admin" on "public"."product_collections";

drop policy "products_manage_admin_or_supplier" on "public"."products";

drop policy "profiles_insert_self_or_admin" on "public"."profiles";

drop policy "profiles_select_own_or_admin" on "public"."profiles";

drop policy "profiles_update_own_or_admin" on "public"."profiles";

drop policy "purchase_order_items_admin_only" on "public"."purchase_order_items";

drop policy "purchase_orders_admin_only" on "public"."purchase_orders";

drop policy "role_permissions_manage_admin" on "public"."role_permissions";

drop policy "role_permissions_select_admin" on "public"."role_permissions";

drop policy "shipment_package_items_admin_only" on "public"."shipment_package_items";

drop policy "shipment_packages_admin_only" on "public"."shipment_packages";

drop policy "soil_tests_manage_field_or_farm_owner_or_admin" on "public"."soil_tests";

drop policy "soil_tests_select_field_or_farm_owner_or_admin" on "public"."soil_tests";

drop policy "spray_program_items_manage_via_program_owner" on "public"."spray_program_items";

drop policy "spray_program_items_select_via_program_owner" on "public"."spray_program_items";

drop policy "spray_programs_manage_own_or_admin" on "public"."spray_programs";

drop policy "spray_programs_select_own_or_admin" on "public"."spray_programs";

drop policy "stock_movements_admin_only" on "public"."stock_movements";

drop policy "stock_transfer_items_admin_only" on "public"."stock_transfer_items";

drop policy "stock_transfers_admin_only" on "public"."stock_transfers";

drop policy "storage_bins_admin_only" on "public"."storage_bins";

drop policy "subscription_plans_manage_admin" on "public"."subscription_plans";

drop policy "subscriptions_manage_admin" on "public"."subscriptions";

drop policy "subscriptions_select_own_or_admin" on "public"."subscriptions";

drop policy "supplier_invoice_items_admin_only" on "public"."supplier_invoice_items";

drop policy "supplier_invoices_admin_only" on "public"."supplier_invoices";

drop policy "suppliers_admin_only" on "public"."suppliers";

drop policy "system_settings_admin_only" on "public"."system_settings";

drop policy "teams_manage_owner_or_admin" on "public"."teams";

drop policy "teams_select_owner_or_admin" on "public"."teams";

drop policy "user_permission_overrides_manage_admin" on "public"."user_permission_overrides";

drop policy "user_permission_overrides_select_admin" on "public"."user_permission_overrides";

drop policy "user_role_assignments_manage_admin" on "public"."user_role_assignments";

drop policy "user_role_assignments_select_self_or_admin" on "public"."user_role_assignments";

drop policy "wallet_transactions_manage_admin_only" on "public"."wallet_transactions";

drop policy "wallet_transactions_select_wallet_owner_or_admin" on "public"."wallet_transactions";

drop policy "wallets_manage_admin_only" on "public"."wallets";

drop policy "wallets_select_owner_or_admin" on "public"."wallets";

drop policy "website_crawl_pages_admin_manage" on "public"."website_crawl_pages";

drop policy "website_crawl_pages_admin_or_trainer_read" on "public"."website_crawl_pages";

drop policy "website_crawl_targets_admin_or_trainer_manage" on "public"."website_crawl_targets";

drop policy "yield_estimator_runs_manage_own_or_admin" on "public"."yield_estimator_runs";

drop policy "yield_estimator_runs_select_own_or_admin" on "public"."yield_estimator_runs";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_variant_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_variant_id_fkey";

alter table "public"."inventory_batches" drop constraint "inventory_batches_variant_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_variant_id_fkey";

alter table "public"."product_pack_sizes" drop constraint "product_pack_sizes_product_id_fkey";

alter table "public"."product_pack_sizes" drop constraint "product_pack_sizes_product_id_pack_code_key";

alter table "public"."product_subcategories" drop constraint "product_subcategories_slug_key";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_variant_id_attribute_id_key";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_variant_id_fkey";

alter table "public"."shipment_package_items" drop constraint "shipment_package_items_variant_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_variant_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_variant_id_fkey";

alter table "public"."abandoned_cart_followups" drop constraint "abandoned_cart_followups_cart_id_fkey";

alter table "public"."addresses" drop constraint "addresses_organization_id_fkey";

alter table "public"."addresses" drop constraint "addresses_user_id_fkey";

alter table "public"."advisor_conversations" drop constraint "advisor_conversations_advisor_profile_id_fkey";

alter table "public"."advisor_conversations" drop constraint "advisor_conversations_user_id_fkey";

alter table "public"."advisor_escalation_rules" drop constraint "advisor_escalation_rules_advisor_profile_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_advisor_profile_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_conversation_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_message_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_model_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_provider_id_fkey";

alter table "public"."advisor_execution_runs" drop constraint "advisor_execution_runs_user_id_fkey";

alter table "public"."advisor_feedback" drop constraint "advisor_feedback_message_id_fkey";

alter table "public"."advisor_feedback" drop constraint "advisor_feedback_user_id_fkey";

alter table "public"."advisor_message_sources" drop constraint "advisor_message_sources_chunk_id_fkey";

alter table "public"."advisor_message_sources" drop constraint "advisor_message_sources_document_id_fkey";

alter table "public"."advisor_message_sources" drop constraint "advisor_message_sources_message_id_fkey";

alter table "public"."advisor_messages" drop constraint "advisor_messages_conversation_id_fkey";

alter table "public"."advisor_profile_guardrails" drop constraint "advisor_profile_guardrails_advisor_profile_id_fkey";

alter table "public"."advisor_profile_guardrails" drop constraint "advisor_profile_guardrails_guardrail_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_advisor_profile_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_embedding_model_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_fallback_prompt_template_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_primary_model_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_provider_id_fkey";

alter table "public"."advisor_profile_model_configs" drop constraint "advisor_profile_model_configs_system_prompt_template_id_fkey";

alter table "public"."advisor_profile_tools" drop constraint "advisor_profile_tools_advisor_profile_id_fkey";

alter table "public"."advisor_profile_tools" drop constraint "advisor_profile_tools_tool_id_fkey";

alter table "public"."advisor_prompt_templates" drop constraint "advisor_prompt_templates_created_by_fkey";

alter table "public"."advisor_query_logs" drop constraint "advisor_query_logs_advisor_profile_id_fkey";

alter table "public"."advisor_query_logs" drop constraint "advisor_query_logs_conversation_id_fkey";

alter table "public"."advisor_query_logs" drop constraint "advisor_query_logs_message_id_fkey";

alter table "public"."advisor_query_logs" drop constraint "advisor_query_logs_user_id_fkey";

alter table "public"."advisor_retrieval_logs" drop constraint "advisor_retrieval_logs_advisor_profile_id_fkey";

alter table "public"."advisor_retrieval_logs" drop constraint "advisor_retrieval_logs_conversation_id_fkey";

alter table "public"."advisor_retrieval_logs" drop constraint "advisor_retrieval_logs_message_id_fkey";

alter table "public"."advisor_retrieval_logs" drop constraint "advisor_retrieval_logs_query_log_id_fkey";

alter table "public"."advisor_retrieval_logs" drop constraint "advisor_retrieval_logs_user_id_fkey";

alter table "public"."advisor_retrieval_results" drop constraint "advisor_retrieval_results_chunk_id_fkey";

alter table "public"."advisor_retrieval_results" drop constraint "advisor_retrieval_results_document_id_fkey";

alter table "public"."advisor_retrieval_results" drop constraint "advisor_retrieval_results_retrieval_log_id_fkey";

alter table "public"."advisor_run_events" drop constraint "advisor_run_events_execution_run_id_fkey";

alter table "public"."advisor_source_rules" drop constraint "advisor_source_rules_advisor_profile_id_fkey";

alter table "public"."advisor_usage_records" drop constraint "advisor_usage_records_execution_run_id_fkey";

alter table "public"."advisor_usage_records" drop constraint "advisor_usage_records_model_id_fkey";

alter table "public"."advisor_usage_records" drop constraint "advisor_usage_records_provider_id_fkey";

alter table "public"."advisor_usage_records" drop constraint "advisor_usage_records_user_id_fkey";

alter table "public"."advisor_web_search_logs" drop constraint "advisor_web_search_logs_advisor_profile_id_fkey";

alter table "public"."advisor_web_search_logs" drop constraint "advisor_web_search_logs_query_log_id_fkey";

alter table "public"."advisor_web_search_logs" drop constraint "advisor_web_search_logs_user_id_fkey";

alter table "public"."advisor_web_search_results" drop constraint "advisor_web_search_results_web_search_log_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_crop_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_farm_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_field_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_tool_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_user_id_fkey";

alter table "public"."agronomy_tool_templates" drop constraint "agronomy_tool_templates_created_by_fkey";

alter table "public"."agronomy_tool_templates" drop constraint "agronomy_tool_templates_tool_id_fkey";

alter table "public"."ai_models" drop constraint "ai_models_provider_id_fkey";

alter table "public"."audit_logs" drop constraint "audit_logs_actor_user_id_fkey";

alter table "public"."cart_items" drop constraint "cart_items_cart_id_fkey";

alter table "public"."cart_items" drop constraint "cart_items_product_id_fkey";

alter table "public"."carts" drop constraint "carts_converted_order_id_fkey";

alter table "public"."carts" drop constraint "carts_user_id_fkey";

alter table "public"."certificates" drop constraint "certificates_course_id_fkey";

alter table "public"."certificates" drop constraint "certificates_enrollment_id_fkey";

alter table "public"."certificates" drop constraint "certificates_user_id_fkey";

alter table "public"."course_modules" drop constraint "course_modules_course_id_fkey";

alter table "public"."courses" drop constraint "courses_category_id_fkey";

alter table "public"."crop_calendar_events" drop constraint "crop_calendar_events_crop_calendar_plan_id_fkey";

alter table "public"."crop_calendar_plans" drop constraint "crop_calendar_plans_crop_id_fkey";

alter table "public"."crop_calendar_plans" drop constraint "crop_calendar_plans_farm_id_fkey";

alter table "public"."crop_calendar_plans" drop constraint "crop_calendar_plans_field_id_fkey";

alter table "public"."crop_calendar_plans" drop constraint "crop_calendar_plans_tool_run_id_fkey";

alter table "public"."crop_calendar_plans" drop constraint "crop_calendar_plans_user_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_crop_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_farm_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_field_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_generated_by_fkey";

alter table "public"."crops" drop constraint "crops_farm_id_fkey";

alter table "public"."customer_credit_ledger" drop constraint "customer_credit_ledger_credit_account_id_fkey";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_customer_invoice_id_fkey";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_order_item_id_fkey";

alter table "public"."customer_invoices" drop constraint "customer_invoices_customer_id_fkey";

alter table "public"."customer_invoices" drop constraint "customer_invoices_order_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_order_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_requested_by_fkey";

alter table "public"."delivery_status_logs" drop constraint "delivery_status_logs_delivery_request_id_fkey";

alter table "public"."delivery_status_logs" drop constraint "delivery_status_logs_updated_by_fkey";

alter table "public"."depot_zones" drop constraint "depot_zones_depot_id_fkey";

alter table "public"."depots" drop constraint "depots_address_id_fkey";

alter table "public"."depots" drop constraint "depots_organization_id_fkey";

alter table "public"."enrollments" drop constraint "enrollments_course_id_fkey";

alter table "public"."enrollments" drop constraint "enrollments_user_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_farm_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_field_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_performed_by_fkey";

alter table "public"."farms" drop constraint "farms_team_id_fkey";

alter table "public"."fertiliser_plan_items" drop constraint "fertiliser_plan_items_recommendation_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_crop_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_farm_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_field_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_tool_run_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_user_id_fkey";

alter table "public"."fields" drop constraint "fields_farm_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_depot_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_order_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_packed_by_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_wave_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_goods_receipt_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_purchase_order_item_id_fkey";

alter table "public"."goods_receipts" drop constraint "goods_receipts_depot_id_fkey";

alter table "public"."goods_receipts" drop constraint "goods_receipts_purchase_order_id_fkey";

alter table "public"."goods_receipts" drop constraint "goods_receipts_received_by_fkey";

alter table "public"."goods_receipts" drop constraint "goods_receipts_supplier_id_fkey";

alter table "public"."harvest_records" drop constraint "harvest_records_crop_id_fkey";

alter table "public"."harvest_records" drop constraint "harvest_records_field_id_fkey";

alter table "public"."harvest_records" drop constraint "harvest_records_planting_record_id_fkey";

alter table "public"."inventory_batches" drop constraint "inventory_batches_bin_id_fkey";

alter table "public"."inventory_batches" drop constraint "inventory_batches_depot_id_fkey";

alter table "public"."irrigation_plan_events" drop constraint "irrigation_plan_events_irrigation_plan_id_fkey";

alter table "public"."irrigation_plans" drop constraint "irrigation_plans_crop_id_fkey";

alter table "public"."irrigation_plans" drop constraint "irrigation_plans_farm_id_fkey";

alter table "public"."irrigation_plans" drop constraint "irrigation_plans_field_id_fkey";

alter table "public"."irrigation_plans" drop constraint "irrigation_plans_tool_run_id_fkey";

alter table "public"."irrigation_plans" drop constraint "irrigation_plans_user_id_fkey";

alter table "public"."journal_entry_lines" drop constraint "journal_entry_lines_depot_id_fkey";

alter table "public"."journal_entry_lines" drop constraint "journal_entry_lines_gl_account_id_fkey";

alter table "public"."journal_entry_lines" drop constraint "journal_entry_lines_journal_entry_id_fkey";

alter table "public"."journal_entry_lines" drop constraint "journal_entry_lines_variant_id_fkey";

alter table "public"."knowledge_document_chunks" drop constraint "knowledge_document_chunks_document_id_fkey";

alter table "public"."knowledge_documents" drop constraint "knowledge_documents_created_by_fkey";

alter table "public"."knowledge_documents" drop constraint "knowledge_documents_source_id_fkey";

alter table "public"."knowledge_ingestion_jobs" drop constraint "knowledge_ingestion_jobs_created_by_fkey";

alter table "public"."knowledge_ingestion_jobs" drop constraint "knowledge_ingestion_jobs_document_id_fkey";

alter table "public"."knowledge_ingestion_jobs" drop constraint "knowledge_ingestion_jobs_source_id_fkey";

alter table "public"."knowledge_sources" drop constraint "knowledge_sources_created_by_fkey";

alter table "public"."lesson_resources" drop constraint "lesson_resources_lesson_id_fkey";

alter table "public"."lessons" drop constraint "lessons_module_id_fkey";

alter table "public"."lime_recommendations" drop constraint "lime_recommendations_farm_id_fkey";

alter table "public"."lime_recommendations" drop constraint "lime_recommendations_field_id_fkey";

alter table "public"."lime_recommendations" drop constraint "lime_recommendations_soil_test_id_fkey";

alter table "public"."lime_recommendations" drop constraint "lime_recommendations_tool_run_id_fkey";

alter table "public"."lime_recommendations" drop constraint "lime_recommendations_user_id_fkey";

alter table "public"."marketplace_buyer_requests" drop constraint "marketplace_buyer_requests_buyer_organization_id_fkey";

alter table "public"."marketplace_buyer_requests" drop constraint "marketplace_buyer_requests_buyer_user_id_fkey";

alter table "public"."marketplace_buyer_requests" drop constraint "marketplace_buyer_requests_commodity_id_fkey";

alter table "public"."marketplace_commodity_grades" drop constraint "marketplace_commodity_grades_commodity_id_fkey";

alter table "public"."marketplace_disputes" drop constraint "marketplace_disputes_raised_by_user_id_fkey";

alter table "public"."marketplace_disputes" drop constraint "marketplace_disputes_trade_id_fkey";

alter table "public"."marketplace_listing_documents" drop constraint "marketplace_listing_documents_listing_id_fkey";

alter table "public"."marketplace_listing_images" drop constraint "marketplace_listing_images_listing_id_fkey";

alter table "public"."marketplace_listing_lots" drop constraint "marketplace_listing_lots_listing_id_fkey";

alter table "public"."marketplace_listings" drop constraint "marketplace_listings_commodity_id_fkey";

alter table "public"."marketplace_listings" drop constraint "marketplace_listings_farm_id_fkey";

alter table "public"."marketplace_listings" drop constraint "marketplace_listings_field_id_fkey";

alter table "public"."marketplace_listings" drop constraint "marketplace_listings_seller_organization_id_fkey";

alter table "public"."marketplace_listings" drop constraint "marketplace_listings_seller_user_id_fkey";

alter table "public"."marketplace_matches" drop constraint "marketplace_matches_buyer_request_id_fkey";

alter table "public"."marketplace_matches" drop constraint "marketplace_matches_listing_id_fkey";

alter table "public"."marketplace_offer_messages" drop constraint "marketplace_offer_messages_offer_id_fkey";

alter table "public"."marketplace_offer_messages" drop constraint "marketplace_offer_messages_sender_user_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_buyer_organization_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_buyer_request_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_buyer_user_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_listing_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_seller_organization_id_fkey";

alter table "public"."marketplace_offers" drop constraint "marketplace_offers_seller_user_id_fkey";

alter table "public"."marketplace_payouts" drop constraint "marketplace_payouts_seller_organization_id_fkey";

alter table "public"."marketplace_payouts" drop constraint "marketplace_payouts_seller_user_id_fkey";

alter table "public"."marketplace_payouts" drop constraint "marketplace_payouts_settlement_id_fkey";

alter table "public"."marketplace_payouts" drop constraint "marketplace_payouts_wallet_transaction_id_fkey";

alter table "public"."marketplace_price_observations" drop constraint "marketplace_price_observations_commodity_id_fkey";

alter table "public"."marketplace_quality_attributes" drop constraint "marketplace_quality_attributes_listing_id_fkey";

alter table "public"."marketplace_settlements" drop constraint "marketplace_settlements_trade_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_buyer_organization_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_buyer_request_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_buyer_user_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_listing_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_offer_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_seller_organization_id_fkey";

alter table "public"."marketplace_trades" drop constraint "marketplace_trades_seller_user_id_fkey";

alter table "public"."notification_preferences" drop constraint "notification_preferences_user_id_fkey";

alter table "public"."notifications" drop constraint "notifications_organization_id_fkey";

alter table "public"."notifications" drop constraint "notifications_user_id_fkey";

alter table "public"."order_items" drop constraint "order_items_order_id_fkey";

alter table "public"."order_items" drop constraint "order_items_product_id_fkey";

alter table "public"."order_items" drop constraint "order_items_variant_id_fkey";

alter table "public"."orders" drop constraint "orders_cart_id_fkey";

alter table "public"."orders" drop constraint "orders_user_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_user_id_fkey";

alter table "public"."organizations" drop constraint "organizations_created_by_fkey";

alter table "public"."payment_allocations" drop constraint "payment_allocations_customer_invoice_id_fkey";

alter table "public"."payment_allocations" drop constraint "payment_allocations_payment_id_fkey";

alter table "public"."payment_transactions" drop constraint "payment_transactions_gateway_id_fkey";

alter table "public"."payment_transactions" drop constraint "payment_transactions_order_id_fkey";

alter table "public"."payment_transactions" drop constraint "payment_transactions_subscription_id_fkey";

alter table "public"."payment_transactions" drop constraint "payment_transactions_user_id_fkey";

alter table "public"."payments" drop constraint "payments_customer_invoice_id_fkey";

alter table "public"."payments" drop constraint "payments_order_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_assigned_to_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_batch_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_bin_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_depot_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_order_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_order_item_id_fkey";

alter table "public"."pick_tasks" drop constraint "pick_tasks_wave_id_fkey";

alter table "public"."pick_waves" drop constraint "pick_waves_created_by_fkey";

alter table "public"."pick_waves" drop constraint "pick_waves_depot_id_fkey";

alter table "public"."planting_records" drop constraint "planting_records_crop_id_fkey";

alter table "public"."planting_records" drop constraint "planting_records_field_id_fkey";

alter table "public"."product_attribute_assignments" drop constraint "product_attribute_assignments_attribute_id_fkey";

alter table "public"."product_attribute_assignments" drop constraint "product_attribute_assignments_attribute_option_id_fkey";

alter table "public"."product_attribute_assignments" drop constraint "product_attribute_assignments_product_id_fkey";

alter table "public"."product_attribute_options" drop constraint "product_attribute_options_attribute_id_fkey";

alter table "public"."product_attributes" drop constraint "product_attributes_applies_to_category_id_fkey";

alter table "public"."product_categories" drop constraint "product_categories_parent_id_fkey";

alter table "public"."product_category_assignments" drop constraint "product_category_assignments_category_id_fkey";

alter table "public"."product_category_assignments" drop constraint "product_category_assignments_product_id_fkey";

alter table "public"."product_collection_items" drop constraint "product_collection_items_collection_id_fkey";

alter table "public"."product_collection_items" drop constraint "product_collection_items_product_id_fkey";

alter table "public"."product_images" drop constraint "product_images_product_id_fkey";

alter table "public"."product_import_rows" drop constraint "product_import_rows_created_product_id_fkey";

alter table "public"."product_import_rows" drop constraint "product_import_rows_created_variant_id_fkey";

alter table "public"."product_import_rows" drop constraint "product_import_rows_import_job_id_fkey";

alter table "public"."product_pack_sizes" drop constraint "product_pack_sizes_pack_type_check";

alter table "public"."product_pricing_history" drop constraint "product_pricing_history_product_id_fkey";

alter table "public"."product_pricing_history" drop constraint "product_pricing_history_variant_id_fkey";

alter table "public"."product_subcategories" drop constraint "product_subcategories_category_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_attribute_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_attribute_option_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_variant_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_depot_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_pack_size_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_product_id_fkey";

alter table "public"."products" drop constraint "fk_products_supplier";

alter table "public"."products" drop constraint "products_category_id_fkey";

alter table "public"."products" drop constraint "products_depot_id_fkey";

alter table "public"."products" drop constraint "products_organization_id_fkey";

alter table "public"."products" drop constraint "products_subcategory_id_fkey";

alter table "public"."profiles" drop constraint "profiles_organization_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_purchase_order_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_approved_by_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_depot_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_ordered_by_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_supplier_id_fkey";

alter table "public"."role_permissions" drop constraint "role_permissions_permission_id_fkey";

alter table "public"."role_permissions" drop constraint "role_permissions_role_id_fkey";

alter table "public"."seed_product_details" drop constraint "seed_product_details_product_id_fkey";

alter table "public"."shipment_package_items" drop constraint "shipment_package_items_batch_id_fkey";

alter table "public"."shipment_package_items" drop constraint "shipment_package_items_order_item_id_fkey";

alter table "public"."shipment_package_items" drop constraint "shipment_package_items_shipment_package_id_fkey";

alter table "public"."shipment_packages" drop constraint "shipment_packages_fulfillment_batch_id_fkey";

alter table "public"."soil_tests" drop constraint "soil_tests_farm_id_fkey";

alter table "public"."soil_tests" drop constraint "soil_tests_field_id_fkey";

alter table "public"."spray_program_items" drop constraint "spray_program_items_spray_program_id_fkey";

alter table "public"."spray_programs" drop constraint "spray_programs_crop_id_fkey";

alter table "public"."spray_programs" drop constraint "spray_programs_farm_id_fkey";

alter table "public"."spray_programs" drop constraint "spray_programs_field_id_fkey";

alter table "public"."spray_programs" drop constraint "spray_programs_tool_run_id_fkey";

alter table "public"."spray_programs" drop constraint "spray_programs_user_id_fkey";

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_stock_adjustment_id_fkey";

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_variant_id_fkey";

alter table "public"."stock_adjustments" drop constraint "stock_adjustments_depot_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_batch_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_bin_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_created_by_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_depot_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_batch_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_transfer_id_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_approved_by_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_from_depot_id_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_requested_by_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_to_depot_id_fkey";

alter table "public"."storage_bins" drop constraint "storage_bins_depot_id_fkey";

alter table "public"."storage_bins" drop constraint "storage_bins_zone_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_plan_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_goods_receipt_item_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_product_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_purchase_order_item_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_supplier_invoice_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_variant_id_fkey";

alter table "public"."supplier_invoices" drop constraint "supplier_invoices_purchase_order_id_fkey";

alter table "public"."supplier_invoices" drop constraint "supplier_invoices_supplier_id_fkey";

alter table "public"."suppliers" drop constraint "suppliers_organization_id_fkey";

alter table "public"."teams" drop constraint "teams_owner_id_fkey";

alter table "public"."user_permission_overrides" drop constraint "user_permission_overrides_permission_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_assigned_by_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_organization_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_role_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_user_id_fkey";

alter table "public"."wallet_transactions" drop constraint "wallet_transactions_payment_transaction_id_fkey";

alter table "public"."wallet_transactions" drop constraint "wallet_transactions_wallet_id_fkey";

alter table "public"."wallets" drop constraint "wallets_organization_id_fkey";

alter table "public"."wallets" drop constraint "wallets_user_id_fkey";

alter table "public"."weather_snapshots" drop constraint "weather_snapshots_farm_id_fkey";

alter table "public"."weather_snapshots" drop constraint "weather_snapshots_field_id_fkey";

alter table "public"."website_crawl_pages" drop constraint "website_crawl_pages_crawl_target_id_fkey";

alter table "public"."website_crawl_pages" drop constraint "website_crawl_pages_document_id_fkey";

alter table "public"."website_crawl_pages" drop constraint "website_crawl_pages_source_id_fkey";

alter table "public"."website_crawl_targets" drop constraint "website_crawl_targets_source_id_fkey";

alter table "public"."yield_estimator_runs" drop constraint "yield_estimator_runs_crop_id_fkey";

alter table "public"."yield_estimator_runs" drop constraint "yield_estimator_runs_farm_id_fkey";

alter table "public"."yield_estimator_runs" drop constraint "yield_estimator_runs_field_id_fkey";

alter table "public"."yield_estimator_runs" drop constraint "yield_estimator_runs_tool_run_id_fkey";

alter table "public"."yield_estimator_runs" drop constraint "yield_estimator_runs_user_id_fkey";

drop function if exists "public"."match_knowledge_chunks"(query_embedding vector, match_count integer, filter_access_level text);

drop index if exists "public"."idx_product_pack_sizes_product_id";

drop index if exists "public"."product_pack_sizes_product_id_pack_code_key";

drop index if exists "public"."product_subcategories_slug_key";

drop index if exists "public"."product_variant_attribute_values_variant_id_attribute_id_key";

drop index if exists "public"."idx_knowledge_document_chunks_embedding";


  create table "public"."accounting_periods" (
    "id" uuid not null default gen_random_uuid(),
    "financial_year" text not null,
    "period_name" text not null,
    "start_date" date not null,
    "end_date" date not null,
    "status" text not null default 'open'::text,
    "closed_by" uuid,
    "closed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."accounting_periods" enable row level security;


  create table "public"."advisory_services" (
    "id" uuid not null default gen_random_uuid(),
    "service_name" text not null,
    "description" text,
    "service_category" text default 'agronomy'::text,
    "pricing_model" text default 'per_session'::text,
    "price" numeric(12,2) default 0,
    "currency_code" text default 'ZAR'::text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."advisory_services" enable row level security;


  create table "public"."advisory_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "session_number" text,
    "customer_id" uuid,
    "farm_id" uuid,
    "advisor_id" uuid,
    "service_id" uuid,
    "session_date" timestamp with time zone default now(),
    "session_type" text default 'consultation'::text,
    "duration_minutes" integer,
    "notes" text,
    "recommendations" text,
    "linked_recommendation_id" uuid,
    "linked_crop_plan_id" uuid,
    "status" text default 'scheduled'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."advisory_sessions" enable row level security;


  create table "public"."agro_advisory_rules" (
    "id" uuid not null default gen_random_uuid(),
    "rule_name" text not null,
    "crop" text not null,
    "region_profile_id" uuid,
    "soil_profile_id" uuid,
    "farming_system_id" uuid,
    "season" text,
    "product_category" text not null,
    "product_id" uuid,
    "variant_id" uuid,
    "application_rate_per_ha" numeric(12,4),
    "application_rate_unit" text,
    "priority" integer not null default 0,
    "rationale" text,
    "notes" text,
    "is_active" boolean not null default true,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_advisory_rules" enable row level security;


  create table "public"."agro_farming_systems" (
    "id" uuid not null default gen_random_uuid(),
    "system_name" text not null,
    "system_code" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_farming_systems" enable row level security;


  create table "public"."agro_recommendation_items" (
    "id" uuid not null default gen_random_uuid(),
    "recommendation_id" uuid not null,
    "product_category" text not null,
    "product_id" uuid,
    "variant_id" uuid,
    "product_name" text,
    "rationale" text,
    "application_rate_per_ha" numeric(12,4),
    "application_rate_unit" text,
    "total_quantity" numeric(12,2),
    "pack_size_id" uuid,
    "packs_needed" integer,
    "unit_price" numeric(14,2),
    "line_total" numeric(14,2),
    "sort_order" integer not null default 0,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_recommendation_items" enable row level security;


  create table "public"."agro_recommendations" (
    "id" uuid not null default gen_random_uuid(),
    "recommendation_number" text,
    "user_id" uuid not null,
    "customer_id" uuid,
    "farm_id" uuid,
    "crop" text not null,
    "area_ha" numeric(10,2),
    "region_profile_id" uuid,
    "soil_profile_id" uuid,
    "farming_system_id" uuid,
    "province" text,
    "rainfall_zone" text,
    "soil_type" text,
    "irrigation_type" text,
    "production_scale" text,
    "production_goal" text,
    "planting_window" text,
    "yield_target" text,
    "assumptions" text,
    "status" text not null default 'draft'::text,
    "converted_to_type" text,
    "converted_to_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_recommendations" enable row level security;


  create table "public"."agro_region_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "country" text not null default 'South Africa'::text,
    "province" text not null,
    "production_zone" text not null,
    "rainfall_class" text,
    "dominant_soil_patterns" text[],
    "common_crops" text[],
    "preferred_planting_windows" text,
    "agronomic_notes" text,
    "risk_notes" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_region_profiles" enable row level security;


  create table "public"."agro_soil_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "profile_name" text not null,
    "texture_class" text not null,
    "drainage" text,
    "water_holding" text,
    "leaching_risk" text,
    "nutrient_holding" text,
    "agronomic_notes" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_soil_profiles" enable row level security;


  create table "public"."agro_solution_bundle_items" (
    "id" uuid not null default gen_random_uuid(),
    "bundle_id" uuid not null,
    "product_category" text not null,
    "product_id" uuid,
    "variant_id" uuid,
    "application_rate_per_ha" numeric(12,4),
    "application_rate_unit" text,
    "sort_order" integer not null default 0,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_solution_bundle_items" enable row level security;


  create table "public"."agro_solution_bundles" (
    "id" uuid not null default gen_random_uuid(),
    "bundle_name" text not null,
    "crop" text not null,
    "target_context" text,
    "agronomic_objective" text,
    "notes" text,
    "estimated_area_ha" numeric(10,2),
    "is_active" boolean not null default true,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."agro_solution_bundles" enable row level security;


  create table "public"."approval_requests" (
    "id" uuid not null default gen_random_uuid(),
    "request_type" text not null,
    "reference_id" uuid not null,
    "reference_number" text,
    "requested_by" uuid,
    "requested_at" timestamp with time zone not null default now(),
    "approval_status" text not null default 'pending'::text,
    "approved_by" uuid,
    "approved_at" timestamp with time zone,
    "rejection_reason" text,
    "value_impact" numeric(14,2) default 0,
    "description" text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."approval_requests" enable row level security;


  create table "public"."bank_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "bank_name" text not null,
    "account_name" text not null,
    "account_number" text not null,
    "branch_code" text,
    "swift_code" text,
    "currency_code" text not null default 'ZAR'::text,
    "country_code" text not null default 'ZA'::text,
    "account_type" text not null default 'operating'::text,
    "opening_balance" numeric(14,2) not null default 0,
    "opening_balance_date" date not null default CURRENT_DATE,
    "is_active" boolean not null default true,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."bank_accounts" enable row level security;


  create table "public"."bank_statement_imports" (
    "id" uuid not null default gen_random_uuid(),
    "bank_account_id" uuid not null,
    "file_name" text not null,
    "file_format" text not null default 'csv'::text,
    "total_rows" integer not null default 0,
    "imported_rows" integer not null default 0,
    "duplicate_rows" integer not null default 0,
    "import_status" text not null default 'pending'::text,
    "imported_by" uuid,
    "imported_at" timestamp with time zone,
    "error_log" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."bank_statement_imports" enable row level security;


  create table "public"."bank_transaction_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "bank_transaction_id" uuid not null,
    "classification" text not null default 'unknown'::text,
    "income_category" text,
    "expense_category" text,
    "business_line" text,
    "branch" text,
    "depot_id" uuid,
    "segment" text,
    "gl_account_id" uuid,
    "notes" text,
    "reviewed_by" uuid,
    "reviewed_at" timestamp with time zone,
    "review_status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "transaction_date" date,
    "amount" numeric(14,2)
      );


alter table "public"."bank_transaction_reviews" enable row level security;


  create table "public"."bank_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "bank_account_id" uuid not null,
    "transaction_date" date not null,
    "description" text,
    "reference_number" text,
    "debit_amount" numeric(14,2) not null default 0,
    "credit_amount" numeric(14,2) not null default 0,
    "running_balance" numeric(14,2),
    "source" text not null default 'manual'::text,
    "reconciliation_status" text not null default 'unmatched'::text,
    "matched_entity_type" text,
    "matched_entity_id" uuid,
    "matched_by" uuid,
    "matched_at" timestamp with time zone,
    "statement_import_id" uuid,
    "category" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."bank_transactions" enable row level security;


  create table "public"."crop_plans" (
    "id" uuid not null default gen_random_uuid(),
    "farm_id" uuid not null,
    "field_id" uuid,
    "season_id" uuid not null,
    "crop" text not null,
    "variety" text,
    "planting_window" text,
    "expected_planting_date" date,
    "expected_harvest_date" date,
    "yield_target" text,
    "farming_system_id" uuid,
    "irrigation_type" text default 'dryland'::text,
    "recommendation_id" uuid,
    "area_hectares" numeric(10,2),
    "status" text not null default 'draft'::text,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."crop_plans" enable row level security;


  create table "public"."customer_communication_logs" (
    "id" uuid not null default gen_random_uuid(),
    "customer_id" uuid not null,
    "action" text not null,
    "action_type" text not null default 'general'::text,
    "reference_type" text,
    "reference_id" uuid,
    "notes" text,
    "performed_by" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."customer_communication_logs" enable row level security;


  create table "public"."customer_credit_note_items" (
    "id" uuid not null default gen_random_uuid(),
    "credit_note_id" uuid not null,
    "description" text not null,
    "quantity" numeric(14,4) not null default 1,
    "unit_price" numeric(14,2) not null default 0,
    "line_total" numeric(14,2) not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."customer_credit_note_items" enable row level security;


  create table "public"."customer_credit_notes" (
    "id" uuid not null default gen_random_uuid(),
    "credit_note_number" text not null,
    "customer_id" uuid,
    "invoice_id" uuid,
    "issue_date" date not null default CURRENT_DATE,
    "reason_code" text not null default 'other'::text,
    "notes" text,
    "subtotal_amount" numeric(14,2) not null default 0,
    "tax_amount" numeric(14,2) not null default 0,
    "total_amount" numeric(14,2) not null default 0,
    "currency_code" text not null default 'ZAR'::text,
    "status" text not null default 'draft'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "applied_invoice_id" uuid,
    "refund_id" uuid
      );


alter table "public"."customer_credit_notes" enable row level security;


  create table "public"."customer_documents" (
    "id" uuid not null default gen_random_uuid(),
    "customer_id" uuid not null,
    "document_name" text not null,
    "document_type" text not null default 'general'::text,
    "file_url" text,
    "uploaded_by" uuid,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."customer_documents" enable row level security;


  create table "public"."customer_refunds" (
    "id" uuid not null default gen_random_uuid(),
    "refund_number" text not null,
    "customer_id" uuid not null,
    "credit_note_id" uuid,
    "invoice_id" uuid,
    "refund_date" date not null default CURRENT_DATE,
    "amount" numeric(14,2) not null default 0,
    "refund_method" text not null default 'bank_transfer'::text,
    "payment_reference" text,
    "gateway_transaction_id" text,
    "status" text not null default 'pending'::text,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."customer_refunds" enable row level security;


  create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "customer_name" text not null,
    "customer_code" text,
    "customer_type" text not null default 'farmer'::text,
    "customer_category" text not null default 'commercial_farmer'::text,
    "registration_number" text,
    "vat_number" text,
    "country" text default 'ZA'::text,
    "province" text,
    "city" text,
    "physical_address" text,
    "postal_address" text,
    "contact_name" text,
    "contact_email" text,
    "contact_phone" text,
    "contact_mobile" text,
    "account_manager" text,
    "payment_terms" text default 'net_30'::text,
    "credit_limit" numeric(14,2) default 0,
    "currency_code" text default 'ZAR'::text,
    "account_status" text default 'active'::text,
    "is_active" boolean not null default true,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."customers" enable row level security;


  create table "public"."depot_inventory" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "pack_size_id" uuid,
    "variant_id" uuid,
    "depot_id" uuid not null,
    "sku" text,
    "quantity_on_hand" numeric(14,2) not null default 0,
    "quantity_reserved" numeric(14,2) not null default 0,
    "quantity_available" numeric(14,2) generated always as ((quantity_on_hand - quantity_reserved)) stored,
    "reorder_level" numeric(14,2) default 0,
    "weight_equivalent_kg" numeric(10,4),
    "last_movement_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "unit_cost" numeric(14,4) default 0
      );


alter table "public"."depot_inventory" enable row level security;


  create table "public"."farm_seasons" (
    "id" uuid not null default gen_random_uuid(),
    "season_name" text not null,
    "start_date" date not null,
    "end_date" date not null,
    "crop_cycle_type" text not null default 'summer'::text,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."farm_seasons" enable row level security;


  create table "public"."logistics_delivery_items" (
    "id" uuid not null default gen_random_uuid(),
    "delivery_request_id" uuid not null,
    "product_id" uuid,
    "variant_id" uuid,
    "pack_size_id" uuid,
    "description" text,
    "quantity" numeric(12,2) not null default 1,
    "weight_per_unit_kg" numeric(10,2) default 0,
    "total_weight_kg" numeric(12,2) generated always as ((quantity * COALESCE(weight_per_unit_kg, (0)::numeric))) stored,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."logistics_delivery_items" enable row level security;


  create table "public"."logistics_delivery_requests" (
    "id" uuid not null default gen_random_uuid(),
    "request_number" text,
    "order_id" uuid,
    "customer_id" uuid,
    "origin_depot_id" uuid,
    "farm_id" uuid,
    "crop_plan_id" uuid,
    "pickup_address" text,
    "pickup_lat" numeric(10,7),
    "pickup_lng" numeric(10,7),
    "delivery_address" text,
    "delivery_lat" numeric(10,7),
    "delivery_lng" numeric(10,7),
    "total_weight_kg" numeric(12,2) default 0,
    "total_volume_m3" numeric(10,2),
    "cargo_description" text,
    "special_requirements" text,
    "preferred_date" date,
    "preferred_window" text,
    "priority" text not null default 'normal'::text,
    "status" text not null default 'pending'::text,
    "estimated_distance_km" numeric(10,2),
    "estimated_cost" numeric(12,2),
    "actual_cost" numeric(12,2),
    "vehicle_type_id" uuid,
    "assigned_vehicle_reg" text,
    "driver_name" text,
    "driver_phone" text,
    "drovvi_request_id" text,
    "pod_type" text,
    "pod_file_path" text,
    "pod_notes" text,
    "delivered_at" timestamp with time zone,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."logistics_delivery_requests" enable row level security;


  create table "public"."logistics_rate_cards" (
    "id" uuid not null default gen_random_uuid(),
    "vehicle_type_id" uuid not null,
    "route_type" text not null default 'standard'::text,
    "min_distance_km" numeric(10,2) default 0,
    "max_distance_km" numeric(10,2),
    "base_rate" numeric(12,2) not null default 0,
    "per_km_rate" numeric(8,2) not null default 0,
    "per_ton_rate" numeric(8,2) default 0,
    "waiting_fee_per_hour" numeric(8,2) default 0,
    "handling_fee" numeric(8,2) default 0,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."logistics_rate_cards" enable row level security;


  create table "public"."logistics_status_log" (
    "id" uuid not null default gen_random_uuid(),
    "delivery_request_id" uuid not null,
    "status" text not null,
    "notes" text,
    "location_lat" numeric(10,7),
    "location_lng" numeric(10,7),
    "recorded_by" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."logistics_status_log" enable row level security;


  create table "public"."notification_channel_configs" (
    "id" uuid not null default gen_random_uuid(),
    "channel" text not null,
    "is_active" boolean not null default false,
    "provider_name" text,
    "sender_identity" text,
    "config" jsonb not null default '{}'::jsonb,
    "auth_status" text not null default 'not_configured'::text,
    "retry_enabled" boolean not null default true,
    "max_retries" integer not null default 3,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."notification_channel_configs" enable row level security;


  create table "public"."payment_gateway_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "payment_id" uuid,
    "payment_request_id" uuid,
    "gateway_code" text not null,
    "gateway_transaction_id" text,
    "gateway_status" text not null default 'initiated'::text,
    "amount" numeric(14,2) not null,
    "currency_code" text not null default 'ZAR'::text,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."payment_gateway_transactions" enable row level security;


  create table "public"."payment_requests" (
    "id" uuid not null default gen_random_uuid(),
    "request_number" text not null,
    "customer_id" uuid,
    "reference_type" text not null,
    "reference_id" uuid not null,
    "amount" numeric not null default 0,
    "currency_code" text not null default 'ZAR'::text,
    "due_date" date,
    "status" text not null default 'pending'::text,
    "payment_link" text,
    "gateway_code" text,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."payment_requests" enable row level security;


  create table "public"."posting_rules" (
    "id" uuid not null default gen_random_uuid(),
    "rule_name" text not null,
    "source_type" text not null,
    "description" text,
    "debit_account_code" text not null,
    "credit_account_code" text not null,
    "is_active" boolean not null default true,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."posting_rules" enable row level security;


  create table "public"."production_stages" (
    "id" uuid not null default gen_random_uuid(),
    "crop_plan_id" uuid not null,
    "stage_name" text not null,
    "stage_order" integer not null default 0,
    "recommended_timing" text,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."production_stages" enable row level security;


  create table "public"."proforma_invoice_items" (
    "id" uuid not null default gen_random_uuid(),
    "proforma_invoice_id" uuid not null,
    "product_id" uuid,
    "pack_size_id" uuid,
    "description" text,
    "quantity" numeric not null default 1,
    "unit_price" numeric not null default 0,
    "discount_percent" numeric default 0,
    "weight_kg" numeric default 0,
    "line_total" numeric not null default 0,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "variant_id" uuid
      );


alter table "public"."proforma_invoice_items" enable row level security;


  create table "public"."proforma_invoices" (
    "id" uuid not null default gen_random_uuid(),
    "proforma_number" text not null,
    "customer_id" uuid,
    "quote_id" uuid,
    "issue_date" date not null default CURRENT_DATE,
    "due_date" date,
    "sales_rep_id" uuid,
    "currency_code" text not null default 'ZAR'::text,
    "payment_terms" text default 'net_30'::text,
    "subtotal_amount" numeric not null default 0,
    "tax_amount" numeric not null default 0,
    "total_amount" numeric not null default 0,
    "tax_rate" numeric default 15,
    "status" text not null default 'draft'::text,
    "notes" text,
    "converted_order_id" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."proforma_invoices" enable row level security;


  create table "public"."program_activities" (
    "id" uuid not null default gen_random_uuid(),
    "crop_plan_id" uuid not null,
    "stage_id" uuid,
    "product_id" uuid,
    "variant_id" uuid,
    "pack_size_id" uuid,
    "activity_description" text not null,
    "product_category" text,
    "application_rate" numeric(12,4),
    "application_rate_unit" text default 'kg/ha'::text,
    "total_quantity" numeric(12,4),
    "packs_needed" numeric(12,2),
    "unit_price" numeric(14,2),
    "line_total" numeric(14,2),
    "recommended_timing" text,
    "notes" text,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."program_activities" enable row level security;


  create table "public"."program_courses" (
    "id" uuid not null default gen_random_uuid(),
    "program_id" uuid not null,
    "course_id" uuid not null,
    "sort_order" integer default 0,
    "is_required" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."program_courses" enable row level security;


  create table "public"."quote_items" (
    "id" uuid not null default gen_random_uuid(),
    "quote_id" uuid not null,
    "product_id" uuid,
    "pack_size_id" uuid,
    "description" text,
    "quantity" numeric not null default 1,
    "unit_price" numeric not null default 0,
    "discount_percent" numeric default 0,
    "weight_kg" numeric default 0,
    "line_total" numeric not null default 0,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."quote_items" enable row level security;


  create table "public"."quotes" (
    "id" uuid not null default gen_random_uuid(),
    "quote_number" text not null,
    "customer_id" uuid,
    "quote_date" date not null default CURRENT_DATE,
    "expiry_date" date,
    "sales_rep_id" uuid,
    "currency_code" text not null default 'ZAR'::text,
    "payment_terms" text default 'net_30'::text,
    "delivery_terms" text,
    "subtotal_amount" numeric not null default 0,
    "tax_amount" numeric not null default 0,
    "total_amount" numeric not null default 0,
    "tax_rate" numeric default 15,
    "status" text not null default 'draft'::text,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."quotes" enable row level security;


  create table "public"."reminder_templates" (
    "id" uuid not null default gen_random_uuid(),
    "template_code" text not null,
    "template_name" text not null,
    "subject_template" text not null,
    "body_template" text not null,
    "reminder_type" text not null default 'invoice_due'::text,
    "days_offset" integer not null default 0,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."reminder_templates" enable row level security;


  create table "public"."stock_count_items" (
    "id" uuid not null default gen_random_uuid(),
    "stock_count_id" uuid not null,
    "product_id" uuid,
    "pack_size_id" uuid,
    "system_quantity" numeric(14,4) not null default 0,
    "counted_quantity" numeric(14,4),
    "variance" numeric(14,4) generated always as ((COALESCE(counted_quantity, (0)::numeric) - system_quantity)) stored,
    "weight_equivalent_kg" numeric(12,4),
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."stock_count_items" enable row level security;


  create table "public"."stock_counts" (
    "id" uuid not null default gen_random_uuid(),
    "count_number" text not null,
    "depot_id" uuid not null,
    "count_type" text not null default 'full'::text,
    "count_date" date not null default CURRENT_DATE,
    "status" text not null default 'draft'::text,
    "notes" text,
    "created_by" uuid,
    "approved_by" uuid,
    "posted_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."stock_counts" enable row level security;


  create table "public"."supplier_contacts" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid not null,
    "contact_name" text not null,
    "role_title" text,
    "email" text,
    "phone" text,
    "mobile" text,
    "is_primary" boolean default false,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_contacts" enable row level security;


  create table "public"."supplier_credit_note_items" (
    "id" uuid not null default gen_random_uuid(),
    "credit_note_id" uuid not null,
    "description" text not null,
    "quantity" numeric(14,4) not null default 1,
    "unit_price" numeric(14,2) not null default 0,
    "line_total" numeric(14,2) not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_credit_note_items" enable row level security;


  create table "public"."supplier_credit_notes" (
    "id" uuid not null default gen_random_uuid(),
    "credit_note_number" text not null,
    "supplier_id" uuid,
    "supplier_invoice_id" uuid,
    "issue_date" date not null default CURRENT_DATE,
    "reason_code" text not null default 'other'::text,
    "notes" text,
    "subtotal_amount" numeric(14,2) not null default 0,
    "tax_amount" numeric(14,2) not null default 0,
    "total_amount" numeric(14,2) not null default 0,
    "currency_code" text not null default 'ZAR'::text,
    "status" text not null default 'draft'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_credit_notes" enable row level security;


  create table "public"."supplier_documents" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid not null,
    "document_name" text not null,
    "document_type" text not null default 'general'::text,
    "file_url" text,
    "uploaded_by" uuid,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_documents" enable row level security;


  create table "public"."supplier_payments" (
    "id" uuid not null default gen_random_uuid(),
    "payment_number" text not null,
    "supplier_id" uuid,
    "supplier_invoice_id" uuid,
    "payment_date" date not null default CURRENT_DATE,
    "amount" numeric(14,2) not null default 0,
    "currency_code" text not null default 'ZAR'::text,
    "payment_method" text not null default 'bank_transfer'::text,
    "payment_reference" text,
    "notes" text,
    "payment_status" text not null default 'pending'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_payments" enable row level security;


  create table "public"."supplier_products" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid not null,
    "product_id" uuid not null,
    "supplier_product_code" text,
    "is_preferred" boolean default false,
    "standard_cost" numeric(14,2),
    "minimum_order_qty" numeric(14,2),
    "lead_time_days" integer,
    "last_purchase_price" numeric(14,2),
    "contract_price" numeric(14,2),
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."supplier_products" enable row level security;


  create table "public"."support_tickets" (
    "id" uuid not null default gen_random_uuid(),
    "ticket_number" text,
    "customer_id" uuid,
    "user_id" uuid,
    "category" text default 'general'::text,
    "priority" text default 'normal'::text,
    "subject" text not null,
    "description" text,
    "status" text default 'open'::text,
    "assigned_advisor_id" uuid,
    "resolved_at" timestamp with time zone,
    "resolution_notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."support_tickets" enable row level security;


  create table "public"."training_programs" (
    "id" uuid not null default gen_random_uuid(),
    "program_name" text not null,
    "description" text,
    "category" text default 'general'::text,
    "start_date" date,
    "end_date" date,
    "enrollment_type" text default 'individual'::text,
    "status" text default 'draft'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."training_programs" enable row level security;


  create table "public"."vat_codes" (
    "id" uuid not null default gen_random_uuid(),
    "code_name" text not null,
    "rate_percent" numeric(5,2) not null default 15.00,
    "vat_direction" text not null default 'output'::text,
    "gl_account_id" uuid,
    "is_active" boolean not null default true,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."vat_codes" enable row level security;


  create table "public"."vat_periods" (
    "id" uuid not null default gen_random_uuid(),
    "period_name" text not null,
    "start_date" date not null,
    "end_date" date not null,
    "status" text not null default 'open'::text,
    "submitted_at" timestamp with time zone,
    "submitted_by" uuid,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."vat_periods" enable row level security;


  create table "public"."vehicle_types" (
    "id" uuid not null default gen_random_uuid(),
    "vehicle_code" text not null,
    "vehicle_name" text not null,
    "max_weight_kg" numeric(10,2) not null default 0,
    "max_volume_m3" numeric(10,2),
    "base_rate" numeric(12,2) default 0,
    "per_km_rate" numeric(8,2) default 0,
    "is_active" boolean not null default true,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."vehicle_types" enable row level security;

alter table "public"."abandoned_cart_followups" enable row level security;

alter table "public"."course_classifications" enable row level security;

alter table "public"."customer_credit_accounts" enable row level security;

alter table "public"."customer_credit_ledger" enable row level security;

alter table "public"."customer_invoice_items" add column "product_id" uuid;

alter table "public"."customer_invoices" add column "paid_amount" numeric not null default 0;

alter table "public"."customer_invoices" add column "payment_terms" text default 'net_30'::text;

alter table "public"."customer_invoices" add column "sales_rep_id" uuid;

alter table "public"."customer_invoices" add column "tax_rate" numeric default 15;

alter table "public"."depots" add column "city" text;

alter table "public"."depots" add column "contact_email" text;

alter table "public"."depots" add column "contact_person" text;

alter table "public"."depots" add column "contact_phone" text;

alter table "public"."depots" add column "country" text default 'ZA'::text;

alter table "public"."depots" add column "gps_lat" numeric(10,7);

alter table "public"."depots" add column "gps_lng" numeric(10,7);

alter table "public"."depots" add column "is_default" boolean default false;

alter table "public"."depots" add column "notes" text;

alter table "public"."depots" add column "physical_address" text;

alter table "public"."depots" add column "province" text;

alter table "public"."depots" add column "storage_category" text default 'general'::text;

alter table "public"."document_delivery_logs" enable row level security;

alter table "public"."farms" add column "customer_id" uuid;

alter table "public"."farms" add column "farming_system_id" uuid;

alter table "public"."farms" add column "irrigation_available" boolean not null default false;

alter table "public"."farms" add column "notes" text;

alter table "public"."farms" add column "region_profile_id" uuid;

alter table "public"."fields" add column "notes" text;

alter table "public"."fields" add column "region_profile_id" uuid;

alter table "public"."fields" add column "soil_profile_id" uuid;

alter table "public"."gl_accounts" add column "description" text;

alter table "public"."gl_accounts" add column "parent_account_id" uuid;

alter table "public"."gl_accounts" add column "posting_allowed" boolean not null default true;

alter table "public"."gl_accounts" enable row level security;

alter table "public"."goods_receipt_items" add column "accepted_quantity" numeric(14,4);

alter table "public"."goods_receipt_items" add column "pack_size_id" uuid;

alter table "public"."goods_receipt_items" add column "product_id" uuid;

alter table "public"."goods_receipt_items" add column "weight_equivalent_kg" numeric(12,4);

alter table "public"."goods_receipts" add column "source_type" text not null default 'supplier_delivery'::text;

alter table "public"."journal_entries" add column "approved_by" uuid;

alter table "public"."journal_entries" add column "is_reversed" boolean not null default false;

alter table "public"."journal_entries" add column "journal_type" text not null default 'system'::text;

alter table "public"."journal_entries" add column "period_id" uuid;

alter table "public"."journal_entries" add column "reversed_by_id" uuid;

alter table "public"."journal_entries" enable row level security;

alter table "public"."journal_entry_lines" add column "customer_id" uuid;

alter table "public"."journal_entry_lines" add column "notes" text;

alter table "public"."journal_entry_lines" add column "supplier_id" uuid;

alter table "public"."journal_entry_lines" enable row level security;

alter table "public"."knowledge_document_chunks" alter column "embedding" set data type public.vector(1536) using "embedding"::public.vector(1536);

alter table "public"."marketplace_commodity_grades" enable row level security;

alter table "public"."notification_templates" add column "created_by" uuid;

alter table "public"."notification_templates" add column "default_recipients" text;

alter table "public"."notification_templates" add column "description" text;

alter table "public"."notification_templates" add column "recipient_config" jsonb default '{}'::jsonb;

alter table "public"."notification_templates" add column "recipient_type" text not null default 'customer'::text;

alter table "public"."notification_templates" add column "sort_order" integer not null default 0;

alter table "public"."notification_templates" add column "trigger_event" text not null default 'manual'::text;

alter table "public"."notification_templates" add column "variables" text[];

alter table "public"."orders" add column "customer_id" uuid;

alter table "public"."orders" add column "delivery_terms" text;

alter table "public"."orders" add column "depot_id" uuid;

alter table "public"."orders" add column "order_date" date default CURRENT_DATE;

alter table "public"."orders" add column "payment_terms" text default 'net_30'::text;

alter table "public"."orders" add column "quote_id" uuid;

alter table "public"."orders" add column "sales_rep_id" uuid;

alter table "public"."payment_allocations" enable row level security;

alter table "public"."payments" add column "allocated_amount" numeric default 0;

alter table "public"."payments" enable row level security;

alter table "public"."product_import_jobs" enable row level security;

alter table "public"."product_import_rows" enable row level security;

alter table "public"."product_pack_sizes" drop column "conversion_factor_to_kg";

alter table "public"."product_pack_sizes" drop column "height_cm";

alter table "public"."product_pack_sizes" drop column "is_default";

alter table "public"."product_pack_sizes" drop column "length_cm";

alter table "public"."product_pack_sizes" drop column "metadata";

alter table "public"."product_pack_sizes" drop column "pack_code";

alter table "public"."product_pack_sizes" drop column "pack_label";

alter table "public"."product_pack_sizes" drop column "product_id";

alter table "public"."product_pack_sizes" drop column "quantity_uom";

alter table "public"."product_pack_sizes" drop column "shipping_weight_kg";

alter table "public"."product_pack_sizes" drop column "width_cm";

alter table "public"."product_pack_sizes" add column "conversion_factor_kg" numeric(10,4);

alter table "public"."product_pack_sizes" add column "crop_type" text;

alter table "public"."product_pack_sizes" add column "description" text;

alter table "public"."product_pack_sizes" add column "display_label" text;

alter table "public"."product_pack_sizes" add column "estimated_weight_kg" numeric(14,3);

alter table "public"."product_pack_sizes" add column "is_bulk" boolean not null default false;

alter table "public"."product_pack_sizes" add column "name" text not null;

alter table "public"."product_pack_sizes" add column "packaging_type" text default 'bag'::text;

alter table "public"."product_pack_sizes" add column "quantity_unit" text;

alter table "public"."product_pack_sizes" add column "seed_count_label" text;

alter table "public"."product_pack_sizes" alter column "quantity_value" drop not null;

alter table "public"."product_pack_sizes" alter column "quantity_value" set data type numeric(14,3) using "quantity_value"::numeric(14,3);

alter table "public"."product_pricing_history" enable row level security;

alter table "public"."product_subcategories" alter column "slug" drop not null;

alter table "public"."product_variant_attribute_values" alter column "attribute_value_number" set data type numeric(14,3) using "attribute_value_number"::numeric(14,3);

alter table "public"."product_variants" drop column "compare_at_price_override";

alter table "public"."product_variants" drop column "price_override";

alter table "public"."product_variants" drop column "shipping_weight_kg";

alter table "public"."product_variants" drop column "stock_quantity";

alter table "public"."product_variants" add column "buying_price" numeric(14,2);

alter table "public"."product_variants" add column "height_cm" numeric(14,2);

alter table "public"."product_variants" add column "is_bulk" boolean not null default false;

alter table "public"."product_variants" add column "length_cm" numeric(14,2);

alter table "public"."product_variants" add column "margin_percent" numeric(8,2);

alter table "public"."product_variants" add column "selling_price" numeric(14,2);

alter table "public"."product_variants" add column "variant_status" text not null default 'active'::text;

alter table "public"."product_variants" add column "weight_kg" numeric(14,3);

alter table "public"."product_variants" add column "width_cm" numeric(14,2);

alter table "public"."product_variants" alter column "metadata" drop default;

alter table "public"."product_variants" alter column "metadata" drop not null;

alter table "public"."purchase_order_items" add column "pack_size_id" uuid;

alter table "public"."purchase_order_items" add column "product_id" uuid;

alter table "public"."purchase_order_items" add column "quantity_received" numeric(14,4) default 0;

alter table "public"."purchase_order_items" add column "supplier_product_code" text;

alter table "public"."purchase_order_items" add column "weight_equivalent_kg" numeric(14,4);

alter table "public"."purchase_orders" add column "approved_at" timestamp with time zone;

alter table "public"."purchase_orders" add column "payment_terms" text;

alter table "public"."purchase_orders" add column "sent_at" timestamp with time zone;

alter table "public"."roles" enable row level security;

alter table "public"."seed_product_details" enable row level security;

alter table "public"."stock_adjustment_items" add column "adjustment_type" text not null default 'increase'::text;

alter table "public"."stock_adjustment_items" add column "pack_size_id" uuid;

alter table "public"."stock_adjustment_items" add column "product_id" uuid;

alter table "public"."stock_adjustment_items" add column "quantity" numeric(14,4) not null default 0;

alter table "public"."stock_adjustment_items" add column "weight_equivalent_kg" numeric(12,4);

alter table "public"."stock_adjustment_items" enable row level security;

alter table "public"."stock_adjustments" add column "adjustment_type" text not null default 'increase'::text;

alter table "public"."stock_adjustments" add column "approved_by" uuid;

alter table "public"."stock_adjustments" add column "posted_at" timestamp with time zone;

alter table "public"."stock_adjustments" add column "reason_code" text;

alter table "public"."stock_adjustments" enable row level security;

alter table "public"."stock_movements" add column "destination_depot_id" uuid;

alter table "public"."stock_movements" add column "pack_size_id" uuid;

alter table "public"."stock_movements" add column "product_id" uuid;

alter table "public"."stock_movements" add column "reason_code" text;

alter table "public"."stock_movements" add column "reference_number" text;

alter table "public"."stock_movements" add column "source_depot_id" uuid;

alter table "public"."stock_movements" add column "status" text not null default 'completed'::text;

alter table "public"."stock_movements" add column "weight_equivalent_kg" numeric(12,4);

alter table "public"."stock_movements" alter column "variant_id" drop not null;

alter table "public"."stock_transfer_items" add column "pack_size_id" uuid;

alter table "public"."stock_transfer_items" add column "product_id" uuid;

alter table "public"."stock_transfer_items" add column "weight_equivalent_kg" numeric(12,4);

alter table "public"."stock_transfer_items" alter column "variant_id" drop not null;

alter table "public"."stock_transfers" add column "dispatched_at" timestamp with time zone;

alter table "public"."stock_transfers" add column "received_at" timestamp with time zone;

alter table "public"."stock_transfers" add column "transfer_date" date default CURRENT_DATE;

alter table "public"."stock_transfers" add column "transfer_reason" text;

alter table "public"."supplier_invoices" add column "created_by" uuid;

alter table "public"."supplier_invoices" add column "paid_amount" numeric(14,2) not null default 0;

alter table "public"."suppliers" add column "bank_account_name" text;

alter table "public"."suppliers" add column "bank_account_number" text;

alter table "public"."suppliers" add column "bank_branch_code" text;

alter table "public"."suppliers" add column "bank_country" text;

alter table "public"."suppliers" add column "bank_name" text;

alter table "public"."suppliers" add column "bank_swift_code" text;

alter table "public"."suppliers" add column "city" text;

alter table "public"."suppliers" add column "company_registration" text;

alter table "public"."suppliers" add column "contract_status" text default 'none'::text;

alter table "public"."suppliers" add column "country" text default 'ZA'::text;

alter table "public"."suppliers" add column "default_payment_method" text default 'eft'::text;

alter table "public"."suppliers" add column "is_preferred" boolean default false;

alter table "public"."suppliers" add column "lead_time_days" integer;

alter table "public"."suppliers" add column "notes" text;

alter table "public"."suppliers" add column "physical_address" text;

alter table "public"."suppliers" add column "postal_address" text;

alter table "public"."suppliers" add column "province" text;

alter table "public"."suppliers" add column "supplier_category" text default 'general'::text;

alter table "public"."suppliers" add column "supplier_credit_limit" numeric(14,2) default 0;

alter table "public"."suppliers" add column "supplier_type" text default 'general'::text;

alter table "public"."suppliers" add column "website" text;

CREATE UNIQUE INDEX accounting_periods_pkey ON public.accounting_periods USING btree (id);

CREATE UNIQUE INDEX advisory_services_pkey ON public.advisory_services USING btree (id);

CREATE UNIQUE INDEX advisory_sessions_pkey ON public.advisory_sessions USING btree (id);

CREATE UNIQUE INDEX agro_advisory_rules_pkey ON public.agro_advisory_rules USING btree (id);

CREATE UNIQUE INDEX agro_farming_systems_pkey ON public.agro_farming_systems USING btree (id);

CREATE UNIQUE INDEX agro_farming_systems_system_code_key ON public.agro_farming_systems USING btree (system_code);

CREATE UNIQUE INDEX agro_recommendation_items_pkey ON public.agro_recommendation_items USING btree (id);

CREATE UNIQUE INDEX agro_recommendations_pkey ON public.agro_recommendations USING btree (id);

CREATE UNIQUE INDEX agro_region_profiles_pkey ON public.agro_region_profiles USING btree (id);

CREATE UNIQUE INDEX agro_soil_profiles_pkey ON public.agro_soil_profiles USING btree (id);

CREATE UNIQUE INDEX agro_solution_bundle_items_pkey ON public.agro_solution_bundle_items USING btree (id);

CREATE UNIQUE INDEX agro_solution_bundles_pkey ON public.agro_solution_bundles USING btree (id);

CREATE UNIQUE INDEX approval_requests_pkey ON public.approval_requests USING btree (id);

CREATE UNIQUE INDEX bank_accounts_pkey ON public.bank_accounts USING btree (id);

CREATE UNIQUE INDEX bank_statement_imports_pkey ON public.bank_statement_imports USING btree (id);

CREATE UNIQUE INDEX bank_transaction_reviews_pkey ON public.bank_transaction_reviews USING btree (id);

CREATE UNIQUE INDEX bank_transactions_pkey ON public.bank_transactions USING btree (id);

CREATE UNIQUE INDEX crop_plans_pkey ON public.crop_plans USING btree (id);

CREATE UNIQUE INDEX customer_communication_logs_pkey ON public.customer_communication_logs USING btree (id);

CREATE UNIQUE INDEX customer_credit_note_items_pkey ON public.customer_credit_note_items USING btree (id);

CREATE UNIQUE INDEX customer_credit_notes_pkey ON public.customer_credit_notes USING btree (id);

CREATE UNIQUE INDEX customer_documents_pkey ON public.customer_documents USING btree (id);

CREATE UNIQUE INDEX customer_refunds_pkey ON public.customer_refunds USING btree (id);

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX depot_inventory_pkey ON public.depot_inventory USING btree (id);

CREATE UNIQUE INDEX depot_inventory_product_id_pack_size_id_depot_id_key ON public.depot_inventory USING btree (product_id, pack_size_id, depot_id);

CREATE UNIQUE INDEX farm_seasons_pkey ON public.farm_seasons USING btree (id);

CREATE INDEX idx_agro_advisory_rules_crop ON public.agro_advisory_rules USING btree (crop);

CREATE INDEX idx_agro_advisory_rules_region ON public.agro_advisory_rules USING btree (region_profile_id);

CREATE INDEX idx_agro_recommendation_items_rec ON public.agro_recommendation_items USING btree (recommendation_id);

CREATE INDEX idx_agro_recommendations_status ON public.agro_recommendations USING btree (status);

CREATE INDEX idx_agro_recommendations_user ON public.agro_recommendations USING btree (user_id);

CREATE INDEX idx_agro_solution_bundle_items_bundle ON public.agro_solution_bundle_items USING btree (bundle_id);

CREATE INDEX idx_approval_requests_ref ON public.approval_requests USING btree (reference_id);

CREATE INDEX idx_approval_requests_status ON public.approval_requests USING btree (approval_status);

CREATE INDEX idx_approval_requests_type ON public.approval_requests USING btree (request_type);

CREATE INDEX idx_bank_transaction_reviews_classification ON public.bank_transaction_reviews USING btree (classification);

CREATE INDEX idx_bank_transaction_reviews_date ON public.bank_transaction_reviews USING btree (transaction_date);

CREATE INDEX idx_bank_txn_account ON public.bank_transactions USING btree (bank_account_id);

CREATE INDEX idx_bank_txn_date ON public.bank_transactions USING btree (transaction_date);

CREATE INDEX idx_bank_txn_status ON public.bank_transactions USING btree (reconciliation_status);

CREATE INDEX idx_crop_plans_farm ON public.crop_plans USING btree (farm_id);

CREATE INDEX idx_crop_plans_field ON public.crop_plans USING btree (field_id);

CREATE INDEX idx_crop_plans_season ON public.crop_plans USING btree (season_id);

CREATE INDEX idx_customer_invoices_customer ON public.customer_invoices USING btree (customer_id);

CREATE INDEX idx_farms_customer ON public.farms USING btree (customer_id);

CREATE INDEX idx_gl_accounts_code ON public.gl_accounts USING btree (account_code);

CREATE INDEX idx_journal_entries_entry_date ON public.journal_entries USING btree (entry_date);

CREATE INDEX idx_journal_entries_reference ON public.journal_entries USING btree (reference_type, reference_id);

CREATE INDEX idx_journal_entries_status ON public.journal_entries USING btree (status);

CREATE INDEX idx_journal_entry_lines_gl_account ON public.journal_entry_lines USING btree (gl_account_id);

CREATE INDEX idx_journal_entry_lines_journal_entry ON public.journal_entry_lines USING btree (journal_entry_id);

CREATE INDEX idx_logistics_delivery_customer ON public.logistics_delivery_requests USING btree (customer_id);

CREATE INDEX idx_logistics_delivery_date ON public.logistics_delivery_requests USING btree (preferred_date);

CREATE INDEX idx_logistics_delivery_depot ON public.logistics_delivery_requests USING btree (origin_depot_id);

CREATE INDEX idx_logistics_delivery_order ON public.logistics_delivery_requests USING btree (order_id);

CREATE INDEX idx_logistics_delivery_status ON public.logistics_delivery_requests USING btree (status);

CREATE INDEX idx_logistics_items_request ON public.logistics_delivery_items USING btree (delivery_request_id);

CREATE INDEX idx_logistics_rate_cards_vehicle ON public.logistics_rate_cards USING btree (vehicle_type_id);

CREATE INDEX idx_logistics_status_log_request ON public.logistics_status_log USING btree (delivery_request_id);

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);

CREATE INDEX idx_payments_order ON public.payments USING btree (order_id);

CREATE INDEX idx_production_stages_plan ON public.production_stages USING btree (crop_plan_id);

CREATE INDEX idx_program_activities_plan ON public.program_activities USING btree (crop_plan_id);

CREATE INDEX idx_program_activities_stage ON public.program_activities USING btree (stage_id);

CREATE INDEX idx_stock_movements_depot ON public.stock_movements USING btree (depot_id);

CREATE INDEX idx_stock_movements_variant ON public.stock_movements USING btree (variant_id);

CREATE UNIQUE INDEX logistics_delivery_items_pkey ON public.logistics_delivery_items USING btree (id);

CREATE UNIQUE INDEX logistics_delivery_requests_pkey ON public.logistics_delivery_requests USING btree (id);

CREATE UNIQUE INDEX logistics_delivery_requests_request_number_key ON public.logistics_delivery_requests USING btree (request_number);

CREATE UNIQUE INDEX logistics_rate_cards_pkey ON public.logistics_rate_cards USING btree (id);

CREATE UNIQUE INDEX logistics_status_log_pkey ON public.logistics_status_log USING btree (id);

CREATE UNIQUE INDEX notification_channel_configs_channel_key ON public.notification_channel_configs USING btree (channel);

CREATE UNIQUE INDEX notification_channel_configs_pkey ON public.notification_channel_configs USING btree (id);

CREATE UNIQUE INDEX payment_gateway_transactions_pkey ON public.payment_gateway_transactions USING btree (id);

CREATE UNIQUE INDEX payment_requests_pkey ON public.payment_requests USING btree (id);

CREATE UNIQUE INDEX posting_rules_pkey ON public.posting_rules USING btree (id);

CREATE UNIQUE INDEX product_pack_sizes_name_key ON public.product_pack_sizes USING btree (name);

CREATE UNIQUE INDEX production_stages_pkey ON public.production_stages USING btree (id);

CREATE UNIQUE INDEX proforma_invoice_items_pkey ON public.proforma_invoice_items USING btree (id);

CREATE UNIQUE INDEX proforma_invoices_pkey ON public.proforma_invoices USING btree (id);

CREATE UNIQUE INDEX program_activities_pkey ON public.program_activities USING btree (id);

CREATE UNIQUE INDEX program_courses_pkey ON public.program_courses USING btree (id);

CREATE UNIQUE INDEX program_courses_program_id_course_id_key ON public.program_courses USING btree (program_id, course_id);

CREATE UNIQUE INDEX quote_items_pkey ON public.quote_items USING btree (id);

CREATE UNIQUE INDEX quotes_pkey ON public.quotes USING btree (id);

CREATE UNIQUE INDEX reminder_templates_pkey ON public.reminder_templates USING btree (id);

CREATE UNIQUE INDEX reminder_templates_template_code_key ON public.reminder_templates USING btree (template_code);

CREATE UNIQUE INDEX stock_count_items_pkey ON public.stock_count_items USING btree (id);

CREATE UNIQUE INDEX stock_counts_pkey ON public.stock_counts USING btree (id);

CREATE UNIQUE INDEX supplier_contacts_pkey ON public.supplier_contacts USING btree (id);

CREATE UNIQUE INDEX supplier_credit_note_items_pkey ON public.supplier_credit_note_items USING btree (id);

CREATE UNIQUE INDEX supplier_credit_notes_pkey ON public.supplier_credit_notes USING btree (id);

CREATE UNIQUE INDEX supplier_documents_pkey ON public.supplier_documents USING btree (id);

CREATE UNIQUE INDEX supplier_payments_pkey ON public.supplier_payments USING btree (id);

CREATE UNIQUE INDEX supplier_products_pkey ON public.supplier_products USING btree (id);

CREATE UNIQUE INDEX supplier_products_supplier_id_product_id_key ON public.supplier_products USING btree (supplier_id, product_id);

CREATE UNIQUE INDEX support_tickets_pkey ON public.support_tickets USING btree (id);

CREATE UNIQUE INDEX training_programs_pkey ON public.training_programs USING btree (id);

CREATE UNIQUE INDEX vat_codes_code_name_key ON public.vat_codes USING btree (code_name);

CREATE UNIQUE INDEX vat_codes_pkey ON public.vat_codes USING btree (id);

CREATE UNIQUE INDEX vat_periods_pkey ON public.vat_periods USING btree (id);

CREATE UNIQUE INDEX vehicle_types_pkey ON public.vehicle_types USING btree (id);

CREATE UNIQUE INDEX vehicle_types_vehicle_code_key ON public.vehicle_types USING btree (vehicle_code);

CREATE INDEX idx_knowledge_document_chunks_embedding ON public.knowledge_document_chunks USING ivfflat (embedding public.vector_cosine_ops) WITH (lists='100');

alter table "public"."accounting_periods" add constraint "accounting_periods_pkey" PRIMARY KEY using index "accounting_periods_pkey";

alter table "public"."advisory_services" add constraint "advisory_services_pkey" PRIMARY KEY using index "advisory_services_pkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_pkey" PRIMARY KEY using index "advisory_sessions_pkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_pkey" PRIMARY KEY using index "agro_advisory_rules_pkey";

alter table "public"."agro_farming_systems" add constraint "agro_farming_systems_pkey" PRIMARY KEY using index "agro_farming_systems_pkey";

alter table "public"."agro_recommendation_items" add constraint "agro_recommendation_items_pkey" PRIMARY KEY using index "agro_recommendation_items_pkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_pkey" PRIMARY KEY using index "agro_recommendations_pkey";

alter table "public"."agro_region_profiles" add constraint "agro_region_profiles_pkey" PRIMARY KEY using index "agro_region_profiles_pkey";

alter table "public"."agro_soil_profiles" add constraint "agro_soil_profiles_pkey" PRIMARY KEY using index "agro_soil_profiles_pkey";

alter table "public"."agro_solution_bundle_items" add constraint "agro_solution_bundle_items_pkey" PRIMARY KEY using index "agro_solution_bundle_items_pkey";

alter table "public"."agro_solution_bundles" add constraint "agro_solution_bundles_pkey" PRIMARY KEY using index "agro_solution_bundles_pkey";

alter table "public"."approval_requests" add constraint "approval_requests_pkey" PRIMARY KEY using index "approval_requests_pkey";

alter table "public"."bank_accounts" add constraint "bank_accounts_pkey" PRIMARY KEY using index "bank_accounts_pkey";

alter table "public"."bank_statement_imports" add constraint "bank_statement_imports_pkey" PRIMARY KEY using index "bank_statement_imports_pkey";

alter table "public"."bank_transaction_reviews" add constraint "bank_transaction_reviews_pkey" PRIMARY KEY using index "bank_transaction_reviews_pkey";

alter table "public"."bank_transactions" add constraint "bank_transactions_pkey" PRIMARY KEY using index "bank_transactions_pkey";

alter table "public"."crop_plans" add constraint "crop_plans_pkey" PRIMARY KEY using index "crop_plans_pkey";

alter table "public"."customer_communication_logs" add constraint "customer_communication_logs_pkey" PRIMARY KEY using index "customer_communication_logs_pkey";

alter table "public"."customer_credit_note_items" add constraint "customer_credit_note_items_pkey" PRIMARY KEY using index "customer_credit_note_items_pkey";

alter table "public"."customer_credit_notes" add constraint "customer_credit_notes_pkey" PRIMARY KEY using index "customer_credit_notes_pkey";

alter table "public"."customer_documents" add constraint "customer_documents_pkey" PRIMARY KEY using index "customer_documents_pkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_pkey" PRIMARY KEY using index "customer_refunds_pkey";

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_pkey" PRIMARY KEY using index "depot_inventory_pkey";

alter table "public"."farm_seasons" add constraint "farm_seasons_pkey" PRIMARY KEY using index "farm_seasons_pkey";

alter table "public"."logistics_delivery_items" add constraint "logistics_delivery_items_pkey" PRIMARY KEY using index "logistics_delivery_items_pkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_pkey" PRIMARY KEY using index "logistics_delivery_requests_pkey";

alter table "public"."logistics_rate_cards" add constraint "logistics_rate_cards_pkey" PRIMARY KEY using index "logistics_rate_cards_pkey";

alter table "public"."logistics_status_log" add constraint "logistics_status_log_pkey" PRIMARY KEY using index "logistics_status_log_pkey";

alter table "public"."notification_channel_configs" add constraint "notification_channel_configs_pkey" PRIMARY KEY using index "notification_channel_configs_pkey";

alter table "public"."payment_gateway_transactions" add constraint "payment_gateway_transactions_pkey" PRIMARY KEY using index "payment_gateway_transactions_pkey";

alter table "public"."payment_requests" add constraint "payment_requests_pkey" PRIMARY KEY using index "payment_requests_pkey";

alter table "public"."posting_rules" add constraint "posting_rules_pkey" PRIMARY KEY using index "posting_rules_pkey";

alter table "public"."production_stages" add constraint "production_stages_pkey" PRIMARY KEY using index "production_stages_pkey";

alter table "public"."proforma_invoice_items" add constraint "proforma_invoice_items_pkey" PRIMARY KEY using index "proforma_invoice_items_pkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_pkey" PRIMARY KEY using index "proforma_invoices_pkey";

alter table "public"."program_activities" add constraint "program_activities_pkey" PRIMARY KEY using index "program_activities_pkey";

alter table "public"."program_courses" add constraint "program_courses_pkey" PRIMARY KEY using index "program_courses_pkey";

alter table "public"."quote_items" add constraint "quote_items_pkey" PRIMARY KEY using index "quote_items_pkey";

alter table "public"."quotes" add constraint "quotes_pkey" PRIMARY KEY using index "quotes_pkey";

alter table "public"."reminder_templates" add constraint "reminder_templates_pkey" PRIMARY KEY using index "reminder_templates_pkey";

alter table "public"."stock_count_items" add constraint "stock_count_items_pkey" PRIMARY KEY using index "stock_count_items_pkey";

alter table "public"."stock_counts" add constraint "stock_counts_pkey" PRIMARY KEY using index "stock_counts_pkey";

alter table "public"."supplier_contacts" add constraint "supplier_contacts_pkey" PRIMARY KEY using index "supplier_contacts_pkey";

alter table "public"."supplier_credit_note_items" add constraint "supplier_credit_note_items_pkey" PRIMARY KEY using index "supplier_credit_note_items_pkey";

alter table "public"."supplier_credit_notes" add constraint "supplier_credit_notes_pkey" PRIMARY KEY using index "supplier_credit_notes_pkey";

alter table "public"."supplier_documents" add constraint "supplier_documents_pkey" PRIMARY KEY using index "supplier_documents_pkey";

alter table "public"."supplier_payments" add constraint "supplier_payments_pkey" PRIMARY KEY using index "supplier_payments_pkey";

alter table "public"."supplier_products" add constraint "supplier_products_pkey" PRIMARY KEY using index "supplier_products_pkey";

alter table "public"."support_tickets" add constraint "support_tickets_pkey" PRIMARY KEY using index "support_tickets_pkey";

alter table "public"."training_programs" add constraint "training_programs_pkey" PRIMARY KEY using index "training_programs_pkey";

alter table "public"."vat_codes" add constraint "vat_codes_pkey" PRIMARY KEY using index "vat_codes_pkey";

alter table "public"."vat_periods" add constraint "vat_periods_pkey" PRIMARY KEY using index "vat_periods_pkey";

alter table "public"."vehicle_types" add constraint "vehicle_types_pkey" PRIMARY KEY using index "vehicle_types_pkey";

alter table "public"."accounting_periods" add constraint "accounting_periods_closed_by_fkey" FOREIGN KEY (closed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."accounting_periods" validate constraint "accounting_periods_closed_by_fkey";

alter table "public"."accounting_periods" add constraint "accounting_periods_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'closed'::text, 'locked'::text]))) not valid;

alter table "public"."accounting_periods" validate constraint "accounting_periods_status_check";

alter table "public"."advisory_services" add constraint "advisory_services_pricing_model_check" CHECK ((pricing_model = ANY (ARRAY['per_session'::text, 'subscription'::text, 'free'::text]))) not valid;

alter table "public"."advisory_services" validate constraint "advisory_services_pricing_model_check";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_advisor_id_fkey" FOREIGN KEY (advisor_id) REFERENCES public.profiles(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_advisor_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_customer_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_farm_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_linked_crop_plan_id_fkey" FOREIGN KEY (linked_crop_plan_id) REFERENCES public.crop_plans(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_linked_crop_plan_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_linked_recommendation_id_fkey" FOREIGN KEY (linked_recommendation_id) REFERENCES public.agro_recommendations(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_linked_recommendation_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.advisory_services(id) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_service_id_fkey";

alter table "public"."advisory_sessions" add constraint "advisory_sessions_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."advisory_sessions" validate constraint "advisory_sessions_status_check";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_created_by_fkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_farming_system_id_fkey" FOREIGN KEY (farming_system_id) REFERENCES public.agro_farming_systems(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_farming_system_id_fkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_product_id_fkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_region_profile_id_fkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_soil_profile_id_fkey" FOREIGN KEY (soil_profile_id) REFERENCES public.agro_soil_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_soil_profile_id_fkey";

alter table "public"."agro_advisory_rules" add constraint "agro_advisory_rules_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."agro_advisory_rules" validate constraint "agro_advisory_rules_variant_id_fkey";

alter table "public"."agro_farming_systems" add constraint "agro_farming_systems_system_code_key" UNIQUE using index "agro_farming_systems_system_code_key";

alter table "public"."agro_recommendation_items" add constraint "agro_recommendation_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendation_items" validate constraint "agro_recommendation_items_pack_size_id_fkey";

alter table "public"."agro_recommendation_items" add constraint "agro_recommendation_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendation_items" validate constraint "agro_recommendation_items_product_id_fkey";

alter table "public"."agro_recommendation_items" add constraint "agro_recommendation_items_recommendation_id_fkey" FOREIGN KEY (recommendation_id) REFERENCES public.agro_recommendations(id) ON DELETE CASCADE not valid;

alter table "public"."agro_recommendation_items" validate constraint "agro_recommendation_items_recommendation_id_fkey";

alter table "public"."agro_recommendation_items" add constraint "agro_recommendation_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendation_items" validate constraint "agro_recommendation_items_variant_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_customer_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_farm_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_farming_system_id_fkey" FOREIGN KEY (farming_system_id) REFERENCES public.agro_farming_systems(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_farming_system_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_region_profile_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_soil_profile_id_fkey" FOREIGN KEY (soil_profile_id) REFERENCES public.agro_soil_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_soil_profile_id_fkey";

alter table "public"."agro_recommendations" add constraint "agro_recommendations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."agro_recommendations" validate constraint "agro_recommendations_user_id_fkey";

alter table "public"."agro_solution_bundle_items" add constraint "agro_solution_bundle_items_bundle_id_fkey" FOREIGN KEY (bundle_id) REFERENCES public.agro_solution_bundles(id) ON DELETE CASCADE not valid;

alter table "public"."agro_solution_bundle_items" validate constraint "agro_solution_bundle_items_bundle_id_fkey";

alter table "public"."agro_solution_bundle_items" add constraint "agro_solution_bundle_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."agro_solution_bundle_items" validate constraint "agro_solution_bundle_items_product_id_fkey";

alter table "public"."agro_solution_bundle_items" add constraint "agro_solution_bundle_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."agro_solution_bundle_items" validate constraint "agro_solution_bundle_items_variant_id_fkey";

alter table "public"."agro_solution_bundles" add constraint "agro_solution_bundles_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agro_solution_bundles" validate constraint "agro_solution_bundles_created_by_fkey";

alter table "public"."approval_requests" add constraint "approval_requests_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."approval_requests" validate constraint "approval_requests_approved_by_fkey";

alter table "public"."approval_requests" add constraint "approval_requests_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES public.profiles(id) not valid;

alter table "public"."approval_requests" validate constraint "approval_requests_requested_by_fkey";

alter table "public"."bank_accounts" add constraint "bank_accounts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."bank_accounts" validate constraint "bank_accounts_created_by_fkey";

alter table "public"."bank_statement_imports" add constraint "bank_statement_imports_bank_account_id_fkey" FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) not valid;

alter table "public"."bank_statement_imports" validate constraint "bank_statement_imports_bank_account_id_fkey";

alter table "public"."bank_statement_imports" add constraint "bank_statement_imports_imported_by_fkey" FOREIGN KEY (imported_by) REFERENCES public.profiles(id) not valid;

alter table "public"."bank_statement_imports" validate constraint "bank_statement_imports_imported_by_fkey";

alter table "public"."bank_transaction_reviews" add constraint "bank_transaction_reviews_bank_transaction_id_fkey" FOREIGN KEY (bank_transaction_id) REFERENCES public.bank_transactions(id) ON DELETE CASCADE not valid;

alter table "public"."bank_transaction_reviews" validate constraint "bank_transaction_reviews_bank_transaction_id_fkey";

alter table "public"."bank_transaction_reviews" add constraint "bank_transaction_reviews_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."bank_transaction_reviews" validate constraint "bank_transaction_reviews_depot_id_fkey";

alter table "public"."bank_transaction_reviews" add constraint "bank_transaction_reviews_gl_account_id_fkey" FOREIGN KEY (gl_account_id) REFERENCES public.gl_accounts(id) not valid;

alter table "public"."bank_transaction_reviews" validate constraint "bank_transaction_reviews_gl_account_id_fkey";

alter table "public"."bank_transaction_reviews" add constraint "bank_transaction_reviews_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."bank_transaction_reviews" validate constraint "bank_transaction_reviews_reviewed_by_fkey";

alter table "public"."bank_transactions" add constraint "bank_transactions_bank_account_id_fkey" FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."bank_transactions" validate constraint "bank_transactions_bank_account_id_fkey";

alter table "public"."bank_transactions" add constraint "bank_transactions_matched_by_fkey" FOREIGN KEY (matched_by) REFERENCES public.profiles(id) not valid;

alter table "public"."bank_transactions" validate constraint "bank_transactions_matched_by_fkey";

alter table "public"."bank_transactions" add constraint "bank_transactions_statement_import_fk" FOREIGN KEY (statement_import_id) REFERENCES public.bank_statement_imports(id) not valid;

alter table "public"."bank_transactions" validate constraint "bank_transactions_statement_import_fk";

alter table "public"."crop_plans" add constraint "crop_plans_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_created_by_fkey";

alter table "public"."crop_plans" add constraint "crop_plans_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_farm_id_fkey";

alter table "public"."crop_plans" add constraint "crop_plans_farming_system_id_fkey" FOREIGN KEY (farming_system_id) REFERENCES public.agro_farming_systems(id) not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_farming_system_id_fkey";

alter table "public"."crop_plans" add constraint "crop_plans_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_field_id_fkey";

alter table "public"."crop_plans" add constraint "crop_plans_recommendation_id_fkey" FOREIGN KEY (recommendation_id) REFERENCES public.agro_recommendations(id) not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_recommendation_id_fkey";

alter table "public"."crop_plans" add constraint "crop_plans_season_id_fkey" FOREIGN KEY (season_id) REFERENCES public.farm_seasons(id) not valid;

alter table "public"."crop_plans" validate constraint "crop_plans_season_id_fkey";

alter table "public"."customer_communication_logs" add constraint "customer_communication_logs_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE not valid;

alter table "public"."customer_communication_logs" validate constraint "customer_communication_logs_customer_id_fkey";

alter table "public"."customer_communication_logs" add constraint "customer_communication_logs_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_communication_logs" validate constraint "customer_communication_logs_performed_by_fkey";

alter table "public"."customer_credit_note_items" add constraint "customer_credit_note_items_credit_note_id_fkey" FOREIGN KEY (credit_note_id) REFERENCES public.customer_credit_notes(id) ON DELETE CASCADE not valid;

alter table "public"."customer_credit_note_items" validate constraint "customer_credit_note_items_credit_note_id_fkey";

alter table "public"."customer_credit_notes" add constraint "customer_credit_notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_credit_notes" validate constraint "customer_credit_notes_created_by_fkey";

alter table "public"."customer_credit_notes" add constraint "customer_credit_notes_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL not valid;

alter table "public"."customer_credit_notes" validate constraint "customer_credit_notes_customer_id_fkey";

alter table "public"."customer_credit_notes" add constraint "customer_credit_notes_invoice_id_fkey" FOREIGN KEY (invoice_id) REFERENCES public.customer_invoices(id) ON DELETE SET NULL not valid;

alter table "public"."customer_credit_notes" validate constraint "customer_credit_notes_invoice_id_fkey";

alter table "public"."customer_documents" add constraint "customer_documents_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE not valid;

alter table "public"."customer_documents" validate constraint "customer_documents_customer_id_fkey";

alter table "public"."customer_documents" add constraint "customer_documents_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) not valid;

alter table "public"."customer_documents" validate constraint "customer_documents_uploaded_by_fkey";

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_product_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_sales_rep_id_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_created_by_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_credit_note_id_fkey" FOREIGN KEY (credit_note_id) REFERENCES public.customer_credit_notes(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_credit_note_id_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_customer_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_depot_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_pack_size_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_product_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_product_id_pack_size_id_depot_id_key" UNIQUE using index "depot_inventory_product_id_pack_size_id_depot_id_key";

alter table "public"."depot_inventory" add constraint "depot_inventory_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_variant_id_fkey";

alter table "public"."farm_seasons" add constraint "farm_seasons_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."farm_seasons" validate constraint "farm_seasons_created_by_fkey";

alter table "public"."farms" add constraint "farms_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."farms" validate constraint "farms_customer_id_fkey";

alter table "public"."farms" add constraint "farms_farming_system_id_fkey" FOREIGN KEY (farming_system_id) REFERENCES public.agro_farming_systems(id) not valid;

alter table "public"."farms" validate constraint "farms_farming_system_id_fkey";

alter table "public"."farms" add constraint "farms_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) not valid;

alter table "public"."farms" validate constraint "farms_region_profile_id_fkey";

alter table "public"."fields" add constraint "fields_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) not valid;

alter table "public"."fields" validate constraint "fields_region_profile_id_fkey";

alter table "public"."fields" add constraint "fields_soil_profile_id_fkey" FOREIGN KEY (soil_profile_id) REFERENCES public.agro_soil_profiles(id) not valid;

alter table "public"."fields" validate constraint "fields_soil_profile_id_fkey";

alter table "public"."gl_accounts" add constraint "gl_accounts_parent_account_id_fkey" FOREIGN KEY (parent_account_id) REFERENCES public.gl_accounts(id) not valid;

alter table "public"."gl_accounts" validate constraint "gl_accounts_parent_account_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_pack_size_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_product_id_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_approved_by_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_period_id_fkey" FOREIGN KEY (period_id) REFERENCES public.accounting_periods(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_period_id_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_reversed_by_id_fkey" FOREIGN KEY (reversed_by_id) REFERENCES public.journal_entries(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_reversed_by_id_fkey";

alter table "public"."logistics_delivery_items" add constraint "logistics_delivery_items_delivery_request_id_fkey" FOREIGN KEY (delivery_request_id) REFERENCES public.logistics_delivery_requests(id) ON DELETE CASCADE not valid;

alter table "public"."logistics_delivery_items" validate constraint "logistics_delivery_items_delivery_request_id_fkey";

alter table "public"."logistics_delivery_items" add constraint "logistics_delivery_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."logistics_delivery_items" validate constraint "logistics_delivery_items_pack_size_id_fkey";

alter table "public"."logistics_delivery_items" add constraint "logistics_delivery_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."logistics_delivery_items" validate constraint "logistics_delivery_items_product_id_fkey";

alter table "public"."logistics_delivery_items" add constraint "logistics_delivery_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) not valid;

alter table "public"."logistics_delivery_items" validate constraint "logistics_delivery_items_variant_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_created_by_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_crop_plan_id_fkey" FOREIGN KEY (crop_plan_id) REFERENCES public.crop_plans(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_crop_plan_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_customer_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_farm_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_order_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_origin_depot_id_fkey" FOREIGN KEY (origin_depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_origin_depot_id_fkey";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_priority_check" CHECK ((priority = ANY (ARRAY['urgent'::text, 'normal'::text, 'scheduled'::text]))) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_priority_check";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_request_number_key" UNIQUE using index "logistics_delivery_requests_request_number_key";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'planning'::text, 'dispatched'::text, 'vehicle_assigned'::text, 'in_transit'::text, 'delivered'::text, 'delivery_failed'::text, 'cancelled'::text]))) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_status_check";

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_vehicle_type_id_fkey" FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_vehicle_type_id_fkey";

alter table "public"."logistics_rate_cards" add constraint "logistics_rate_cards_vehicle_type_id_fkey" FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id) not valid;

alter table "public"."logistics_rate_cards" validate constraint "logistics_rate_cards_vehicle_type_id_fkey";

alter table "public"."logistics_status_log" add constraint "logistics_status_log_delivery_request_id_fkey" FOREIGN KEY (delivery_request_id) REFERENCES public.logistics_delivery_requests(id) ON DELETE CASCADE not valid;

alter table "public"."logistics_status_log" validate constraint "logistics_status_log_delivery_request_id_fkey";

alter table "public"."logistics_status_log" add constraint "logistics_status_log_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) not valid;

alter table "public"."logistics_status_log" validate constraint "logistics_status_log_recorded_by_fkey";

alter table "public"."notification_channel_configs" add constraint "notification_channel_configs_auth_status_check" CHECK ((auth_status = ANY (ARRAY['not_configured'::text, 'configured'::text, 'verified'::text, 'error'::text]))) not valid;

alter table "public"."notification_channel_configs" validate constraint "notification_channel_configs_auth_status_check";

alter table "public"."notification_channel_configs" add constraint "notification_channel_configs_channel_check" CHECK ((channel = ANY (ARRAY['email'::text, 'sms'::text, 'whatsapp'::text, 'in_app'::text, 'push'::text]))) not valid;

alter table "public"."notification_channel_configs" validate constraint "notification_channel_configs_channel_check";

alter table "public"."notification_channel_configs" add constraint "notification_channel_configs_channel_key" UNIQUE using index "notification_channel_configs_channel_key";

alter table "public"."notification_templates" add constraint "notification_templates_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."notification_templates" validate constraint "notification_templates_created_by_fkey";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."orders" validate constraint "orders_depot_id_fkey";

alter table "public"."orders" add constraint "orders_quote_id_fkey" FOREIGN KEY (quote_id) REFERENCES public.quotes(id) not valid;

alter table "public"."orders" validate constraint "orders_quote_id_fkey";

alter table "public"."orders" add constraint "orders_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_sales_rep_id_fkey";

alter table "public"."payment_gateway_transactions" add constraint "payment_gateway_transactions_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) not valid;

alter table "public"."payment_gateway_transactions" validate constraint "payment_gateway_transactions_payment_id_fkey";

alter table "public"."payment_gateway_transactions" add constraint "payment_gateway_transactions_payment_request_id_fkey" FOREIGN KEY (payment_request_id) REFERENCES public.payment_requests(id) not valid;

alter table "public"."payment_gateway_transactions" validate constraint "payment_gateway_transactions_payment_request_id_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_created_by_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_customer_id_fkey";

alter table "public"."product_pack_sizes" add constraint "product_pack_sizes_name_key" UNIQUE using index "product_pack_sizes_name_key";

alter table "public"."product_variants" add constraint "product_variants_variant_status_check" CHECK ((variant_status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text, 'archived'::text]))) not valid;

alter table "public"."product_variants" validate constraint "product_variants_variant_status_check";

alter table "public"."production_stages" add constraint "production_stages_crop_plan_id_fkey" FOREIGN KEY (crop_plan_id) REFERENCES public.crop_plans(id) ON DELETE CASCADE not valid;

alter table "public"."production_stages" validate constraint "production_stages_crop_plan_id_fkey";

alter table "public"."proforma_invoice_items" add constraint "proforma_invoice_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."proforma_invoice_items" validate constraint "proforma_invoice_items_pack_size_id_fkey";

alter table "public"."proforma_invoice_items" add constraint "proforma_invoice_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."proforma_invoice_items" validate constraint "proforma_invoice_items_product_id_fkey";

alter table "public"."proforma_invoice_items" add constraint "proforma_invoice_items_proforma_invoice_id_fkey" FOREIGN KEY (proforma_invoice_id) REFERENCES public.proforma_invoices(id) ON DELETE CASCADE not valid;

alter table "public"."proforma_invoice_items" validate constraint "proforma_invoice_items_proforma_invoice_id_fkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_converted_order_id_fkey" FOREIGN KEY (converted_order_id) REFERENCES public.orders(id) not valid;

alter table "public"."proforma_invoices" validate constraint "proforma_invoices_converted_order_id_fkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."proforma_invoices" validate constraint "proforma_invoices_created_by_fkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."proforma_invoices" validate constraint "proforma_invoices_customer_id_fkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_quote_id_fkey" FOREIGN KEY (quote_id) REFERENCES public.quotes(id) not valid;

alter table "public"."proforma_invoices" validate constraint "proforma_invoices_quote_id_fkey";

alter table "public"."proforma_invoices" add constraint "proforma_invoices_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."proforma_invoices" validate constraint "proforma_invoices_sales_rep_id_fkey";

alter table "public"."program_activities" add constraint "program_activities_crop_plan_id_fkey" FOREIGN KEY (crop_plan_id) REFERENCES public.crop_plans(id) ON DELETE CASCADE not valid;

alter table "public"."program_activities" validate constraint "program_activities_crop_plan_id_fkey";

alter table "public"."program_activities" add constraint "program_activities_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."program_activities" validate constraint "program_activities_pack_size_id_fkey";

alter table "public"."program_activities" add constraint "program_activities_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."program_activities" validate constraint "program_activities_product_id_fkey";

alter table "public"."program_activities" add constraint "program_activities_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES public.production_stages(id) ON DELETE SET NULL not valid;

alter table "public"."program_activities" validate constraint "program_activities_stage_id_fkey";

alter table "public"."program_activities" add constraint "program_activities_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) not valid;

alter table "public"."program_activities" validate constraint "program_activities_variant_id_fkey";

alter table "public"."program_courses" add constraint "program_courses_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE not valid;

alter table "public"."program_courses" validate constraint "program_courses_course_id_fkey";

alter table "public"."program_courses" add constraint "program_courses_program_id_course_id_key" UNIQUE using index "program_courses_program_id_course_id_key";

alter table "public"."program_courses" add constraint "program_courses_program_id_fkey" FOREIGN KEY (program_id) REFERENCES public.training_programs(id) ON DELETE CASCADE not valid;

alter table "public"."program_courses" validate constraint "program_courses_program_id_fkey";

alter table "public"."purchase_order_items" add constraint "purchase_order_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."purchase_order_items" validate constraint "purchase_order_items_pack_size_id_fkey";

alter table "public"."purchase_order_items" add constraint "purchase_order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."purchase_order_items" validate constraint "purchase_order_items_product_id_fkey";

alter table "public"."quote_items" add constraint "quote_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."quote_items" validate constraint "quote_items_pack_size_id_fkey";

alter table "public"."quote_items" add constraint "quote_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."quote_items" validate constraint "quote_items_product_id_fkey";

alter table "public"."quote_items" add constraint "quote_items_quote_id_fkey" FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE not valid;

alter table "public"."quote_items" validate constraint "quote_items_quote_id_fkey";

alter table "public"."quotes" add constraint "quotes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."quotes" validate constraint "quotes_created_by_fkey";

alter table "public"."quotes" add constraint "quotes_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."quotes" validate constraint "quotes_customer_id_fkey";

alter table "public"."quotes" add constraint "quotes_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."quotes" validate constraint "quotes_sales_rep_id_fkey";

alter table "public"."reminder_templates" add constraint "reminder_templates_template_code_key" UNIQUE using index "reminder_templates_template_code_key";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_pack_size_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_product_id_fkey";

alter table "public"."stock_adjustments" add constraint "stock_adjustments_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."stock_adjustments" validate constraint "stock_adjustments_approved_by_fkey";

alter table "public"."stock_count_items" add constraint "stock_count_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_count_items" validate constraint "stock_count_items_pack_size_id_fkey";

alter table "public"."stock_count_items" add constraint "stock_count_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_count_items" validate constraint "stock_count_items_product_id_fkey";

alter table "public"."stock_count_items" add constraint "stock_count_items_stock_count_id_fkey" FOREIGN KEY (stock_count_id) REFERENCES public.stock_counts(id) ON DELETE CASCADE not valid;

alter table "public"."stock_count_items" validate constraint "stock_count_items_stock_count_id_fkey";

alter table "public"."stock_counts" add constraint "stock_counts_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."stock_counts" validate constraint "stock_counts_approved_by_fkey";

alter table "public"."stock_counts" add constraint "stock_counts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."stock_counts" validate constraint "stock_counts_created_by_fkey";

alter table "public"."stock_counts" add constraint "stock_counts_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."stock_counts" validate constraint "stock_counts_depot_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_destination_depot_id_fkey" FOREIGN KEY (destination_depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_destination_depot_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_pack_size_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_product_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_source_depot_id_fkey" FOREIGN KEY (source_depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_source_depot_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_pack_size_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_product_id_fkey";

alter table "public"."supplier_contacts" add constraint "supplier_contacts_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_contacts" validate constraint "supplier_contacts_supplier_id_fkey";

alter table "public"."supplier_credit_note_items" add constraint "supplier_credit_note_items_credit_note_id_fkey" FOREIGN KEY (credit_note_id) REFERENCES public.supplier_credit_notes(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_credit_note_items" validate constraint "supplier_credit_note_items_credit_note_id_fkey";

alter table "public"."supplier_credit_notes" add constraint "supplier_credit_notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."supplier_credit_notes" validate constraint "supplier_credit_notes_created_by_fkey";

alter table "public"."supplier_credit_notes" add constraint "supplier_credit_notes_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_credit_notes" validate constraint "supplier_credit_notes_supplier_id_fkey";

alter table "public"."supplier_credit_notes" add constraint "supplier_credit_notes_supplier_invoice_id_fkey" FOREIGN KEY (supplier_invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_credit_notes" validate constraint "supplier_credit_notes_supplier_invoice_id_fkey";

alter table "public"."supplier_documents" add constraint "supplier_documents_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_documents" validate constraint "supplier_documents_supplier_id_fkey";

alter table "public"."supplier_documents" add constraint "supplier_documents_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) not valid;

alter table "public"."supplier_documents" validate constraint "supplier_documents_uploaded_by_fkey";

alter table "public"."supplier_invoices" add constraint "supplier_invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_created_by_fkey";

alter table "public"."supplier_payments" add constraint "supplier_payments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."supplier_payments" validate constraint "supplier_payments_created_by_fkey";

alter table "public"."supplier_payments" add constraint "supplier_payments_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_payments" validate constraint "supplier_payments_supplier_id_fkey";

alter table "public"."supplier_payments" add constraint "supplier_payments_supplier_invoice_id_fkey" FOREIGN KEY (supplier_invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_payments" validate constraint "supplier_payments_supplier_invoice_id_fkey";

alter table "public"."supplier_products" add constraint "supplier_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_products" validate constraint "supplier_products_product_id_fkey";

alter table "public"."supplier_products" add constraint "supplier_products_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_products" validate constraint "supplier_products_supplier_id_fkey";

alter table "public"."supplier_products" add constraint "supplier_products_supplier_id_product_id_key" UNIQUE using index "supplier_products_supplier_id_product_id_key";

alter table "public"."support_tickets" add constraint "support_tickets_assigned_advisor_id_fkey" FOREIGN KEY (assigned_advisor_id) REFERENCES public.profiles(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_assigned_advisor_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_customer_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text]))) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_priority_check";

alter table "public"."support_tickets" add constraint "support_tickets_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'waiting'::text, 'resolved'::text, 'closed'::text]))) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_status_check";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."training_programs" add constraint "training_programs_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."training_programs" validate constraint "training_programs_created_by_fkey";

alter table "public"."training_programs" add constraint "training_programs_enrollment_type_check" CHECK ((enrollment_type = ANY (ARRAY['individual'::text, 'group'::text, 'cohort'::text]))) not valid;

alter table "public"."training_programs" validate constraint "training_programs_enrollment_type_check";

alter table "public"."training_programs" add constraint "training_programs_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'completed'::text, 'archived'::text]))) not valid;

alter table "public"."training_programs" validate constraint "training_programs_status_check";

alter table "public"."vat_codes" add constraint "vat_codes_code_name_key" UNIQUE using index "vat_codes_code_name_key";

alter table "public"."vat_codes" add constraint "vat_codes_gl_account_id_fkey" FOREIGN KEY (gl_account_id) REFERENCES public.gl_accounts(id) not valid;

alter table "public"."vat_codes" validate constraint "vat_codes_gl_account_id_fkey";

alter table "public"."vat_codes" add constraint "vat_codes_vat_direction_check" CHECK ((vat_direction = ANY (ARRAY['input'::text, 'output'::text, 'both'::text]))) not valid;

alter table "public"."vat_codes" validate constraint "vat_codes_vat_direction_check";

alter table "public"."vat_periods" add constraint "vat_periods_status_check" CHECK ((status = ANY (ARRAY['open'::text, 'closed'::text, 'submitted'::text]))) not valid;

alter table "public"."vat_periods" validate constraint "vat_periods_status_check";

alter table "public"."vat_periods" add constraint "vat_periods_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) not valid;

alter table "public"."vat_periods" validate constraint "vat_periods_submitted_by_fkey";

alter table "public"."vehicle_types" add constraint "vehicle_types_vehicle_code_key" UNIQUE using index "vehicle_types_vehicle_code_key";

alter table "public"."abandoned_cart_followups" add constraint "abandoned_cart_followups_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE not valid;

alter table "public"."abandoned_cart_followups" validate constraint "abandoned_cart_followups_cart_id_fkey";

alter table "public"."addresses" add constraint "addresses_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "addresses_organization_id_fkey";

alter table "public"."addresses" add constraint "addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."addresses" validate constraint "addresses_user_id_fkey";

alter table "public"."advisor_conversations" add constraint "advisor_conversations_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_conversations" validate constraint "advisor_conversations_advisor_profile_id_fkey";

alter table "public"."advisor_conversations" add constraint "advisor_conversations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_conversations" validate constraint "advisor_conversations_user_id_fkey";

alter table "public"."advisor_escalation_rules" add constraint "advisor_escalation_rules_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_escalation_rules" validate constraint "advisor_escalation_rules_advisor_profile_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_advisor_profile_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.advisor_conversations(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_conversation_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.advisor_messages(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_message_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_model_id_fkey" FOREIGN KEY (model_id) REFERENCES public.ai_models(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_model_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.ai_providers(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_provider_id_fkey";

alter table "public"."advisor_execution_runs" add constraint "advisor_execution_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_execution_runs" validate constraint "advisor_execution_runs_user_id_fkey";

alter table "public"."advisor_feedback" add constraint "advisor_feedback_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.advisor_messages(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_feedback" validate constraint "advisor_feedback_message_id_fkey";

alter table "public"."advisor_feedback" add constraint "advisor_feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_feedback" validate constraint "advisor_feedback_user_id_fkey";

alter table "public"."advisor_message_sources" add constraint "advisor_message_sources_chunk_id_fkey" FOREIGN KEY (chunk_id) REFERENCES public.knowledge_document_chunks(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_message_sources" validate constraint "advisor_message_sources_chunk_id_fkey";

alter table "public"."advisor_message_sources" add constraint "advisor_message_sources_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_message_sources" validate constraint "advisor_message_sources_document_id_fkey";

alter table "public"."advisor_message_sources" add constraint "advisor_message_sources_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.advisor_messages(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_message_sources" validate constraint "advisor_message_sources_message_id_fkey";

alter table "public"."advisor_messages" add constraint "advisor_messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.advisor_conversations(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_messages" validate constraint "advisor_messages_conversation_id_fkey";

alter table "public"."advisor_profile_guardrails" add constraint "advisor_profile_guardrails_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_profile_guardrails" validate constraint "advisor_profile_guardrails_advisor_profile_id_fkey";

alter table "public"."advisor_profile_guardrails" add constraint "advisor_profile_guardrails_guardrail_id_fkey" FOREIGN KEY (guardrail_id) REFERENCES public.advisor_guardrails(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_profile_guardrails" validate constraint "advisor_profile_guardrails_guardrail_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_advisor_profile_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_embedding_model_id_fkey" FOREIGN KEY (embedding_model_id) REFERENCES public.ai_models(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_embedding_model_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_fallback_prompt_template_id_fkey" FOREIGN KEY (fallback_prompt_template_id) REFERENCES public.advisor_prompt_templates(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_fallback_prompt_template_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_primary_model_id_fkey" FOREIGN KEY (primary_model_id) REFERENCES public.ai_models(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_primary_model_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.ai_providers(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_provider_id_fkey";

alter table "public"."advisor_profile_model_configs" add constraint "advisor_profile_model_configs_system_prompt_template_id_fkey" FOREIGN KEY (system_prompt_template_id) REFERENCES public.advisor_prompt_templates(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_profile_model_configs" validate constraint "advisor_profile_model_configs_system_prompt_template_id_fkey";

alter table "public"."advisor_profile_tools" add constraint "advisor_profile_tools_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_profile_tools" validate constraint "advisor_profile_tools_advisor_profile_id_fkey";

alter table "public"."advisor_profile_tools" add constraint "advisor_profile_tools_tool_id_fkey" FOREIGN KEY (tool_id) REFERENCES public.advisor_tools(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_profile_tools" validate constraint "advisor_profile_tools_tool_id_fkey";

alter table "public"."advisor_prompt_templates" add constraint "advisor_prompt_templates_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_prompt_templates" validate constraint "advisor_prompt_templates_created_by_fkey";

alter table "public"."advisor_query_logs" add constraint "advisor_query_logs_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_query_logs" validate constraint "advisor_query_logs_advisor_profile_id_fkey";

alter table "public"."advisor_query_logs" add constraint "advisor_query_logs_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.advisor_conversations(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_query_logs" validate constraint "advisor_query_logs_conversation_id_fkey";

alter table "public"."advisor_query_logs" add constraint "advisor_query_logs_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.advisor_messages(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_query_logs" validate constraint "advisor_query_logs_message_id_fkey";

alter table "public"."advisor_query_logs" add constraint "advisor_query_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_query_logs" validate constraint "advisor_query_logs_user_id_fkey";

alter table "public"."advisor_retrieval_logs" add constraint "advisor_retrieval_logs_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_logs" validate constraint "advisor_retrieval_logs_advisor_profile_id_fkey";

alter table "public"."advisor_retrieval_logs" add constraint "advisor_retrieval_logs_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public.advisor_conversations(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_logs" validate constraint "advisor_retrieval_logs_conversation_id_fkey";

alter table "public"."advisor_retrieval_logs" add constraint "advisor_retrieval_logs_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.advisor_messages(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_logs" validate constraint "advisor_retrieval_logs_message_id_fkey";

alter table "public"."advisor_retrieval_logs" add constraint "advisor_retrieval_logs_query_log_id_fkey" FOREIGN KEY (query_log_id) REFERENCES public.advisor_query_logs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_retrieval_logs" validate constraint "advisor_retrieval_logs_query_log_id_fkey";

alter table "public"."advisor_retrieval_logs" add constraint "advisor_retrieval_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_logs" validate constraint "advisor_retrieval_logs_user_id_fkey";

alter table "public"."advisor_retrieval_results" add constraint "advisor_retrieval_results_chunk_id_fkey" FOREIGN KEY (chunk_id) REFERENCES public.knowledge_document_chunks(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_results" validate constraint "advisor_retrieval_results_chunk_id_fkey";

alter table "public"."advisor_retrieval_results" add constraint "advisor_retrieval_results_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_retrieval_results" validate constraint "advisor_retrieval_results_document_id_fkey";

alter table "public"."advisor_retrieval_results" add constraint "advisor_retrieval_results_retrieval_log_id_fkey" FOREIGN KEY (retrieval_log_id) REFERENCES public.advisor_retrieval_logs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_retrieval_results" validate constraint "advisor_retrieval_results_retrieval_log_id_fkey";

alter table "public"."advisor_run_events" add constraint "advisor_run_events_execution_run_id_fkey" FOREIGN KEY (execution_run_id) REFERENCES public.advisor_execution_runs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_run_events" validate constraint "advisor_run_events_execution_run_id_fkey";

alter table "public"."advisor_source_rules" add constraint "advisor_source_rules_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_source_rules" validate constraint "advisor_source_rules_advisor_profile_id_fkey";

alter table "public"."advisor_usage_records" add constraint "advisor_usage_records_execution_run_id_fkey" FOREIGN KEY (execution_run_id) REFERENCES public.advisor_execution_runs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_usage_records" validate constraint "advisor_usage_records_execution_run_id_fkey";

alter table "public"."advisor_usage_records" add constraint "advisor_usage_records_model_id_fkey" FOREIGN KEY (model_id) REFERENCES public.ai_models(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_usage_records" validate constraint "advisor_usage_records_model_id_fkey";

alter table "public"."advisor_usage_records" add constraint "advisor_usage_records_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.ai_providers(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_usage_records" validate constraint "advisor_usage_records_provider_id_fkey";

alter table "public"."advisor_usage_records" add constraint "advisor_usage_records_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_usage_records" validate constraint "advisor_usage_records_user_id_fkey";

alter table "public"."advisor_web_search_logs" add constraint "advisor_web_search_logs_advisor_profile_id_fkey" FOREIGN KEY (advisor_profile_id) REFERENCES public.advisor_profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_web_search_logs" validate constraint "advisor_web_search_logs_advisor_profile_id_fkey";

alter table "public"."advisor_web_search_logs" add constraint "advisor_web_search_logs_query_log_id_fkey" FOREIGN KEY (query_log_id) REFERENCES public.advisor_query_logs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_web_search_logs" validate constraint "advisor_web_search_logs_query_log_id_fkey";

alter table "public"."advisor_web_search_logs" add constraint "advisor_web_search_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."advisor_web_search_logs" validate constraint "advisor_web_search_logs_user_id_fkey";

alter table "public"."advisor_web_search_results" add constraint "advisor_web_search_results_web_search_log_id_fkey" FOREIGN KEY (web_search_log_id) REFERENCES public.advisor_web_search_logs(id) ON DELETE CASCADE not valid;

alter table "public"."advisor_web_search_results" validate constraint "advisor_web_search_results_web_search_log_id_fkey";

alter table "public"."agronomy_tool_runs" add constraint "agronomy_tool_runs_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."agronomy_tool_runs" validate constraint "agronomy_tool_runs_crop_id_fkey";

alter table "public"."agronomy_tool_runs" add constraint "agronomy_tool_runs_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."agronomy_tool_runs" validate constraint "agronomy_tool_runs_farm_id_fkey";

alter table "public"."agronomy_tool_runs" add constraint "agronomy_tool_runs_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."agronomy_tool_runs" validate constraint "agronomy_tool_runs_field_id_fkey";

alter table "public"."agronomy_tool_runs" add constraint "agronomy_tool_runs_tool_id_fkey" FOREIGN KEY (tool_id) REFERENCES public.agronomy_tools(id) ON DELETE CASCADE not valid;

alter table "public"."agronomy_tool_runs" validate constraint "agronomy_tool_runs_tool_id_fkey";

alter table "public"."agronomy_tool_runs" add constraint "agronomy_tool_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."agronomy_tool_runs" validate constraint "agronomy_tool_runs_user_id_fkey";

alter table "public"."agronomy_tool_templates" add constraint "agronomy_tool_templates_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."agronomy_tool_templates" validate constraint "agronomy_tool_templates_created_by_fkey";

alter table "public"."agronomy_tool_templates" add constraint "agronomy_tool_templates_tool_id_fkey" FOREIGN KEY (tool_id) REFERENCES public.agronomy_tools(id) ON DELETE CASCADE not valid;

alter table "public"."agronomy_tool_templates" validate constraint "agronomy_tool_templates_tool_id_fkey";

alter table "public"."ai_models" add constraint "ai_models_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.ai_providers(id) ON DELETE CASCADE not valid;

alter table "public"."ai_models" validate constraint "ai_models_provider_id_fkey";

alter table "public"."audit_logs" add constraint "audit_logs_actor_user_id_fkey" FOREIGN KEY (actor_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_actor_user_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_cart_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_product_id_fkey";

alter table "public"."carts" add constraint "carts_converted_order_id_fkey" FOREIGN KEY (converted_order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."carts" validate constraint "carts_converted_order_id_fkey";

alter table "public"."carts" add constraint "carts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."carts" validate constraint "carts_user_id_fkey";

alter table "public"."certificates" add constraint "certificates_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE not valid;

alter table "public"."certificates" validate constraint "certificates_course_id_fkey";

alter table "public"."certificates" add constraint "certificates_enrollment_id_fkey" FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE SET NULL not valid;

alter table "public"."certificates" validate constraint "certificates_enrollment_id_fkey";

alter table "public"."certificates" add constraint "certificates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."certificates" validate constraint "certificates_user_id_fkey";

alter table "public"."course_modules" add constraint "course_modules_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE not valid;

alter table "public"."course_modules" validate constraint "course_modules_course_id_fkey";

alter table "public"."courses" add constraint "courses_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.course_categories(id) ON DELETE SET NULL not valid;

alter table "public"."courses" validate constraint "courses_category_id_fkey";

alter table "public"."crop_calendar_events" add constraint "crop_calendar_events_crop_calendar_plan_id_fkey" FOREIGN KEY (crop_calendar_plan_id) REFERENCES public.crop_calendar_plans(id) ON DELETE CASCADE not valid;

alter table "public"."crop_calendar_events" validate constraint "crop_calendar_events_crop_calendar_plan_id_fkey";

alter table "public"."crop_calendar_plans" add constraint "crop_calendar_plans_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."crop_calendar_plans" validate constraint "crop_calendar_plans_crop_id_fkey";

alter table "public"."crop_calendar_plans" add constraint "crop_calendar_plans_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."crop_calendar_plans" validate constraint "crop_calendar_plans_farm_id_fkey";

alter table "public"."crop_calendar_plans" add constraint "crop_calendar_plans_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."crop_calendar_plans" validate constraint "crop_calendar_plans_field_id_fkey";

alter table "public"."crop_calendar_plans" add constraint "crop_calendar_plans_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."crop_calendar_plans" validate constraint "crop_calendar_plans_tool_run_id_fkey";

alter table "public"."crop_calendar_plans" add constraint "crop_calendar_plans_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."crop_calendar_plans" validate constraint "crop_calendar_plans_user_id_fkey";

alter table "public"."crop_recommendations" add constraint "crop_recommendations_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."crop_recommendations" validate constraint "crop_recommendations_crop_id_fkey";

alter table "public"."crop_recommendations" add constraint "crop_recommendations_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."crop_recommendations" validate constraint "crop_recommendations_farm_id_fkey";

alter table "public"."crop_recommendations" add constraint "crop_recommendations_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."crop_recommendations" validate constraint "crop_recommendations_field_id_fkey";

alter table "public"."crop_recommendations" add constraint "crop_recommendations_generated_by_fkey" FOREIGN KEY (generated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."crop_recommendations" validate constraint "crop_recommendations_generated_by_fkey";

alter table "public"."crops" add constraint "crops_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."crops" validate constraint "crops_farm_id_fkey";

alter table "public"."customer_credit_ledger" add constraint "customer_credit_ledger_credit_account_id_fkey" FOREIGN KEY (credit_account_id) REFERENCES public.customer_credit_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."customer_credit_ledger" validate constraint "customer_credit_ledger_credit_account_id_fkey";

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_customer_invoice_id_fkey" FOREIGN KEY (customer_invoice_id) REFERENCES public.customer_invoices(id) ON DELETE CASCADE not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_customer_invoice_id_fkey";

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_order_item_id_fkey" FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_order_item_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_customer_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_order_id_fkey";

alter table "public"."delivery_requests" add constraint "delivery_requests_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_requests" validate constraint "delivery_requests_order_id_fkey";

alter table "public"."delivery_requests" add constraint "delivery_requests_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_requests" validate constraint "delivery_requests_requested_by_fkey";

alter table "public"."delivery_status_logs" add constraint "delivery_status_logs_delivery_request_id_fkey" FOREIGN KEY (delivery_request_id) REFERENCES public.delivery_requests(id) ON DELETE CASCADE not valid;

alter table "public"."delivery_status_logs" validate constraint "delivery_status_logs_delivery_request_id_fkey";

alter table "public"."delivery_status_logs" add constraint "delivery_status_logs_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_status_logs" validate constraint "delivery_status_logs_updated_by_fkey";

alter table "public"."depot_zones" add constraint "depot_zones_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE not valid;

alter table "public"."depot_zones" validate constraint "depot_zones_depot_id_fkey";

alter table "public"."depots" add constraint "depots_address_id_fkey" FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON DELETE SET NULL not valid;

alter table "public"."depots" validate constraint "depots_address_id_fkey";

alter table "public"."depots" add constraint "depots_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."depots" validate constraint "depots_organization_id_fkey";

alter table "public"."enrollments" add constraint "enrollments_course_id_fkey" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE not valid;

alter table "public"."enrollments" validate constraint "enrollments_course_id_fkey";

alter table "public"."enrollments" add constraint "enrollments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."enrollments" validate constraint "enrollments_user_id_fkey";

alter table "public"."farm_activities" add constraint "farm_activities_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."farm_activities" validate constraint "farm_activities_farm_id_fkey";

alter table "public"."farm_activities" add constraint "farm_activities_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."farm_activities" validate constraint "farm_activities_field_id_fkey";

alter table "public"."farm_activities" add constraint "farm_activities_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."farm_activities" validate constraint "farm_activities_performed_by_fkey";

alter table "public"."farms" add constraint "farms_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE not valid;

alter table "public"."farms" validate constraint "farms_team_id_fkey";

alter table "public"."fertiliser_plan_items" add constraint "fertiliser_plan_items_recommendation_id_fkey" FOREIGN KEY (recommendation_id) REFERENCES public.fertiliser_recommendations(id) ON DELETE CASCADE not valid;

alter table "public"."fertiliser_plan_items" validate constraint "fertiliser_plan_items_recommendation_id_fkey";

alter table "public"."fertiliser_recommendations" add constraint "fertiliser_recommendations_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."fertiliser_recommendations" validate constraint "fertiliser_recommendations_crop_id_fkey";

alter table "public"."fertiliser_recommendations" add constraint "fertiliser_recommendations_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."fertiliser_recommendations" validate constraint "fertiliser_recommendations_farm_id_fkey";

alter table "public"."fertiliser_recommendations" add constraint "fertiliser_recommendations_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."fertiliser_recommendations" validate constraint "fertiliser_recommendations_field_id_fkey";

alter table "public"."fertiliser_recommendations" add constraint "fertiliser_recommendations_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."fertiliser_recommendations" validate constraint "fertiliser_recommendations_tool_run_id_fkey";

alter table "public"."fertiliser_recommendations" add constraint "fertiliser_recommendations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."fertiliser_recommendations" validate constraint "fertiliser_recommendations_user_id_fkey";

alter table "public"."fields" add constraint "fields_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."fields" validate constraint "fields_farm_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_depot_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_order_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_packed_by_fkey" FOREIGN KEY (packed_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_packed_by_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_wave_id_fkey" FOREIGN KEY (wave_id) REFERENCES public.pick_waves(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_wave_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_goods_receipt_id_fkey" FOREIGN KEY (goods_receipt_id) REFERENCES public.goods_receipts(id) ON DELETE CASCADE not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_goods_receipt_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_purchase_order_item_id_fkey" FOREIGN KEY (purchase_order_item_id) REFERENCES public.purchase_order_items(id) ON DELETE SET NULL not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_purchase_order_item_id_fkey";

alter table "public"."goods_receipts" add constraint "goods_receipts_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."goods_receipts" validate constraint "goods_receipts_depot_id_fkey";

alter table "public"."goods_receipts" add constraint "goods_receipts_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE SET NULL not valid;

alter table "public"."goods_receipts" validate constraint "goods_receipts_purchase_order_id_fkey";

alter table "public"."goods_receipts" add constraint "goods_receipts_received_by_fkey" FOREIGN KEY (received_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."goods_receipts" validate constraint "goods_receipts_received_by_fkey";

alter table "public"."goods_receipts" add constraint "goods_receipts_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL not valid;

alter table "public"."goods_receipts" validate constraint "goods_receipts_supplier_id_fkey";

alter table "public"."harvest_records" add constraint "harvest_records_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."harvest_records" validate constraint "harvest_records_crop_id_fkey";

alter table "public"."harvest_records" add constraint "harvest_records_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."harvest_records" validate constraint "harvest_records_field_id_fkey";

alter table "public"."harvest_records" add constraint "harvest_records_planting_record_id_fkey" FOREIGN KEY (planting_record_id) REFERENCES public.planting_records(id) ON DELETE SET NULL not valid;

alter table "public"."harvest_records" validate constraint "harvest_records_planting_record_id_fkey";

alter table "public"."inventory_batches" add constraint "inventory_batches_bin_id_fkey" FOREIGN KEY (bin_id) REFERENCES public.storage_bins(id) ON DELETE SET NULL not valid;

alter table "public"."inventory_batches" validate constraint "inventory_batches_bin_id_fkey";

alter table "public"."inventory_batches" add constraint "inventory_batches_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_batches" validate constraint "inventory_batches_depot_id_fkey";

alter table "public"."irrigation_plan_events" add constraint "irrigation_plan_events_irrigation_plan_id_fkey" FOREIGN KEY (irrigation_plan_id) REFERENCES public.irrigation_plans(id) ON DELETE CASCADE not valid;

alter table "public"."irrigation_plan_events" validate constraint "irrigation_plan_events_irrigation_plan_id_fkey";

alter table "public"."irrigation_plans" add constraint "irrigation_plans_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."irrigation_plans" validate constraint "irrigation_plans_crop_id_fkey";

alter table "public"."irrigation_plans" add constraint "irrigation_plans_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."irrigation_plans" validate constraint "irrigation_plans_farm_id_fkey";

alter table "public"."irrigation_plans" add constraint "irrigation_plans_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."irrigation_plans" validate constraint "irrigation_plans_field_id_fkey";

alter table "public"."irrigation_plans" add constraint "irrigation_plans_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."irrigation_plans" validate constraint "irrigation_plans_tool_run_id_fkey";

alter table "public"."irrigation_plans" add constraint "irrigation_plans_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."irrigation_plans" validate constraint "irrigation_plans_user_id_fkey";

alter table "public"."journal_entry_lines" add constraint "journal_entry_lines_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."journal_entry_lines" validate constraint "journal_entry_lines_depot_id_fkey";

alter table "public"."journal_entry_lines" add constraint "journal_entry_lines_gl_account_id_fkey" FOREIGN KEY (gl_account_id) REFERENCES public.gl_accounts(id) ON DELETE RESTRICT not valid;

alter table "public"."journal_entry_lines" validate constraint "journal_entry_lines_gl_account_id_fkey";

alter table "public"."journal_entry_lines" add constraint "journal_entry_lines_journal_entry_id_fkey" FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entries(id) ON DELETE CASCADE not valid;

alter table "public"."journal_entry_lines" validate constraint "journal_entry_lines_journal_entry_id_fkey";

alter table "public"."journal_entry_lines" add constraint "journal_entry_lines_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."journal_entry_lines" validate constraint "journal_entry_lines_variant_id_fkey";

alter table "public"."knowledge_document_chunks" add constraint "knowledge_document_chunks_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE CASCADE not valid;

alter table "public"."knowledge_document_chunks" validate constraint "knowledge_document_chunks_document_id_fkey";

alter table "public"."knowledge_documents" add constraint "knowledge_documents_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."knowledge_documents" validate constraint "knowledge_documents_created_by_fkey";

alter table "public"."knowledge_documents" add constraint "knowledge_documents_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.knowledge_sources(id) ON DELETE CASCADE not valid;

alter table "public"."knowledge_documents" validate constraint "knowledge_documents_source_id_fkey";

alter table "public"."knowledge_ingestion_jobs" add constraint "knowledge_ingestion_jobs_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."knowledge_ingestion_jobs" validate constraint "knowledge_ingestion_jobs_created_by_fkey";

alter table "public"."knowledge_ingestion_jobs" add constraint "knowledge_ingestion_jobs_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE SET NULL not valid;

alter table "public"."knowledge_ingestion_jobs" validate constraint "knowledge_ingestion_jobs_document_id_fkey";

alter table "public"."knowledge_ingestion_jobs" add constraint "knowledge_ingestion_jobs_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.knowledge_sources(id) ON DELETE SET NULL not valid;

alter table "public"."knowledge_ingestion_jobs" validate constraint "knowledge_ingestion_jobs_source_id_fkey";

alter table "public"."knowledge_sources" add constraint "knowledge_sources_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."knowledge_sources" validate constraint "knowledge_sources_created_by_fkey";

alter table "public"."lesson_resources" add constraint "lesson_resources_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_resources" validate constraint "lesson_resources_lesson_id_fkey";

alter table "public"."lessons" add constraint "lessons_module_id_fkey" FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE not valid;

alter table "public"."lessons" validate constraint "lessons_module_id_fkey";

alter table "public"."lime_recommendations" add constraint "lime_recommendations_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."lime_recommendations" validate constraint "lime_recommendations_farm_id_fkey";

alter table "public"."lime_recommendations" add constraint "lime_recommendations_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."lime_recommendations" validate constraint "lime_recommendations_field_id_fkey";

alter table "public"."lime_recommendations" add constraint "lime_recommendations_soil_test_id_fkey" FOREIGN KEY (soil_test_id) REFERENCES public.soil_tests(id) ON DELETE SET NULL not valid;

alter table "public"."lime_recommendations" validate constraint "lime_recommendations_soil_test_id_fkey";

alter table "public"."lime_recommendations" add constraint "lime_recommendations_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."lime_recommendations" validate constraint "lime_recommendations_tool_run_id_fkey";

alter table "public"."lime_recommendations" add constraint "lime_recommendations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."lime_recommendations" validate constraint "lime_recommendations_user_id_fkey";

alter table "public"."marketplace_buyer_requests" add constraint "marketplace_buyer_requests_buyer_organization_id_fkey" FOREIGN KEY (buyer_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_buyer_requests" validate constraint "marketplace_buyer_requests_buyer_organization_id_fkey";

alter table "public"."marketplace_buyer_requests" add constraint "marketplace_buyer_requests_buyer_user_id_fkey" FOREIGN KEY (buyer_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_buyer_requests" validate constraint "marketplace_buyer_requests_buyer_user_id_fkey";

alter table "public"."marketplace_buyer_requests" add constraint "marketplace_buyer_requests_commodity_id_fkey" FOREIGN KEY (commodity_id) REFERENCES public.marketplace_commodities(id) ON DELETE RESTRICT not valid;

alter table "public"."marketplace_buyer_requests" validate constraint "marketplace_buyer_requests_commodity_id_fkey";

alter table "public"."marketplace_commodity_grades" add constraint "marketplace_commodity_grades_commodity_id_fkey" FOREIGN KEY (commodity_id) REFERENCES public.marketplace_commodities(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_commodity_grades" validate constraint "marketplace_commodity_grades_commodity_id_fkey";

alter table "public"."marketplace_disputes" add constraint "marketplace_disputes_raised_by_user_id_fkey" FOREIGN KEY (raised_by_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_disputes" validate constraint "marketplace_disputes_raised_by_user_id_fkey";

alter table "public"."marketplace_disputes" add constraint "marketplace_disputes_trade_id_fkey" FOREIGN KEY (trade_id) REFERENCES public.marketplace_trades(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_disputes" validate constraint "marketplace_disputes_trade_id_fkey";

alter table "public"."marketplace_listing_documents" add constraint "marketplace_listing_documents_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_listing_documents" validate constraint "marketplace_listing_documents_listing_id_fkey";

alter table "public"."marketplace_listing_images" add constraint "marketplace_listing_images_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_listing_images" validate constraint "marketplace_listing_images_listing_id_fkey";

alter table "public"."marketplace_listing_lots" add constraint "marketplace_listing_lots_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_listing_lots" validate constraint "marketplace_listing_lots_listing_id_fkey";

alter table "public"."marketplace_listings" add constraint "marketplace_listings_commodity_id_fkey" FOREIGN KEY (commodity_id) REFERENCES public.marketplace_commodities(id) ON DELETE RESTRICT not valid;

alter table "public"."marketplace_listings" validate constraint "marketplace_listings_commodity_id_fkey";

alter table "public"."marketplace_listings" add constraint "marketplace_listings_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_listings" validate constraint "marketplace_listings_farm_id_fkey";

alter table "public"."marketplace_listings" add constraint "marketplace_listings_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_listings" validate constraint "marketplace_listings_field_id_fkey";

alter table "public"."marketplace_listings" add constraint "marketplace_listings_seller_organization_id_fkey" FOREIGN KEY (seller_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_listings" validate constraint "marketplace_listings_seller_organization_id_fkey";

alter table "public"."marketplace_listings" add constraint "marketplace_listings_seller_user_id_fkey" FOREIGN KEY (seller_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_listings" validate constraint "marketplace_listings_seller_user_id_fkey";

alter table "public"."marketplace_matches" add constraint "marketplace_matches_buyer_request_id_fkey" FOREIGN KEY (buyer_request_id) REFERENCES public.marketplace_buyer_requests(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_matches" validate constraint "marketplace_matches_buyer_request_id_fkey";

alter table "public"."marketplace_matches" add constraint "marketplace_matches_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_matches" validate constraint "marketplace_matches_listing_id_fkey";

alter table "public"."marketplace_offer_messages" add constraint "marketplace_offer_messages_offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES public.marketplace_offers(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_offer_messages" validate constraint "marketplace_offer_messages_offer_id_fkey";

alter table "public"."marketplace_offer_messages" add constraint "marketplace_offer_messages_sender_user_id_fkey" FOREIGN KEY (sender_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offer_messages" validate constraint "marketplace_offer_messages_sender_user_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_buyer_organization_id_fkey" FOREIGN KEY (buyer_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_buyer_organization_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_buyer_request_id_fkey" FOREIGN KEY (buyer_request_id) REFERENCES public.marketplace_buyer_requests(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_buyer_request_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_buyer_user_id_fkey" FOREIGN KEY (buyer_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_buyer_user_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_listing_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_seller_organization_id_fkey" FOREIGN KEY (seller_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_seller_organization_id_fkey";

alter table "public"."marketplace_offers" add constraint "marketplace_offers_seller_user_id_fkey" FOREIGN KEY (seller_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_offers" validate constraint "marketplace_offers_seller_user_id_fkey";

alter table "public"."marketplace_payouts" add constraint "marketplace_payouts_seller_organization_id_fkey" FOREIGN KEY (seller_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_payouts" validate constraint "marketplace_payouts_seller_organization_id_fkey";

alter table "public"."marketplace_payouts" add constraint "marketplace_payouts_seller_user_id_fkey" FOREIGN KEY (seller_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_payouts" validate constraint "marketplace_payouts_seller_user_id_fkey";

alter table "public"."marketplace_payouts" add constraint "marketplace_payouts_settlement_id_fkey" FOREIGN KEY (settlement_id) REFERENCES public.marketplace_settlements(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_payouts" validate constraint "marketplace_payouts_settlement_id_fkey";

alter table "public"."marketplace_payouts" add constraint "marketplace_payouts_wallet_transaction_id_fkey" FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_payouts" validate constraint "marketplace_payouts_wallet_transaction_id_fkey";

alter table "public"."marketplace_price_observations" add constraint "marketplace_price_observations_commodity_id_fkey" FOREIGN KEY (commodity_id) REFERENCES public.marketplace_commodities(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_price_observations" validate constraint "marketplace_price_observations_commodity_id_fkey";

alter table "public"."marketplace_quality_attributes" add constraint "marketplace_quality_attributes_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_quality_attributes" validate constraint "marketplace_quality_attributes_listing_id_fkey";

alter table "public"."marketplace_settlements" add constraint "marketplace_settlements_trade_id_fkey" FOREIGN KEY (trade_id) REFERENCES public.marketplace_trades(id) ON DELETE CASCADE not valid;

alter table "public"."marketplace_settlements" validate constraint "marketplace_settlements_trade_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_buyer_organization_id_fkey" FOREIGN KEY (buyer_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_buyer_organization_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_buyer_request_id_fkey" FOREIGN KEY (buyer_request_id) REFERENCES public.marketplace_buyer_requests(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_buyer_request_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_buyer_user_id_fkey" FOREIGN KEY (buyer_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_buyer_user_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.marketplace_listings(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_listing_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES public.marketplace_offers(id) ON DELETE RESTRICT not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_offer_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_seller_organization_id_fkey" FOREIGN KEY (seller_organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_seller_organization_id_fkey";

alter table "public"."marketplace_trades" add constraint "marketplace_trades_seller_user_id_fkey" FOREIGN KEY (seller_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."marketplace_trades" validate constraint "marketplace_trades_seller_user_id_fkey";

alter table "public"."notification_preferences" add constraint "notification_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notification_preferences" validate constraint "notification_preferences_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_organization_id_fkey";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."order_items" add constraint "order_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."order_items" validate constraint "order_items_variant_id_fkey";

alter table "public"."orders" add constraint "orders_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_cart_id_fkey";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" add constraint "organization_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."organization_members" validate constraint "organization_members_user_id_fkey";

alter table "public"."organizations" add constraint "organizations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."organizations" validate constraint "organizations_created_by_fkey";

alter table "public"."payment_allocations" add constraint "payment_allocations_customer_invoice_id_fkey" FOREIGN KEY (customer_invoice_id) REFERENCES public.customer_invoices(id) ON DELETE CASCADE not valid;

alter table "public"."payment_allocations" validate constraint "payment_allocations_customer_invoice_id_fkey";

alter table "public"."payment_allocations" add constraint "payment_allocations_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE not valid;

alter table "public"."payment_allocations" validate constraint "payment_allocations_payment_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_gateway_id_fkey" FOREIGN KEY (gateway_id) REFERENCES public.payment_gateways(id) ON DELETE SET NULL not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_gateway_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_order_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE SET NULL not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_subscription_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_user_id_fkey";

alter table "public"."payments" add constraint "payments_customer_invoice_id_fkey" FOREIGN KEY (customer_invoice_id) REFERENCES public.customer_invoices(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_customer_invoice_id_fkey";

alter table "public"."payments" add constraint "payments_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_order_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_assigned_to_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_batch_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_bin_id_fkey" FOREIGN KEY (bin_id) REFERENCES public.storage_bins(id) ON DELETE SET NULL not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_bin_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_depot_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_order_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_order_item_id_fkey" FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE SET NULL not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_order_item_id_fkey";

alter table "public"."pick_tasks" add constraint "pick_tasks_wave_id_fkey" FOREIGN KEY (wave_id) REFERENCES public.pick_waves(id) ON DELETE CASCADE not valid;

alter table "public"."pick_tasks" validate constraint "pick_tasks_wave_id_fkey";

alter table "public"."pick_waves" add constraint "pick_waves_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."pick_waves" validate constraint "pick_waves_created_by_fkey";

alter table "public"."pick_waves" add constraint "pick_waves_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE RESTRICT not valid;

alter table "public"."pick_waves" validate constraint "pick_waves_depot_id_fkey";

alter table "public"."planting_records" add constraint "planting_records_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."planting_records" validate constraint "planting_records_crop_id_fkey";

alter table "public"."planting_records" add constraint "planting_records_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."planting_records" validate constraint "planting_records_field_id_fkey";

alter table "public"."product_attribute_assignments" add constraint "product_attribute_assignments_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_assignments" validate constraint "product_attribute_assignments_attribute_id_fkey";

alter table "public"."product_attribute_assignments" add constraint "product_attribute_assignments_attribute_option_id_fkey" FOREIGN KEY (attribute_option_id) REFERENCES public.product_attribute_options(id) ON DELETE SET NULL not valid;

alter table "public"."product_attribute_assignments" validate constraint "product_attribute_assignments_attribute_option_id_fkey";

alter table "public"."product_attribute_assignments" add constraint "product_attribute_assignments_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_assignments" validate constraint "product_attribute_assignments_product_id_fkey";

alter table "public"."product_attribute_options" add constraint "product_attribute_options_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_options" validate constraint "product_attribute_options_attribute_id_fkey";

alter table "public"."product_attributes" add constraint "product_attributes_applies_to_category_id_fkey" FOREIGN KEY (applies_to_category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL not valid;

alter table "public"."product_attributes" validate constraint "product_attributes_applies_to_category_id_fkey";

alter table "public"."product_categories" add constraint "product_categories_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.product_categories(id) ON DELETE SET NULL not valid;

alter table "public"."product_categories" validate constraint "product_categories_parent_id_fkey";

alter table "public"."product_category_assignments" add constraint "product_category_assignments_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE CASCADE not valid;

alter table "public"."product_category_assignments" validate constraint "product_category_assignments_category_id_fkey";

alter table "public"."product_category_assignments" add constraint "product_category_assignments_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_category_assignments" validate constraint "product_category_assignments_product_id_fkey";

alter table "public"."product_collection_items" add constraint "product_collection_items_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES public.product_collections(id) ON DELETE CASCADE not valid;

alter table "public"."product_collection_items" validate constraint "product_collection_items_collection_id_fkey";

alter table "public"."product_collection_items" add constraint "product_collection_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_collection_items" validate constraint "product_collection_items_product_id_fkey";

alter table "public"."product_images" add constraint "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_product_id_fkey";

alter table "public"."product_import_rows" add constraint "product_import_rows_created_product_id_fkey" FOREIGN KEY (created_product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."product_import_rows" validate constraint "product_import_rows_created_product_id_fkey";

alter table "public"."product_import_rows" add constraint "product_import_rows_created_variant_id_fkey" FOREIGN KEY (created_variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."product_import_rows" validate constraint "product_import_rows_created_variant_id_fkey";

alter table "public"."product_import_rows" add constraint "product_import_rows_import_job_id_fkey" FOREIGN KEY (import_job_id) REFERENCES public.product_import_jobs(id) ON DELETE CASCADE not valid;

alter table "public"."product_import_rows" validate constraint "product_import_rows_import_job_id_fkey";

alter table "public"."product_pack_sizes" add constraint "product_pack_sizes_pack_type_check" CHECK ((pack_type = ANY (ARRAY['weight'::text, 'seed_count'::text, 'volume'::text, 'unit'::text]))) not valid;

alter table "public"."product_pack_sizes" validate constraint "product_pack_sizes_pack_type_check";

alter table "public"."product_pricing_history" add constraint "product_pricing_history_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_pricing_history" validate constraint "product_pricing_history_product_id_fkey";

alter table "public"."product_pricing_history" add constraint "product_pricing_history_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE not valid;

alter table "public"."product_pricing_history" validate constraint "product_pricing_history_variant_id_fkey";

alter table "public"."product_subcategories" add constraint "product_subcategories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE CASCADE not valid;

alter table "public"."product_subcategories" validate constraint "product_subcategories_category_id_fkey";

alter table "public"."product_variant_attribute_values" add constraint "product_variant_attribute_values_attribute_id_fkey" FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id) ON DELETE CASCADE not valid;

alter table "public"."product_variant_attribute_values" validate constraint "product_variant_attribute_values_attribute_id_fkey";

alter table "public"."product_variant_attribute_values" add constraint "product_variant_attribute_values_attribute_option_id_fkey" FOREIGN KEY (attribute_option_id) REFERENCES public.product_attribute_options(id) ON DELETE SET NULL not valid;

alter table "public"."product_variant_attribute_values" validate constraint "product_variant_attribute_values_attribute_option_id_fkey";

alter table "public"."product_variant_attribute_values" add constraint "product_variant_attribute_values_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE not valid;

alter table "public"."product_variant_attribute_values" validate constraint "product_variant_attribute_values_variant_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."product_variants" validate constraint "product_variants_depot_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."product_variants" validate constraint "product_variants_pack_size_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_variants" validate constraint "product_variants_product_id_fkey";

alter table "public"."products" add constraint "fk_products_supplier" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "fk_products_supplier";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

alter table "public"."products" add constraint "products_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_depot_id_fkey";

alter table "public"."products" add constraint "products_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_organization_id_fkey";

alter table "public"."products" add constraint "products_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES public.product_subcategories(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_subcategory_id_fkey";

alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";

alter table "public"."purchase_order_items" add constraint "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE not valid;

alter table "public"."purchase_order_items" validate constraint "purchase_order_items_purchase_order_id_fkey";

alter table "public"."purchase_orders" add constraint "purchase_orders_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."purchase_orders" validate constraint "purchase_orders_approved_by_fkey";

alter table "public"."purchase_orders" add constraint "purchase_orders_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."purchase_orders" validate constraint "purchase_orders_depot_id_fkey";

alter table "public"."purchase_orders" add constraint "purchase_orders_ordered_by_fkey" FOREIGN KEY (ordered_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."purchase_orders" validate constraint "purchase_orders_ordered_by_fkey";

alter table "public"."purchase_orders" add constraint "purchase_orders_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT not valid;

alter table "public"."purchase_orders" validate constraint "purchase_orders_supplier_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_permission_id_fkey";

alter table "public"."role_permissions" add constraint "role_permissions_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE not valid;

alter table "public"."role_permissions" validate constraint "role_permissions_role_id_fkey";

alter table "public"."seed_product_details" add constraint "seed_product_details_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."seed_product_details" validate constraint "seed_product_details_product_id_fkey";

alter table "public"."shipment_package_items" add constraint "shipment_package_items_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."shipment_package_items" validate constraint "shipment_package_items_batch_id_fkey";

alter table "public"."shipment_package_items" add constraint "shipment_package_items_order_item_id_fkey" FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE SET NULL not valid;

alter table "public"."shipment_package_items" validate constraint "shipment_package_items_order_item_id_fkey";

alter table "public"."shipment_package_items" add constraint "shipment_package_items_shipment_package_id_fkey" FOREIGN KEY (shipment_package_id) REFERENCES public.shipment_packages(id) ON DELETE CASCADE not valid;

alter table "public"."shipment_package_items" validate constraint "shipment_package_items_shipment_package_id_fkey";

alter table "public"."shipment_packages" add constraint "shipment_packages_fulfillment_batch_id_fkey" FOREIGN KEY (fulfillment_batch_id) REFERENCES public.fulfillment_batches(id) ON DELETE CASCADE not valid;

alter table "public"."shipment_packages" validate constraint "shipment_packages_fulfillment_batch_id_fkey";

alter table "public"."soil_tests" add constraint "soil_tests_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."soil_tests" validate constraint "soil_tests_farm_id_fkey";

alter table "public"."soil_tests" add constraint "soil_tests_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."soil_tests" validate constraint "soil_tests_field_id_fkey";

alter table "public"."spray_program_items" add constraint "spray_program_items_spray_program_id_fkey" FOREIGN KEY (spray_program_id) REFERENCES public.spray_programs(id) ON DELETE CASCADE not valid;

alter table "public"."spray_program_items" validate constraint "spray_program_items_spray_program_id_fkey";

alter table "public"."spray_programs" add constraint "spray_programs_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."spray_programs" validate constraint "spray_programs_crop_id_fkey";

alter table "public"."spray_programs" add constraint "spray_programs_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."spray_programs" validate constraint "spray_programs_farm_id_fkey";

alter table "public"."spray_programs" add constraint "spray_programs_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."spray_programs" validate constraint "spray_programs_field_id_fkey";

alter table "public"."spray_programs" add constraint "spray_programs_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."spray_programs" validate constraint "spray_programs_tool_run_id_fkey";

alter table "public"."spray_programs" add constraint "spray_programs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."spray_programs" validate constraint "spray_programs_user_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_stock_adjustment_id_fkey" FOREIGN KEY (stock_adjustment_id) REFERENCES public.stock_adjustments(id) ON DELETE CASCADE not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_stock_adjustment_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_variant_id_fkey";

alter table "public"."stock_adjustments" add constraint "stock_adjustments_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."stock_adjustments" validate constraint "stock_adjustments_depot_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_batch_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_bin_id_fkey" FOREIGN KEY (bin_id) REFERENCES public.storage_bins(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_bin_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_created_by_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_depot_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_batch_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_transfer_id_fkey" FOREIGN KEY (transfer_id) REFERENCES public.stock_transfers(id) ON DELETE CASCADE not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_transfer_id_fkey";

alter table "public"."stock_transfers" add constraint "stock_transfers_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."stock_transfers" validate constraint "stock_transfers_approved_by_fkey";

alter table "public"."stock_transfers" add constraint "stock_transfers_from_depot_id_fkey" FOREIGN KEY (from_depot_id) REFERENCES public.depots(id) ON DELETE RESTRICT not valid;

alter table "public"."stock_transfers" validate constraint "stock_transfers_from_depot_id_fkey";

alter table "public"."stock_transfers" add constraint "stock_transfers_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."stock_transfers" validate constraint "stock_transfers_requested_by_fkey";

alter table "public"."stock_transfers" add constraint "stock_transfers_to_depot_id_fkey" FOREIGN KEY (to_depot_id) REFERENCES public.depots(id) ON DELETE RESTRICT not valid;

alter table "public"."stock_transfers" validate constraint "stock_transfers_to_depot_id_fkey";

alter table "public"."storage_bins" add constraint "storage_bins_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE not valid;

alter table "public"."storage_bins" validate constraint "storage_bins_depot_id_fkey";

alter table "public"."storage_bins" add constraint "storage_bins_zone_id_fkey" FOREIGN KEY (zone_id) REFERENCES public.depot_zones(id) ON DELETE SET NULL not valid;

alter table "public"."storage_bins" validate constraint "storage_bins_zone_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE RESTRICT not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_plan_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."supplier_invoice_items" add constraint "supplier_invoice_items_goods_receipt_item_id_fkey" FOREIGN KEY (goods_receipt_item_id) REFERENCES public.goods_receipt_items(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoice_items" validate constraint "supplier_invoice_items_goods_receipt_item_id_fkey";

alter table "public"."supplier_invoice_items" add constraint "supplier_invoice_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoice_items" validate constraint "supplier_invoice_items_product_id_fkey";

alter table "public"."supplier_invoice_items" add constraint "supplier_invoice_items_purchase_order_item_id_fkey" FOREIGN KEY (purchase_order_item_id) REFERENCES public.purchase_order_items(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoice_items" validate constraint "supplier_invoice_items_purchase_order_item_id_fkey";

alter table "public"."supplier_invoice_items" add constraint "supplier_invoice_items_supplier_invoice_id_fkey" FOREIGN KEY (supplier_invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_invoice_items" validate constraint "supplier_invoice_items_supplier_invoice_id_fkey";

alter table "public"."supplier_invoice_items" add constraint "supplier_invoice_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoice_items" validate constraint "supplier_invoice_items_variant_id_fkey";

alter table "public"."supplier_invoices" add constraint "supplier_invoices_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_purchase_order_id_fkey";

alter table "public"."supplier_invoices" add constraint "supplier_invoices_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_supplier_id_fkey";

alter table "public"."suppliers" add constraint "suppliers_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."suppliers" validate constraint "suppliers_organization_id_fkey";

alter table "public"."teams" add constraint "teams_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."teams" validate constraint "teams_owner_id_fkey";

alter table "public"."user_permission_overrides" add constraint "user_permission_overrides_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE not valid;

alter table "public"."user_permission_overrides" validate constraint "user_permission_overrides_permission_id_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_assigned_by_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_organization_id_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_role_id_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_user_id_fkey";

alter table "public"."wallet_transactions" add constraint "wallet_transactions_payment_transaction_id_fkey" FOREIGN KEY (payment_transaction_id) REFERENCES public.payment_transactions(id) ON DELETE SET NULL not valid;

alter table "public"."wallet_transactions" validate constraint "wallet_transactions_payment_transaction_id_fkey";

alter table "public"."wallet_transactions" add constraint "wallet_transactions_wallet_id_fkey" FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE CASCADE not valid;

alter table "public"."wallet_transactions" validate constraint "wallet_transactions_wallet_id_fkey";

alter table "public"."wallets" add constraint "wallets_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."wallets" validate constraint "wallets_organization_id_fkey";

alter table "public"."wallets" add constraint "wallets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."wallets" validate constraint "wallets_user_id_fkey";

alter table "public"."weather_snapshots" add constraint "weather_snapshots_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE not valid;

alter table "public"."weather_snapshots" validate constraint "weather_snapshots_farm_id_fkey";

alter table "public"."weather_snapshots" add constraint "weather_snapshots_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE CASCADE not valid;

alter table "public"."weather_snapshots" validate constraint "weather_snapshots_field_id_fkey";

alter table "public"."website_crawl_pages" add constraint "website_crawl_pages_crawl_target_id_fkey" FOREIGN KEY (crawl_target_id) REFERENCES public.website_crawl_targets(id) ON DELETE CASCADE not valid;

alter table "public"."website_crawl_pages" validate constraint "website_crawl_pages_crawl_target_id_fkey";

alter table "public"."website_crawl_pages" add constraint "website_crawl_pages_document_id_fkey" FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE SET NULL not valid;

alter table "public"."website_crawl_pages" validate constraint "website_crawl_pages_document_id_fkey";

alter table "public"."website_crawl_pages" add constraint "website_crawl_pages_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.knowledge_sources(id) ON DELETE SET NULL not valid;

alter table "public"."website_crawl_pages" validate constraint "website_crawl_pages_source_id_fkey";

alter table "public"."website_crawl_targets" add constraint "website_crawl_targets_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.knowledge_sources(id) ON DELETE CASCADE not valid;

alter table "public"."website_crawl_targets" validate constraint "website_crawl_targets_source_id_fkey";

alter table "public"."yield_estimator_runs" add constraint "yield_estimator_runs_crop_id_fkey" FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE SET NULL not valid;

alter table "public"."yield_estimator_runs" validate constraint "yield_estimator_runs_crop_id_fkey";

alter table "public"."yield_estimator_runs" add constraint "yield_estimator_runs_farm_id_fkey" FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL not valid;

alter table "public"."yield_estimator_runs" validate constraint "yield_estimator_runs_farm_id_fkey";

alter table "public"."yield_estimator_runs" add constraint "yield_estimator_runs_field_id_fkey" FOREIGN KEY (field_id) REFERENCES public.fields(id) ON DELETE SET NULL not valid;

alter table "public"."yield_estimator_runs" validate constraint "yield_estimator_runs_field_id_fkey";

alter table "public"."yield_estimator_runs" add constraint "yield_estimator_runs_tool_run_id_fkey" FOREIGN KEY (tool_run_id) REFERENCES public.agronomy_tool_runs(id) ON DELETE SET NULL not valid;

alter table "public"."yield_estimator_runs" validate constraint "yield_estimator_runs_tool_run_id_fkey";

alter table "public"."yield_estimator_runs" add constraint "yield_estimator_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."yield_estimator_runs" validate constraint "yield_estimator_runs_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_agro_rec_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'REC-' || lpad(nextval('public.agro_rec_number_seq')::text, 6, '0');
$function$
;

CREATE OR REPLACE FUNCTION public.generate_ccn_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'CCN-' || nextval('public.ccn_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_ci_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'INV-' || nextval('public.ci_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_delivery_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'DEL-' || lpad(nextval('public.logistics_delivery_seq')::text, 6, '0');
$function$
;

CREATE OR REPLACE FUNCTION public.generate_gr_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'GR-' || nextval('public.gr_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_je_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'JE-' || nextval('public.je_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_pi_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(proforma_number, '[^0-9]', '', 'g'), '')::bigint), 800000) + 1
    INTO next_val FROM public.proforma_invoices;
  RETURN 'PI-' || next_val;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_po_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'PO-' || nextval('public.po_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_pr_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(request_number, '[^0-9]', '', 'g'), '')::bigint), 900000) + 1
    INTO next_val FROM public.payment_requests;
  RETURN 'PR-' || next_val;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_qt_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE next_val bigint;
BEGIN
  SELECT COALESCE(MAX(NULLIF(regexp_replace(quote_number, '[^0-9]', '', 'g'), '')::bigint), 700000) + 1
    INTO next_val FROM public.quotes;
  RETURN 'QT-' || next_val;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_refund_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'RF-' || nextval('public.refund_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_sa_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'SA-' || nextval('public.sa_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_sc_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'SC-' || lpad(nextval('public.stock_count_seq')::text, 6, '0');
$function$
;

CREATE OR REPLACE FUNCTION public.generate_scn_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'SCN-' || nextval('public.scn_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_si_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'SI-' || nextval('public.si_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_sp_number()
 RETURNS text
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  SELECT 'SP-' || nextval('public.sp_number_seq')::text;
$function$
;

CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(query_embedding public.vector, match_count integer DEFAULT 5, filter_access_level text DEFAULT NULL::text)
 RETURNS TABLE(chunk_id uuid, document_id uuid, chunk_text text, similarity double precision, access_level text, document_title text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select
    c.id as chunk_id,
    c.document_id,
    c.chunk_text,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.access_level,
    d.title as document_title
  from public.knowledge_document_chunks c
  join public.knowledge_documents d on d.id = c.document_id
  where c.embedding is not null
    and d.is_published = true
    and (
      filter_access_level is null
      or d.access_level = filter_access_level
    )
    and (
      public.is_admin()
      or d.access_level = 'public'
      or d.access_level = 'authenticated'
      or (
        d.access_level = 'premium'
        and exists (
          select 1
          from public.subscriptions s
          where s.user_id = auth.uid()
            and s.status in ('trialing', 'active')
        )
      )
    )
  order by c.embedding <=> query_embedding
  limit match_count;
$function$
;

CREATE OR REPLACE FUNCTION public.populate_review_from_transaction()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.transaction_date IS NULL OR NEW.amount IS NULL THEN
    SELECT
      bt.transaction_date,
      GREATEST(COALESCE(bt.debit_amount, 0), COALESCE(bt.credit_amount, 0))
    INTO NEW.transaction_date, NEW.amount
    FROM public.bank_transactions bt
    WHERE bt.id = NEW.bank_transaction_id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_self_approval()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (NEW.approval_status IN ('approved', 'rejected'))
     AND (OLD.approval_status IS DISTINCT FROM NEW.approval_status)
     AND (NEW.requested_by = auth.uid())
     AND NOT public.is_admin()
  THEN
    RAISE EXCEPTION 'Users cannot approve or reject their own requests';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_advisory_session_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.session_number IS NULL THEN
    NEW.session_number := 'AS-' || lpad(nextval('public.advisory_session_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $function$
;

CREATE OR REPLACE FUNCTION public.set_delivery_request_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.request_number IS NULL THEN
    NEW.request_number := public.generate_delivery_number();
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_support_ticket_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := 'TK-' || lpad(nextval('public.support_ticket_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $function$
;

create or replace view "public"."user_effective_permissions" as  SELECT DISTINCT ura.user_id,
    r.name AS role_name,
    p.code AS permission_code,
    p.name AS permission_name,
    p.module
   FROM (((public.user_role_assignments ura
     JOIN public.roles r ON ((r.id = ura.role_id)))
     JOIN public.role_permissions rp ON ((rp.role_id = r.id)))
     JOIN public.permissions p ON ((p.id = rp.permission_id)));


grant delete on table "public"."accounting_periods" to "anon";

grant insert on table "public"."accounting_periods" to "anon";

grant references on table "public"."accounting_periods" to "anon";

grant select on table "public"."accounting_periods" to "anon";

grant trigger on table "public"."accounting_periods" to "anon";

grant truncate on table "public"."accounting_periods" to "anon";

grant update on table "public"."accounting_periods" to "anon";

grant delete on table "public"."accounting_periods" to "authenticated";

grant insert on table "public"."accounting_periods" to "authenticated";

grant references on table "public"."accounting_periods" to "authenticated";

grant select on table "public"."accounting_periods" to "authenticated";

grant trigger on table "public"."accounting_periods" to "authenticated";

grant truncate on table "public"."accounting_periods" to "authenticated";

grant update on table "public"."accounting_periods" to "authenticated";

grant delete on table "public"."accounting_periods" to "service_role";

grant insert on table "public"."accounting_periods" to "service_role";

grant references on table "public"."accounting_periods" to "service_role";

grant select on table "public"."accounting_periods" to "service_role";

grant trigger on table "public"."accounting_periods" to "service_role";

grant truncate on table "public"."accounting_periods" to "service_role";

grant update on table "public"."accounting_periods" to "service_role";

grant delete on table "public"."advisory_services" to "anon";

grant insert on table "public"."advisory_services" to "anon";

grant references on table "public"."advisory_services" to "anon";

grant select on table "public"."advisory_services" to "anon";

grant trigger on table "public"."advisory_services" to "anon";

grant truncate on table "public"."advisory_services" to "anon";

grant update on table "public"."advisory_services" to "anon";

grant delete on table "public"."advisory_services" to "authenticated";

grant insert on table "public"."advisory_services" to "authenticated";

grant references on table "public"."advisory_services" to "authenticated";

grant select on table "public"."advisory_services" to "authenticated";

grant trigger on table "public"."advisory_services" to "authenticated";

grant truncate on table "public"."advisory_services" to "authenticated";

grant update on table "public"."advisory_services" to "authenticated";

grant delete on table "public"."advisory_services" to "service_role";

grant insert on table "public"."advisory_services" to "service_role";

grant references on table "public"."advisory_services" to "service_role";

grant select on table "public"."advisory_services" to "service_role";

grant trigger on table "public"."advisory_services" to "service_role";

grant truncate on table "public"."advisory_services" to "service_role";

grant update on table "public"."advisory_services" to "service_role";

grant delete on table "public"."advisory_sessions" to "anon";

grant insert on table "public"."advisory_sessions" to "anon";

grant references on table "public"."advisory_sessions" to "anon";

grant select on table "public"."advisory_sessions" to "anon";

grant trigger on table "public"."advisory_sessions" to "anon";

grant truncate on table "public"."advisory_sessions" to "anon";

grant update on table "public"."advisory_sessions" to "anon";

grant delete on table "public"."advisory_sessions" to "authenticated";

grant insert on table "public"."advisory_sessions" to "authenticated";

grant references on table "public"."advisory_sessions" to "authenticated";

grant select on table "public"."advisory_sessions" to "authenticated";

grant trigger on table "public"."advisory_sessions" to "authenticated";

grant truncate on table "public"."advisory_sessions" to "authenticated";

grant update on table "public"."advisory_sessions" to "authenticated";

grant delete on table "public"."advisory_sessions" to "service_role";

grant insert on table "public"."advisory_sessions" to "service_role";

grant references on table "public"."advisory_sessions" to "service_role";

grant select on table "public"."advisory_sessions" to "service_role";

grant trigger on table "public"."advisory_sessions" to "service_role";

grant truncate on table "public"."advisory_sessions" to "service_role";

grant update on table "public"."advisory_sessions" to "service_role";

grant delete on table "public"."agro_advisory_rules" to "anon";

grant insert on table "public"."agro_advisory_rules" to "anon";

grant references on table "public"."agro_advisory_rules" to "anon";

grant select on table "public"."agro_advisory_rules" to "anon";

grant trigger on table "public"."agro_advisory_rules" to "anon";

grant truncate on table "public"."agro_advisory_rules" to "anon";

grant update on table "public"."agro_advisory_rules" to "anon";

grant delete on table "public"."agro_advisory_rules" to "authenticated";

grant insert on table "public"."agro_advisory_rules" to "authenticated";

grant references on table "public"."agro_advisory_rules" to "authenticated";

grant select on table "public"."agro_advisory_rules" to "authenticated";

grant trigger on table "public"."agro_advisory_rules" to "authenticated";

grant truncate on table "public"."agro_advisory_rules" to "authenticated";

grant update on table "public"."agro_advisory_rules" to "authenticated";

grant delete on table "public"."agro_advisory_rules" to "service_role";

grant insert on table "public"."agro_advisory_rules" to "service_role";

grant references on table "public"."agro_advisory_rules" to "service_role";

grant select on table "public"."agro_advisory_rules" to "service_role";

grant trigger on table "public"."agro_advisory_rules" to "service_role";

grant truncate on table "public"."agro_advisory_rules" to "service_role";

grant update on table "public"."agro_advisory_rules" to "service_role";

grant delete on table "public"."agro_farming_systems" to "anon";

grant insert on table "public"."agro_farming_systems" to "anon";

grant references on table "public"."agro_farming_systems" to "anon";

grant select on table "public"."agro_farming_systems" to "anon";

grant trigger on table "public"."agro_farming_systems" to "anon";

grant truncate on table "public"."agro_farming_systems" to "anon";

grant update on table "public"."agro_farming_systems" to "anon";

grant delete on table "public"."agro_farming_systems" to "authenticated";

grant insert on table "public"."agro_farming_systems" to "authenticated";

grant references on table "public"."agro_farming_systems" to "authenticated";

grant select on table "public"."agro_farming_systems" to "authenticated";

grant trigger on table "public"."agro_farming_systems" to "authenticated";

grant truncate on table "public"."agro_farming_systems" to "authenticated";

grant update on table "public"."agro_farming_systems" to "authenticated";

grant delete on table "public"."agro_farming_systems" to "service_role";

grant insert on table "public"."agro_farming_systems" to "service_role";

grant references on table "public"."agro_farming_systems" to "service_role";

grant select on table "public"."agro_farming_systems" to "service_role";

grant trigger on table "public"."agro_farming_systems" to "service_role";

grant truncate on table "public"."agro_farming_systems" to "service_role";

grant update on table "public"."agro_farming_systems" to "service_role";

grant delete on table "public"."agro_recommendation_items" to "anon";

grant insert on table "public"."agro_recommendation_items" to "anon";

grant references on table "public"."agro_recommendation_items" to "anon";

grant select on table "public"."agro_recommendation_items" to "anon";

grant trigger on table "public"."agro_recommendation_items" to "anon";

grant truncate on table "public"."agro_recommendation_items" to "anon";

grant update on table "public"."agro_recommendation_items" to "anon";

grant delete on table "public"."agro_recommendation_items" to "authenticated";

grant insert on table "public"."agro_recommendation_items" to "authenticated";

grant references on table "public"."agro_recommendation_items" to "authenticated";

grant select on table "public"."agro_recommendation_items" to "authenticated";

grant trigger on table "public"."agro_recommendation_items" to "authenticated";

grant truncate on table "public"."agro_recommendation_items" to "authenticated";

grant update on table "public"."agro_recommendation_items" to "authenticated";

grant delete on table "public"."agro_recommendation_items" to "service_role";

grant insert on table "public"."agro_recommendation_items" to "service_role";

grant references on table "public"."agro_recommendation_items" to "service_role";

grant select on table "public"."agro_recommendation_items" to "service_role";

grant trigger on table "public"."agro_recommendation_items" to "service_role";

grant truncate on table "public"."agro_recommendation_items" to "service_role";

grant update on table "public"."agro_recommendation_items" to "service_role";

grant delete on table "public"."agro_recommendations" to "anon";

grant insert on table "public"."agro_recommendations" to "anon";

grant references on table "public"."agro_recommendations" to "anon";

grant select on table "public"."agro_recommendations" to "anon";

grant trigger on table "public"."agro_recommendations" to "anon";

grant truncate on table "public"."agro_recommendations" to "anon";

grant update on table "public"."agro_recommendations" to "anon";

grant delete on table "public"."agro_recommendations" to "authenticated";

grant insert on table "public"."agro_recommendations" to "authenticated";

grant references on table "public"."agro_recommendations" to "authenticated";

grant select on table "public"."agro_recommendations" to "authenticated";

grant trigger on table "public"."agro_recommendations" to "authenticated";

grant truncate on table "public"."agro_recommendations" to "authenticated";

grant update on table "public"."agro_recommendations" to "authenticated";

grant delete on table "public"."agro_recommendations" to "service_role";

grant insert on table "public"."agro_recommendations" to "service_role";

grant references on table "public"."agro_recommendations" to "service_role";

grant select on table "public"."agro_recommendations" to "service_role";

grant trigger on table "public"."agro_recommendations" to "service_role";

grant truncate on table "public"."agro_recommendations" to "service_role";

grant update on table "public"."agro_recommendations" to "service_role";

grant delete on table "public"."agro_region_profiles" to "anon";

grant insert on table "public"."agro_region_profiles" to "anon";

grant references on table "public"."agro_region_profiles" to "anon";

grant select on table "public"."agro_region_profiles" to "anon";

grant trigger on table "public"."agro_region_profiles" to "anon";

grant truncate on table "public"."agro_region_profiles" to "anon";

grant update on table "public"."agro_region_profiles" to "anon";

grant delete on table "public"."agro_region_profiles" to "authenticated";

grant insert on table "public"."agro_region_profiles" to "authenticated";

grant references on table "public"."agro_region_profiles" to "authenticated";

grant select on table "public"."agro_region_profiles" to "authenticated";

grant trigger on table "public"."agro_region_profiles" to "authenticated";

grant truncate on table "public"."agro_region_profiles" to "authenticated";

grant update on table "public"."agro_region_profiles" to "authenticated";

grant delete on table "public"."agro_region_profiles" to "service_role";

grant insert on table "public"."agro_region_profiles" to "service_role";

grant references on table "public"."agro_region_profiles" to "service_role";

grant select on table "public"."agro_region_profiles" to "service_role";

grant trigger on table "public"."agro_region_profiles" to "service_role";

grant truncate on table "public"."agro_region_profiles" to "service_role";

grant update on table "public"."agro_region_profiles" to "service_role";

grant delete on table "public"."agro_soil_profiles" to "anon";

grant insert on table "public"."agro_soil_profiles" to "anon";

grant references on table "public"."agro_soil_profiles" to "anon";

grant select on table "public"."agro_soil_profiles" to "anon";

grant trigger on table "public"."agro_soil_profiles" to "anon";

grant truncate on table "public"."agro_soil_profiles" to "anon";

grant update on table "public"."agro_soil_profiles" to "anon";

grant delete on table "public"."agro_soil_profiles" to "authenticated";

grant insert on table "public"."agro_soil_profiles" to "authenticated";

grant references on table "public"."agro_soil_profiles" to "authenticated";

grant select on table "public"."agro_soil_profiles" to "authenticated";

grant trigger on table "public"."agro_soil_profiles" to "authenticated";

grant truncate on table "public"."agro_soil_profiles" to "authenticated";

grant update on table "public"."agro_soil_profiles" to "authenticated";

grant delete on table "public"."agro_soil_profiles" to "service_role";

grant insert on table "public"."agro_soil_profiles" to "service_role";

grant references on table "public"."agro_soil_profiles" to "service_role";

grant select on table "public"."agro_soil_profiles" to "service_role";

grant trigger on table "public"."agro_soil_profiles" to "service_role";

grant truncate on table "public"."agro_soil_profiles" to "service_role";

grant update on table "public"."agro_soil_profiles" to "service_role";

grant delete on table "public"."agro_solution_bundle_items" to "anon";

grant insert on table "public"."agro_solution_bundle_items" to "anon";

grant references on table "public"."agro_solution_bundle_items" to "anon";

grant select on table "public"."agro_solution_bundle_items" to "anon";

grant trigger on table "public"."agro_solution_bundle_items" to "anon";

grant truncate on table "public"."agro_solution_bundle_items" to "anon";

grant update on table "public"."agro_solution_bundle_items" to "anon";

grant delete on table "public"."agro_solution_bundle_items" to "authenticated";

grant insert on table "public"."agro_solution_bundle_items" to "authenticated";

grant references on table "public"."agro_solution_bundle_items" to "authenticated";

grant select on table "public"."agro_solution_bundle_items" to "authenticated";

grant trigger on table "public"."agro_solution_bundle_items" to "authenticated";

grant truncate on table "public"."agro_solution_bundle_items" to "authenticated";

grant update on table "public"."agro_solution_bundle_items" to "authenticated";

grant delete on table "public"."agro_solution_bundle_items" to "service_role";

grant insert on table "public"."agro_solution_bundle_items" to "service_role";

grant references on table "public"."agro_solution_bundle_items" to "service_role";

grant select on table "public"."agro_solution_bundle_items" to "service_role";

grant trigger on table "public"."agro_solution_bundle_items" to "service_role";

grant truncate on table "public"."agro_solution_bundle_items" to "service_role";

grant update on table "public"."agro_solution_bundle_items" to "service_role";

grant delete on table "public"."agro_solution_bundles" to "anon";

grant insert on table "public"."agro_solution_bundles" to "anon";

grant references on table "public"."agro_solution_bundles" to "anon";

grant select on table "public"."agro_solution_bundles" to "anon";

grant trigger on table "public"."agro_solution_bundles" to "anon";

grant truncate on table "public"."agro_solution_bundles" to "anon";

grant update on table "public"."agro_solution_bundles" to "anon";

grant delete on table "public"."agro_solution_bundles" to "authenticated";

grant insert on table "public"."agro_solution_bundles" to "authenticated";

grant references on table "public"."agro_solution_bundles" to "authenticated";

grant select on table "public"."agro_solution_bundles" to "authenticated";

grant trigger on table "public"."agro_solution_bundles" to "authenticated";

grant truncate on table "public"."agro_solution_bundles" to "authenticated";

grant update on table "public"."agro_solution_bundles" to "authenticated";

grant delete on table "public"."agro_solution_bundles" to "service_role";

grant insert on table "public"."agro_solution_bundles" to "service_role";

grant references on table "public"."agro_solution_bundles" to "service_role";

grant select on table "public"."agro_solution_bundles" to "service_role";

grant trigger on table "public"."agro_solution_bundles" to "service_role";

grant truncate on table "public"."agro_solution_bundles" to "service_role";

grant update on table "public"."agro_solution_bundles" to "service_role";

grant delete on table "public"."approval_requests" to "anon";

grant insert on table "public"."approval_requests" to "anon";

grant references on table "public"."approval_requests" to "anon";

grant select on table "public"."approval_requests" to "anon";

grant trigger on table "public"."approval_requests" to "anon";

grant truncate on table "public"."approval_requests" to "anon";

grant update on table "public"."approval_requests" to "anon";

grant delete on table "public"."approval_requests" to "authenticated";

grant insert on table "public"."approval_requests" to "authenticated";

grant references on table "public"."approval_requests" to "authenticated";

grant select on table "public"."approval_requests" to "authenticated";

grant trigger on table "public"."approval_requests" to "authenticated";

grant truncate on table "public"."approval_requests" to "authenticated";

grant update on table "public"."approval_requests" to "authenticated";

grant delete on table "public"."approval_requests" to "service_role";

grant insert on table "public"."approval_requests" to "service_role";

grant references on table "public"."approval_requests" to "service_role";

grant select on table "public"."approval_requests" to "service_role";

grant trigger on table "public"."approval_requests" to "service_role";

grant truncate on table "public"."approval_requests" to "service_role";

grant update on table "public"."approval_requests" to "service_role";

grant delete on table "public"."bank_accounts" to "anon";

grant insert on table "public"."bank_accounts" to "anon";

grant references on table "public"."bank_accounts" to "anon";

grant select on table "public"."bank_accounts" to "anon";

grant trigger on table "public"."bank_accounts" to "anon";

grant truncate on table "public"."bank_accounts" to "anon";

grant update on table "public"."bank_accounts" to "anon";

grant delete on table "public"."bank_accounts" to "authenticated";

grant insert on table "public"."bank_accounts" to "authenticated";

grant references on table "public"."bank_accounts" to "authenticated";

grant select on table "public"."bank_accounts" to "authenticated";

grant trigger on table "public"."bank_accounts" to "authenticated";

grant truncate on table "public"."bank_accounts" to "authenticated";

grant update on table "public"."bank_accounts" to "authenticated";

grant delete on table "public"."bank_accounts" to "service_role";

grant insert on table "public"."bank_accounts" to "service_role";

grant references on table "public"."bank_accounts" to "service_role";

grant select on table "public"."bank_accounts" to "service_role";

grant trigger on table "public"."bank_accounts" to "service_role";

grant truncate on table "public"."bank_accounts" to "service_role";

grant update on table "public"."bank_accounts" to "service_role";

grant delete on table "public"."bank_statement_imports" to "anon";

grant insert on table "public"."bank_statement_imports" to "anon";

grant references on table "public"."bank_statement_imports" to "anon";

grant select on table "public"."bank_statement_imports" to "anon";

grant trigger on table "public"."bank_statement_imports" to "anon";

grant truncate on table "public"."bank_statement_imports" to "anon";

grant update on table "public"."bank_statement_imports" to "anon";

grant delete on table "public"."bank_statement_imports" to "authenticated";

grant insert on table "public"."bank_statement_imports" to "authenticated";

grant references on table "public"."bank_statement_imports" to "authenticated";

grant select on table "public"."bank_statement_imports" to "authenticated";

grant trigger on table "public"."bank_statement_imports" to "authenticated";

grant truncate on table "public"."bank_statement_imports" to "authenticated";

grant update on table "public"."bank_statement_imports" to "authenticated";

grant delete on table "public"."bank_statement_imports" to "service_role";

grant insert on table "public"."bank_statement_imports" to "service_role";

grant references on table "public"."bank_statement_imports" to "service_role";

grant select on table "public"."bank_statement_imports" to "service_role";

grant trigger on table "public"."bank_statement_imports" to "service_role";

grant truncate on table "public"."bank_statement_imports" to "service_role";

grant update on table "public"."bank_statement_imports" to "service_role";

grant delete on table "public"."bank_transaction_reviews" to "anon";

grant insert on table "public"."bank_transaction_reviews" to "anon";

grant references on table "public"."bank_transaction_reviews" to "anon";

grant select on table "public"."bank_transaction_reviews" to "anon";

grant trigger on table "public"."bank_transaction_reviews" to "anon";

grant truncate on table "public"."bank_transaction_reviews" to "anon";

grant update on table "public"."bank_transaction_reviews" to "anon";

grant delete on table "public"."bank_transaction_reviews" to "authenticated";

grant insert on table "public"."bank_transaction_reviews" to "authenticated";

grant references on table "public"."bank_transaction_reviews" to "authenticated";

grant select on table "public"."bank_transaction_reviews" to "authenticated";

grant trigger on table "public"."bank_transaction_reviews" to "authenticated";

grant truncate on table "public"."bank_transaction_reviews" to "authenticated";

grant update on table "public"."bank_transaction_reviews" to "authenticated";

grant delete on table "public"."bank_transaction_reviews" to "service_role";

grant insert on table "public"."bank_transaction_reviews" to "service_role";

grant references on table "public"."bank_transaction_reviews" to "service_role";

grant select on table "public"."bank_transaction_reviews" to "service_role";

grant trigger on table "public"."bank_transaction_reviews" to "service_role";

grant truncate on table "public"."bank_transaction_reviews" to "service_role";

grant update on table "public"."bank_transaction_reviews" to "service_role";

grant delete on table "public"."bank_transactions" to "anon";

grant insert on table "public"."bank_transactions" to "anon";

grant references on table "public"."bank_transactions" to "anon";

grant select on table "public"."bank_transactions" to "anon";

grant trigger on table "public"."bank_transactions" to "anon";

grant truncate on table "public"."bank_transactions" to "anon";

grant update on table "public"."bank_transactions" to "anon";

grant delete on table "public"."bank_transactions" to "authenticated";

grant insert on table "public"."bank_transactions" to "authenticated";

grant references on table "public"."bank_transactions" to "authenticated";

grant select on table "public"."bank_transactions" to "authenticated";

grant trigger on table "public"."bank_transactions" to "authenticated";

grant truncate on table "public"."bank_transactions" to "authenticated";

grant update on table "public"."bank_transactions" to "authenticated";

grant delete on table "public"."bank_transactions" to "service_role";

grant insert on table "public"."bank_transactions" to "service_role";

grant references on table "public"."bank_transactions" to "service_role";

grant select on table "public"."bank_transactions" to "service_role";

grant trigger on table "public"."bank_transactions" to "service_role";

grant truncate on table "public"."bank_transactions" to "service_role";

grant update on table "public"."bank_transactions" to "service_role";

grant delete on table "public"."crop_plans" to "anon";

grant insert on table "public"."crop_plans" to "anon";

grant references on table "public"."crop_plans" to "anon";

grant select on table "public"."crop_plans" to "anon";

grant trigger on table "public"."crop_plans" to "anon";

grant truncate on table "public"."crop_plans" to "anon";

grant update on table "public"."crop_plans" to "anon";

grant delete on table "public"."crop_plans" to "authenticated";

grant insert on table "public"."crop_plans" to "authenticated";

grant references on table "public"."crop_plans" to "authenticated";

grant select on table "public"."crop_plans" to "authenticated";

grant trigger on table "public"."crop_plans" to "authenticated";

grant truncate on table "public"."crop_plans" to "authenticated";

grant update on table "public"."crop_plans" to "authenticated";

grant delete on table "public"."crop_plans" to "service_role";

grant insert on table "public"."crop_plans" to "service_role";

grant references on table "public"."crop_plans" to "service_role";

grant select on table "public"."crop_plans" to "service_role";

grant trigger on table "public"."crop_plans" to "service_role";

grant truncate on table "public"."crop_plans" to "service_role";

grant update on table "public"."crop_plans" to "service_role";

grant delete on table "public"."customer_communication_logs" to "anon";

grant insert on table "public"."customer_communication_logs" to "anon";

grant references on table "public"."customer_communication_logs" to "anon";

grant select on table "public"."customer_communication_logs" to "anon";

grant trigger on table "public"."customer_communication_logs" to "anon";

grant truncate on table "public"."customer_communication_logs" to "anon";

grant update on table "public"."customer_communication_logs" to "anon";

grant delete on table "public"."customer_communication_logs" to "authenticated";

grant insert on table "public"."customer_communication_logs" to "authenticated";

grant references on table "public"."customer_communication_logs" to "authenticated";

grant select on table "public"."customer_communication_logs" to "authenticated";

grant trigger on table "public"."customer_communication_logs" to "authenticated";

grant truncate on table "public"."customer_communication_logs" to "authenticated";

grant update on table "public"."customer_communication_logs" to "authenticated";

grant delete on table "public"."customer_communication_logs" to "service_role";

grant insert on table "public"."customer_communication_logs" to "service_role";

grant references on table "public"."customer_communication_logs" to "service_role";

grant select on table "public"."customer_communication_logs" to "service_role";

grant trigger on table "public"."customer_communication_logs" to "service_role";

grant truncate on table "public"."customer_communication_logs" to "service_role";

grant update on table "public"."customer_communication_logs" to "service_role";

grant delete on table "public"."customer_credit_note_items" to "anon";

grant insert on table "public"."customer_credit_note_items" to "anon";

grant references on table "public"."customer_credit_note_items" to "anon";

grant select on table "public"."customer_credit_note_items" to "anon";

grant trigger on table "public"."customer_credit_note_items" to "anon";

grant truncate on table "public"."customer_credit_note_items" to "anon";

grant update on table "public"."customer_credit_note_items" to "anon";

grant delete on table "public"."customer_credit_note_items" to "authenticated";

grant insert on table "public"."customer_credit_note_items" to "authenticated";

grant references on table "public"."customer_credit_note_items" to "authenticated";

grant select on table "public"."customer_credit_note_items" to "authenticated";

grant trigger on table "public"."customer_credit_note_items" to "authenticated";

grant truncate on table "public"."customer_credit_note_items" to "authenticated";

grant update on table "public"."customer_credit_note_items" to "authenticated";

grant delete on table "public"."customer_credit_note_items" to "service_role";

grant insert on table "public"."customer_credit_note_items" to "service_role";

grant references on table "public"."customer_credit_note_items" to "service_role";

grant select on table "public"."customer_credit_note_items" to "service_role";

grant trigger on table "public"."customer_credit_note_items" to "service_role";

grant truncate on table "public"."customer_credit_note_items" to "service_role";

grant update on table "public"."customer_credit_note_items" to "service_role";

grant delete on table "public"."customer_credit_notes" to "anon";

grant insert on table "public"."customer_credit_notes" to "anon";

grant references on table "public"."customer_credit_notes" to "anon";

grant select on table "public"."customer_credit_notes" to "anon";

grant trigger on table "public"."customer_credit_notes" to "anon";

grant truncate on table "public"."customer_credit_notes" to "anon";

grant update on table "public"."customer_credit_notes" to "anon";

grant delete on table "public"."customer_credit_notes" to "authenticated";

grant insert on table "public"."customer_credit_notes" to "authenticated";

grant references on table "public"."customer_credit_notes" to "authenticated";

grant select on table "public"."customer_credit_notes" to "authenticated";

grant trigger on table "public"."customer_credit_notes" to "authenticated";

grant truncate on table "public"."customer_credit_notes" to "authenticated";

grant update on table "public"."customer_credit_notes" to "authenticated";

grant delete on table "public"."customer_credit_notes" to "service_role";

grant insert on table "public"."customer_credit_notes" to "service_role";

grant references on table "public"."customer_credit_notes" to "service_role";

grant select on table "public"."customer_credit_notes" to "service_role";

grant trigger on table "public"."customer_credit_notes" to "service_role";

grant truncate on table "public"."customer_credit_notes" to "service_role";

grant update on table "public"."customer_credit_notes" to "service_role";

grant delete on table "public"."customer_documents" to "anon";

grant insert on table "public"."customer_documents" to "anon";

grant references on table "public"."customer_documents" to "anon";

grant select on table "public"."customer_documents" to "anon";

grant trigger on table "public"."customer_documents" to "anon";

grant truncate on table "public"."customer_documents" to "anon";

grant update on table "public"."customer_documents" to "anon";

grant delete on table "public"."customer_documents" to "authenticated";

grant insert on table "public"."customer_documents" to "authenticated";

grant references on table "public"."customer_documents" to "authenticated";

grant select on table "public"."customer_documents" to "authenticated";

grant trigger on table "public"."customer_documents" to "authenticated";

grant truncate on table "public"."customer_documents" to "authenticated";

grant update on table "public"."customer_documents" to "authenticated";

grant delete on table "public"."customer_documents" to "service_role";

grant insert on table "public"."customer_documents" to "service_role";

grant references on table "public"."customer_documents" to "service_role";

grant select on table "public"."customer_documents" to "service_role";

grant trigger on table "public"."customer_documents" to "service_role";

grant truncate on table "public"."customer_documents" to "service_role";

grant update on table "public"."customer_documents" to "service_role";

grant delete on table "public"."customer_refunds" to "anon";

grant insert on table "public"."customer_refunds" to "anon";

grant references on table "public"."customer_refunds" to "anon";

grant select on table "public"."customer_refunds" to "anon";

grant trigger on table "public"."customer_refunds" to "anon";

grant truncate on table "public"."customer_refunds" to "anon";

grant update on table "public"."customer_refunds" to "anon";

grant delete on table "public"."customer_refunds" to "authenticated";

grant insert on table "public"."customer_refunds" to "authenticated";

grant references on table "public"."customer_refunds" to "authenticated";

grant select on table "public"."customer_refunds" to "authenticated";

grant trigger on table "public"."customer_refunds" to "authenticated";

grant truncate on table "public"."customer_refunds" to "authenticated";

grant update on table "public"."customer_refunds" to "authenticated";

grant delete on table "public"."customer_refunds" to "service_role";

grant insert on table "public"."customer_refunds" to "service_role";

grant references on table "public"."customer_refunds" to "service_role";

grant select on table "public"."customer_refunds" to "service_role";

grant trigger on table "public"."customer_refunds" to "service_role";

grant truncate on table "public"."customer_refunds" to "service_role";

grant update on table "public"."customer_refunds" to "service_role";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."depot_inventory" to "anon";

grant insert on table "public"."depot_inventory" to "anon";

grant references on table "public"."depot_inventory" to "anon";

grant select on table "public"."depot_inventory" to "anon";

grant trigger on table "public"."depot_inventory" to "anon";

grant truncate on table "public"."depot_inventory" to "anon";

grant update on table "public"."depot_inventory" to "anon";

grant delete on table "public"."depot_inventory" to "authenticated";

grant insert on table "public"."depot_inventory" to "authenticated";

grant references on table "public"."depot_inventory" to "authenticated";

grant select on table "public"."depot_inventory" to "authenticated";

grant trigger on table "public"."depot_inventory" to "authenticated";

grant truncate on table "public"."depot_inventory" to "authenticated";

grant update on table "public"."depot_inventory" to "authenticated";

grant delete on table "public"."depot_inventory" to "service_role";

grant insert on table "public"."depot_inventory" to "service_role";

grant references on table "public"."depot_inventory" to "service_role";

grant select on table "public"."depot_inventory" to "service_role";

grant trigger on table "public"."depot_inventory" to "service_role";

grant truncate on table "public"."depot_inventory" to "service_role";

grant update on table "public"."depot_inventory" to "service_role";

grant delete on table "public"."farm_seasons" to "anon";

grant insert on table "public"."farm_seasons" to "anon";

grant references on table "public"."farm_seasons" to "anon";

grant select on table "public"."farm_seasons" to "anon";

grant trigger on table "public"."farm_seasons" to "anon";

grant truncate on table "public"."farm_seasons" to "anon";

grant update on table "public"."farm_seasons" to "anon";

grant delete on table "public"."farm_seasons" to "authenticated";

grant insert on table "public"."farm_seasons" to "authenticated";

grant references on table "public"."farm_seasons" to "authenticated";

grant select on table "public"."farm_seasons" to "authenticated";

grant trigger on table "public"."farm_seasons" to "authenticated";

grant truncate on table "public"."farm_seasons" to "authenticated";

grant update on table "public"."farm_seasons" to "authenticated";

grant delete on table "public"."farm_seasons" to "service_role";

grant insert on table "public"."farm_seasons" to "service_role";

grant references on table "public"."farm_seasons" to "service_role";

grant select on table "public"."farm_seasons" to "service_role";

grant trigger on table "public"."farm_seasons" to "service_role";

grant truncate on table "public"."farm_seasons" to "service_role";

grant update on table "public"."farm_seasons" to "service_role";

grant delete on table "public"."logistics_delivery_items" to "anon";

grant insert on table "public"."logistics_delivery_items" to "anon";

grant references on table "public"."logistics_delivery_items" to "anon";

grant select on table "public"."logistics_delivery_items" to "anon";

grant trigger on table "public"."logistics_delivery_items" to "anon";

grant truncate on table "public"."logistics_delivery_items" to "anon";

grant update on table "public"."logistics_delivery_items" to "anon";

grant delete on table "public"."logistics_delivery_items" to "authenticated";

grant insert on table "public"."logistics_delivery_items" to "authenticated";

grant references on table "public"."logistics_delivery_items" to "authenticated";

grant select on table "public"."logistics_delivery_items" to "authenticated";

grant trigger on table "public"."logistics_delivery_items" to "authenticated";

grant truncate on table "public"."logistics_delivery_items" to "authenticated";

grant update on table "public"."logistics_delivery_items" to "authenticated";

grant delete on table "public"."logistics_delivery_items" to "service_role";

grant insert on table "public"."logistics_delivery_items" to "service_role";

grant references on table "public"."logistics_delivery_items" to "service_role";

grant select on table "public"."logistics_delivery_items" to "service_role";

grant trigger on table "public"."logistics_delivery_items" to "service_role";

grant truncate on table "public"."logistics_delivery_items" to "service_role";

grant update on table "public"."logistics_delivery_items" to "service_role";

grant delete on table "public"."logistics_delivery_requests" to "anon";

grant insert on table "public"."logistics_delivery_requests" to "anon";

grant references on table "public"."logistics_delivery_requests" to "anon";

grant select on table "public"."logistics_delivery_requests" to "anon";

grant trigger on table "public"."logistics_delivery_requests" to "anon";

grant truncate on table "public"."logistics_delivery_requests" to "anon";

grant update on table "public"."logistics_delivery_requests" to "anon";

grant delete on table "public"."logistics_delivery_requests" to "authenticated";

grant insert on table "public"."logistics_delivery_requests" to "authenticated";

grant references on table "public"."logistics_delivery_requests" to "authenticated";

grant select on table "public"."logistics_delivery_requests" to "authenticated";

grant trigger on table "public"."logistics_delivery_requests" to "authenticated";

grant truncate on table "public"."logistics_delivery_requests" to "authenticated";

grant update on table "public"."logistics_delivery_requests" to "authenticated";

grant delete on table "public"."logistics_delivery_requests" to "service_role";

grant insert on table "public"."logistics_delivery_requests" to "service_role";

grant references on table "public"."logistics_delivery_requests" to "service_role";

grant select on table "public"."logistics_delivery_requests" to "service_role";

grant trigger on table "public"."logistics_delivery_requests" to "service_role";

grant truncate on table "public"."logistics_delivery_requests" to "service_role";

grant update on table "public"."logistics_delivery_requests" to "service_role";

grant delete on table "public"."logistics_rate_cards" to "anon";

grant insert on table "public"."logistics_rate_cards" to "anon";

grant references on table "public"."logistics_rate_cards" to "anon";

grant select on table "public"."logistics_rate_cards" to "anon";

grant trigger on table "public"."logistics_rate_cards" to "anon";

grant truncate on table "public"."logistics_rate_cards" to "anon";

grant update on table "public"."logistics_rate_cards" to "anon";

grant delete on table "public"."logistics_rate_cards" to "authenticated";

grant insert on table "public"."logistics_rate_cards" to "authenticated";

grant references on table "public"."logistics_rate_cards" to "authenticated";

grant select on table "public"."logistics_rate_cards" to "authenticated";

grant trigger on table "public"."logistics_rate_cards" to "authenticated";

grant truncate on table "public"."logistics_rate_cards" to "authenticated";

grant update on table "public"."logistics_rate_cards" to "authenticated";

grant delete on table "public"."logistics_rate_cards" to "service_role";

grant insert on table "public"."logistics_rate_cards" to "service_role";

grant references on table "public"."logistics_rate_cards" to "service_role";

grant select on table "public"."logistics_rate_cards" to "service_role";

grant trigger on table "public"."logistics_rate_cards" to "service_role";

grant truncate on table "public"."logistics_rate_cards" to "service_role";

grant update on table "public"."logistics_rate_cards" to "service_role";

grant delete on table "public"."logistics_status_log" to "anon";

grant insert on table "public"."logistics_status_log" to "anon";

grant references on table "public"."logistics_status_log" to "anon";

grant select on table "public"."logistics_status_log" to "anon";

grant trigger on table "public"."logistics_status_log" to "anon";

grant truncate on table "public"."logistics_status_log" to "anon";

grant update on table "public"."logistics_status_log" to "anon";

grant delete on table "public"."logistics_status_log" to "authenticated";

grant insert on table "public"."logistics_status_log" to "authenticated";

grant references on table "public"."logistics_status_log" to "authenticated";

grant select on table "public"."logistics_status_log" to "authenticated";

grant trigger on table "public"."logistics_status_log" to "authenticated";

grant truncate on table "public"."logistics_status_log" to "authenticated";

grant update on table "public"."logistics_status_log" to "authenticated";

grant delete on table "public"."logistics_status_log" to "service_role";

grant insert on table "public"."logistics_status_log" to "service_role";

grant references on table "public"."logistics_status_log" to "service_role";

grant select on table "public"."logistics_status_log" to "service_role";

grant trigger on table "public"."logistics_status_log" to "service_role";

grant truncate on table "public"."logistics_status_log" to "service_role";

grant update on table "public"."logistics_status_log" to "service_role";

grant delete on table "public"."notification_channel_configs" to "anon";

grant insert on table "public"."notification_channel_configs" to "anon";

grant references on table "public"."notification_channel_configs" to "anon";

grant select on table "public"."notification_channel_configs" to "anon";

grant trigger on table "public"."notification_channel_configs" to "anon";

grant truncate on table "public"."notification_channel_configs" to "anon";

grant update on table "public"."notification_channel_configs" to "anon";

grant delete on table "public"."notification_channel_configs" to "authenticated";

grant insert on table "public"."notification_channel_configs" to "authenticated";

grant references on table "public"."notification_channel_configs" to "authenticated";

grant select on table "public"."notification_channel_configs" to "authenticated";

grant trigger on table "public"."notification_channel_configs" to "authenticated";

grant truncate on table "public"."notification_channel_configs" to "authenticated";

grant update on table "public"."notification_channel_configs" to "authenticated";

grant delete on table "public"."notification_channel_configs" to "service_role";

grant insert on table "public"."notification_channel_configs" to "service_role";

grant references on table "public"."notification_channel_configs" to "service_role";

grant select on table "public"."notification_channel_configs" to "service_role";

grant trigger on table "public"."notification_channel_configs" to "service_role";

grant truncate on table "public"."notification_channel_configs" to "service_role";

grant update on table "public"."notification_channel_configs" to "service_role";

grant delete on table "public"."payment_gateway_transactions" to "anon";

grant insert on table "public"."payment_gateway_transactions" to "anon";

grant references on table "public"."payment_gateway_transactions" to "anon";

grant select on table "public"."payment_gateway_transactions" to "anon";

grant trigger on table "public"."payment_gateway_transactions" to "anon";

grant truncate on table "public"."payment_gateway_transactions" to "anon";

grant update on table "public"."payment_gateway_transactions" to "anon";

grant delete on table "public"."payment_gateway_transactions" to "authenticated";

grant insert on table "public"."payment_gateway_transactions" to "authenticated";

grant references on table "public"."payment_gateway_transactions" to "authenticated";

grant select on table "public"."payment_gateway_transactions" to "authenticated";

grant trigger on table "public"."payment_gateway_transactions" to "authenticated";

grant truncate on table "public"."payment_gateway_transactions" to "authenticated";

grant update on table "public"."payment_gateway_transactions" to "authenticated";

grant delete on table "public"."payment_gateway_transactions" to "service_role";

grant insert on table "public"."payment_gateway_transactions" to "service_role";

grant references on table "public"."payment_gateway_transactions" to "service_role";

grant select on table "public"."payment_gateway_transactions" to "service_role";

grant trigger on table "public"."payment_gateway_transactions" to "service_role";

grant truncate on table "public"."payment_gateway_transactions" to "service_role";

grant update on table "public"."payment_gateway_transactions" to "service_role";

grant delete on table "public"."payment_requests" to "anon";

grant insert on table "public"."payment_requests" to "anon";

grant references on table "public"."payment_requests" to "anon";

grant select on table "public"."payment_requests" to "anon";

grant trigger on table "public"."payment_requests" to "anon";

grant truncate on table "public"."payment_requests" to "anon";

grant update on table "public"."payment_requests" to "anon";

grant delete on table "public"."payment_requests" to "authenticated";

grant insert on table "public"."payment_requests" to "authenticated";

grant references on table "public"."payment_requests" to "authenticated";

grant select on table "public"."payment_requests" to "authenticated";

grant trigger on table "public"."payment_requests" to "authenticated";

grant truncate on table "public"."payment_requests" to "authenticated";

grant update on table "public"."payment_requests" to "authenticated";

grant delete on table "public"."payment_requests" to "service_role";

grant insert on table "public"."payment_requests" to "service_role";

grant references on table "public"."payment_requests" to "service_role";

grant select on table "public"."payment_requests" to "service_role";

grant trigger on table "public"."payment_requests" to "service_role";

grant truncate on table "public"."payment_requests" to "service_role";

grant update on table "public"."payment_requests" to "service_role";

grant delete on table "public"."posting_rules" to "anon";

grant insert on table "public"."posting_rules" to "anon";

grant references on table "public"."posting_rules" to "anon";

grant select on table "public"."posting_rules" to "anon";

grant trigger on table "public"."posting_rules" to "anon";

grant truncate on table "public"."posting_rules" to "anon";

grant update on table "public"."posting_rules" to "anon";

grant delete on table "public"."posting_rules" to "authenticated";

grant insert on table "public"."posting_rules" to "authenticated";

grant references on table "public"."posting_rules" to "authenticated";

grant select on table "public"."posting_rules" to "authenticated";

grant trigger on table "public"."posting_rules" to "authenticated";

grant truncate on table "public"."posting_rules" to "authenticated";

grant update on table "public"."posting_rules" to "authenticated";

grant delete on table "public"."posting_rules" to "service_role";

grant insert on table "public"."posting_rules" to "service_role";

grant references on table "public"."posting_rules" to "service_role";

grant select on table "public"."posting_rules" to "service_role";

grant trigger on table "public"."posting_rules" to "service_role";

grant truncate on table "public"."posting_rules" to "service_role";

grant update on table "public"."posting_rules" to "service_role";

grant delete on table "public"."production_stages" to "anon";

grant insert on table "public"."production_stages" to "anon";

grant references on table "public"."production_stages" to "anon";

grant select on table "public"."production_stages" to "anon";

grant trigger on table "public"."production_stages" to "anon";

grant truncate on table "public"."production_stages" to "anon";

grant update on table "public"."production_stages" to "anon";

grant delete on table "public"."production_stages" to "authenticated";

grant insert on table "public"."production_stages" to "authenticated";

grant references on table "public"."production_stages" to "authenticated";

grant select on table "public"."production_stages" to "authenticated";

grant trigger on table "public"."production_stages" to "authenticated";

grant truncate on table "public"."production_stages" to "authenticated";

grant update on table "public"."production_stages" to "authenticated";

grant delete on table "public"."production_stages" to "service_role";

grant insert on table "public"."production_stages" to "service_role";

grant references on table "public"."production_stages" to "service_role";

grant select on table "public"."production_stages" to "service_role";

grant trigger on table "public"."production_stages" to "service_role";

grant truncate on table "public"."production_stages" to "service_role";

grant update on table "public"."production_stages" to "service_role";

grant delete on table "public"."proforma_invoice_items" to "anon";

grant insert on table "public"."proforma_invoice_items" to "anon";

grant references on table "public"."proforma_invoice_items" to "anon";

grant select on table "public"."proforma_invoice_items" to "anon";

grant trigger on table "public"."proforma_invoice_items" to "anon";

grant truncate on table "public"."proforma_invoice_items" to "anon";

grant update on table "public"."proforma_invoice_items" to "anon";

grant delete on table "public"."proforma_invoice_items" to "authenticated";

grant insert on table "public"."proforma_invoice_items" to "authenticated";

grant references on table "public"."proforma_invoice_items" to "authenticated";

grant select on table "public"."proforma_invoice_items" to "authenticated";

grant trigger on table "public"."proforma_invoice_items" to "authenticated";

grant truncate on table "public"."proforma_invoice_items" to "authenticated";

grant update on table "public"."proforma_invoice_items" to "authenticated";

grant delete on table "public"."proforma_invoice_items" to "service_role";

grant insert on table "public"."proforma_invoice_items" to "service_role";

grant references on table "public"."proforma_invoice_items" to "service_role";

grant select on table "public"."proforma_invoice_items" to "service_role";

grant trigger on table "public"."proforma_invoice_items" to "service_role";

grant truncate on table "public"."proforma_invoice_items" to "service_role";

grant update on table "public"."proforma_invoice_items" to "service_role";

grant delete on table "public"."proforma_invoices" to "anon";

grant insert on table "public"."proforma_invoices" to "anon";

grant references on table "public"."proforma_invoices" to "anon";

grant select on table "public"."proforma_invoices" to "anon";

grant trigger on table "public"."proforma_invoices" to "anon";

grant truncate on table "public"."proforma_invoices" to "anon";

grant update on table "public"."proforma_invoices" to "anon";

grant delete on table "public"."proforma_invoices" to "authenticated";

grant insert on table "public"."proforma_invoices" to "authenticated";

grant references on table "public"."proforma_invoices" to "authenticated";

grant select on table "public"."proforma_invoices" to "authenticated";

grant trigger on table "public"."proforma_invoices" to "authenticated";

grant truncate on table "public"."proforma_invoices" to "authenticated";

grant update on table "public"."proforma_invoices" to "authenticated";

grant delete on table "public"."proforma_invoices" to "service_role";

grant insert on table "public"."proforma_invoices" to "service_role";

grant references on table "public"."proforma_invoices" to "service_role";

grant select on table "public"."proforma_invoices" to "service_role";

grant trigger on table "public"."proforma_invoices" to "service_role";

grant truncate on table "public"."proforma_invoices" to "service_role";

grant update on table "public"."proforma_invoices" to "service_role";

grant delete on table "public"."program_activities" to "anon";

grant insert on table "public"."program_activities" to "anon";

grant references on table "public"."program_activities" to "anon";

grant select on table "public"."program_activities" to "anon";

grant trigger on table "public"."program_activities" to "anon";

grant truncate on table "public"."program_activities" to "anon";

grant update on table "public"."program_activities" to "anon";

grant delete on table "public"."program_activities" to "authenticated";

grant insert on table "public"."program_activities" to "authenticated";

grant references on table "public"."program_activities" to "authenticated";

grant select on table "public"."program_activities" to "authenticated";

grant trigger on table "public"."program_activities" to "authenticated";

grant truncate on table "public"."program_activities" to "authenticated";

grant update on table "public"."program_activities" to "authenticated";

grant delete on table "public"."program_activities" to "service_role";

grant insert on table "public"."program_activities" to "service_role";

grant references on table "public"."program_activities" to "service_role";

grant select on table "public"."program_activities" to "service_role";

grant trigger on table "public"."program_activities" to "service_role";

grant truncate on table "public"."program_activities" to "service_role";

grant update on table "public"."program_activities" to "service_role";

grant delete on table "public"."program_courses" to "anon";

grant insert on table "public"."program_courses" to "anon";

grant references on table "public"."program_courses" to "anon";

grant select on table "public"."program_courses" to "anon";

grant trigger on table "public"."program_courses" to "anon";

grant truncate on table "public"."program_courses" to "anon";

grant update on table "public"."program_courses" to "anon";

grant delete on table "public"."program_courses" to "authenticated";

grant insert on table "public"."program_courses" to "authenticated";

grant references on table "public"."program_courses" to "authenticated";

grant select on table "public"."program_courses" to "authenticated";

grant trigger on table "public"."program_courses" to "authenticated";

grant truncate on table "public"."program_courses" to "authenticated";

grant update on table "public"."program_courses" to "authenticated";

grant delete on table "public"."program_courses" to "service_role";

grant insert on table "public"."program_courses" to "service_role";

grant references on table "public"."program_courses" to "service_role";

grant select on table "public"."program_courses" to "service_role";

grant trigger on table "public"."program_courses" to "service_role";

grant truncate on table "public"."program_courses" to "service_role";

grant update on table "public"."program_courses" to "service_role";

grant delete on table "public"."quote_items" to "anon";

grant insert on table "public"."quote_items" to "anon";

grant references on table "public"."quote_items" to "anon";

grant select on table "public"."quote_items" to "anon";

grant trigger on table "public"."quote_items" to "anon";

grant truncate on table "public"."quote_items" to "anon";

grant update on table "public"."quote_items" to "anon";

grant delete on table "public"."quote_items" to "authenticated";

grant insert on table "public"."quote_items" to "authenticated";

grant references on table "public"."quote_items" to "authenticated";

grant select on table "public"."quote_items" to "authenticated";

grant trigger on table "public"."quote_items" to "authenticated";

grant truncate on table "public"."quote_items" to "authenticated";

grant update on table "public"."quote_items" to "authenticated";

grant delete on table "public"."quote_items" to "service_role";

grant insert on table "public"."quote_items" to "service_role";

grant references on table "public"."quote_items" to "service_role";

grant select on table "public"."quote_items" to "service_role";

grant trigger on table "public"."quote_items" to "service_role";

grant truncate on table "public"."quote_items" to "service_role";

grant update on table "public"."quote_items" to "service_role";

grant delete on table "public"."quotes" to "anon";

grant insert on table "public"."quotes" to "anon";

grant references on table "public"."quotes" to "anon";

grant select on table "public"."quotes" to "anon";

grant trigger on table "public"."quotes" to "anon";

grant truncate on table "public"."quotes" to "anon";

grant update on table "public"."quotes" to "anon";

grant delete on table "public"."quotes" to "authenticated";

grant insert on table "public"."quotes" to "authenticated";

grant references on table "public"."quotes" to "authenticated";

grant select on table "public"."quotes" to "authenticated";

grant trigger on table "public"."quotes" to "authenticated";

grant truncate on table "public"."quotes" to "authenticated";

grant update on table "public"."quotes" to "authenticated";

grant delete on table "public"."quotes" to "service_role";

grant insert on table "public"."quotes" to "service_role";

grant references on table "public"."quotes" to "service_role";

grant select on table "public"."quotes" to "service_role";

grant trigger on table "public"."quotes" to "service_role";

grant truncate on table "public"."quotes" to "service_role";

grant update on table "public"."quotes" to "service_role";

grant delete on table "public"."reminder_templates" to "anon";

grant insert on table "public"."reminder_templates" to "anon";

grant references on table "public"."reminder_templates" to "anon";

grant select on table "public"."reminder_templates" to "anon";

grant trigger on table "public"."reminder_templates" to "anon";

grant truncate on table "public"."reminder_templates" to "anon";

grant update on table "public"."reminder_templates" to "anon";

grant delete on table "public"."reminder_templates" to "authenticated";

grant insert on table "public"."reminder_templates" to "authenticated";

grant references on table "public"."reminder_templates" to "authenticated";

grant select on table "public"."reminder_templates" to "authenticated";

grant trigger on table "public"."reminder_templates" to "authenticated";

grant truncate on table "public"."reminder_templates" to "authenticated";

grant update on table "public"."reminder_templates" to "authenticated";

grant delete on table "public"."reminder_templates" to "service_role";

grant insert on table "public"."reminder_templates" to "service_role";

grant references on table "public"."reminder_templates" to "service_role";

grant select on table "public"."reminder_templates" to "service_role";

grant trigger on table "public"."reminder_templates" to "service_role";

grant truncate on table "public"."reminder_templates" to "service_role";

grant update on table "public"."reminder_templates" to "service_role";

grant delete on table "public"."stock_count_items" to "anon";

grant insert on table "public"."stock_count_items" to "anon";

grant references on table "public"."stock_count_items" to "anon";

grant select on table "public"."stock_count_items" to "anon";

grant trigger on table "public"."stock_count_items" to "anon";

grant truncate on table "public"."stock_count_items" to "anon";

grant update on table "public"."stock_count_items" to "anon";

grant delete on table "public"."stock_count_items" to "authenticated";

grant insert on table "public"."stock_count_items" to "authenticated";

grant references on table "public"."stock_count_items" to "authenticated";

grant select on table "public"."stock_count_items" to "authenticated";

grant trigger on table "public"."stock_count_items" to "authenticated";

grant truncate on table "public"."stock_count_items" to "authenticated";

grant update on table "public"."stock_count_items" to "authenticated";

grant delete on table "public"."stock_count_items" to "service_role";

grant insert on table "public"."stock_count_items" to "service_role";

grant references on table "public"."stock_count_items" to "service_role";

grant select on table "public"."stock_count_items" to "service_role";

grant trigger on table "public"."stock_count_items" to "service_role";

grant truncate on table "public"."stock_count_items" to "service_role";

grant update on table "public"."stock_count_items" to "service_role";

grant delete on table "public"."stock_counts" to "anon";

grant insert on table "public"."stock_counts" to "anon";

grant references on table "public"."stock_counts" to "anon";

grant select on table "public"."stock_counts" to "anon";

grant trigger on table "public"."stock_counts" to "anon";

grant truncate on table "public"."stock_counts" to "anon";

grant update on table "public"."stock_counts" to "anon";

grant delete on table "public"."stock_counts" to "authenticated";

grant insert on table "public"."stock_counts" to "authenticated";

grant references on table "public"."stock_counts" to "authenticated";

grant select on table "public"."stock_counts" to "authenticated";

grant trigger on table "public"."stock_counts" to "authenticated";

grant truncate on table "public"."stock_counts" to "authenticated";

grant update on table "public"."stock_counts" to "authenticated";

grant delete on table "public"."stock_counts" to "service_role";

grant insert on table "public"."stock_counts" to "service_role";

grant references on table "public"."stock_counts" to "service_role";

grant select on table "public"."stock_counts" to "service_role";

grant trigger on table "public"."stock_counts" to "service_role";

grant truncate on table "public"."stock_counts" to "service_role";

grant update on table "public"."stock_counts" to "service_role";

grant delete on table "public"."supplier_contacts" to "anon";

grant insert on table "public"."supplier_contacts" to "anon";

grant references on table "public"."supplier_contacts" to "anon";

grant select on table "public"."supplier_contacts" to "anon";

grant trigger on table "public"."supplier_contacts" to "anon";

grant truncate on table "public"."supplier_contacts" to "anon";

grant update on table "public"."supplier_contacts" to "anon";

grant delete on table "public"."supplier_contacts" to "authenticated";

grant insert on table "public"."supplier_contacts" to "authenticated";

grant references on table "public"."supplier_contacts" to "authenticated";

grant select on table "public"."supplier_contacts" to "authenticated";

grant trigger on table "public"."supplier_contacts" to "authenticated";

grant truncate on table "public"."supplier_contacts" to "authenticated";

grant update on table "public"."supplier_contacts" to "authenticated";

grant delete on table "public"."supplier_contacts" to "service_role";

grant insert on table "public"."supplier_contacts" to "service_role";

grant references on table "public"."supplier_contacts" to "service_role";

grant select on table "public"."supplier_contacts" to "service_role";

grant trigger on table "public"."supplier_contacts" to "service_role";

grant truncate on table "public"."supplier_contacts" to "service_role";

grant update on table "public"."supplier_contacts" to "service_role";

grant delete on table "public"."supplier_credit_note_items" to "anon";

grant insert on table "public"."supplier_credit_note_items" to "anon";

grant references on table "public"."supplier_credit_note_items" to "anon";

grant select on table "public"."supplier_credit_note_items" to "anon";

grant trigger on table "public"."supplier_credit_note_items" to "anon";

grant truncate on table "public"."supplier_credit_note_items" to "anon";

grant update on table "public"."supplier_credit_note_items" to "anon";

grant delete on table "public"."supplier_credit_note_items" to "authenticated";

grant insert on table "public"."supplier_credit_note_items" to "authenticated";

grant references on table "public"."supplier_credit_note_items" to "authenticated";

grant select on table "public"."supplier_credit_note_items" to "authenticated";

grant trigger on table "public"."supplier_credit_note_items" to "authenticated";

grant truncate on table "public"."supplier_credit_note_items" to "authenticated";

grant update on table "public"."supplier_credit_note_items" to "authenticated";

grant delete on table "public"."supplier_credit_note_items" to "service_role";

grant insert on table "public"."supplier_credit_note_items" to "service_role";

grant references on table "public"."supplier_credit_note_items" to "service_role";

grant select on table "public"."supplier_credit_note_items" to "service_role";

grant trigger on table "public"."supplier_credit_note_items" to "service_role";

grant truncate on table "public"."supplier_credit_note_items" to "service_role";

grant update on table "public"."supplier_credit_note_items" to "service_role";

grant delete on table "public"."supplier_credit_notes" to "anon";

grant insert on table "public"."supplier_credit_notes" to "anon";

grant references on table "public"."supplier_credit_notes" to "anon";

grant select on table "public"."supplier_credit_notes" to "anon";

grant trigger on table "public"."supplier_credit_notes" to "anon";

grant truncate on table "public"."supplier_credit_notes" to "anon";

grant update on table "public"."supplier_credit_notes" to "anon";

grant delete on table "public"."supplier_credit_notes" to "authenticated";

grant insert on table "public"."supplier_credit_notes" to "authenticated";

grant references on table "public"."supplier_credit_notes" to "authenticated";

grant select on table "public"."supplier_credit_notes" to "authenticated";

grant trigger on table "public"."supplier_credit_notes" to "authenticated";

grant truncate on table "public"."supplier_credit_notes" to "authenticated";

grant update on table "public"."supplier_credit_notes" to "authenticated";

grant delete on table "public"."supplier_credit_notes" to "service_role";

grant insert on table "public"."supplier_credit_notes" to "service_role";

grant references on table "public"."supplier_credit_notes" to "service_role";

grant select on table "public"."supplier_credit_notes" to "service_role";

grant trigger on table "public"."supplier_credit_notes" to "service_role";

grant truncate on table "public"."supplier_credit_notes" to "service_role";

grant update on table "public"."supplier_credit_notes" to "service_role";

grant delete on table "public"."supplier_documents" to "anon";

grant insert on table "public"."supplier_documents" to "anon";

grant references on table "public"."supplier_documents" to "anon";

grant select on table "public"."supplier_documents" to "anon";

grant trigger on table "public"."supplier_documents" to "anon";

grant truncate on table "public"."supplier_documents" to "anon";

grant update on table "public"."supplier_documents" to "anon";

grant delete on table "public"."supplier_documents" to "authenticated";

grant insert on table "public"."supplier_documents" to "authenticated";

grant references on table "public"."supplier_documents" to "authenticated";

grant select on table "public"."supplier_documents" to "authenticated";

grant trigger on table "public"."supplier_documents" to "authenticated";

grant truncate on table "public"."supplier_documents" to "authenticated";

grant update on table "public"."supplier_documents" to "authenticated";

grant delete on table "public"."supplier_documents" to "service_role";

grant insert on table "public"."supplier_documents" to "service_role";

grant references on table "public"."supplier_documents" to "service_role";

grant select on table "public"."supplier_documents" to "service_role";

grant trigger on table "public"."supplier_documents" to "service_role";

grant truncate on table "public"."supplier_documents" to "service_role";

grant update on table "public"."supplier_documents" to "service_role";

grant delete on table "public"."supplier_payments" to "anon";

grant insert on table "public"."supplier_payments" to "anon";

grant references on table "public"."supplier_payments" to "anon";

grant select on table "public"."supplier_payments" to "anon";

grant trigger on table "public"."supplier_payments" to "anon";

grant truncate on table "public"."supplier_payments" to "anon";

grant update on table "public"."supplier_payments" to "anon";

grant delete on table "public"."supplier_payments" to "authenticated";

grant insert on table "public"."supplier_payments" to "authenticated";

grant references on table "public"."supplier_payments" to "authenticated";

grant select on table "public"."supplier_payments" to "authenticated";

grant trigger on table "public"."supplier_payments" to "authenticated";

grant truncate on table "public"."supplier_payments" to "authenticated";

grant update on table "public"."supplier_payments" to "authenticated";

grant delete on table "public"."supplier_payments" to "service_role";

grant insert on table "public"."supplier_payments" to "service_role";

grant references on table "public"."supplier_payments" to "service_role";

grant select on table "public"."supplier_payments" to "service_role";

grant trigger on table "public"."supplier_payments" to "service_role";

grant truncate on table "public"."supplier_payments" to "service_role";

grant update on table "public"."supplier_payments" to "service_role";

grant delete on table "public"."supplier_products" to "anon";

grant insert on table "public"."supplier_products" to "anon";

grant references on table "public"."supplier_products" to "anon";

grant select on table "public"."supplier_products" to "anon";

grant trigger on table "public"."supplier_products" to "anon";

grant truncate on table "public"."supplier_products" to "anon";

grant update on table "public"."supplier_products" to "anon";

grant delete on table "public"."supplier_products" to "authenticated";

grant insert on table "public"."supplier_products" to "authenticated";

grant references on table "public"."supplier_products" to "authenticated";

grant select on table "public"."supplier_products" to "authenticated";

grant trigger on table "public"."supplier_products" to "authenticated";

grant truncate on table "public"."supplier_products" to "authenticated";

grant update on table "public"."supplier_products" to "authenticated";

grant delete on table "public"."supplier_products" to "service_role";

grant insert on table "public"."supplier_products" to "service_role";

grant references on table "public"."supplier_products" to "service_role";

grant select on table "public"."supplier_products" to "service_role";

grant trigger on table "public"."supplier_products" to "service_role";

grant truncate on table "public"."supplier_products" to "service_role";

grant update on table "public"."supplier_products" to "service_role";

grant delete on table "public"."support_tickets" to "anon";

grant insert on table "public"."support_tickets" to "anon";

grant references on table "public"."support_tickets" to "anon";

grant select on table "public"."support_tickets" to "anon";

grant trigger on table "public"."support_tickets" to "anon";

grant truncate on table "public"."support_tickets" to "anon";

grant update on table "public"."support_tickets" to "anon";

grant delete on table "public"."support_tickets" to "authenticated";

grant insert on table "public"."support_tickets" to "authenticated";

grant references on table "public"."support_tickets" to "authenticated";

grant select on table "public"."support_tickets" to "authenticated";

grant trigger on table "public"."support_tickets" to "authenticated";

grant truncate on table "public"."support_tickets" to "authenticated";

grant update on table "public"."support_tickets" to "authenticated";

grant delete on table "public"."support_tickets" to "service_role";

grant insert on table "public"."support_tickets" to "service_role";

grant references on table "public"."support_tickets" to "service_role";

grant select on table "public"."support_tickets" to "service_role";

grant trigger on table "public"."support_tickets" to "service_role";

grant truncate on table "public"."support_tickets" to "service_role";

grant update on table "public"."support_tickets" to "service_role";

grant delete on table "public"."training_programs" to "anon";

grant insert on table "public"."training_programs" to "anon";

grant references on table "public"."training_programs" to "anon";

grant select on table "public"."training_programs" to "anon";

grant trigger on table "public"."training_programs" to "anon";

grant truncate on table "public"."training_programs" to "anon";

grant update on table "public"."training_programs" to "anon";

grant delete on table "public"."training_programs" to "authenticated";

grant insert on table "public"."training_programs" to "authenticated";

grant references on table "public"."training_programs" to "authenticated";

grant select on table "public"."training_programs" to "authenticated";

grant trigger on table "public"."training_programs" to "authenticated";

grant truncate on table "public"."training_programs" to "authenticated";

grant update on table "public"."training_programs" to "authenticated";

grant delete on table "public"."training_programs" to "service_role";

grant insert on table "public"."training_programs" to "service_role";

grant references on table "public"."training_programs" to "service_role";

grant select on table "public"."training_programs" to "service_role";

grant trigger on table "public"."training_programs" to "service_role";

grant truncate on table "public"."training_programs" to "service_role";

grant update on table "public"."training_programs" to "service_role";

grant delete on table "public"."vat_codes" to "anon";

grant insert on table "public"."vat_codes" to "anon";

grant references on table "public"."vat_codes" to "anon";

grant select on table "public"."vat_codes" to "anon";

grant trigger on table "public"."vat_codes" to "anon";

grant truncate on table "public"."vat_codes" to "anon";

grant update on table "public"."vat_codes" to "anon";

grant delete on table "public"."vat_codes" to "authenticated";

grant insert on table "public"."vat_codes" to "authenticated";

grant references on table "public"."vat_codes" to "authenticated";

grant select on table "public"."vat_codes" to "authenticated";

grant trigger on table "public"."vat_codes" to "authenticated";

grant truncate on table "public"."vat_codes" to "authenticated";

grant update on table "public"."vat_codes" to "authenticated";

grant delete on table "public"."vat_codes" to "service_role";

grant insert on table "public"."vat_codes" to "service_role";

grant references on table "public"."vat_codes" to "service_role";

grant select on table "public"."vat_codes" to "service_role";

grant trigger on table "public"."vat_codes" to "service_role";

grant truncate on table "public"."vat_codes" to "service_role";

grant update on table "public"."vat_codes" to "service_role";

grant delete on table "public"."vat_periods" to "anon";

grant insert on table "public"."vat_periods" to "anon";

grant references on table "public"."vat_periods" to "anon";

grant select on table "public"."vat_periods" to "anon";

grant trigger on table "public"."vat_periods" to "anon";

grant truncate on table "public"."vat_periods" to "anon";

grant update on table "public"."vat_periods" to "anon";

grant delete on table "public"."vat_periods" to "authenticated";

grant insert on table "public"."vat_periods" to "authenticated";

grant references on table "public"."vat_periods" to "authenticated";

grant select on table "public"."vat_periods" to "authenticated";

grant trigger on table "public"."vat_periods" to "authenticated";

grant truncate on table "public"."vat_periods" to "authenticated";

grant update on table "public"."vat_periods" to "authenticated";

grant delete on table "public"."vat_periods" to "service_role";

grant insert on table "public"."vat_periods" to "service_role";

grant references on table "public"."vat_periods" to "service_role";

grant select on table "public"."vat_periods" to "service_role";

grant trigger on table "public"."vat_periods" to "service_role";

grant truncate on table "public"."vat_periods" to "service_role";

grant update on table "public"."vat_periods" to "service_role";

grant delete on table "public"."vehicle_types" to "anon";

grant insert on table "public"."vehicle_types" to "anon";

grant references on table "public"."vehicle_types" to "anon";

grant select on table "public"."vehicle_types" to "anon";

grant trigger on table "public"."vehicle_types" to "anon";

grant truncate on table "public"."vehicle_types" to "anon";

grant update on table "public"."vehicle_types" to "anon";

grant delete on table "public"."vehicle_types" to "authenticated";

grant insert on table "public"."vehicle_types" to "authenticated";

grant references on table "public"."vehicle_types" to "authenticated";

grant select on table "public"."vehicle_types" to "authenticated";

grant trigger on table "public"."vehicle_types" to "authenticated";

grant truncate on table "public"."vehicle_types" to "authenticated";

grant update on table "public"."vehicle_types" to "authenticated";

grant delete on table "public"."vehicle_types" to "service_role";

grant insert on table "public"."vehicle_types" to "service_role";

grant references on table "public"."vehicle_types" to "service_role";

grant select on table "public"."vehicle_types" to "service_role";

grant trigger on table "public"."vehicle_types" to "service_role";

grant truncate on table "public"."vehicle_types" to "service_role";

grant update on table "public"."vehicle_types" to "service_role";


  create policy "Admin and sales can manage abandoned cart followups"
  on "public"."abandoned_cart_followups"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_role('sales'::text)));



  create policy "Admin/accountant can manage accounting_periods"
  on "public"."accounting_periods"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'finance_manager'::text]));



  create policy "Admins can manage advisory_services"
  on "public"."advisory_services"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view advisory_services"
  on "public"."advisory_services"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage advisory_sessions"
  on "public"."advisory_sessions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view advisory_sessions"
  on "public"."advisory_sessions"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin manage advisory rules"
  on "public"."agro_advisory_rules"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read advisory rules"
  on "public"."agro_advisory_rules"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin manage farming systems"
  on "public"."agro_farming_systems"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read farming systems"
  on "public"."agro_farming_systems"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users manage own rec items"
  on "public"."agro_recommendation_items"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.agro_recommendations r
  WHERE ((r.id = agro_recommendation_items.recommendation_id) AND ((r.user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.agro_recommendations r
  WHERE ((r.id = agro_recommendation_items.recommendation_id) AND ((r.user_id = auth.uid()) OR public.is_admin())))));



  create policy "Users read own rec items"
  on "public"."agro_recommendation_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.agro_recommendations r
  WHERE ((r.id = agro_recommendation_items.recommendation_id) AND ((r.user_id = auth.uid()) OR public.is_admin())))));



  create policy "Users create own recommendations"
  on "public"."agro_recommendations"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "Users read own recommendations"
  on "public"."agro_recommendations"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "Users update own recommendations"
  on "public"."agro_recommendations"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "Admin manage region profiles"
  on "public"."agro_region_profiles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read region profiles"
  on "public"."agro_region_profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin manage soil profiles"
  on "public"."agro_soil_profiles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read soil profiles"
  on "public"."agro_soil_profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin manage bundle items"
  on "public"."agro_solution_bundle_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read bundle items"
  on "public"."agro_solution_bundle_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin manage solution bundles"
  on "public"."agro_solution_bundles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read solution bundles"
  on "public"."agro_solution_bundles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "approval_requests_delete"
  on "public"."approval_requests"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "approval_requests_insert"
  on "public"."approval_requests"
  as permissive
  for insert
  to authenticated
with check (((requested_by = auth.uid()) OR public.is_admin()));



  create policy "approval_requests_select"
  on "public"."approval_requests"
  as permissive
  for select
  to authenticated
using (((requested_by = auth.uid()) OR public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('warehouse_officer'::text) OR public.has_role('accountant'::text)));



  create policy "approval_requests_update"
  on "public"."approval_requests"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR ((public.has_role('procurement_officer'::text) OR public.has_role('warehouse_officer'::text) OR public.has_role('accountant'::text)) AND (requested_by <> auth.uid()))))
with check ((public.is_admin() OR ((public.has_role('procurement_officer'::text) OR public.has_role('warehouse_officer'::text) OR public.has_role('accountant'::text)) AND (requested_by <> auth.uid()))));



  create policy "Admin and finance access bank_accounts"
  on "public"."bank_accounts"
  as permissive
  for all
  to public
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['accountant'::text, 'finance_manager'::text])));



  create policy "Admin and finance access bank_statement_imports"
  on "public"."bank_statement_imports"
  as permissive
  for all
  to public
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['accountant'::text, 'finance_manager'::text])));



  create policy "Admin/finance access bank_transaction_reviews"
  on "public"."bank_transaction_reviews"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text, 'accountant'::text]));



  create policy "Admin and finance access bank_transactions"
  on "public"."bank_transactions"
  as permissive
  for all
  to public
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['accountant'::text, 'finance_manager'::text])));



  create policy "Admin/trainer can manage certificates"
  on "public"."certificates"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'trainer'::text])));



  create policy "Authenticated can read certificates"
  on "public"."certificates"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and trainers can manage course classifications"
  on "public"."course_classifications"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_role('trainer'::text)));



  create policy "Authenticated users can read course classifications"
  on "public"."course_classifications"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin full access on crop_plans"
  on "public"."crop_plans"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read crop_plans"
  on "public"."crop_plans"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and sales can manage communication logs"
  on "public"."customer_communication_logs"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'sales_manager'::text, 'accountant'::text]));



  create policy "Admin/finance can manage customer_credit_accounts"
  on "public"."customer_credit_accounts"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text, 'sales_manager'::text])));



  create policy "Authenticated can read customer_credit_accounts"
  on "public"."customer_credit_accounts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/finance can manage customer_credit_ledger"
  on "public"."customer_credit_ledger"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Authenticated can read customer_credit_ledger"
  on "public"."customer_credit_ledger"
  as permissive
  for select
  to authenticated
using (true);



  create policy "ccni_insert"
  on "public"."customer_credit_note_items"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



  create policy "ccni_select"
  on "public"."customer_credit_note_items"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



  create policy "ccn_insert"
  on "public"."customer_credit_notes"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



  create policy "ccn_select"
  on "public"."customer_credit_notes"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



  create policy "ccn_update"
  on "public"."customer_credit_notes"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('accountant'::text)));



  create policy "customer_documents_delete"
  on "public"."customer_documents"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "customer_documents_insert"
  on "public"."customer_documents"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text)));



  create policy "customer_documents_select"
  on "public"."customer_documents"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text)));



  create policy "Admin and finance can manage refunds"
  on "public"."customer_refunds"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'sales_manager'::text]));



  create policy "customers_delete"
  on "public"."customers"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "customers_insert"
  on "public"."customers"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text)));



  create policy "customers_select"
  on "public"."customers"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "customers_update"
  on "public"."customers"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text)))
with check ((public.is_admin() OR public.has_role('sales_manager'::text)));



  create policy "Admins can manage depot_inventory"
  on "public"."depot_inventory"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view depot_inventory"
  on "public"."depot_inventory"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and finance can manage document delivery logs"
  on "public"."document_delivery_logs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text, 'sales_manager'::text])));



  create policy "Admin full access on farm_seasons"
  on "public"."farm_seasons"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read farm_seasons"
  on "public"."farm_seasons"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/accountant can manage gl_accounts"
  on "public"."gl_accounts"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Authenticated users can read gl_accounts"
  on "public"."gl_accounts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can manage harvest_records"
  on "public"."harvest_records"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated can read harvest_records"
  on "public"."harvest_records"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/accountant can manage journal_entries"
  on "public"."journal_entries"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Finance roles can read journal_entries"
  on "public"."journal_entries"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/accountant can manage journal_entry_lines"
  on "public"."journal_entry_lines"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Finance roles can read journal_entry_lines"
  on "public"."journal_entry_lines"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can manage delivery items"
  on "public"."logistics_delivery_items"
  as permissive
  for all
  to authenticated
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



  create policy "Authenticated can view delivery items"
  on "public"."logistics_delivery_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can delete delivery requests"
  on "public"."logistics_delivery_requests"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "Admins can manage delivery requests"
  on "public"."logistics_delivery_requests"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR (created_by = auth.uid())));



  create policy "Authenticated can view delivery requests"
  on "public"."logistics_delivery_requests"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authorized users can create delivery requests"
  on "public"."logistics_delivery_requests"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() IS NOT NULL));



  create policy "Admins can manage rate cards"
  on "public"."logistics_rate_cards"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated can view rate cards"
  on "public"."logistics_rate_cards"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can insert status log"
  on "public"."logistics_status_log"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() IS NOT NULL));



  create policy "Authenticated can view status log"
  on "public"."logistics_status_log"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage commodity grades"
  on "public"."marketplace_commodity_grades"
  as permissive
  for all
  to authenticated
using (public.is_admin());



  create policy "Authenticated users can read commodity grades"
  on "public"."marketplace_commodity_grades"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage channel configs"
  on "public"."notification_channel_configs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Auth users can read channel configs"
  on "public"."notification_channel_configs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/finance can manage payment_allocations"
  on "public"."payment_allocations"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Authenticated can read payment_allocations"
  on "public"."payment_allocations"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin and finance can manage gateway transactions"
  on "public"."payment_gateway_transactions"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'sales_manager'::text]));



  create policy "payment_requests_delete"
  on "public"."payment_requests"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "payment_requests_insert"
  on "public"."payment_requests"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "payment_requests_select"
  on "public"."payment_requests"
  as permissive
  for select
  to authenticated
using (true);



  create policy "payment_requests_update"
  on "public"."payment_requests"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



  create policy "Admin/finance can manage payments"
  on "public"."payments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text, 'sales_manager'::text])));



  create policy "Authenticated can read payments"
  on "public"."payments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can manage planting_records"
  on "public"."planting_records"
  as permissive
  for all
  to authenticated
using (true);



  create policy "Authenticated can read planting_records"
  on "public"."planting_records"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/accountant can manage posting_rules"
  on "public"."posting_rules"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'finance_manager'::text]));



  create policy "Admin can manage product_category_assignments"
  on "public"."product_category_assignments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_category_assignments"
  on "public"."product_category_assignments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_collection_items"
  on "public"."product_collection_items"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_collection_items"
  on "public"."product_collection_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_images"
  on "public"."product_images"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_images"
  on "public"."product_images"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_import_jobs"
  on "public"."product_import_jobs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_import_jobs"
  on "public"."product_import_jobs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_import_rows"
  on "public"."product_import_rows"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_import_rows"
  on "public"."product_import_rows"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_pack_sizes"
  on "public"."product_pack_sizes"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_pack_sizes"
  on "public"."product_pack_sizes"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_pricing_history"
  on "public"."product_pricing_history"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_pricing_history"
  on "public"."product_pricing_history"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_subcategories"
  on "public"."product_subcategories"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_subcategories"
  on "public"."product_subcategories"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_variant_attribute_values"
  on "public"."product_variant_attribute_values"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_variant_attribute_values"
  on "public"."product_variant_attribute_values"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage product_variants"
  on "public"."product_variants"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read product_variants"
  on "public"."product_variants"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin full access on production_stages"
  on "public"."production_stages"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read production_stages"
  on "public"."production_stages"
  as permissive
  for select
  to authenticated
using (true);



  create policy "proforma_items_delete"
  on "public"."proforma_invoice_items"
  as permissive
  for delete
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "proforma_items_insert"
  on "public"."proforma_invoice_items"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "proforma_items_select"
  on "public"."proforma_invoice_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "proforma_items_update"
  on "public"."proforma_invoice_items"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "proforma_delete"
  on "public"."proforma_invoices"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "proforma_insert"
  on "public"."proforma_invoices"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "proforma_select"
  on "public"."proforma_invoices"
  as permissive
  for select
  to authenticated
using (true);



  create policy "proforma_update"
  on "public"."proforma_invoices"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "Admin full access on program_activities"
  on "public"."program_activities"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated read program_activities"
  on "public"."program_activities"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage program_courses"
  on "public"."program_courses"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view program_courses"
  on "public"."program_courses"
  as permissive
  for select
  to authenticated
using (true);



  create policy "quote_items_delete"
  on "public"."quote_items"
  as permissive
  for delete
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "quote_items_insert"
  on "public"."quote_items"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "quote_items_select"
  on "public"."quote_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "quote_items_update"
  on "public"."quote_items"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "quotes_delete"
  on "public"."quotes"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "quotes_insert"
  on "public"."quotes"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "quotes_select"
  on "public"."quotes"
  as permissive
  for select
  to authenticated
using (true);



  create policy "quotes_update"
  on "public"."quotes"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('procurement_officer'::text)));



  create policy "Admin can manage reminder templates"
  on "public"."reminder_templates"
  as permissive
  for all
  to authenticated
using (public.is_admin());



  create policy "roles_read_authenticated"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage seed_product_details"
  on "public"."seed_product_details"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Authenticated can read seed_product_details"
  on "public"."seed_product_details"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/warehouse can manage stock_adjustment_items"
  on "public"."stock_adjustment_items"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'warehouse_officer'::text])));



  create policy "Authenticated can read stock_adjustment_items"
  on "public"."stock_adjustment_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin/warehouse can manage stock_adjustments"
  on "public"."stock_adjustments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'warehouse_officer'::text])));



  create policy "Authenticated can read stock_adjustments"
  on "public"."stock_adjustments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can insert stock_count_items"
  on "public"."stock_count_items"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Authenticated can update stock_count_items"
  on "public"."stock_count_items"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Authenticated can view stock_count_items"
  on "public"."stock_count_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can insert stock_counts"
  on "public"."stock_counts"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Authenticated can update stock_counts"
  on "public"."stock_counts"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Authenticated can view stock_counts"
  on "public"."stock_counts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "supplier_contacts_delete"
  on "public"."supplier_contacts"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "supplier_contacts_insert"
  on "public"."supplier_contacts"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('procurement_officer'::text)));



  create policy "supplier_contacts_select"
  on "public"."supplier_contacts"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('supplier'::text)));



  create policy "supplier_contacts_update"
  on "public"."supplier_contacts"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text)))
with check ((public.is_admin() OR public.has_role('procurement_officer'::text)));



  create policy "scni_insert"
  on "public"."supplier_credit_note_items"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "scni_select"
  on "public"."supplier_credit_note_items"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "scn_insert"
  on "public"."supplier_credit_notes"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "scn_select"
  on "public"."supplier_credit_notes"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "scn_update"
  on "public"."supplier_credit_notes"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('accountant'::text)));



  create policy "supplier_documents_delete"
  on "public"."supplier_documents"
  as permissive
  for delete
  to authenticated
using (public.is_admin());



  create policy "supplier_documents_insert"
  on "public"."supplier_documents"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('procurement_officer'::text)));



  create policy "supplier_documents_select"
  on "public"."supplier_documents"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text)));



  create policy "sp_insert"
  on "public"."supplier_payments"
  as permissive
  for insert
  to authenticated
with check ((public.is_admin() OR public.has_role('accountant'::text)));



  create policy "sp_select"
  on "public"."supplier_payments"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('procurement_officer'::text) OR public.has_role('accountant'::text)));



  create policy "sp_update"
  on "public"."supplier_payments"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('accountant'::text)));



  create policy "Authenticated users can manage supplier products"
  on "public"."supplier_products"
  as permissive
  for all
  to authenticated
using (true)
with check (true);



  create policy "Admins can manage support_tickets"
  on "public"."support_tickets"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view support_tickets"
  on "public"."support_tickets"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can create support_tickets"
  on "public"."support_tickets"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "Admins can manage training_programs"
  on "public"."training_programs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view training_programs"
  on "public"."training_programs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage vat_codes"
  on "public"."vat_codes"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can read vat_codes"
  on "public"."vat_codes"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage vat_periods"
  on "public"."vat_periods"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can read vat_periods"
  on "public"."vat_periods"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admins can manage vehicle types"
  on "public"."vehicle_types"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Authenticated users can view vehicle types"
  on "public"."vehicle_types"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Admin can manage weather_snapshots"
  on "public"."weather_snapshots"
  as permissive
  for all
  to authenticated
using (public.is_admin());



  create policy "Authenticated can read weather_snapshots"
  on "public"."weather_snapshots"
  as permissive
  for select
  to authenticated
using (true);



  create policy "addresses_manage_own_or_admin"
  on "public"."addresses"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "addresses_select_own_or_admin"
  on "public"."addresses"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_conversations_insert_own_or_admin"
  on "public"."advisor_conversations"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_conversations_select_own_or_admin"
  on "public"."advisor_conversations"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_conversations_update_own_or_admin"
  on "public"."advisor_conversations"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_escalation_rules_admin_manage"
  on "public"."advisor_escalation_rules"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_escalation_rules_admin_or_trainer_read"
  on "public"."advisor_escalation_rules"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "advisor_execution_runs_insert_own_or_admin"
  on "public"."advisor_execution_runs"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_execution_runs_select_own_or_admin"
  on "public"."advisor_execution_runs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_execution_runs_update_admin_only"
  on "public"."advisor_execution_runs"
  as permissive
  for update
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_feedback_select_own_or_admin"
  on "public"."advisor_feedback"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_feedback_update_own_or_admin"
  on "public"."advisor_feedback"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_guardrails_admin_manage"
  on "public"."advisor_guardrails"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_guardrails_admin_or_trainer_read"
  on "public"."advisor_guardrails"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "advisor_message_sources_manage_admin_only"
  on "public"."advisor_message_sources"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_message_sources_select_own_message_or_admin"
  on "public"."advisor_message_sources"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.advisor_messages m
     JOIN public.advisor_conversations c ON ((c.id = m.conversation_id)))
  WHERE ((m.id = advisor_message_sources.message_id) AND ((c.user_id = auth.uid()) OR public.is_admin())))));



  create policy "advisor_messages_insert_own_conversation_or_admin"
  on "public"."advisor_messages"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.advisor_conversations c
  WHERE ((c.id = advisor_messages.conversation_id) AND ((c.user_id = auth.uid()) OR public.is_admin())))));



  create policy "advisor_messages_select_own_conversation_or_admin"
  on "public"."advisor_messages"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.advisor_conversations c
  WHERE ((c.id = advisor_messages.conversation_id) AND ((c.user_id = auth.uid()) OR public.is_admin())))));



  create policy "advisor_profile_guardrails_admin_manage"
  on "public"."advisor_profile_guardrails"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_profile_guardrails_admin_or_trainer_read"
  on "public"."advisor_profile_guardrails"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "advisor_profile_model_configs_admin_manage"
  on "public"."advisor_profile_model_configs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_profile_model_configs_admin_read"
  on "public"."advisor_profile_model_configs"
  as permissive
  for select
  to authenticated
using (public.is_admin());



  create policy "advisor_profile_tools_manage_admin"
  on "public"."advisor_profile_tools"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_profiles_manage_admin"
  on "public"."advisor_profiles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_profiles_read_authenticated"
  on "public"."advisor_profiles"
  as permissive
  for select
  to authenticated
using (((is_active = true) OR public.is_admin()));



  create policy "advisor_prompt_templates_admin_only_manage"
  on "public"."advisor_prompt_templates"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_prompt_templates_admin_or_trainer_read"
  on "public"."advisor_prompt_templates"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "advisor_query_logs_manage_admin_only"
  on "public"."advisor_query_logs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_query_logs_select_own_or_admin"
  on "public"."advisor_query_logs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_retrieval_logs_manage_admin_only"
  on "public"."advisor_retrieval_logs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_retrieval_logs_select_own_or_admin"
  on "public"."advisor_retrieval_logs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_retrieval_results_manage_admin_only"
  on "public"."advisor_retrieval_results"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_retrieval_results_select_own_or_admin"
  on "public"."advisor_retrieval_results"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.advisor_retrieval_logs rl
  WHERE ((rl.id = advisor_retrieval_results.retrieval_log_id) AND ((rl.user_id = auth.uid()) OR public.is_admin())))));



  create policy "advisor_run_events_manage_admin_only"
  on "public"."advisor_run_events"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_run_events_select_own_or_admin"
  on "public"."advisor_run_events"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.advisor_execution_runs r
  WHERE ((r.id = advisor_run_events.execution_run_id) AND ((r.user_id = auth.uid()) OR public.is_admin())))));



  create policy "advisor_source_rules_admin_manage"
  on "public"."advisor_source_rules"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_source_rules_admin_or_trainer_read"
  on "public"."advisor_source_rules"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "advisor_tools_manage_admin"
  on "public"."advisor_tools"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_tools_read_authenticated"
  on "public"."advisor_tools"
  as permissive
  for select
  to authenticated
using (((is_active = true) OR public.is_admin()));



  create policy "advisor_usage_records_manage_admin_only"
  on "public"."advisor_usage_records"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_usage_records_select_own_or_admin"
  on "public"."advisor_usage_records"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_web_search_logs_manage_admin_only"
  on "public"."advisor_web_search_logs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_web_search_logs_select_own_or_admin"
  on "public"."advisor_web_search_logs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "advisor_web_search_results_manage_admin_only"
  on "public"."advisor_web_search_results"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "advisor_web_search_results_select_own_or_admin"
  on "public"."advisor_web_search_results"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.advisor_web_search_logs wl
  WHERE ((wl.id = advisor_web_search_results.web_search_log_id) AND ((wl.user_id = auth.uid()) OR public.is_admin())))));



  create policy "agronomy_tool_runs_insert_own_or_admin"
  on "public"."agronomy_tool_runs"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "agronomy_tool_runs_select_own_or_admin"
  on "public"."agronomy_tool_runs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "agronomy_tool_runs_update_own_or_admin"
  on "public"."agronomy_tool_runs"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "agronomy_tool_templates_manage_admin_or_trainer"
  on "public"."agronomy_tool_templates"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "agronomy_tool_templates_read_by_access_level"
  on "public"."agronomy_tool_templates"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (access_level = 'public'::text) OR (access_level = 'authenticated'::text) OR ((access_level = 'premium'::text) AND (EXISTS ( SELECT 1
   FROM public.subscriptions s
  WHERE ((s.user_id = auth.uid()) AND (s.status = ANY (ARRAY['trialing'::text, 'active'::text]))))))));



  create policy "agronomy_tools_manage_admin_or_trainer"
  on "public"."agronomy_tools"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "agronomy_tools_read_authenticated"
  on "public"."agronomy_tools"
  as permissive
  for select
  to authenticated
using (((is_active = true) OR public.is_admin()));



  create policy "ai_models_admin_only"
  on "public"."ai_models"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "ai_providers_admin_only"
  on "public"."ai_providers"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "audit_logs_admin_only"
  on "public"."audit_logs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "cart_items_manage_own_or_admin"
  on "public"."cart_items"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.carts c
  WHERE ((c.id = cart_items.cart_id) AND (c.user_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM public.carts c
  WHERE ((c.id = cart_items.cart_id) AND (c.user_id = auth.uid())))) OR public.is_admin()));



  create policy "cart_items_select_own_or_admin"
  on "public"."cart_items"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.carts c
  WHERE ((c.id = cart_items.cart_id) AND (c.user_id = auth.uid())))) OR public.is_admin()));



  create policy "carts_manage_own_or_admin"
  on "public"."carts"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "carts_select_own_or_admin"
  on "public"."carts"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "coupon_codes_admin_only"
  on "public"."coupon_codes"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "coupon_codes_admin_only_read"
  on "public"."coupon_codes"
  as permissive
  for select
  to authenticated
using (public.is_admin());



  create policy "course_categories_admin_or_trainer_manage"
  on "public"."course_categories"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "course_modules_manage_admin_or_trainer"
  on "public"."course_modules"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "course_modules_read_if_enrolled_or_admin_or_trainer"
  on "public"."course_modules"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text) OR (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.id = course_modules.course_id) AND (public.is_enrolled_in_course(c.id) OR (c.price = (0)::numeric) OR (c.status = 'published'::text)))))));



  create policy "courses_manage_admin_or_trainer"
  on "public"."courses"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "crop_calendar_events_manage_via_plan_owner"
  on "public"."crop_calendar_events"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.crop_calendar_plans cp
  WHERE ((cp.id = crop_calendar_events.crop_calendar_plan_id) AND ((cp.user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.crop_calendar_plans cp
  WHERE ((cp.id = crop_calendar_events.crop_calendar_plan_id) AND ((cp.user_id = auth.uid()) OR public.is_admin())))));



  create policy "crop_calendar_events_select_via_plan_owner"
  on "public"."crop_calendar_events"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.crop_calendar_plans cp
  WHERE ((cp.id = crop_calendar_events.crop_calendar_plan_id) AND ((cp.user_id = auth.uid()) OR public.is_admin())))));



  create policy "crop_calendar_plans_manage_own_or_admin"
  on "public"."crop_calendar_plans"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "crop_calendar_plans_select_own_or_admin"
  on "public"."crop_calendar_plans"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "crop_recommendations_manage_admin_or_trainer"
  on "public"."crop_recommendations"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "crop_recommendations_select_owner_or_admin"
  on "public"."crop_recommendations"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = crop_recommendations.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = crop_recommendations.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "crops_manage_farm_owner_or_admin"
  on "public"."crops"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = crops.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = crops.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "crops_select_farm_owner_or_admin"
  on "public"."crops"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = crops.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "customer_invoice_items_admin_manage"
  on "public"."customer_invoice_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "customer_invoice_items_select_owner_or_admin"
  on "public"."customer_invoice_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.customer_invoices ci
  WHERE ((ci.id = customer_invoice_items.customer_invoice_id) AND ((ci.customer_id = auth.uid()) OR public.is_admin())))));



  create policy "customer_invoices_admin_manage"
  on "public"."customer_invoices"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "customer_invoices_select_owner_or_admin"
  on "public"."customer_invoices"
  as permissive
  for select
  to authenticated
using (((customer_id = auth.uid()) OR public.is_admin()));



  create policy "delivery_requests_insert_owner_or_admin"
  on "public"."delivery_requests"
  as permissive
  for insert
  to authenticated
with check (((requested_by = auth.uid()) OR public.is_admin()));



  create policy "delivery_requests_select_owner_or_admin"
  on "public"."delivery_requests"
  as permissive
  for select
  to authenticated
using (((requested_by = auth.uid()) OR public.is_admin()));



  create policy "delivery_requests_update_admin_or_logistics"
  on "public"."delivery_requests"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('logistics_partner'::text)))
with check ((public.is_admin() OR public.has_role('logistics_partner'::text)));



  create policy "delivery_status_logs_manage_admin_or_logistics"
  on "public"."delivery_status_logs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('logistics_partner'::text)))
with check ((public.is_admin() OR public.has_role('logistics_partner'::text)));



  create policy "delivery_status_logs_select_owner_admin_logistics"
  on "public"."delivery_status_logs"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.delivery_requests dr
  WHERE ((dr.id = delivery_status_logs.delivery_request_id) AND ((dr.requested_by = auth.uid()) OR public.is_admin() OR public.has_role('logistics_partner'::text))))));



  create policy "depot_zones_admin_only"
  on "public"."depot_zones"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "depots_admin_only"
  on "public"."depots"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "enrollments_insert_own_or_admin"
  on "public"."enrollments"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "enrollments_select_own_or_admin"
  on "public"."enrollments"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "enrollments_update_own_or_admin"
  on "public"."enrollments"
  as permissive
  for update
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "farm_activities_manage_owner_or_admin"
  on "public"."farm_activities"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = farm_activities.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = farm_activities.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = farm_activities.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = farm_activities.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "farm_activities_select_owner_or_admin"
  on "public"."farm_activities"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = farm_activities.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = farm_activities.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "farms_manage_team_owner_or_admin"
  on "public"."farms"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.teams t
  WHERE ((t.id = farms.team_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM public.teams t
  WHERE ((t.id = farms.team_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "farms_select_team_owner_or_admin"
  on "public"."farms"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.teams t
  WHERE ((t.id = farms.team_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "fertiliser_plan_items_manage_via_recommendation_owner"
  on "public"."fertiliser_plan_items"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.fertiliser_recommendations fr
  WHERE ((fr.id = fertiliser_plan_items.recommendation_id) AND ((fr.user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.fertiliser_recommendations fr
  WHERE ((fr.id = fertiliser_plan_items.recommendation_id) AND ((fr.user_id = auth.uid()) OR public.is_admin())))));



  create policy "fertiliser_plan_items_select_via_recommendation_owner"
  on "public"."fertiliser_plan_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.fertiliser_recommendations fr
  WHERE ((fr.id = fertiliser_plan_items.recommendation_id) AND ((fr.user_id = auth.uid()) OR public.is_admin())))));



  create policy "fertiliser_recommendations_manage_own_or_admin"
  on "public"."fertiliser_recommendations"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "fertiliser_recommendations_select_own_or_admin"
  on "public"."fertiliser_recommendations"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "fields_manage_farm_owner_or_admin"
  on "public"."fields"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = fields.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = fields.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "fields_select_farm_owner_or_admin"
  on "public"."fields"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE ((f.id = fields.farm_id) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "fulfillment_batches_admin_only"
  on "public"."fulfillment_batches"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "goods_receipt_items_admin_only"
  on "public"."goods_receipt_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "goods_receipts_admin_only"
  on "public"."goods_receipts"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "inventory_batches_admin_only"
  on "public"."inventory_batches"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "irrigation_plan_events_manage_via_plan_owner"
  on "public"."irrigation_plan_events"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.irrigation_plans ip
  WHERE ((ip.id = irrigation_plan_events.irrigation_plan_id) AND ((ip.user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.irrigation_plans ip
  WHERE ((ip.id = irrigation_plan_events.irrigation_plan_id) AND ((ip.user_id = auth.uid()) OR public.is_admin())))));



  create policy "irrigation_plan_events_select_via_plan_owner"
  on "public"."irrigation_plan_events"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.irrigation_plans ip
  WHERE ((ip.id = irrigation_plan_events.irrigation_plan_id) AND ((ip.user_id = auth.uid()) OR public.is_admin())))));



  create policy "irrigation_plans_manage_own_or_admin"
  on "public"."irrigation_plans"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "irrigation_plans_select_own_or_admin"
  on "public"."irrigation_plans"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "knowledge_document_chunks_manage_admin_or_trainer"
  on "public"."knowledge_document_chunks"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "knowledge_document_chunks_read_via_document_access"
  on "public"."knowledge_document_chunks"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.knowledge_documents d
  WHERE ((d.id = knowledge_document_chunks.document_id) AND (public.is_admin() OR ((d.is_published = true) AND ((d.access_level = 'public'::text) OR (d.access_level = 'authenticated'::text) OR ((d.access_level = 'premium'::text) AND (EXISTS ( SELECT 1
           FROM public.subscriptions s
          WHERE ((s.user_id = auth.uid()) AND (s.status = ANY (ARRAY['trialing'::text, 'active'::text])))))))))))));



  create policy "knowledge_documents_manage_admin_or_trainer"
  on "public"."knowledge_documents"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "knowledge_documents_read_by_access_level"
  on "public"."knowledge_documents"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR ((is_published = true) AND ((access_level = 'public'::text) OR (access_level = 'authenticated'::text) OR ((access_level = 'premium'::text) AND (EXISTS ( SELECT 1
   FROM public.subscriptions s
  WHERE ((s.user_id = auth.uid()) AND (s.status = ANY (ARRAY['trialing'::text, 'active'::text]))))))))));



  create policy "knowledge_ingestion_jobs_admin_or_trainer_manage"
  on "public"."knowledge_ingestion_jobs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "knowledge_sources_manage_admin_or_trainer"
  on "public"."knowledge_sources"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "knowledge_sources_read_authenticated_or_admin"
  on "public"."knowledge_sources"
  as permissive
  for select
  to authenticated
using (((is_active = true) OR public.is_admin()));



  create policy "lesson_resources_manage_admin_or_trainer"
  on "public"."lesson_resources"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "lesson_resources_read_if_enrolled_or_admin_or_trainer"
  on "public"."lesson_resources"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text) OR (EXISTS ( SELECT 1
   FROM ((public.lessons l
     JOIN public.course_modules cm ON ((cm.id = l.module_id)))
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((l.id = lesson_resources.lesson_id) AND (public.is_enrolled_in_course(c.id) OR ((c.price = (0)::numeric) AND (l.is_preview = true))))))));



  create policy "lessons_manage_admin_or_trainer"
  on "public"."lessons"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "lessons_read_if_enrolled_or_admin_or_trainer"
  on "public"."lessons"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text) OR (EXISTS ( SELECT 1
   FROM (public.course_modules cm
     JOIN public.courses c ON ((c.id = cm.course_id)))
  WHERE ((cm.id = lessons.module_id) AND (public.is_enrolled_in_course(c.id) OR ((c.price = (0)::numeric) AND (lessons.is_preview = true))))))));



  create policy "lime_recommendations_manage_own_or_admin"
  on "public"."lime_recommendations"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "lime_recommendations_select_own_or_admin"
  on "public"."lime_recommendations"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "marketplace_buyer_requests_manage_owner_or_admin"
  on "public"."marketplace_buyer_requests"
  as permissive
  for all
  to authenticated
using (((buyer_user_id = auth.uid()) OR public.is_admin()))
with check (((buyer_user_id = auth.uid()) OR public.is_admin()));



  create policy "marketplace_buyer_requests_read_owner_or_published_or_admin"
  on "public"."marketplace_buyer_requests"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (buyer_user_id = auth.uid()) OR ((status = 'open'::text) AND ((visibility_scope = 'public'::text) OR (visibility_scope = 'authenticated'::text)))));



  create policy "marketplace_commodities_admin_manage"
  on "public"."marketplace_commodities"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_commodities_read_authenticated"
  on "public"."marketplace_commodities"
  as permissive
  for select
  to authenticated
using (((is_active = true) OR public.is_admin()));



  create policy "marketplace_disputes_manage_related_parties_or_admin"
  on "public"."marketplace_disputes"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR (raised_by_user_id = auth.uid())))
with check ((public.is_admin() OR (raised_by_user_id = auth.uid())));



  create policy "marketplace_disputes_read_related_parties_or_admin"
  on "public"."marketplace_disputes"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (raised_by_user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.marketplace_trades t
  WHERE ((t.id = marketplace_disputes.trade_id) AND ((t.seller_user_id = auth.uid()) OR (t.buyer_user_id = auth.uid())))))));



  create policy "marketplace_listing_documents_manage_owner_or_admin"
  on "public"."marketplace_listing_documents"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_documents.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_documents.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))));



  create policy "marketplace_listing_documents_read_owner_or_admin"
  on "public"."marketplace_listing_documents"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_documents.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))));



  create policy "marketplace_listing_images_manage_owner_or_admin"
  on "public"."marketplace_listing_images"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_images.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_images.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))));



  create policy "marketplace_listing_images_read_via_listing"
  on "public"."marketplace_listing_images"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_images.listing_id) AND (public.is_admin() OR (l.seller_user_id = auth.uid()) OR ((l.status = 'published'::text) AND ((l.visibility_scope = 'public'::text) OR (l.visibility_scope = 'authenticated'::text))))))));



  create policy "marketplace_listing_lots_manage_owner_or_admin"
  on "public"."marketplace_listing_lots"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_lots.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_lots.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))));



  create policy "marketplace_listing_lots_read_via_listing"
  on "public"."marketplace_listing_lots"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_listing_lots.listing_id) AND (public.is_admin() OR (l.seller_user_id = auth.uid()) OR ((l.status = 'published'::text) AND ((l.visibility_scope = 'public'::text) OR (l.visibility_scope = 'authenticated'::text))))))));



  create policy "marketplace_listing_statuses_admin_manage"
  on "public"."marketplace_listing_statuses"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_listings_manage_owner_or_admin"
  on "public"."marketplace_listings"
  as permissive
  for all
  to authenticated
using (((seller_user_id = auth.uid()) OR public.is_admin()))
with check (((seller_user_id = auth.uid()) OR public.is_admin()));



  create policy "marketplace_listings_read_by_visibility"
  on "public"."marketplace_listings"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (seller_user_id = auth.uid()) OR ((status = 'published'::text) AND ((visibility_scope = 'public'::text) OR (visibility_scope = 'authenticated'::text)))));



  create policy "marketplace_matches_admin_manage"
  on "public"."marketplace_matches"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_matches_read_related_parties_or_admin"
  on "public"."marketplace_matches"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_matches.listing_id) AND (l.seller_user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.marketplace_buyer_requests br
  WHERE ((br.id = marketplace_matches.buyer_request_id) AND (br.buyer_user_id = auth.uid()))))));



  create policy "marketplace_offer_messages_manage_related_parties_or_admin"
  on "public"."marketplace_offer_messages"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_offers o
  WHERE ((o.id = marketplace_offer_messages.offer_id) AND (public.is_admin() OR (o.seller_user_id = auth.uid()) OR (o.buyer_user_id = auth.uid()))))))
with check ((EXISTS ( SELECT 1
   FROM public.marketplace_offers o
  WHERE ((o.id = marketplace_offer_messages.offer_id) AND (public.is_admin() OR (o.seller_user_id = auth.uid()) OR (o.buyer_user_id = auth.uid()))))));



  create policy "marketplace_offer_messages_read_related_parties_or_admin"
  on "public"."marketplace_offer_messages"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_offers o
  WHERE ((o.id = marketplace_offer_messages.offer_id) AND (public.is_admin() OR (o.seller_user_id = auth.uid()) OR (o.buyer_user_id = auth.uid()))))));



  create policy "marketplace_offers_manage_related_parties_or_admin"
  on "public"."marketplace_offers"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR (seller_user_id = auth.uid()) OR (buyer_user_id = auth.uid())))
with check ((public.is_admin() OR (seller_user_id = auth.uid()) OR (buyer_user_id = auth.uid())));



  create policy "marketplace_offers_read_related_parties_or_admin"
  on "public"."marketplace_offers"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (seller_user_id = auth.uid()) OR (buyer_user_id = auth.uid())));



  create policy "marketplace_payouts_manage_admin_only"
  on "public"."marketplace_payouts"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_payouts_read_related_seller_or_admin"
  on "public"."marketplace_payouts"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (seller_user_id = auth.uid())));



  create policy "marketplace_price_observations_admin_manage"
  on "public"."marketplace_price_observations"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_quality_attributes_manage_owner_or_admin"
  on "public"."marketplace_quality_attributes"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_quality_attributes.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_quality_attributes.listing_id) AND ((l.seller_user_id = auth.uid()) OR public.is_admin())))));



  create policy "marketplace_quality_attributes_read_via_listing"
  on "public"."marketplace_quality_attributes"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.marketplace_listings l
  WHERE ((l.id = marketplace_quality_attributes.listing_id) AND (public.is_admin() OR (l.seller_user_id = auth.uid()) OR ((l.status = 'published'::text) AND ((l.visibility_scope = 'public'::text) OR (l.visibility_scope = 'authenticated'::text))))))));



  create policy "marketplace_settlements_manage_admin_only"
  on "public"."marketplace_settlements"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_settlements_read_related_parties_or_admin"
  on "public"."marketplace_settlements"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (EXISTS ( SELECT 1
   FROM public.marketplace_trades t
  WHERE ((t.id = marketplace_settlements.trade_id) AND ((t.seller_user_id = auth.uid()) OR (t.buyer_user_id = auth.uid())))))));



  create policy "marketplace_trades_manage_admin_only"
  on "public"."marketplace_trades"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "marketplace_trades_read_related_parties_or_admin"
  on "public"."marketplace_trades"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR (seller_user_id = auth.uid()) OR (buyer_user_id = auth.uid())));



  create policy "notification_preferences_manage_own_or_admin"
  on "public"."notification_preferences"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "notification_preferences_select_own_or_admin"
  on "public"."notification_preferences"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "notification_templates_admin_only"
  on "public"."notification_templates"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "notifications_manage_admin_only"
  on "public"."notifications"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "notifications_select_own_or_admin"
  on "public"."notifications"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "order_items_manage_admin_only"
  on "public"."order_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "order_items_select_order_owner_or_admin"
  on "public"."order_items"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))) OR public.is_admin()));



  create policy "orders_insert_own_or_admin"
  on "public"."orders"
  as permissive
  for insert
  to authenticated
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "orders_select_own_or_admin"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "orders_update_admin_only"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "organization_members_manage_admin"
  on "public"."organization_members"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "organization_members_select_member_or_admin"
  on "public"."organization_members"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.belongs_to_organization(organization_id) OR public.is_admin()));



  create policy "organizations_manage_admin"
  on "public"."organizations"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "organizations_select_member_or_admin"
  on "public"."organizations"
  as permissive
  for select
  to authenticated
using ((public.belongs_to_organization(id) OR public.is_admin()));



  create policy "payment_gateways_admin_only"
  on "public"."payment_gateways"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "payment_transactions_manage_admin_only"
  on "public"."payment_transactions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "payment_transactions_select_own_or_admin"
  on "public"."payment_transactions"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "permissions_manage_admin"
  on "public"."permissions"
  as permissive
  for all
  to public
using ((public.current_user_has_permission('permissions:manage'::text) OR public.current_user_has_role('superuser'::text)))
with check ((public.current_user_has_permission('permissions:manage'::text) OR public.current_user_has_role('superuser'::text)));



  create policy "permissions_select_admin"
  on "public"."permissions"
  as permissive
  for select
  to public
using ((public.current_user_has_permission('permissions:view'::text) OR public.user_has_any_role(auth.uid(), ARRAY['admin'::text, 'superuser'::text])));



  create policy "pick_tasks_admin_only"
  on "public"."pick_tasks"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "pick_waves_admin_only"
  on "public"."pick_waves"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "product_attribute_assignments_admin_or_supplier_manage"
  on "public"."product_attribute_assignments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('supplier'::text)))
with check ((public.is_admin() OR public.has_role('supplier'::text)));



  create policy "product_attribute_options_admin_manage"
  on "public"."product_attribute_options"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "product_attribute_options_admin_or_trainer_read"
  on "public"."product_attribute_options"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "product_attributes_admin_manage"
  on "public"."product_attributes"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "product_attributes_admin_or_trainer_read"
  on "public"."product_attributes"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "product_categories_manage_admin"
  on "public"."product_categories"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "product_collections_manage_admin"
  on "public"."product_collections"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "products_manage_admin_or_supplier"
  on "public"."products"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('supplier'::text)))
with check ((public.is_admin() OR public.has_role('supplier'::text)));



  create policy "profiles_insert_self_or_admin"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check (((id = auth.uid()) OR public.is_admin()));



  create policy "profiles_select_own_or_admin"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (((id = auth.uid()) OR public.is_admin()));



  create policy "profiles_update_own_or_admin"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (((id = auth.uid()) OR public.is_admin()))
with check (((id = auth.uid()) OR public.is_admin()));



  create policy "purchase_order_items_admin_only"
  on "public"."purchase_order_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "purchase_orders_admin_only"
  on "public"."purchase_orders"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "role_permissions_manage_admin"
  on "public"."role_permissions"
  as permissive
  for all
  to public
using ((public.current_user_has_permission('roles:manage'::text) OR public.current_user_has_role('superuser'::text)))
with check ((public.current_user_has_permission('roles:manage'::text) OR public.current_user_has_role('superuser'::text)));



  create policy "role_permissions_select_admin"
  on "public"."role_permissions"
  as permissive
  for select
  to public
using ((public.current_user_has_permission('roles:view'::text) OR public.current_user_has_role('superuser'::text)));



  create policy "shipment_package_items_admin_only"
  on "public"."shipment_package_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "shipment_packages_admin_only"
  on "public"."shipment_packages"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "soil_tests_manage_field_or_farm_owner_or_admin"
  on "public"."soil_tests"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = soil_tests.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = soil_tests.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = soil_tests.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = soil_tests.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "soil_tests_select_field_or_farm_owner_or_admin"
  on "public"."soil_tests"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.farms f
     JOIN public.teams t ON ((t.id = f.team_id)))
  WHERE (((f.id = soil_tests.farm_id) OR (EXISTS ( SELECT 1
           FROM public.fields fld
          WHERE ((fld.id = soil_tests.field_id) AND (fld.farm_id = f.id))))) AND (t.owner_id = auth.uid())))) OR public.is_admin()));



  create policy "spray_program_items_manage_via_program_owner"
  on "public"."spray_program_items"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.spray_programs sp
  WHERE ((sp.id = spray_program_items.spray_program_id) AND ((sp.user_id = auth.uid()) OR public.is_admin())))))
with check ((EXISTS ( SELECT 1
   FROM public.spray_programs sp
  WHERE ((sp.id = spray_program_items.spray_program_id) AND ((sp.user_id = auth.uid()) OR public.is_admin())))));



  create policy "spray_program_items_select_via_program_owner"
  on "public"."spray_program_items"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.spray_programs sp
  WHERE ((sp.id = spray_program_items.spray_program_id) AND ((sp.user_id = auth.uid()) OR public.is_admin())))));



  create policy "spray_programs_manage_own_or_admin"
  on "public"."spray_programs"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "spray_programs_select_own_or_admin"
  on "public"."spray_programs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "stock_movements_admin_only"
  on "public"."stock_movements"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "stock_transfer_items_admin_only"
  on "public"."stock_transfer_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "stock_transfers_admin_only"
  on "public"."stock_transfers"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "storage_bins_admin_only"
  on "public"."storage_bins"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "subscription_plans_manage_admin"
  on "public"."subscription_plans"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "subscriptions_manage_admin"
  on "public"."subscriptions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "subscriptions_select_own_or_admin"
  on "public"."subscriptions"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "supplier_invoice_items_admin_only"
  on "public"."supplier_invoice_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "supplier_invoices_admin_only"
  on "public"."supplier_invoices"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "suppliers_admin_only"
  on "public"."suppliers"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "system_settings_admin_only"
  on "public"."system_settings"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "teams_manage_owner_or_admin"
  on "public"."teams"
  as permissive
  for all
  to authenticated
using (((owner_id = auth.uid()) OR public.is_admin()))
with check (((owner_id = auth.uid()) OR public.is_admin()));



  create policy "teams_select_owner_or_admin"
  on "public"."teams"
  as permissive
  for select
  to authenticated
using (((owner_id = auth.uid()) OR public.is_admin()));



  create policy "user_permission_overrides_manage_admin"
  on "public"."user_permission_overrides"
  as permissive
  for all
  to public
using ((public.current_user_has_permission('users:manage'::text) OR public.current_user_has_role('superuser'::text)))
with check ((public.current_user_has_permission('users:manage'::text) OR public.current_user_has_role('superuser'::text)));



  create policy "user_permission_overrides_select_admin"
  on "public"."user_permission_overrides"
  as permissive
  for select
  to public
using ((public.current_user_has_permission('users:view'::text) OR public.current_user_has_role('superuser'::text)));



  create policy "user_role_assignments_manage_admin"
  on "public"."user_role_assignments"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "user_role_assignments_select_self_or_admin"
  on "public"."user_role_assignments"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "wallet_transactions_manage_admin_only"
  on "public"."wallet_transactions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "wallet_transactions_select_wallet_owner_or_admin"
  on "public"."wallet_transactions"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.wallets w
  WHERE ((w.id = wallet_transactions.wallet_id) AND (w.user_id = auth.uid())))) OR public.is_admin()));



  create policy "wallets_manage_admin_only"
  on "public"."wallets"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "wallets_select_owner_or_admin"
  on "public"."wallets"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "website_crawl_pages_admin_manage"
  on "public"."website_crawl_pages"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "website_crawl_pages_admin_or_trainer_read"
  on "public"."website_crawl_pages"
  as permissive
  for select
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "website_crawl_targets_admin_or_trainer_manage"
  on "public"."website_crawl_targets"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.has_role('trainer'::text)))
with check ((public.is_admin() OR public.has_role('trainer'::text)));



  create policy "yield_estimator_runs_manage_own_or_admin"
  on "public"."yield_estimator_runs"
  as permissive
  for all
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()))
with check (((user_id = auth.uid()) OR public.is_admin()));



  create policy "yield_estimator_runs_select_own_or_admin"
  on "public"."yield_estimator_runs"
  as permissive
  for select
  to authenticated
using (((user_id = auth.uid()) OR public.is_admin()));


CREATE TRIGGER trg_advisory_session_number BEFORE INSERT ON public.advisory_sessions FOR EACH ROW EXECUTE FUNCTION public.set_advisory_session_number();

CREATE TRIGGER trg_prevent_self_approval BEFORE UPDATE ON public.approval_requests FOR EACH ROW EXECUTE FUNCTION public.prevent_self_approval();

CREATE TRIGGER set_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_populate_review_fields BEFORE INSERT OR UPDATE ON public.bank_transaction_reviews FOR EACH ROW EXECUTE FUNCTION public.populate_review_from_transaction();

CREATE TRIGGER set_bank_transactions_updated_at BEFORE UPDATE ON public.bank_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_depot_inventory_updated_at BEFORE UPDATE ON public.depot_inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_set_delivery_request_number BEFORE INSERT ON public.logistics_delivery_requests FOR EACH ROW EXECUTE FUNCTION public.set_delivery_request_number();

CREATE TRIGGER set_stock_counts_updated_at BEFORE UPDATE ON public.stock_counts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_support_ticket_number BEFORE INSERT ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.set_support_ticket_number();

CREATE TRIGGER trg_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_conversations_updated_at BEFORE UPDATE ON public.advisor_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_escalation_rules_updated_at BEFORE UPDATE ON public.advisor_escalation_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_execution_runs_updated_at BEFORE UPDATE ON public.advisor_execution_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_guardrails_updated_at BEFORE UPDATE ON public.advisor_guardrails FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_profile_model_configs_updated_at BEFORE UPDATE ON public.advisor_profile_model_configs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_profiles_updated_at BEFORE UPDATE ON public.advisor_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_prompt_templates_updated_at BEFORE UPDATE ON public.advisor_prompt_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_tools_updated_at BEFORE UPDATE ON public.advisor_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_agronomy_tool_runs_updated_at BEFORE UPDATE ON public.agronomy_tool_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_agronomy_tool_templates_updated_at BEFORE UPDATE ON public.agronomy_tool_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_agronomy_tools_updated_at BEFORE UPDATE ON public.agronomy_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_ai_models_updated_at BEFORE UPDATE ON public.ai_models FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_ai_providers_updated_at BEFORE UPDATE ON public.ai_providers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_coupon_codes_updated_at BEFORE UPDATE ON public.coupon_codes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_course_categories_updated_at BEFORE UPDATE ON public.course_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_course_modules_updated_at BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_crop_calendar_plans_updated_at BEFORE UPDATE ON public.crop_calendar_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_crop_recommendations_updated_at BEFORE UPDATE ON public.crop_recommendations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_customer_credit_accounts_updated_at BEFORE UPDATE ON public.customer_credit_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_apply_credit_ledger_effect AFTER INSERT ON public.customer_credit_ledger FOR EACH ROW EXECUTE FUNCTION public.apply_credit_ledger_effect();

CREATE TRIGGER trg_customer_invoices_updated_at BEFORE UPDATE ON public.customer_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_customer_invoice_cogs_journal AFTER UPDATE ON public.customer_invoices FOR EACH ROW EXECUTE FUNCTION public.post_customer_invoice_cogs_journal();

CREATE TRIGGER trg_post_customer_invoice_journal AFTER UPDATE ON public.customer_invoices FOR EACH ROW EXECUTE FUNCTION public.post_customer_invoice_journal();

CREATE TRIGGER trg_delivery_requests_updated_at BEFORE UPDATE ON public.delivery_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_depot_zones_updated_at BEFORE UPDATE ON public.depot_zones FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_depots_updated_at BEFORE UPDATE ON public.depots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_farm_activities_updated_at BEFORE UPDATE ON public.farm_activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fertiliser_recommendations_updated_at BEFORE UPDATE ON public.fertiliser_recommendations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fields_updated_at BEFORE UPDATE ON public.fields FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_fulfillment_batches_updated_at BEFORE UPDATE ON public.fulfillment_batches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_goods_receipts_updated_at BEFORE UPDATE ON public.goods_receipts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_goods_receipt_journal AFTER UPDATE ON public.goods_receipts FOR EACH ROW EXECUTE FUNCTION public.post_goods_receipt_journal();

CREATE TRIGGER trg_harvest_records_updated_at BEFORE UPDATE ON public.harvest_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_inventory_batches_updated_at BEFORE UPDATE ON public.inventory_batches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_irrigation_plans_updated_at BEFORE UPDATE ON public.irrigation_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_knowledge_documents_updated_at BEFORE UPDATE ON public.knowledge_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_knowledge_ingestion_jobs_updated_at BEFORE UPDATE ON public.knowledge_ingestion_jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_knowledge_sources_updated_at BEFORE UPDATE ON public.knowledge_sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_lime_recommendations_updated_at BEFORE UPDATE ON public.lime_recommendations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_buyer_requests_updated_at BEFORE UPDATE ON public.marketplace_buyer_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_commodities_updated_at BEFORE UPDATE ON public.marketplace_commodities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_disputes_updated_at BEFORE UPDATE ON public.marketplace_disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_listings_updated_at BEFORE UPDATE ON public.marketplace_listings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_offers_updated_at BEFORE UPDATE ON public.marketplace_offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_payouts_updated_at BEFORE UPDATE ON public.marketplace_payouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_settlements_updated_at BEFORE UPDATE ON public.marketplace_settlements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_marketplace_trades_updated_at BEFORE UPDATE ON public.marketplace_trades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_notification_templates_updated_at BEFORE UPDATE ON public.notification_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_auto_generate_invoice_from_order AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.auto_generate_invoice_from_order();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_organization_members_updated_at BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_payment_gateways_updated_at BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_auto_generate_invoice_from_payment AFTER UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.auto_generate_invoice_from_payment();

CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_permissions_updated_at BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pick_tasks_updated_at BEFORE UPDATE ON public.pick_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pick_waves_updated_at BEFORE UPDATE ON public.pick_waves FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_planting_records_updated_at BEFORE UPDATE ON public.planting_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_attributes_updated_at BEFORE UPDATE ON public.product_attributes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_collections_updated_at BEFORE UPDATE ON public.product_collections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_pack_sizes_updated_at BEFORE UPDATE ON public.product_pack_sizes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_subcategories_updated_at BEFORE UPDATE ON public.product_subcategories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_purchase_order_items_updated_at BEFORE UPDATE ON public.purchase_order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_seed_product_details_updated_at BEFORE UPDATE ON public.seed_product_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_soil_tests_updated_at BEFORE UPDATE ON public.soil_tests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_spray_programs_updated_at BEFORE UPDATE ON public.spray_programs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_stock_adjustments_updated_at BEFORE UPDATE ON public.stock_adjustments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_stock_transfers_updated_at BEFORE UPDATE ON public.stock_transfers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_storage_bins_updated_at BEFORE UPDATE ON public.storage_bins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_supplier_invoice_journal AFTER UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.post_supplier_invoice_journal();

CREATE TRIGGER trg_supplier_invoices_updated_at BEFORE UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_user_role_assignments_updated_at BEFORE UPDATE ON public.user_role_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_website_crawl_targets_updated_at BEFORE UPDATE ON public.website_crawl_targets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_yield_estimator_runs_updated_at BEFORE UPDATE ON public.yield_estimator_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

drop trigger if exists "on_auth_user_created" on "auth"."users";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Auth users can upload documents"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'document-files'::text));



  create policy "Authorized users can read documents"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'document-files'::text));



