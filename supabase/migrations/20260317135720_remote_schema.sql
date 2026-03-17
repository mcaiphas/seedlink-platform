drop trigger if exists "trg_addresses_updated_at" on "public"."addresses";

drop trigger if exists "trg_advisor_conversations_updated_at" on "public"."advisor_conversations";

drop trigger if exists "trg_advisor_escalation_rules_updated_at" on "public"."advisor_escalation_rules";

drop trigger if exists "trg_advisor_execution_runs_updated_at" on "public"."advisor_execution_runs";

drop trigger if exists "trg_advisor_guardrails_updated_at" on "public"."advisor_guardrails";

drop trigger if exists "trg_advisor_profile_model_configs_updated_at" on "public"."advisor_profile_model_configs";

drop trigger if exists "trg_advisor_profiles_updated_at" on "public"."advisor_profiles";

drop trigger if exists "trg_advisor_prompt_templates_updated_at" on "public"."advisor_prompt_templates";

drop trigger if exists "trg_advisor_tools_updated_at" on "public"."advisor_tools";

drop trigger if exists "trg_advisory_session_number" on "public"."advisory_sessions";

drop trigger if exists "trg_agronomy_tool_runs_updated_at" on "public"."agronomy_tool_runs";

drop trigger if exists "trg_agronomy_tool_templates_updated_at" on "public"."agronomy_tool_templates";

drop trigger if exists "trg_agronomy_tools_updated_at" on "public"."agronomy_tools";

drop trigger if exists "trg_ai_models_updated_at" on "public"."ai_models";

drop trigger if exists "trg_ai_providers_updated_at" on "public"."ai_providers";

drop trigger if exists "trg_prevent_self_approval" on "public"."approval_requests";

drop trigger if exists "set_bank_accounts_updated_at" on "public"."bank_accounts";

drop trigger if exists "trg_populate_review_fields" on "public"."bank_transaction_reviews";

drop trigger if exists "set_bank_transactions_updated_at" on "public"."bank_transactions";

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

drop trigger if exists "set_customers_updated_at" on "public"."customers";

drop trigger if exists "trg_delivery_requests_updated_at" on "public"."delivery_requests";

drop trigger if exists "set_depot_inventory_updated_at" on "public"."depot_inventory";

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

drop trigger if exists "trg_set_delivery_request_number" on "public"."logistics_delivery_requests";

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

drop trigger if exists "set_stock_counts_updated_at" on "public"."stock_counts";

drop trigger if exists "trg_stock_transfers_updated_at" on "public"."stock_transfers";

drop trigger if exists "trg_storage_bins_updated_at" on "public"."storage_bins";

drop trigger if exists "trg_subscription_plans_updated_at" on "public"."subscription_plans";

drop trigger if exists "trg_subscriptions_updated_at" on "public"."subscriptions";

drop trigger if exists "trg_post_supplier_invoice_journal" on "public"."supplier_invoices";

drop trigger if exists "trg_supplier_invoices_updated_at" on "public"."supplier_invoices";

drop trigger if exists "trg_suppliers_updated_at" on "public"."suppliers";

drop trigger if exists "trg_support_ticket_number" on "public"."support_tickets";

drop trigger if exists "trg_system_settings_updated_at" on "public"."system_settings";

drop trigger if exists "trg_user_role_assignments_updated_at" on "public"."user_role_assignments";

drop trigger if exists "trg_wallets_updated_at" on "public"."wallets";

drop trigger if exists "trg_website_crawl_targets_updated_at" on "public"."website_crawl_targets";

drop trigger if exists "trg_yield_estimator_runs_updated_at" on "public"."yield_estimator_runs";

drop policy "Admin and sales can manage abandoned cart followups" on "public"."abandoned_cart_followups";

drop policy "Admin/accountant can manage accounting_periods" on "public"."accounting_periods";

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

drop policy "Admins can manage advisory_services" on "public"."advisory_services";

drop policy "Admins can manage advisory_sessions" on "public"."advisory_sessions";

drop policy "Admin manage advisory rules" on "public"."agro_advisory_rules";

drop policy "Admin manage farming systems" on "public"."agro_farming_systems";

drop policy "Users manage own rec items" on "public"."agro_recommendation_items";

drop policy "Users read own rec items" on "public"."agro_recommendation_items";

drop policy "Users read own recommendations" on "public"."agro_recommendations";

drop policy "Users update own recommendations" on "public"."agro_recommendations";

drop policy "Admin manage region profiles" on "public"."agro_region_profiles";

drop policy "Admin manage soil profiles" on "public"."agro_soil_profiles";

drop policy "Admin manage bundle items" on "public"."agro_solution_bundle_items";

drop policy "Admin manage solution bundles" on "public"."agro_solution_bundles";

drop policy "agronomy_tool_runs_insert_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_runs_select_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_runs_update_own_or_admin" on "public"."agronomy_tool_runs";

drop policy "agronomy_tool_templates_manage_admin_or_trainer" on "public"."agronomy_tool_templates";

drop policy "agronomy_tool_templates_read_by_access_level" on "public"."agronomy_tool_templates";

drop policy "agronomy_tools_manage_admin_or_trainer" on "public"."agronomy_tools";

drop policy "agronomy_tools_read_authenticated" on "public"."agronomy_tools";

drop policy "ai_models_admin_only" on "public"."ai_models";

drop policy "ai_providers_admin_only" on "public"."ai_providers";

drop policy "approval_requests_delete" on "public"."approval_requests";

drop policy "approval_requests_insert" on "public"."approval_requests";

drop policy "approval_requests_select" on "public"."approval_requests";

drop policy "approval_requests_update" on "public"."approval_requests";

drop policy "audit_logs_admin_only" on "public"."audit_logs";

drop policy "Admin and finance access bank_accounts" on "public"."bank_accounts";

drop policy "Admin and finance access bank_statement_imports" on "public"."bank_statement_imports";

drop policy "Admin/finance access bank_transaction_reviews" on "public"."bank_transaction_reviews";

drop policy "Admin and finance access bank_transactions" on "public"."bank_transactions";

drop policy "cart_items_manage_own_or_admin" on "public"."cart_items";

drop policy "cart_items_select_own_or_admin" on "public"."cart_items";

drop policy "carts_manage_own_or_admin" on "public"."carts";

drop policy "carts_select_own_or_admin" on "public"."carts";

drop policy "Admin/trainer can manage certificates" on "public"."certificates";

drop policy "coupon_codes_admin_only" on "public"."coupon_codes";

drop policy "coupon_codes_admin_only_read" on "public"."coupon_codes";

drop policy "course_categories_admin_or_trainer_manage" on "public"."course_categories";

drop policy "Admin and trainers can manage course classifications" on "public"."course_classifications";

drop policy "course_modules_manage_admin_or_trainer" on "public"."course_modules";

drop policy "course_modules_read_if_enrolled_or_admin_or_trainer" on "public"."course_modules";

drop policy "courses_manage_admin_or_trainer" on "public"."courses";

drop policy "crop_calendar_events_manage_via_plan_owner" on "public"."crop_calendar_events";

drop policy "crop_calendar_events_select_via_plan_owner" on "public"."crop_calendar_events";

drop policy "crop_calendar_plans_manage_own_or_admin" on "public"."crop_calendar_plans";

drop policy "crop_calendar_plans_select_own_or_admin" on "public"."crop_calendar_plans";

drop policy "Admin full access on crop_plans" on "public"."crop_plans";

drop policy "crop_recommendations_manage_admin_or_trainer" on "public"."crop_recommendations";

drop policy "crop_recommendations_select_owner_or_admin" on "public"."crop_recommendations";

drop policy "crops_manage_farm_owner_or_admin" on "public"."crops";

drop policy "crops_select_farm_owner_or_admin" on "public"."crops";

drop policy "Admin and sales can manage communication logs" on "public"."customer_communication_logs";

drop policy "Admin/finance can manage customer_credit_accounts" on "public"."customer_credit_accounts";

drop policy "Admin/finance can manage customer_credit_ledger" on "public"."customer_credit_ledger";

drop policy "ccni_insert" on "public"."customer_credit_note_items";

drop policy "ccni_select" on "public"."customer_credit_note_items";

drop policy "ccn_insert" on "public"."customer_credit_notes";

drop policy "ccn_select" on "public"."customer_credit_notes";

drop policy "ccn_update" on "public"."customer_credit_notes";

drop policy "customer_documents_delete" on "public"."customer_documents";

drop policy "customer_documents_insert" on "public"."customer_documents";

drop policy "customer_documents_select" on "public"."customer_documents";

drop policy "customer_invoice_items_admin_manage" on "public"."customer_invoice_items";

drop policy "customer_invoice_items_select_owner_or_admin" on "public"."customer_invoice_items";

drop policy "customer_invoices_admin_manage" on "public"."customer_invoices";

drop policy "customer_invoices_select_owner_or_admin" on "public"."customer_invoices";

drop policy "Admin and finance can manage refunds" on "public"."customer_refunds";

drop policy "customers_delete" on "public"."customers";

drop policy "customers_insert" on "public"."customers";

drop policy "customers_select" on "public"."customers";

drop policy "customers_update" on "public"."customers";

drop policy "delivery_requests_insert_owner_or_admin" on "public"."delivery_requests";

drop policy "delivery_requests_select_owner_or_admin" on "public"."delivery_requests";

drop policy "delivery_requests_update_admin_or_logistics" on "public"."delivery_requests";

drop policy "delivery_status_logs_manage_admin_or_logistics" on "public"."delivery_status_logs";

drop policy "delivery_status_logs_select_owner_admin_logistics" on "public"."delivery_status_logs";

drop policy "Admins can manage depot_inventory" on "public"."depot_inventory";

drop policy "depot_zones_admin_only" on "public"."depot_zones";

drop policy "depots_admin_only" on "public"."depots";

drop policy "Admin and finance can manage document delivery logs" on "public"."document_delivery_logs";

drop policy "enrollments_insert_own_or_admin" on "public"."enrollments";

drop policy "enrollments_select_own_or_admin" on "public"."enrollments";

drop policy "enrollments_update_own_or_admin" on "public"."enrollments";

drop policy "farm_activities_manage_owner_or_admin" on "public"."farm_activities";

drop policy "farm_activities_select_owner_or_admin" on "public"."farm_activities";

drop policy "Admin full access on farm_seasons" on "public"."farm_seasons";

drop policy "farms_manage_team_owner_or_admin" on "public"."farms";

drop policy "farms_select_team_owner_or_admin" on "public"."farms";

drop policy "fertiliser_plan_items_manage_via_recommendation_owner" on "public"."fertiliser_plan_items";

drop policy "fertiliser_plan_items_select_via_recommendation_owner" on "public"."fertiliser_plan_items";

drop policy "fertiliser_recommendations_manage_own_or_admin" on "public"."fertiliser_recommendations";

drop policy "fertiliser_recommendations_select_own_or_admin" on "public"."fertiliser_recommendations";

drop policy "fields_manage_farm_owner_or_admin" on "public"."fields";

drop policy "fields_select_farm_owner_or_admin" on "public"."fields";

drop policy "fulfillment_batches_admin_only" on "public"."fulfillment_batches";

drop policy "Admin/accountant can manage gl_accounts" on "public"."gl_accounts";

drop policy "goods_receipt_items_admin_only" on "public"."goods_receipt_items";

drop policy "goods_receipts_admin_only" on "public"."goods_receipts";

drop policy "inventory_batches_admin_only" on "public"."inventory_batches";

drop policy "irrigation_plan_events_manage_via_plan_owner" on "public"."irrigation_plan_events";

drop policy "irrigation_plan_events_select_via_plan_owner" on "public"."irrigation_plan_events";

drop policy "irrigation_plans_manage_own_or_admin" on "public"."irrigation_plans";

drop policy "irrigation_plans_select_own_or_admin" on "public"."irrigation_plans";

drop policy "Admin/accountant can manage journal_entries" on "public"."journal_entries";

drop policy "Admin/accountant can manage journal_entry_lines" on "public"."journal_entry_lines";

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

drop policy "Admins can delete delivery requests" on "public"."logistics_delivery_requests";

drop policy "Admins can manage delivery requests" on "public"."logistics_delivery_requests";

drop policy "Admins can manage rate cards" on "public"."logistics_rate_cards";

drop policy "marketplace_buyer_requests_manage_owner_or_admin" on "public"."marketplace_buyer_requests";

drop policy "marketplace_buyer_requests_read_owner_or_published_or_admin" on "public"."marketplace_buyer_requests";

drop policy "marketplace_commodities_admin_manage" on "public"."marketplace_commodities";

drop policy "marketplace_commodities_read_authenticated" on "public"."marketplace_commodities";

drop policy "Admin can manage commodity grades" on "public"."marketplace_commodity_grades";

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

drop policy "Admins can manage channel configs" on "public"."notification_channel_configs";

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

drop policy "Admin/finance can manage payment_allocations" on "public"."payment_allocations";

drop policy "Admin and finance can manage gateway transactions" on "public"."payment_gateway_transactions";

drop policy "payment_gateways_admin_only" on "public"."payment_gateways";

drop policy "payment_requests_delete" on "public"."payment_requests";

drop policy "payment_requests_insert" on "public"."payment_requests";

drop policy "payment_requests_update" on "public"."payment_requests";

drop policy "payment_transactions_manage_admin_only" on "public"."payment_transactions";

drop policy "payment_transactions_select_own_or_admin" on "public"."payment_transactions";

drop policy "Admin/finance can manage payments" on "public"."payments";

drop policy "permissions_manage_admin" on "public"."permissions";

drop policy "permissions_select_admin" on "public"."permissions";

drop policy "pick_tasks_admin_only" on "public"."pick_tasks";

drop policy "pick_waves_admin_only" on "public"."pick_waves";

drop policy "Admin/accountant can manage posting_rules" on "public"."posting_rules";

drop policy "product_attribute_assignments_admin_or_supplier_manage" on "public"."product_attribute_assignments";

drop policy "product_attribute_options_admin_manage" on "public"."product_attribute_options";

drop policy "product_attribute_options_admin_or_trainer_read" on "public"."product_attribute_options";

drop policy "product_attributes_admin_manage" on "public"."product_attributes";

drop policy "product_attributes_admin_or_trainer_read" on "public"."product_attributes";

drop policy "product_categories_manage_admin" on "public"."product_categories";

drop policy "Admin can manage product_category_assignments" on "public"."product_category_assignments";

drop policy "Admin can manage product_collection_items" on "public"."product_collection_items";

drop policy "product_collections_manage_admin" on "public"."product_collections";

drop policy "Admin can manage product_images" on "public"."product_images";

drop policy "Admin can manage product_import_jobs" on "public"."product_import_jobs";

drop policy "Admin can manage product_import_rows" on "public"."product_import_rows";

drop policy "Admin can manage product_pack_sizes" on "public"."product_pack_sizes";

drop policy "Admin can manage product_pricing_history" on "public"."product_pricing_history";

drop policy "Admin can manage product_subcategories" on "public"."product_subcategories";

drop policy "Admin can manage product_variant_attribute_values" on "public"."product_variant_attribute_values";

drop policy "Admin can manage product_variants" on "public"."product_variants";

drop policy "Admin full access on production_stages" on "public"."production_stages";

drop policy "products_manage_admin_or_supplier" on "public"."products";

drop policy "profiles_insert_self_or_admin" on "public"."profiles";

drop policy "profiles_select_own_or_admin" on "public"."profiles";

drop policy "profiles_update_own_or_admin" on "public"."profiles";

drop policy "proforma_items_delete" on "public"."proforma_invoice_items";

drop policy "proforma_items_insert" on "public"."proforma_invoice_items";

drop policy "proforma_items_update" on "public"."proforma_invoice_items";

drop policy "proforma_delete" on "public"."proforma_invoices";

drop policy "proforma_insert" on "public"."proforma_invoices";

drop policy "proforma_update" on "public"."proforma_invoices";

drop policy "Admin full access on program_activities" on "public"."program_activities";

drop policy "Admins can manage program_courses" on "public"."program_courses";

drop policy "purchase_order_items_admin_only" on "public"."purchase_order_items";

drop policy "purchase_orders_admin_only" on "public"."purchase_orders";

drop policy "quote_items_delete" on "public"."quote_items";

drop policy "quote_items_insert" on "public"."quote_items";

drop policy "quote_items_update" on "public"."quote_items";

drop policy "quotes_delete" on "public"."quotes";

drop policy "quotes_insert" on "public"."quotes";

drop policy "quotes_update" on "public"."quotes";

drop policy "Admin can manage reminder templates" on "public"."reminder_templates";

drop policy "role_permissions_manage_admin" on "public"."role_permissions";

drop policy "role_permissions_select_admin" on "public"."role_permissions";

drop policy "Admin can manage seed_product_details" on "public"."seed_product_details";

drop policy "shipment_package_items_admin_only" on "public"."shipment_package_items";

drop policy "shipment_packages_admin_only" on "public"."shipment_packages";

drop policy "soil_tests_manage_field_or_farm_owner_or_admin" on "public"."soil_tests";

drop policy "soil_tests_select_field_or_farm_owner_or_admin" on "public"."soil_tests";

drop policy "spray_program_items_manage_via_program_owner" on "public"."spray_program_items";

drop policy "spray_program_items_select_via_program_owner" on "public"."spray_program_items";

drop policy "spray_programs_manage_own_or_admin" on "public"."spray_programs";

drop policy "spray_programs_select_own_or_admin" on "public"."spray_programs";

drop policy "Admin/warehouse can manage stock_adjustment_items" on "public"."stock_adjustment_items";

drop policy "Admin/warehouse can manage stock_adjustments" on "public"."stock_adjustments";

drop policy "stock_movements_admin_only" on "public"."stock_movements";

drop policy "stock_transfer_items_admin_only" on "public"."stock_transfer_items";

drop policy "stock_transfers_admin_only" on "public"."stock_transfers";

drop policy "storage_bins_admin_only" on "public"."storage_bins";

drop policy "subscription_plans_manage_admin" on "public"."subscription_plans";

drop policy "subscriptions_manage_admin" on "public"."subscriptions";

drop policy "subscriptions_select_own_or_admin" on "public"."subscriptions";

drop policy "supplier_contacts_delete" on "public"."supplier_contacts";

drop policy "supplier_contacts_insert" on "public"."supplier_contacts";

drop policy "supplier_contacts_select" on "public"."supplier_contacts";

drop policy "supplier_contacts_update" on "public"."supplier_contacts";

drop policy "scni_insert" on "public"."supplier_credit_note_items";

drop policy "scni_select" on "public"."supplier_credit_note_items";

drop policy "scn_insert" on "public"."supplier_credit_notes";

drop policy "scn_select" on "public"."supplier_credit_notes";

drop policy "scn_update" on "public"."supplier_credit_notes";

drop policy "supplier_documents_delete" on "public"."supplier_documents";

drop policy "supplier_documents_insert" on "public"."supplier_documents";

drop policy "supplier_documents_select" on "public"."supplier_documents";

drop policy "supplier_invoice_items_admin_only" on "public"."supplier_invoice_items";

drop policy "supplier_invoices_admin_only" on "public"."supplier_invoices";

drop policy "sp_insert" on "public"."supplier_payments";

drop policy "sp_select" on "public"."supplier_payments";

drop policy "sp_update" on "public"."supplier_payments";

drop policy "suppliers_admin_only" on "public"."suppliers";

drop policy "Admins can manage support_tickets" on "public"."support_tickets";

drop policy "system_settings_admin_only" on "public"."system_settings";

drop policy "teams_manage_owner_or_admin" on "public"."teams";

drop policy "teams_select_owner_or_admin" on "public"."teams";

drop policy "Admins can manage training_programs" on "public"."training_programs";

drop policy "user_permission_overrides_manage_admin" on "public"."user_permission_overrides";

drop policy "user_permission_overrides_select_admin" on "public"."user_permission_overrides";

drop policy "user_role_assignments_manage_admin" on "public"."user_role_assignments";

drop policy "user_role_assignments_select_self_or_admin" on "public"."user_role_assignments";

drop policy "Admins can manage vat_codes" on "public"."vat_codes";

drop policy "Admins can manage vat_periods" on "public"."vat_periods";

drop policy "Admins can manage vehicle types" on "public"."vehicle_types";

drop policy "wallet_transactions_manage_admin_only" on "public"."wallet_transactions";

drop policy "wallet_transactions_select_wallet_owner_or_admin" on "public"."wallet_transactions";

drop policy "wallets_manage_admin_only" on "public"."wallets";

drop policy "wallets_select_owner_or_admin" on "public"."wallets";

drop policy "Admin can manage weather_snapshots" on "public"."weather_snapshots";

drop policy "website_crawl_pages_admin_manage" on "public"."website_crawl_pages";

drop policy "website_crawl_pages_admin_or_trainer_read" on "public"."website_crawl_pages";

drop policy "website_crawl_targets_admin_or_trainer_manage" on "public"."website_crawl_targets";

drop policy "yield_estimator_runs_manage_own_or_admin" on "public"."yield_estimator_runs";

drop policy "yield_estimator_runs_select_own_or_admin" on "public"."yield_estimator_runs";

alter table "public"."abandoned_cart_followups" drop constraint "abandoned_cart_followups_cart_id_fkey";

alter table "public"."accounting_periods" drop constraint "accounting_periods_closed_by_fkey";

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

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_advisor_id_fkey";

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_customer_id_fkey";

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_farm_id_fkey";

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_linked_crop_plan_id_fkey";

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_linked_recommendation_id_fkey";

alter table "public"."advisory_sessions" drop constraint "advisory_sessions_service_id_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_created_by_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_farming_system_id_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_product_id_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_region_profile_id_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_soil_profile_id_fkey";

alter table "public"."agro_advisory_rules" drop constraint "agro_advisory_rules_variant_id_fkey";

alter table "public"."agro_recommendation_items" drop constraint "agro_recommendation_items_pack_size_id_fkey";

alter table "public"."agro_recommendation_items" drop constraint "agro_recommendation_items_product_id_fkey";

alter table "public"."agro_recommendation_items" drop constraint "agro_recommendation_items_recommendation_id_fkey";

alter table "public"."agro_recommendation_items" drop constraint "agro_recommendation_items_variant_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_customer_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_farm_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_farming_system_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_region_profile_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_soil_profile_id_fkey";

alter table "public"."agro_recommendations" drop constraint "agro_recommendations_user_id_fkey";

alter table "public"."agro_solution_bundle_items" drop constraint "agro_solution_bundle_items_bundle_id_fkey";

alter table "public"."agro_solution_bundle_items" drop constraint "agro_solution_bundle_items_product_id_fkey";

alter table "public"."agro_solution_bundle_items" drop constraint "agro_solution_bundle_items_variant_id_fkey";

alter table "public"."agro_solution_bundles" drop constraint "agro_solution_bundles_created_by_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_crop_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_farm_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_field_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_tool_id_fkey";

alter table "public"."agronomy_tool_runs" drop constraint "agronomy_tool_runs_user_id_fkey";

alter table "public"."agronomy_tool_templates" drop constraint "agronomy_tool_templates_created_by_fkey";

alter table "public"."agronomy_tool_templates" drop constraint "agronomy_tool_templates_tool_id_fkey";

alter table "public"."ai_models" drop constraint "ai_models_provider_id_fkey";

alter table "public"."approval_requests" drop constraint "approval_requests_approved_by_fkey";

alter table "public"."approval_requests" drop constraint "approval_requests_requested_by_fkey";

alter table "public"."audit_logs" drop constraint "audit_logs_actor_user_id_fkey";

alter table "public"."bank_accounts" drop constraint "bank_accounts_created_by_fkey";

alter table "public"."bank_statement_imports" drop constraint "bank_statement_imports_bank_account_id_fkey";

alter table "public"."bank_statement_imports" drop constraint "bank_statement_imports_imported_by_fkey";

alter table "public"."bank_transaction_reviews" drop constraint "bank_transaction_reviews_bank_transaction_id_fkey";

alter table "public"."bank_transaction_reviews" drop constraint "bank_transaction_reviews_depot_id_fkey";

alter table "public"."bank_transaction_reviews" drop constraint "bank_transaction_reviews_gl_account_id_fkey";

alter table "public"."bank_transaction_reviews" drop constraint "bank_transaction_reviews_reviewed_by_fkey";

alter table "public"."bank_transactions" drop constraint "bank_transactions_bank_account_id_fkey";

alter table "public"."bank_transactions" drop constraint "bank_transactions_matched_by_fkey";

alter table "public"."bank_transactions" drop constraint "bank_transactions_statement_import_fk";

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

alter table "public"."crop_plans" drop constraint "crop_plans_created_by_fkey";

alter table "public"."crop_plans" drop constraint "crop_plans_farm_id_fkey";

alter table "public"."crop_plans" drop constraint "crop_plans_farming_system_id_fkey";

alter table "public"."crop_plans" drop constraint "crop_plans_field_id_fkey";

alter table "public"."crop_plans" drop constraint "crop_plans_recommendation_id_fkey";

alter table "public"."crop_plans" drop constraint "crop_plans_season_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_crop_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_farm_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_field_id_fkey";

alter table "public"."crop_recommendations" drop constraint "crop_recommendations_generated_by_fkey";

alter table "public"."crops" drop constraint "crops_farm_id_fkey";

alter table "public"."customer_communication_logs" drop constraint "customer_communication_logs_customer_id_fkey";

alter table "public"."customer_communication_logs" drop constraint "customer_communication_logs_performed_by_fkey";

alter table "public"."customer_credit_ledger" drop constraint "customer_credit_ledger_credit_account_id_fkey";

alter table "public"."customer_credit_note_items" drop constraint "customer_credit_note_items_credit_note_id_fkey";

alter table "public"."customer_credit_notes" drop constraint "customer_credit_notes_created_by_fkey";

alter table "public"."customer_credit_notes" drop constraint "customer_credit_notes_customer_id_fkey";

alter table "public"."customer_credit_notes" drop constraint "customer_credit_notes_invoice_id_fkey";

alter table "public"."customer_documents" drop constraint "customer_documents_customer_id_fkey";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_customer_invoice_id_fkey";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_order_item_id_fkey";

alter table "public"."customer_invoice_items" drop constraint "customer_invoice_items_product_id_fkey";

alter table "public"."customer_invoices" drop constraint "customer_invoices_customer_id_fkey";

alter table "public"."customer_invoices" drop constraint "customer_invoices_order_id_fkey";

alter table "public"."customer_invoices" drop constraint "customer_invoices_sales_rep_id_fkey";

alter table "public"."customer_refunds" drop constraint "customer_refunds_created_by_fkey";

alter table "public"."customer_refunds" drop constraint "customer_refunds_credit_note_id_fkey";

alter table "public"."customer_refunds" drop constraint "customer_refunds_customer_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_order_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_requested_by_fkey";

alter table "public"."delivery_status_logs" drop constraint "delivery_status_logs_delivery_request_id_fkey";

alter table "public"."delivery_status_logs" drop constraint "delivery_status_logs_updated_by_fkey";

alter table "public"."depot_inventory" drop constraint "depot_inventory_depot_id_fkey";

alter table "public"."depot_inventory" drop constraint "depot_inventory_pack_size_id_fkey";

alter table "public"."depot_inventory" drop constraint "depot_inventory_product_id_fkey";

alter table "public"."depot_inventory" drop constraint "depot_inventory_variant_id_fkey";

alter table "public"."depot_zones" drop constraint "depot_zones_depot_id_fkey";

alter table "public"."depots" drop constraint "depots_address_id_fkey";

alter table "public"."depots" drop constraint "depots_organization_id_fkey";

alter table "public"."enrollments" drop constraint "enrollments_course_id_fkey";

alter table "public"."enrollments" drop constraint "enrollments_user_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_farm_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_field_id_fkey";

alter table "public"."farm_activities" drop constraint "farm_activities_performed_by_fkey";

alter table "public"."farm_seasons" drop constraint "farm_seasons_created_by_fkey";

alter table "public"."farms" drop constraint "farms_customer_id_fkey";

alter table "public"."farms" drop constraint "farms_farming_system_id_fkey";

alter table "public"."farms" drop constraint "farms_region_profile_id_fkey";

alter table "public"."farms" drop constraint "farms_team_id_fkey";

alter table "public"."fertiliser_plan_items" drop constraint "fertiliser_plan_items_recommendation_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_crop_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_farm_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_field_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_tool_run_id_fkey";

alter table "public"."fertiliser_recommendations" drop constraint "fertiliser_recommendations_user_id_fkey";

alter table "public"."fields" drop constraint "fields_farm_id_fkey";

alter table "public"."fields" drop constraint "fields_region_profile_id_fkey";

alter table "public"."fields" drop constraint "fields_soil_profile_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_depot_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_order_id_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_packed_by_fkey";

alter table "public"."fulfillment_batches" drop constraint "fulfillment_batches_wave_id_fkey";

alter table "public"."gl_accounts" drop constraint "gl_accounts_parent_account_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_goods_receipt_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_pack_size_id_fkey";

alter table "public"."goods_receipt_items" drop constraint "goods_receipt_items_product_id_fkey";

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

alter table "public"."journal_entries" drop constraint "journal_entries_approved_by_fkey";

alter table "public"."journal_entries" drop constraint "journal_entries_period_id_fkey";

alter table "public"."journal_entries" drop constraint "journal_entries_reversed_by_id_fkey";

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

alter table "public"."logistics_delivery_items" drop constraint "logistics_delivery_items_delivery_request_id_fkey";

alter table "public"."logistics_delivery_items" drop constraint "logistics_delivery_items_pack_size_id_fkey";

alter table "public"."logistics_delivery_items" drop constraint "logistics_delivery_items_product_id_fkey";

alter table "public"."logistics_delivery_items" drop constraint "logistics_delivery_items_variant_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_created_by_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_crop_plan_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_customer_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_farm_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_order_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_origin_depot_id_fkey";

alter table "public"."logistics_delivery_requests" drop constraint "logistics_delivery_requests_vehicle_type_id_fkey";

alter table "public"."logistics_rate_cards" drop constraint "logistics_rate_cards_vehicle_type_id_fkey";

alter table "public"."logistics_status_log" drop constraint "logistics_status_log_delivery_request_id_fkey";

alter table "public"."logistics_status_log" drop constraint "logistics_status_log_recorded_by_fkey";

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

alter table "public"."notification_templates" drop constraint "notification_templates_created_by_fkey";

alter table "public"."notifications" drop constraint "notifications_organization_id_fkey";

alter table "public"."notifications" drop constraint "notifications_user_id_fkey";

alter table "public"."order_items" drop constraint "order_items_order_id_fkey";

alter table "public"."order_items" drop constraint "order_items_product_id_fkey";

alter table "public"."order_items" drop constraint "order_items_variant_id_fkey";

alter table "public"."orders" drop constraint "orders_cart_id_fkey";

alter table "public"."orders" drop constraint "orders_customer_id_fkey";

alter table "public"."orders" drop constraint "orders_depot_id_fkey";

alter table "public"."orders" drop constraint "orders_quote_id_fkey";

alter table "public"."orders" drop constraint "orders_sales_rep_id_fkey";

alter table "public"."orders" drop constraint "orders_user_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_organization_id_fkey";

alter table "public"."organization_members" drop constraint "organization_members_user_id_fkey";

alter table "public"."organizations" drop constraint "organizations_created_by_fkey";

alter table "public"."payment_allocations" drop constraint "payment_allocations_customer_invoice_id_fkey";

alter table "public"."payment_allocations" drop constraint "payment_allocations_payment_id_fkey";

alter table "public"."payment_gateway_transactions" drop constraint "payment_gateway_transactions_payment_id_fkey";

alter table "public"."payment_gateway_transactions" drop constraint "payment_gateway_transactions_payment_request_id_fkey";

alter table "public"."payment_requests" drop constraint "payment_requests_created_by_fkey";

alter table "public"."payment_requests" drop constraint "payment_requests_customer_id_fkey";

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

alter table "public"."product_pricing_history" drop constraint "product_pricing_history_product_id_fkey";

alter table "public"."product_pricing_history" drop constraint "product_pricing_history_variant_id_fkey";

alter table "public"."product_subcategories" drop constraint "product_subcategories_category_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_attribute_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_attribute_option_id_fkey";

alter table "public"."product_variant_attribute_values" drop constraint "product_variant_attribute_values_variant_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_depot_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_pack_size_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_product_id_fkey";

alter table "public"."production_stages" drop constraint "production_stages_crop_plan_id_fkey";

alter table "public"."products" drop constraint "fk_products_supplier";

alter table "public"."products" drop constraint "products_category_id_fkey";

alter table "public"."products" drop constraint "products_depot_id_fkey";

alter table "public"."products" drop constraint "products_organization_id_fkey";

alter table "public"."products" drop constraint "products_subcategory_id_fkey";

alter table "public"."profiles" drop constraint "profiles_organization_id_fkey";

alter table "public"."proforma_invoice_items" drop constraint "proforma_invoice_items_pack_size_id_fkey";

alter table "public"."proforma_invoice_items" drop constraint "proforma_invoice_items_product_id_fkey";

alter table "public"."proforma_invoice_items" drop constraint "proforma_invoice_items_proforma_invoice_id_fkey";

alter table "public"."proforma_invoices" drop constraint "proforma_invoices_converted_order_id_fkey";

alter table "public"."proforma_invoices" drop constraint "proforma_invoices_created_by_fkey";

alter table "public"."proforma_invoices" drop constraint "proforma_invoices_customer_id_fkey";

alter table "public"."proforma_invoices" drop constraint "proforma_invoices_quote_id_fkey";

alter table "public"."proforma_invoices" drop constraint "proforma_invoices_sales_rep_id_fkey";

alter table "public"."program_activities" drop constraint "program_activities_crop_plan_id_fkey";

alter table "public"."program_activities" drop constraint "program_activities_pack_size_id_fkey";

alter table "public"."program_activities" drop constraint "program_activities_product_id_fkey";

alter table "public"."program_activities" drop constraint "program_activities_stage_id_fkey";

alter table "public"."program_activities" drop constraint "program_activities_variant_id_fkey";

alter table "public"."program_courses" drop constraint "program_courses_course_id_fkey";

alter table "public"."program_courses" drop constraint "program_courses_program_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_pack_size_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_product_id_fkey";

alter table "public"."purchase_order_items" drop constraint "purchase_order_items_purchase_order_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_approved_by_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_depot_id_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_ordered_by_fkey";

alter table "public"."purchase_orders" drop constraint "purchase_orders_supplier_id_fkey";

alter table "public"."quote_items" drop constraint "quote_items_pack_size_id_fkey";

alter table "public"."quote_items" drop constraint "quote_items_product_id_fkey";

alter table "public"."quote_items" drop constraint "quote_items_quote_id_fkey";

alter table "public"."quotes" drop constraint "quotes_created_by_fkey";

alter table "public"."quotes" drop constraint "quotes_customer_id_fkey";

alter table "public"."quotes" drop constraint "quotes_sales_rep_id_fkey";

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

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_pack_size_id_fkey";

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_product_id_fkey";

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_stock_adjustment_id_fkey";

alter table "public"."stock_adjustment_items" drop constraint "stock_adjustment_items_variant_id_fkey";

alter table "public"."stock_adjustments" drop constraint "stock_adjustments_approved_by_fkey";

alter table "public"."stock_adjustments" drop constraint "stock_adjustments_depot_id_fkey";

alter table "public"."stock_count_items" drop constraint "stock_count_items_pack_size_id_fkey";

alter table "public"."stock_count_items" drop constraint "stock_count_items_product_id_fkey";

alter table "public"."stock_count_items" drop constraint "stock_count_items_stock_count_id_fkey";

alter table "public"."stock_counts" drop constraint "stock_counts_approved_by_fkey";

alter table "public"."stock_counts" drop constraint "stock_counts_created_by_fkey";

alter table "public"."stock_counts" drop constraint "stock_counts_depot_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_batch_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_bin_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_created_by_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_depot_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_destination_depot_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_pack_size_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_product_id_fkey";

alter table "public"."stock_movements" drop constraint "stock_movements_source_depot_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_batch_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_pack_size_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_product_id_fkey";

alter table "public"."stock_transfer_items" drop constraint "stock_transfer_items_transfer_id_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_approved_by_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_from_depot_id_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_requested_by_fkey";

alter table "public"."stock_transfers" drop constraint "stock_transfers_to_depot_id_fkey";

alter table "public"."storage_bins" drop constraint "storage_bins_depot_id_fkey";

alter table "public"."storage_bins" drop constraint "storage_bins_zone_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_plan_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."supplier_contacts" drop constraint "supplier_contacts_supplier_id_fkey";

alter table "public"."supplier_credit_note_items" drop constraint "supplier_credit_note_items_credit_note_id_fkey";

alter table "public"."supplier_credit_notes" drop constraint "supplier_credit_notes_created_by_fkey";

alter table "public"."supplier_credit_notes" drop constraint "supplier_credit_notes_supplier_id_fkey";

alter table "public"."supplier_credit_notes" drop constraint "supplier_credit_notes_supplier_invoice_id_fkey";

alter table "public"."supplier_documents" drop constraint "supplier_documents_supplier_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_goods_receipt_item_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_product_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_purchase_order_item_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_supplier_invoice_id_fkey";

alter table "public"."supplier_invoice_items" drop constraint "supplier_invoice_items_variant_id_fkey";

alter table "public"."supplier_invoices" drop constraint "supplier_invoices_created_by_fkey";

alter table "public"."supplier_invoices" drop constraint "supplier_invoices_purchase_order_id_fkey";

alter table "public"."supplier_invoices" drop constraint "supplier_invoices_supplier_id_fkey";

alter table "public"."supplier_payments" drop constraint "supplier_payments_created_by_fkey";

alter table "public"."supplier_payments" drop constraint "supplier_payments_supplier_id_fkey";

alter table "public"."supplier_payments" drop constraint "supplier_payments_supplier_invoice_id_fkey";

alter table "public"."supplier_products" drop constraint "supplier_products_product_id_fkey";

alter table "public"."supplier_products" drop constraint "supplier_products_supplier_id_fkey";

alter table "public"."suppliers" drop constraint "suppliers_organization_id_fkey";

alter table "public"."support_tickets" drop constraint "support_tickets_assigned_advisor_id_fkey";

alter table "public"."support_tickets" drop constraint "support_tickets_customer_id_fkey";

alter table "public"."support_tickets" drop constraint "support_tickets_user_id_fkey";

alter table "public"."teams" drop constraint "teams_owner_id_fkey";

alter table "public"."training_programs" drop constraint "training_programs_created_by_fkey";

alter table "public"."user_permission_overrides" drop constraint "user_permission_overrides_permission_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_assigned_by_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_organization_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_role_id_fkey";

alter table "public"."user_role_assignments" drop constraint "user_role_assignments_user_id_fkey";

alter table "public"."vat_codes" drop constraint "vat_codes_gl_account_id_fkey";

alter table "public"."vat_periods" drop constraint "vat_periods_submitted_by_fkey";

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

drop index if exists "public"."idx_knowledge_document_chunks_embedding";

alter table "public"."knowledge_document_chunks" alter column "embedding" set data type public.vector(1536) using "embedding"::public.vector(1536);

CREATE INDEX idx_knowledge_document_chunks_embedding ON public.knowledge_document_chunks USING ivfflat (embedding public.vector_cosine_ops) WITH (lists='100');

alter table "public"."abandoned_cart_followups" add constraint "abandoned_cart_followups_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE not valid;

alter table "public"."abandoned_cart_followups" validate constraint "abandoned_cart_followups_cart_id_fkey";

alter table "public"."accounting_periods" add constraint "accounting_periods_closed_by_fkey" FOREIGN KEY (closed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."accounting_periods" validate constraint "accounting_periods_closed_by_fkey";

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

alter table "public"."approval_requests" add constraint "approval_requests_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."approval_requests" validate constraint "approval_requests_approved_by_fkey";

alter table "public"."approval_requests" add constraint "approval_requests_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES public.profiles(id) not valid;

alter table "public"."approval_requests" validate constraint "approval_requests_requested_by_fkey";

alter table "public"."audit_logs" add constraint "audit_logs_actor_user_id_fkey" FOREIGN KEY (actor_user_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_actor_user_id_fkey";

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

alter table "public"."customer_communication_logs" add constraint "customer_communication_logs_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE not valid;

alter table "public"."customer_communication_logs" validate constraint "customer_communication_logs_customer_id_fkey";

alter table "public"."customer_communication_logs" add constraint "customer_communication_logs_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_communication_logs" validate constraint "customer_communication_logs_performed_by_fkey";

alter table "public"."customer_credit_ledger" add constraint "customer_credit_ledger_credit_account_id_fkey" FOREIGN KEY (credit_account_id) REFERENCES public.customer_credit_accounts(id) ON DELETE CASCADE not valid;

alter table "public"."customer_credit_ledger" validate constraint "customer_credit_ledger_credit_account_id_fkey";

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

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_customer_invoice_id_fkey" FOREIGN KEY (customer_invoice_id) REFERENCES public.customer_invoices(id) ON DELETE CASCADE not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_customer_invoice_id_fkey";

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_order_item_id_fkey" FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_order_item_id_fkey";

alter table "public"."customer_invoice_items" add constraint "customer_invoice_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."customer_invoice_items" validate constraint "customer_invoice_items_product_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_customer_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_order_id_fkey";

alter table "public"."customer_invoices" add constraint "customer_invoices_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_invoices" validate constraint "customer_invoices_sales_rep_id_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_created_by_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_credit_note_id_fkey" FOREIGN KEY (credit_note_id) REFERENCES public.customer_credit_notes(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_credit_note_id_fkey";

alter table "public"."customer_refunds" add constraint "customer_refunds_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."customer_refunds" validate constraint "customer_refunds_customer_id_fkey";

alter table "public"."delivery_requests" add constraint "delivery_requests_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_requests" validate constraint "delivery_requests_order_id_fkey";

alter table "public"."delivery_requests" add constraint "delivery_requests_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_requests" validate constraint "delivery_requests_requested_by_fkey";

alter table "public"."delivery_status_logs" add constraint "delivery_status_logs_delivery_request_id_fkey" FOREIGN KEY (delivery_request_id) REFERENCES public.delivery_requests(id) ON DELETE CASCADE not valid;

alter table "public"."delivery_status_logs" validate constraint "delivery_status_logs_delivery_request_id_fkey";

alter table "public"."delivery_status_logs" add constraint "delivery_status_logs_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."delivery_status_logs" validate constraint "delivery_status_logs_updated_by_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_depot_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_pack_size_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_product_id_fkey";

alter table "public"."depot_inventory" add constraint "depot_inventory_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."depot_inventory" validate constraint "depot_inventory_variant_id_fkey";

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

alter table "public"."farm_seasons" add constraint "farm_seasons_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."farm_seasons" validate constraint "farm_seasons_created_by_fkey";

alter table "public"."farms" add constraint "farms_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."farms" validate constraint "farms_customer_id_fkey";

alter table "public"."farms" add constraint "farms_farming_system_id_fkey" FOREIGN KEY (farming_system_id) REFERENCES public.agro_farming_systems(id) not valid;

alter table "public"."farms" validate constraint "farms_farming_system_id_fkey";

alter table "public"."farms" add constraint "farms_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) not valid;

alter table "public"."farms" validate constraint "farms_region_profile_id_fkey";

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

alter table "public"."fields" add constraint "fields_region_profile_id_fkey" FOREIGN KEY (region_profile_id) REFERENCES public.agro_region_profiles(id) not valid;

alter table "public"."fields" validate constraint "fields_region_profile_id_fkey";

alter table "public"."fields" add constraint "fields_soil_profile_id_fkey" FOREIGN KEY (soil_profile_id) REFERENCES public.agro_soil_profiles(id) not valid;

alter table "public"."fields" validate constraint "fields_soil_profile_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_depot_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_order_id_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_packed_by_fkey" FOREIGN KEY (packed_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_packed_by_fkey";

alter table "public"."fulfillment_batches" add constraint "fulfillment_batches_wave_id_fkey" FOREIGN KEY (wave_id) REFERENCES public.pick_waves(id) ON DELETE SET NULL not valid;

alter table "public"."fulfillment_batches" validate constraint "fulfillment_batches_wave_id_fkey";

alter table "public"."gl_accounts" add constraint "gl_accounts_parent_account_id_fkey" FOREIGN KEY (parent_account_id) REFERENCES public.gl_accounts(id) not valid;

alter table "public"."gl_accounts" validate constraint "gl_accounts_parent_account_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_goods_receipt_id_fkey" FOREIGN KEY (goods_receipt_id) REFERENCES public.goods_receipts(id) ON DELETE CASCADE not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_goods_receipt_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_pack_size_id_fkey";

alter table "public"."goods_receipt_items" add constraint "goods_receipt_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."goods_receipt_items" validate constraint "goods_receipt_items_product_id_fkey";

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

alter table "public"."journal_entries" add constraint "journal_entries_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_approved_by_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_period_id_fkey" FOREIGN KEY (period_id) REFERENCES public.accounting_periods(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_period_id_fkey";

alter table "public"."journal_entries" add constraint "journal_entries_reversed_by_id_fkey" FOREIGN KEY (reversed_by_id) REFERENCES public.journal_entries(id) not valid;

alter table "public"."journal_entries" validate constraint "journal_entries_reversed_by_id_fkey";

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

alter table "public"."logistics_delivery_requests" add constraint "logistics_delivery_requests_vehicle_type_id_fkey" FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id) not valid;

alter table "public"."logistics_delivery_requests" validate constraint "logistics_delivery_requests_vehicle_type_id_fkey";

alter table "public"."logistics_rate_cards" add constraint "logistics_rate_cards_vehicle_type_id_fkey" FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id) not valid;

alter table "public"."logistics_rate_cards" validate constraint "logistics_rate_cards_vehicle_type_id_fkey";

alter table "public"."logistics_status_log" add constraint "logistics_status_log_delivery_request_id_fkey" FOREIGN KEY (delivery_request_id) REFERENCES public.logistics_delivery_requests(id) ON DELETE CASCADE not valid;

alter table "public"."logistics_status_log" validate constraint "logistics_status_log_delivery_request_id_fkey";

alter table "public"."logistics_status_log" add constraint "logistics_status_log_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) not valid;

alter table "public"."logistics_status_log" validate constraint "logistics_status_log_recorded_by_fkey";

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

alter table "public"."notification_templates" add constraint "notification_templates_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."notification_templates" validate constraint "notification_templates_created_by_fkey";

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

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."orders" validate constraint "orders_depot_id_fkey";

alter table "public"."orders" add constraint "orders_quote_id_fkey" FOREIGN KEY (quote_id) REFERENCES public.quotes(id) not valid;

alter table "public"."orders" validate constraint "orders_quote_id_fkey";

alter table "public"."orders" add constraint "orders_sales_rep_id_fkey" FOREIGN KEY (sales_rep_id) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_sales_rep_id_fkey";

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

alter table "public"."payment_gateway_transactions" add constraint "payment_gateway_transactions_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) not valid;

alter table "public"."payment_gateway_transactions" validate constraint "payment_gateway_transactions_payment_id_fkey";

alter table "public"."payment_gateway_transactions" add constraint "payment_gateway_transactions_payment_request_id_fkey" FOREIGN KEY (payment_request_id) REFERENCES public.payment_requests(id) not valid;

alter table "public"."payment_gateway_transactions" validate constraint "payment_gateway_transactions_payment_request_id_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_created_by_fkey";

alter table "public"."payment_requests" add constraint "payment_requests_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."payment_requests" validate constraint "payment_requests_customer_id_fkey";

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

alter table "public"."production_stages" add constraint "production_stages_crop_plan_id_fkey" FOREIGN KEY (crop_plan_id) REFERENCES public.crop_plans(id) ON DELETE CASCADE not valid;

alter table "public"."production_stages" validate constraint "production_stages_crop_plan_id_fkey";

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

alter table "public"."program_courses" add constraint "program_courses_program_id_fkey" FOREIGN KEY (program_id) REFERENCES public.training_programs(id) ON DELETE CASCADE not valid;

alter table "public"."program_courses" validate constraint "program_courses_program_id_fkey";

alter table "public"."purchase_order_items" add constraint "purchase_order_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."purchase_order_items" validate constraint "purchase_order_items_pack_size_id_fkey";

alter table "public"."purchase_order_items" add constraint "purchase_order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."purchase_order_items" validate constraint "purchase_order_items_product_id_fkey";

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

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_pack_size_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_product_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_stock_adjustment_id_fkey" FOREIGN KEY (stock_adjustment_id) REFERENCES public.stock_adjustments(id) ON DELETE CASCADE not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_stock_adjustment_id_fkey";

alter table "public"."stock_adjustment_items" add constraint "stock_adjustment_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE SET NULL not valid;

alter table "public"."stock_adjustment_items" validate constraint "stock_adjustment_items_variant_id_fkey";

alter table "public"."stock_adjustments" add constraint "stock_adjustments_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) not valid;

alter table "public"."stock_adjustments" validate constraint "stock_adjustments_approved_by_fkey";

alter table "public"."stock_adjustments" add constraint "stock_adjustments_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."stock_adjustments" validate constraint "stock_adjustments_depot_id_fkey";

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

alter table "public"."stock_movements" add constraint "stock_movements_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_batch_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_bin_id_fkey" FOREIGN KEY (bin_id) REFERENCES public.storage_bins(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_bin_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_created_by_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_depot_id_fkey" FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE SET NULL not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_depot_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_destination_depot_id_fkey" FOREIGN KEY (destination_depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_destination_depot_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_pack_size_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_product_id_fkey";

alter table "public"."stock_movements" add constraint "stock_movements_source_depot_id_fkey" FOREIGN KEY (source_depot_id) REFERENCES public.depots(id) not valid;

alter table "public"."stock_movements" validate constraint "stock_movements_source_depot_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_batch_id_fkey" FOREIGN KEY (batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_batch_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_pack_size_id_fkey" FOREIGN KEY (pack_size_id) REFERENCES public.product_pack_sizes(id) not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_pack_size_id_fkey";

alter table "public"."stock_transfer_items" add constraint "stock_transfer_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."stock_transfer_items" validate constraint "stock_transfer_items_product_id_fkey";

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

alter table "public"."supplier_invoices" add constraint "supplier_invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_created_by_fkey";

alter table "public"."supplier_invoices" add constraint "supplier_invoices_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE SET NULL not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_purchase_order_id_fkey";

alter table "public"."supplier_invoices" add constraint "supplier_invoices_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT not valid;

alter table "public"."supplier_invoices" validate constraint "supplier_invoices_supplier_id_fkey";

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

alter table "public"."suppliers" add constraint "suppliers_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL not valid;

alter table "public"."suppliers" validate constraint "suppliers_organization_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_assigned_advisor_id_fkey" FOREIGN KEY (assigned_advisor_id) REFERENCES public.profiles(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_assigned_advisor_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_customer_id_fkey";

alter table "public"."support_tickets" add constraint "support_tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."support_tickets" validate constraint "support_tickets_user_id_fkey";

alter table "public"."teams" add constraint "teams_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."teams" validate constraint "teams_owner_id_fkey";

alter table "public"."training_programs" add constraint "training_programs_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."training_programs" validate constraint "training_programs_created_by_fkey";

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

alter table "public"."vat_codes" add constraint "vat_codes_gl_account_id_fkey" FOREIGN KEY (gl_account_id) REFERENCES public.gl_accounts(id) not valid;

alter table "public"."vat_codes" validate constraint "vat_codes_gl_account_id_fkey";

alter table "public"."vat_periods" add constraint "vat_periods_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) not valid;

alter table "public"."vat_periods" validate constraint "vat_periods_submitted_by_fkey";

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

create or replace view "public"."user_effective_permissions" as  SELECT DISTINCT ura.user_id,
    r.name AS role_name,
    p.code AS permission_code,
    p.name AS permission_name,
    p.module
   FROM (((public.user_role_assignments ura
     JOIN public.roles r ON ((r.id = ura.role_id)))
     JOIN public.role_permissions rp ON ((rp.role_id = r.id)))
     JOIN public.permissions p ON ((p.id = rp.permission_id)));



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



  create policy "Admins can manage advisory_services"
  on "public"."advisory_services"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admins can manage advisory_sessions"
  on "public"."advisory_sessions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admin manage advisory rules"
  on "public"."agro_advisory_rules"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admin manage farming systems"
  on "public"."agro_farming_systems"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin manage soil profiles"
  on "public"."agro_soil_profiles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admin manage bundle items"
  on "public"."agro_solution_bundle_items"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admin manage solution bundles"
  on "public"."agro_solution_bundles"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "audit_logs_admin_only"
  on "public"."audit_logs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin/trainer can manage certificates"
  on "public"."certificates"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'trainer'::text])));



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



  create policy "Admin and trainers can manage course classifications"
  on "public"."course_classifications"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_role('trainer'::text)));



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



  create policy "Admin full access on crop_plans"
  on "public"."crop_plans"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin/finance can manage customer_credit_ledger"
  on "public"."customer_credit_ledger"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



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



  create policy "Admins can manage depot_inventory"
  on "public"."depot_inventory"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin and finance can manage document delivery logs"
  on "public"."document_delivery_logs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text, 'sales_manager'::text])));



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



  create policy "Admin full access on farm_seasons"
  on "public"."farm_seasons"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin/accountant can manage gl_accounts"
  on "public"."gl_accounts"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



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



  create policy "Admin/accountant can manage journal_entries"
  on "public"."journal_entries"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Admin/accountant can manage journal_entry_lines"
  on "public"."journal_entry_lines"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



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



  create policy "Admins can manage rate cards"
  on "public"."logistics_rate_cards"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin can manage commodity grades"
  on "public"."marketplace_commodity_grades"
  as permissive
  for all
  to authenticated
using (public.is_admin());



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



  create policy "Admins can manage channel configs"
  on "public"."notification_channel_configs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin/finance can manage payment_allocations"
  on "public"."payment_allocations"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text])));



  create policy "Admin and finance can manage gateway transactions"
  on "public"."payment_gateway_transactions"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'sales_manager'::text]));



  create policy "payment_gateways_admin_only"
  on "public"."payment_gateways"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "payment_requests_update"
  on "public"."payment_requests"
  as permissive
  for update
  to authenticated
using ((public.is_admin() OR public.has_role('sales_manager'::text) OR public.has_role('accountant'::text)));



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



  create policy "Admin/finance can manage payments"
  on "public"."payments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'accountant'::text, 'sales_manager'::text])));



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



  create policy "Admin/accountant can manage posting_rules"
  on "public"."posting_rules"
  as permissive
  for all
  to authenticated
using (public.current_user_has_any_role(ARRAY['super_admin'::text, 'admin'::text, 'accountant'::text, 'finance_manager'::text]));



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



  create policy "Admin can manage product_category_assignments"
  on "public"."product_category_assignments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_collection_items"
  on "public"."product_collection_items"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "product_collections_manage_admin"
  on "public"."product_collections"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admin can manage product_images"
  on "public"."product_images"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_import_jobs"
  on "public"."product_import_jobs"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_import_rows"
  on "public"."product_import_rows"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_pack_sizes"
  on "public"."product_pack_sizes"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_pricing_history"
  on "public"."product_pricing_history"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_subcategories"
  on "public"."product_subcategories"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_variant_attribute_values"
  on "public"."product_variant_attribute_values"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin can manage product_variants"
  on "public"."product_variants"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



  create policy "Admin full access on production_stages"
  on "public"."production_stages"
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



  create policy "Admins can manage program_courses"
  on "public"."program_courses"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin can manage seed_product_details"
  on "public"."seed_product_details"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'product_manager'::text])));



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



  create policy "Admin/warehouse can manage stock_adjustment_items"
  on "public"."stock_adjustment_items"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'warehouse_officer'::text])));



  create policy "Admin/warehouse can manage stock_adjustments"
  on "public"."stock_adjustments"
  as permissive
  for all
  to authenticated
using ((public.is_admin() OR public.current_user_has_any_role(ARRAY['admin'::text, 'super_admin'::text, 'warehouse_officer'::text])));



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



  create policy "suppliers_admin_only"
  on "public"."suppliers"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admins can manage support_tickets"
  on "public"."support_tickets"
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



  create policy "Admins can manage training_programs"
  on "public"."training_programs"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admins can manage vat_codes"
  on "public"."vat_codes"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admins can manage vat_periods"
  on "public"."vat_periods"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Admins can manage vehicle types"
  on "public"."vehicle_types"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



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



  create policy "Admin can manage weather_snapshots"
  on "public"."weather_snapshots"
  as permissive
  for all
  to authenticated
using (public.is_admin());



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


CREATE TRIGGER trg_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_conversations_updated_at BEFORE UPDATE ON public.advisor_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_escalation_rules_updated_at BEFORE UPDATE ON public.advisor_escalation_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_execution_runs_updated_at BEFORE UPDATE ON public.advisor_execution_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_guardrails_updated_at BEFORE UPDATE ON public.advisor_guardrails FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_profile_model_configs_updated_at BEFORE UPDATE ON public.advisor_profile_model_configs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_profiles_updated_at BEFORE UPDATE ON public.advisor_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_prompt_templates_updated_at BEFORE UPDATE ON public.advisor_prompt_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisor_tools_updated_at BEFORE UPDATE ON public.advisor_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advisory_session_number BEFORE INSERT ON public.advisory_sessions FOR EACH ROW EXECUTE FUNCTION public.set_advisory_session_number();

CREATE TRIGGER trg_agronomy_tool_runs_updated_at BEFORE UPDATE ON public.agronomy_tool_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_agronomy_tool_templates_updated_at BEFORE UPDATE ON public.agronomy_tool_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_agronomy_tools_updated_at BEFORE UPDATE ON public.agronomy_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_ai_models_updated_at BEFORE UPDATE ON public.ai_models FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_ai_providers_updated_at BEFORE UPDATE ON public.ai_providers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_prevent_self_approval BEFORE UPDATE ON public.approval_requests FOR EACH ROW EXECUTE FUNCTION public.prevent_self_approval();

CREATE TRIGGER set_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_populate_review_fields BEFORE INSERT OR UPDATE ON public.bank_transaction_reviews FOR EACH ROW EXECUTE FUNCTION public.populate_review_from_transaction();

CREATE TRIGGER set_bank_transactions_updated_at BEFORE UPDATE ON public.bank_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_delivery_requests_updated_at BEFORE UPDATE ON public.delivery_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_depot_inventory_updated_at BEFORE UPDATE ON public.depot_inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TRIGGER trg_set_delivery_request_number BEFORE INSERT ON public.logistics_delivery_requests FOR EACH ROW EXECUTE FUNCTION public.set_delivery_request_number();

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

CREATE TRIGGER set_stock_counts_updated_at BEFORE UPDATE ON public.stock_counts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_stock_transfers_updated_at BEFORE UPDATE ON public.stock_transfers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_storage_bins_updated_at BEFORE UPDATE ON public.storage_bins FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_post_supplier_invoice_journal AFTER UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.post_supplier_invoice_journal();

CREATE TRIGGER trg_supplier_invoices_updated_at BEFORE UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_support_ticket_number BEFORE INSERT ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.set_support_ticket_number();

CREATE TRIGGER trg_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_user_role_assignments_updated_at BEFORE UPDATE ON public.user_role_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_website_crawl_targets_updated_at BEFORE UPDATE ON public.website_crawl_targets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_yield_estimator_runs_updated_at BEFORE UPDATE ON public.yield_estimator_runs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

drop trigger if exists "on_auth_user_created" on "auth"."users";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


