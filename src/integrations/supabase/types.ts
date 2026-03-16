export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_type: string
          city: string | null
          country_code: string
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          latitude: number | null
          line1: string
          line2: string | null
          longitude: number | null
          organization_id: string | null
          postal_code: string | null
          province: string | null
          suburb: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_type?: string
          city?: string | null
          country_code?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          line1: string
          line2?: string | null
          longitude?: number | null
          organization_id?: string | null
          postal_code?: string | null
          province?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_type?: string
          city?: string | null
          country_code?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          line1?: string
          line2?: string | null
          longitude?: number | null
          organization_id?: string | null
          postal_code?: string | null
          province?: string | null
          suburb?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_conversations: {
        Row: {
          advisor_profile_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          metadata: Json
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          metadata?: Json
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_conversations_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_escalation_rules: {
        Row: {
          advisor_profile_id: string | null
          created_at: string
          description: string | null
          escalation_target: string | null
          id: string
          is_active: boolean
          name: string
          rule_code: string
          rule_config: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          advisor_profile_id?: string | null
          created_at?: string
          description?: string | null
          escalation_target?: string | null
          id?: string
          is_active?: boolean
          name: string
          rule_code: string
          rule_config?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          advisor_profile_id?: string | null
          created_at?: string
          description?: string | null
          escalation_target?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rule_code?: string
          rule_config?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_escalation_rules_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_execution_runs: {
        Row: {
          advisor_profile_id: string | null
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          finish_reason: string | null
          id: string
          input_text: string | null
          message_id: string | null
          metadata: Json
          model_id: string | null
          output_text: string | null
          provider_id: string | null
          response_time_ms: number | null
          run_status: string
          started_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advisor_profile_id?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          finish_reason?: string | null
          id?: string
          input_text?: string | null
          message_id?: string | null
          metadata?: Json
          model_id?: string | null
          output_text?: string | null
          provider_id?: string | null
          response_time_ms?: number | null
          run_status?: string
          started_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advisor_profile_id?: string | null
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          finish_reason?: string | null
          id?: string
          input_text?: string | null
          message_id?: string | null
          metadata?: Json
          model_id?: string | null
          output_text?: string | null
          provider_id?: string | null
          response_time_ms?: number | null
          run_status?: string
          started_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_execution_runs_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_execution_runs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "advisor_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_execution_runs_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "advisor_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_execution_runs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_execution_runs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_execution_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_feedback: {
        Row: {
          comments: string | null
          created_at: string
          feedback_type: string | null
          id: string
          message_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          feedback_type?: string | null
          id?: string
          message_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "advisor_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_guardrails: {
        Row: {
          created_at: string
          description: string | null
          guardrail_code: string
          guardrail_type: string
          id: string
          is_active: boolean
          name: string
          rule_config: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guardrail_code: string
          guardrail_type: string
          id?: string
          is_active?: boolean
          name: string
          rule_config?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guardrail_code?: string
          guardrail_type?: string
          id?: string
          is_active?: boolean
          name?: string
          rule_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      advisor_message_sources: {
        Row: {
          chunk_id: string | null
          citation_url: string | null
          created_at: string
          document_id: string | null
          excerpt: string | null
          id: string
          message_id: string
          source_label: string | null
        }
        Insert: {
          chunk_id?: string | null
          citation_url?: string | null
          created_at?: string
          document_id?: string | null
          excerpt?: string | null
          id?: string
          message_id: string
          source_label?: string | null
        }
        Update: {
          chunk_id?: string | null
          citation_url?: string | null
          created_at?: string
          document_id?: string | null
          excerpt?: string | null
          id?: string
          message_id?: string
          source_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_message_sources_chunk_id_fkey"
            columns: ["chunk_id"]
            isOneToOne: false
            referencedRelation: "knowledge_document_chunks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_message_sources_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_message_sources_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "advisor_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message_format: string
          message_order: number | null
          message_text: string
          metadata: Json
          model_name: string | null
          model_provider: string | null
          sender_type: string
          token_input: number | null
          token_output: number | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message_format?: string
          message_order?: number | null
          message_text: string
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          sender_type: string
          token_input?: number | null
          token_output?: number | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message_format?: string
          message_order?: number | null
          message_text?: string
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          sender_type?: string
          token_input?: number | null
          token_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "advisor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_profile_guardrails: {
        Row: {
          advisor_profile_id: string
          created_at: string
          guardrail_id: string
          id: string
          is_required: boolean
          sort_order: number
        }
        Insert: {
          advisor_profile_id: string
          created_at?: string
          guardrail_id: string
          id?: string
          is_required?: boolean
          sort_order?: number
        }
        Update: {
          advisor_profile_id?: string
          created_at?: string
          guardrail_id?: string
          id?: string
          is_required?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "advisor_profile_guardrails_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_guardrails_guardrail_id_fkey"
            columns: ["guardrail_id"]
            isOneToOne: false
            referencedRelation: "advisor_guardrails"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_profile_model_configs: {
        Row: {
          advisor_profile_id: string
          created_at: string
          embedding_model_id: string | null
          fallback_prompt_template_id: string | null
          id: string
          is_active: boolean
          max_output_tokens: number | null
          metadata: Json
          primary_model_id: string | null
          provider_id: string | null
          system_prompt_template_id: string | null
          temperature: number | null
          top_p: number | null
          updated_at: string
        }
        Insert: {
          advisor_profile_id: string
          created_at?: string
          embedding_model_id?: string | null
          fallback_prompt_template_id?: string | null
          id?: string
          is_active?: boolean
          max_output_tokens?: number | null
          metadata?: Json
          primary_model_id?: string | null
          provider_id?: string | null
          system_prompt_template_id?: string | null
          temperature?: number | null
          top_p?: number | null
          updated_at?: string
        }
        Update: {
          advisor_profile_id?: string
          created_at?: string
          embedding_model_id?: string | null
          fallback_prompt_template_id?: string | null
          id?: string
          is_active?: boolean
          max_output_tokens?: number | null
          metadata?: Json
          primary_model_id?: string | null
          provider_id?: string | null
          system_prompt_template_id?: string | null
          temperature?: number | null
          top_p?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_profile_model_configs_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: true
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_model_configs_embedding_model_id_fkey"
            columns: ["embedding_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_model_configs_fallback_prompt_template_id_fkey"
            columns: ["fallback_prompt_template_id"]
            isOneToOne: false
            referencedRelation: "advisor_prompt_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_model_configs_primary_model_id_fkey"
            columns: ["primary_model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_model_configs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_model_configs_system_prompt_template_id_fkey"
            columns: ["system_prompt_template_id"]
            isOneToOne: false
            referencedRelation: "advisor_prompt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_profile_tools: {
        Row: {
          advisor_profile_id: string
          created_at: string
          id: string
          is_required: boolean
          sort_order: number
          tool_id: string
        }
        Insert: {
          advisor_profile_id: string
          created_at?: string
          id?: string
          is_required?: boolean
          sort_order?: number
          tool_id: string
        }
        Update: {
          advisor_profile_id?: string
          created_at?: string
          id?: string
          is_required?: boolean
          sort_order?: number
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_profile_tools_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_profile_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "advisor_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_profiles: {
        Row: {
          advisor_code: string
          advisor_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json
          model_name: string | null
          model_provider: string | null
          name: string
          system_prompt: string | null
          updated_at: string
        }
        Insert: {
          advisor_code: string
          advisor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          name: string
          system_prompt?: string | null
          updated_at?: string
        }
        Update: {
          advisor_code?: string
          advisor_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          name?: string
          system_prompt?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      advisor_prompt_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          metadata: Json
          name: string
          prompt_code: string
          prompt_type: string
          updated_at: string
          version: number
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          prompt_code: string
          prompt_type: string
          updated_at?: string
          version?: number
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          prompt_code?: string
          prompt_type?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "advisor_prompt_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_query_logs: {
        Row: {
          advisor_profile_id: string | null
          conversation_id: string | null
          created_at: string
          id: string
          message_id: string | null
          metadata: Json
          model_name: string | null
          model_provider: string | null
          query_text: string
          response_status: string
          response_time_ms: number | null
          tool_usage: Json
          user_id: string | null
        }
        Insert: {
          advisor_profile_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          query_text: string
          response_status?: string
          response_time_ms?: number | null
          tool_usage?: Json
          user_id?: string | null
        }
        Update: {
          advisor_profile_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          metadata?: Json
          model_name?: string | null
          model_provider?: string | null
          query_text?: string
          response_status?: string
          response_time_ms?: number | null
          tool_usage?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_query_logs_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_query_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "advisor_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_query_logs_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "advisor_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_query_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_retrieval_logs: {
        Row: {
          advisor_profile_id: string | null
          conversation_id: string | null
          created_at: string
          id: string
          message_id: string | null
          metadata: Json
          query_log_id: string | null
          query_text: string
          retrieval_type: string
          top_k: number
          total_results: number
          user_id: string | null
        }
        Insert: {
          advisor_profile_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          metadata?: Json
          query_log_id?: string | null
          query_text: string
          retrieval_type: string
          top_k?: number
          total_results?: number
          user_id?: string | null
        }
        Update: {
          advisor_profile_id?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          metadata?: Json
          query_log_id?: string | null
          query_text?: string
          retrieval_type?: string
          top_k?: number
          total_results?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_retrieval_logs_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "advisor_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_logs_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "advisor_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_logs_query_log_id_fkey"
            columns: ["query_log_id"]
            isOneToOne: false
            referencedRelation: "advisor_query_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_retrieval_results: {
        Row: {
          chunk_id: string | null
          created_at: string
          document_id: string | null
          id: string
          metadata: Json
          rank_order: number | null
          retrieval_log_id: string
          score: number | null
          snippet: string | null
          source_label: string | null
          source_type: string | null
        }
        Insert: {
          chunk_id?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          metadata?: Json
          rank_order?: number | null
          retrieval_log_id: string
          score?: number | null
          snippet?: string | null
          source_label?: string | null
          source_type?: string | null
        }
        Update: {
          chunk_id?: string | null
          created_at?: string
          document_id?: string | null
          id?: string
          metadata?: Json
          rank_order?: number | null
          retrieval_log_id?: string
          score?: number | null
          snippet?: string | null
          source_label?: string | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_retrieval_results_chunk_id_fkey"
            columns: ["chunk_id"]
            isOneToOne: false
            referencedRelation: "knowledge_document_chunks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_results_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_retrieval_results_retrieval_log_id_fkey"
            columns: ["retrieval_log_id"]
            isOneToOne: false
            referencedRelation: "advisor_retrieval_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_run_events: {
        Row: {
          created_at: string
          event_payload: Json
          event_type: string
          execution_run_id: string
          id: string
        }
        Insert: {
          created_at?: string
          event_payload?: Json
          event_type: string
          execution_run_id: string
          id?: string
        }
        Update: {
          created_at?: string
          event_payload?: Json
          event_type?: string
          execution_run_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_run_events_execution_run_id_fkey"
            columns: ["execution_run_id"]
            isOneToOne: false
            referencedRelation: "advisor_execution_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_source_rules: {
        Row: {
          advisor_profile_id: string | null
          created_at: string
          id: string
          is_active: boolean
          rule_type: string
          rule_value: string
        }
        Insert: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          rule_type: string
          rule_value: string
        }
        Update: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          rule_type?: string
          rule_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_source_rules_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_tools: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          tool_code: string
          tool_type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tool_code: string
          tool_type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tool_code?: string
          tool_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      advisor_usage_records: {
        Row: {
          created_at: string
          currency_code: string
          estimated_cost: number | null
          execution_run_id: string
          id: string
          model_id: string | null
          provider_id: string | null
          token_input: number
          token_output: number
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency_code?: string
          estimated_cost?: number | null
          execution_run_id: string
          id?: string
          model_id?: string | null
          provider_id?: string | null
          token_input?: number
          token_output?: number
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency_code?: string
          estimated_cost?: number | null
          execution_run_id?: string
          id?: string
          model_id?: string | null
          provider_id?: string | null
          token_input?: number
          token_output?: number
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_usage_records_execution_run_id_fkey"
            columns: ["execution_run_id"]
            isOneToOne: false
            referencedRelation: "advisor_execution_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_usage_records_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_usage_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_usage_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_web_search_logs: {
        Row: {
          advisor_profile_id: string | null
          created_at: string
          id: string
          metadata: Json
          provider: string | null
          query_log_id: string | null
          result_count: number
          search_query: string
          status: string
          user_id: string | null
        }
        Insert: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          provider?: string | null
          query_log_id?: string | null
          result_count?: number
          search_query: string
          status?: string
          user_id?: string | null
        }
        Update: {
          advisor_profile_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          provider?: string | null
          query_log_id?: string | null
          result_count?: number
          search_query?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_web_search_logs_advisor_profile_id_fkey"
            columns: ["advisor_profile_id"]
            isOneToOne: false
            referencedRelation: "advisor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_web_search_logs_query_log_id_fkey"
            columns: ["query_log_id"]
            isOneToOne: false
            referencedRelation: "advisor_query_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_web_search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_web_search_results: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          metadata: Json
          rank_order: number | null
          snippet: string | null
          title: string | null
          url: string | null
          web_search_log_id: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          metadata?: Json
          rank_order?: number | null
          snippet?: string | null
          title?: string | null
          url?: string | null
          web_search_log_id: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          metadata?: Json
          rank_order?: number | null
          snippet?: string | null
          title?: string | null
          url?: string | null
          web_search_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_web_search_results_web_search_log_id_fkey"
            columns: ["web_search_log_id"]
            isOneToOne: false
            referencedRelation: "advisor_web_search_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      agronomy_tool_runs: {
        Row: {
          created_at: string
          crop_id: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          input_data: Json
          output_data: Json
          run_name: string | null
          status: string
          tool_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          input_data?: Json
          output_data?: Json
          run_name?: string | null
          status?: string
          tool_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          input_data?: Json
          output_data?: Json
          run_name?: string | null
          status?: string
          tool_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agronomy_tool_runs_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agronomy_tool_runs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agronomy_tool_runs_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agronomy_tool_runs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agronomy_tool_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agronomy_tool_templates: {
        Row: {
          access_level: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_data: Json
          tool_id: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_data?: Json
          tool_id: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_data?: Json
          tool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agronomy_tool_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agronomy_tool_templates_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      agronomy_tools: {
        Row: {
          category: string
          config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          tool_code: string
          updated_at: string
        }
        Insert: {
          category: string
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tool_code: string
          updated_at?: string
        }
        Update: {
          category?: string
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tool_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          context_window: number | null
          created_at: string
          currency_code: string
          display_name: string
          id: string
          is_active: boolean
          max_output_tokens: number | null
          metadata: Json
          model_code: string
          model_type: string
          pricing_input_per_million: number | null
          pricing_output_per_million: number | null
          provider_id: string
          updated_at: string
        }
        Insert: {
          context_window?: number | null
          created_at?: string
          currency_code?: string
          display_name: string
          id?: string
          is_active?: boolean
          max_output_tokens?: number | null
          metadata?: Json
          model_code: string
          model_type: string
          pricing_input_per_million?: number | null
          pricing_output_per_million?: number | null
          provider_id: string
          updated_at?: string
        }
        Update: {
          context_window?: number | null
          created_at?: string
          currency_code?: string
          display_name?: string
          id?: string
          is_active?: boolean
          max_output_tokens?: number | null
          metadata?: Json
          model_code?: string
          model_type?: string
          pricing_input_per_million?: number | null
          pricing_output_per_million?: number | null
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          base_url: string | null
          config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          provider_code: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          provider_code: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          provider_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          line_total: number
          metadata: Json
          product_id: string
          quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          line_total?: number
          metadata?: Json
          product_id: string
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          line_total?: number
          metadata?: Json
          product_id?: string
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency_code: string
          discount_amount: number
          expires_at: string | null
          id: string
          status: string
          subtotal_amount: number
          tax_amount: number
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency_code?: string
          discount_amount?: number
          expires_at?: string | null
          id?: string
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency_code?: string
          discount_amount?: number
          expires_at?: string | null
          id?: string
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_url: string | null
          course_id: string
          created_at: string
          enrollment_id: string | null
          id: string
          issued_at: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          certificate_url?: string | null
          course_id: string
          created_at?: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          certificate_url?: string | null
          course_id?: string
          created_at?: string
          enrollment_id?: string | null
          id?: string
          issued_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_codes: {
        Row: {
          code: string
          created_at: string
          currency_code: string
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          starts_at: string | null
          updated_at: string
          usage_count: number
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          currency_code?: string
          description?: string | null
          discount_type: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          currency_code?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
        }
        Relationships: []
      }
      course_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      course_classifications: {
        Row: {
          classification_type: string
          code: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          classification_type: string
          code?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          classification_type?: string
          code?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          is_active: boolean
          is_featured: boolean
          level: string | null
          price: number | null
          short_description: string | null
          slug: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          level?: string | null
          price?: number | null
          short_description?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          level?: string | null
          price?: number | null
          short_description?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "course_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_calendar_events: {
        Row: {
          created_at: string
          crop_calendar_plan_id: string
          event_title: string
          event_type: string
          id: string
          notes: string | null
          planned_date: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          crop_calendar_plan_id: string
          event_title: string
          event_type: string
          id?: string
          notes?: string | null
          planned_date?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          crop_calendar_plan_id?: string
          event_title?: string
          event_type?: string
          id?: string
          notes?: string | null
          planned_date?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "crop_calendar_events_crop_calendar_plan_id_fkey"
            columns: ["crop_calendar_plan_id"]
            isOneToOne: false
            referencedRelation: "crop_calendar_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_calendar_plans: {
        Row: {
          created_at: string
          crop_id: string | null
          expected_harvest_end: string | null
          expected_harvest_start: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          notes: string | null
          plan_name: string
          planting_window_end: string | null
          planting_window_start: string | null
          tool_run_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          notes?: string | null
          plan_name: string
          planting_window_end?: string | null
          planting_window_start?: string | null
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          notes?: string | null
          plan_name?: string
          planting_window_end?: string | null
          planting_window_start?: string | null
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_calendar_plans_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_calendar_plans_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_calendar_plans_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_calendar_plans_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_calendar_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_recommendations: {
        Row: {
          basis: string | null
          created_at: string
          crop_id: string | null
          farm_id: string | null
          field_id: string | null
          generated_by: string | null
          id: string
          metadata: Json
          recommendation_text: string
          recommendation_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          basis?: string | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          generated_by?: string | null
          id?: string
          metadata?: Json
          recommendation_text: string
          recommendation_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          basis?: string | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          generated_by?: string | null
          id?: string
          metadata?: Json
          recommendation_text?: string
          recommendation_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crop_recommendations_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_recommendations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_recommendations_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_recommendations_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          created_at: string | null
          crop_type: string
          expected_harvest: string | null
          farm_id: string | null
          id: string
          planting_date: string | null
          variety: string | null
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          expected_harvest?: string | null
          farm_id?: string | null
          id?: string
          planting_date?: string | null
          variety?: string | null
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          expected_harvest?: string | null
          farm_id?: string | null
          id?: string
          planting_date?: string | null
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_invoice_items: {
        Row: {
          created_at: string
          customer_invoice_id: string
          description: string
          id: string
          line_total: number
          order_item_id: string | null
          quantity: number
          quantity_uom: string
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          customer_invoice_id: string
          description: string
          id?: string
          line_total?: number
          order_item_id?: string | null
          quantity: number
          quantity_uom?: string
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          customer_invoice_id?: string
          description?: string
          id?: string
          line_total?: number
          order_item_id?: string | null
          quantity?: number
          quantity_uom?: string
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoice_items_customer_invoice_id_fkey"
            columns: ["customer_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoice_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_invoices: {
        Row: {
          created_at: string
          currency_code: string
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          order_id: string | null
          status: string
          subtotal_amount: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          order_id?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          order_id?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_requests: {
        Row: {
          cargo_type: string | null
          created_at: string
          delivery_status: string
          dropoff_address: string
          dropoff_lat: number | null
          dropoff_lng: number | null
          external_reference: string | null
          id: string
          logistics_provider: string | null
          metadata: Json
          order_id: string | null
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          requested_by: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          cargo_type?: string | null
          created_at?: string
          delivery_status?: string
          dropoff_address: string
          dropoff_lat?: number | null
          dropoff_lng?: number | null
          external_reference?: string | null
          id?: string
          logistics_provider?: string | null
          metadata?: Json
          order_id?: string | null
          pickup_address: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          requested_by?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          cargo_type?: string | null
          created_at?: string
          delivery_status?: string
          dropoff_address?: string
          dropoff_lat?: number | null
          dropoff_lng?: number | null
          external_reference?: string | null
          id?: string
          logistics_provider?: string | null
          metadata?: Json
          order_id?: string | null
          pickup_address?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          requested_by?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_status_logs: {
        Row: {
          created_at: string
          delivery_request_id: string
          id: string
          notes: string | null
          status: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          delivery_request_id: string
          id?: string
          notes?: string | null
          status: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          delivery_request_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_status_logs_delivery_request_id_fkey"
            columns: ["delivery_request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_status_logs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      depot_zones: {
        Row: {
          created_at: string
          depot_id: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          zone_code: string
          zone_type: string
        }
        Insert: {
          created_at?: string
          depot_id: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          zone_code: string
          zone_type?: string
        }
        Update: {
          created_at?: string
          depot_id?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          zone_code?: string
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "depot_zones_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      depots: {
        Row: {
          address_id: string | null
          created_at: string
          depot_code: string
          depot_type: string
          id: string
          is_active: boolean
          metadata: Json
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          depot_code: string
          depot_type?: string
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          depot_code?: string
          depot_type?: string
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "depots_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          enrolled_at: string
          id: string
          progress: number | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string
          id?: string
          progress?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_activities: {
        Row: {
          activity_date: string
          activity_type: string
          cost_amount: number | null
          created_at: string
          description: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          metadata: Json
          performed_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_date: string
          activity_type: string
          cost_amount?: number | null
          created_at?: string
          description?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          metadata?: Json
          performed_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          cost_amount?: number | null
          created_at?: string
          description?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          metadata?: Json
          performed_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_activities_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_activities_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_activities_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string | null
          farm_name: string
          hectares: number | null
          id: string
          location: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          farm_name: string
          hectares?: number | null
          id?: string
          location?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          farm_name?: string
          hectares?: number | null
          id?: string
          location?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farms_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      fertiliser_plan_items: {
        Row: {
          application_rate_kg_ha: number | null
          application_stage: string
          application_timing: string | null
          created_at: string
          id: string
          notes: string | null
          nutrient_ratio: string | null
          product_name: string | null
          recommendation_id: string
          sort_order: number
        }
        Insert: {
          application_rate_kg_ha?: number | null
          application_stage: string
          application_timing?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          nutrient_ratio?: string | null
          product_name?: string | null
          recommendation_id: string
          sort_order?: number
        }
        Update: {
          application_rate_kg_ha?: number | null
          application_stage?: string
          application_timing?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          nutrient_ratio?: string | null
          product_name?: string | null
          recommendation_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fertiliser_plan_items_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "fertiliser_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      fertiliser_recommendations: {
        Row: {
          assumptions: Json
          boron_kg_ha: number | null
          calcium_kg_ha: number | null
          created_at: string
          crop_id: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          magnesium_kg_ha: number | null
          nitrogen_kg_ha: number | null
          phosphorus_kg_ha: number | null
          potassium_kg_ha: number | null
          recommendation_notes: string | null
          season_label: string | null
          sulphur_kg_ha: number | null
          target_yield: number | null
          target_yield_unit: string | null
          tool_run_id: string | null
          updated_at: string
          user_id: string
          zinc_kg_ha: number | null
        }
        Insert: {
          assumptions?: Json
          boron_kg_ha?: number | null
          calcium_kg_ha?: number | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          magnesium_kg_ha?: number | null
          nitrogen_kg_ha?: number | null
          phosphorus_kg_ha?: number | null
          potassium_kg_ha?: number | null
          recommendation_notes?: string | null
          season_label?: string | null
          sulphur_kg_ha?: number | null
          target_yield?: number | null
          target_yield_unit?: string | null
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
          zinc_kg_ha?: number | null
        }
        Update: {
          assumptions?: Json
          boron_kg_ha?: number | null
          calcium_kg_ha?: number | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          magnesium_kg_ha?: number | null
          nitrogen_kg_ha?: number | null
          phosphorus_kg_ha?: number | null
          potassium_kg_ha?: number | null
          recommendation_notes?: string | null
          season_label?: string | null
          sulphur_kg_ha?: number | null
          target_yield?: number | null
          target_yield_unit?: string | null
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
          zinc_kg_ha?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fertiliser_recommendations_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fertiliser_recommendations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fertiliser_recommendations_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fertiliser_recommendations_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fertiliser_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          area_hectares: number
          boundary_geojson: Json | null
          created_at: string
          farm_id: string
          field_code: string | null
          field_name: string
          gps_lat: number | null
          gps_lng: number | null
          id: string
          irrigation_type: string | null
          is_active: boolean
          soil_type: string | null
          updated_at: string
        }
        Insert: {
          area_hectares?: number
          boundary_geojson?: Json | null
          created_at?: string
          farm_id: string
          field_code?: string | null
          field_name: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          irrigation_type?: string | null
          is_active?: boolean
          soil_type?: string | null
          updated_at?: string
        }
        Update: {
          area_hectares?: number
          boundary_geojson?: Json | null
          created_at?: string
          farm_id?: string
          field_code?: string | null
          field_name?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          irrigation_type?: string | null
          is_active?: boolean
          soil_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fields_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      fulfillment_batches: {
        Row: {
          created_at: string
          depot_id: string | null
          fulfillment_number: string
          id: string
          order_id: string | null
          packed_at: string | null
          packed_by: string | null
          status: string
          updated_at: string
          wave_id: string | null
        }
        Insert: {
          created_at?: string
          depot_id?: string | null
          fulfillment_number: string
          id?: string
          order_id?: string | null
          packed_at?: string | null
          packed_by?: string | null
          status?: string
          updated_at?: string
          wave_id?: string | null
        }
        Update: {
          created_at?: string
          depot_id?: string | null
          fulfillment_number?: string
          id?: string
          order_id?: string | null
          packed_at?: string | null
          packed_by?: string | null
          status?: string
          updated_at?: string
          wave_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fulfillment_batches_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fulfillment_batches_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fulfillment_batches_packed_by_fkey"
            columns: ["packed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fulfillment_batches_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "pick_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_receipt_items: {
        Row: {
          batch_number: string | null
          created_at: string
          expiry_date: string | null
          goods_receipt_id: string
          id: string
          purchase_order_item_id: string | null
          quantity_received: number
          quantity_uom: string
          unit_cost: number | null
          variant_id: string | null
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          goods_receipt_id: string
          id?: string
          purchase_order_item_id?: string | null
          quantity_received: number
          quantity_uom?: string
          unit_cost?: number | null
          variant_id?: string | null
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          goods_receipt_id?: string
          id?: string
          purchase_order_item_id?: string | null
          quantity_received?: number
          quantity_uom?: string
          unit_cost?: number | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goods_receipt_items_goods_receipt_id_fkey"
            columns: ["goods_receipt_id"]
            isOneToOne: false
            referencedRelation: "goods_receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipt_items_purchase_order_item_id_fkey"
            columns: ["purchase_order_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_receipts: {
        Row: {
          created_at: string
          depot_id: string | null
          id: string
          notes: string | null
          purchase_order_id: string | null
          receipt_date: string
          receipt_number: string
          received_by: string | null
          status: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          depot_id?: string | null
          id?: string
          notes?: string | null
          purchase_order_id?: string | null
          receipt_date?: string
          receipt_number: string
          received_by?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          depot_id?: string | null
          id?: string
          notes?: string | null
          purchase_order_id?: string | null
          receipt_date?: string
          receipt_number?: string
          received_by?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goods_receipts_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipts_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipts_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      harvest_records: {
        Row: {
          created_at: string
          crop_id: string | null
          field_id: string
          harvest_date: string
          harvested_area_hectares: number | null
          id: string
          metadata: Json
          moisture_percent: number | null
          notes: string | null
          planting_record_id: string | null
          quality_grade: string | null
          status: string
          total_yield_tons: number | null
          updated_at: string
          yield_per_hectare: number | null
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          field_id: string
          harvest_date: string
          harvested_area_hectares?: number | null
          id?: string
          metadata?: Json
          moisture_percent?: number | null
          notes?: string | null
          planting_record_id?: string | null
          quality_grade?: string | null
          status?: string
          total_yield_tons?: number | null
          updated_at?: string
          yield_per_hectare?: number | null
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          field_id?: string
          harvest_date?: string
          harvested_area_hectares?: number | null
          id?: string
          metadata?: Json
          moisture_percent?: number | null
          notes?: string | null
          planting_record_id?: string | null
          quality_grade?: string | null
          status?: string
          total_yield_tons?: number | null
          updated_at?: string
          yield_per_hectare?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "harvest_records_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvest_records_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvest_records_planting_record_id_fkey"
            columns: ["planting_record_id"]
            isOneToOne: false
            referencedRelation: "planting_records"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_batches: {
        Row: {
          batch_number: string
          bin_id: string | null
          created_at: string
          currency_code: string
          depot_id: string
          expiry_date: string | null
          id: string
          lot_number: string | null
          manufacture_date: string | null
          metadata: Json
          quantity_on_hand: number
          quantity_reserved: number
          status: string
          unit_cost: number | null
          updated_at: string
          variant_id: string
        }
        Insert: {
          batch_number: string
          bin_id?: string | null
          created_at?: string
          currency_code?: string
          depot_id: string
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          manufacture_date?: string | null
          metadata?: Json
          quantity_on_hand?: number
          quantity_reserved?: number
          status?: string
          unit_cost?: number | null
          updated_at?: string
          variant_id: string
        }
        Update: {
          batch_number?: string
          bin_id?: string | null
          created_at?: string
          currency_code?: string
          depot_id?: string
          expiry_date?: string | null
          id?: string
          lot_number?: string | null
          manufacture_date?: string | null
          metadata?: Json
          quantity_on_hand?: number
          quantity_reserved?: number
          status?: string
          unit_cost?: number | null
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "storage_bins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      irrigation_plan_events: {
        Row: {
          created_at: string
          deficit_mm: number | null
          et_mm: number | null
          event_date: string | null
          growth_stage: string | null
          id: string
          irrigation_mm: number | null
          irrigation_plan_id: string
          notes: string | null
          rainfall_mm: number | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          deficit_mm?: number | null
          et_mm?: number | null
          event_date?: string | null
          growth_stage?: string | null
          id?: string
          irrigation_mm?: number | null
          irrigation_plan_id: string
          notes?: string | null
          rainfall_mm?: number | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          deficit_mm?: number | null
          et_mm?: number | null
          event_date?: string | null
          growth_stage?: string | null
          id?: string
          irrigation_mm?: number | null
          irrigation_plan_id?: string
          notes?: string | null
          rainfall_mm?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "irrigation_plan_events_irrigation_plan_id_fkey"
            columns: ["irrigation_plan_id"]
            isOneToOne: false
            referencedRelation: "irrigation_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      irrigation_plans: {
        Row: {
          application_efficiency_percent: number | null
          created_at: string
          crop_id: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          irrigation_trigger_percent: number | null
          notes: string | null
          plan_name: string
          rooting_depth_cm: number | null
          soil_water_holding_capacity_mm: number | null
          target_refill_mm: number | null
          tool_run_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_efficiency_percent?: number | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          irrigation_trigger_percent?: number | null
          notes?: string | null
          plan_name: string
          rooting_depth_cm?: number | null
          soil_water_holding_capacity_mm?: number | null
          target_refill_mm?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_efficiency_percent?: number | null
          created_at?: string
          crop_id?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          irrigation_trigger_percent?: number | null
          notes?: string | null
          plan_name?: string
          rooting_depth_cm?: number | null
          soil_water_holding_capacity_mm?: number | null
          target_refill_mm?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "irrigation_plans_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "irrigation_plans_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "irrigation_plans_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "irrigation_plans_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "irrigation_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_document_chunks: {
        Row: {
          chunk_hash: string | null
          chunk_index: number
          chunk_text: string
          created_at: string
          document_id: string
          embedded_at: string | null
          embedding: string | null
          embedding_model: string | null
          embedding_provider: string | null
          embedding_status: string
          id: string
          metadata: Json
          token_count: number | null
        }
        Insert: {
          chunk_hash?: string | null
          chunk_index: number
          chunk_text: string
          created_at?: string
          document_id: string
          embedded_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          embedding_provider?: string | null
          embedding_status?: string
          id?: string
          metadata?: Json
          token_count?: number | null
        }
        Update: {
          chunk_hash?: string | null
          chunk_index?: number
          chunk_text?: string
          created_at?: string
          document_id?: string
          embedded_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          embedding_provider?: string | null
          embedding_status?: string
          id?: string
          metadata?: Json
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          access_level: string
          country_code: string | null
          created_at: string
          created_by: string | null
          document_type: string
          id: string
          is_published: boolean
          language_code: string | null
          metadata: Json
          original_url: string | null
          plain_text: string | null
          published_at: string | null
          slug: string | null
          source_id: string | null
          storage_path: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          document_type?: string
          id?: string
          is_published?: boolean
          language_code?: string | null
          metadata?: Json
          original_url?: string | null
          plain_text?: string | null
          published_at?: string | null
          slug?: string | null
          source_id?: string | null
          storage_path?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          document_type?: string
          id?: string
          is_published?: boolean
          language_code?: string | null
          metadata?: Json
          original_url?: string | null
          plain_text?: string | null
          published_at?: string | null
          slug?: string | null
          source_id?: string | null
          storage_path?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_ingestion_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          document_id: string | null
          error_message: string | null
          id: string
          job_type: string
          metadata: Json
          source_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          metadata?: Json
          source_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          metadata?: Json
          source_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_ingestion_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_ingestion_jobs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_ingestion_jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          country_code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          language_code: string | null
          metadata: Json
          name: string
          source_type: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          language_code?: string | null
          metadata?: Json
          name: string
          source_type: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          language_code?: string | null
          metadata?: Json
          name?: string
          source_type?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          resource_type: string
          resource_url: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          resource_type?: string
          resource_url: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          resource_type?: string
          resource_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_type: string
          content_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean
          is_published: boolean
          module_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          module_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          module_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lime_recommendations: {
        Row: {
          acid_saturation_percent: number | null
          assumptions: Json
          created_at: string
          current_ph_kcl: number | null
          farm_id: string | null
          field_id: string | null
          id: string
          lime_requirement_t_ha: number | null
          lime_type: string | null
          recommendation_notes: string | null
          soil_test_id: string | null
          target_acid_saturation_percent: number | null
          target_ph_kcl: number | null
          tool_run_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acid_saturation_percent?: number | null
          assumptions?: Json
          created_at?: string
          current_ph_kcl?: number | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          lime_requirement_t_ha?: number | null
          lime_type?: string | null
          recommendation_notes?: string | null
          soil_test_id?: string | null
          target_acid_saturation_percent?: number | null
          target_ph_kcl?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acid_saturation_percent?: number | null
          assumptions?: Json
          created_at?: string
          current_ph_kcl?: number | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          lime_requirement_t_ha?: number | null
          lime_type?: string | null
          recommendation_notes?: string | null
          soil_test_id?: string | null
          target_acid_saturation_percent?: number | null
          target_ph_kcl?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lime_recommendations_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lime_recommendations_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lime_recommendations_soil_test_id_fkey"
            columns: ["soil_test_id"]
            isOneToOne: false
            referencedRelation: "soil_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lime_recommendations_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lime_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_buyer_requests: {
        Row: {
          buyer_organization_id: string | null
          buyer_user_id: string | null
          commodity_id: string
          country_code: string | null
          created_at: string
          currency_code: string
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_location: string | null
          description: string | null
          id: string
          metadata: Json
          minimum_quality_grade: string | null
          quantity_unit: string
          region_name: string | null
          request_number: string
          required_from: string | null
          required_quantity: number
          required_until: string | null
          status: string
          target_price_per_unit: number | null
          title: string
          updated_at: string
          visibility_scope: string
        }
        Insert: {
          buyer_organization_id?: string | null
          buyer_user_id?: string | null
          commodity_id: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_location?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          minimum_quality_grade?: string | null
          quantity_unit?: string
          region_name?: string | null
          request_number: string
          required_from?: string | null
          required_quantity: number
          required_until?: string | null
          status?: string
          target_price_per_unit?: number | null
          title: string
          updated_at?: string
          visibility_scope?: string
        }
        Update: {
          buyer_organization_id?: string | null
          buyer_user_id?: string | null
          commodity_id?: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_location?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          minimum_quality_grade?: string | null
          quantity_unit?: string
          region_name?: string | null
          request_number?: string
          required_from?: string | null
          required_quantity?: number
          required_until?: string | null
          status?: string
          target_price_per_unit?: number | null
          title?: string
          updated_at?: string
          visibility_scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_buyer_requests_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_buyer_requests_buyer_user_id_fkey"
            columns: ["buyer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_buyer_requests_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "marketplace_commodities"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_commodities: {
        Row: {
          category: string
          commodity_code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata: Json
          name: string
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          category: string
          commodity_code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          unit_of_measure?: string
          updated_at?: string
        }
        Update: {
          category?: string
          commodity_code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_commodity_grades: {
        Row: {
          code: string | null
          commodity_id: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          commodity_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          commodity_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_commodity_grades_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "marketplace_commodities"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_disputes: {
        Row: {
          created_at: string
          description: string
          dispute_type: string
          id: string
          raised_by_user_id: string | null
          resolution_notes: string | null
          status: string
          title: string
          trade_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          dispute_type: string
          id?: string
          raised_by_user_id?: string | null
          resolution_notes?: string | null
          status?: string
          title: string
          trade_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          dispute_type?: string
          id?: string
          raised_by_user_id?: string | null
          resolution_notes?: string | null
          status?: string
          title?: string
          trade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_disputes_raised_by_user_id_fkey"
            columns: ["raised_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_disputes_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "marketplace_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listing_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string
          id: string
          issued_at: string | null
          listing_id: string
          title: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          issued_at?: string | null
          listing_id: string
          title: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          issued_at?: string | null
          listing_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listing_documents_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listing_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          listing_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          listing_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          listing_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listing_lots: {
        Row: {
          batch_reference: string | null
          created_at: string
          id: string
          listing_id: string
          lot_code: string
          metadata: Json
          moisture_percent: number | null
          quality_grade: string | null
          quantity_available: number
          quantity_reserved: number
          quantity_unit: string
          storage_location: string | null
        }
        Insert: {
          batch_reference?: string | null
          created_at?: string
          id?: string
          listing_id: string
          lot_code: string
          metadata?: Json
          moisture_percent?: number | null
          quality_grade?: string | null
          quantity_available?: number
          quantity_reserved?: number
          quantity_unit?: string
          storage_location?: string | null
        }
        Update: {
          batch_reference?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          lot_code?: string
          metadata?: Json
          moisture_percent?: number | null
          quality_grade?: string | null
          quantity_available?: number
          quantity_reserved?: number
          quantity_unit?: string
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listing_lots_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listing_statuses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
          status_code: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          status_code: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          status_code?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          available_from: string | null
          available_until: string | null
          commodity_id: string
          country_code: string | null
          created_at: string
          currency_code: string
          description: string | null
          farm_id: string | null
          field_id: string | null
          foreign_matter_percent: number | null
          harvest_date: string | null
          harvest_season: string | null
          id: string
          listing_number: string
          metadata: Json
          minimum_order_quantity: number | null
          moisture_percent: number | null
          oil_content_percent: number | null
          packaging_type: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          pickup_location: string | null
          price_per_unit: number | null
          price_type: string
          protein_percent: number | null
          quality_grade: string | null
          quantity_available: number
          quantity_reserved: number
          quantity_unit: string
          region_name: string | null
          seller_organization_id: string | null
          seller_user_id: string | null
          status: string
          title: string
          updated_at: string
          visibility_scope: string
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          commodity_id: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          description?: string | null
          farm_id?: string | null
          field_id?: string | null
          foreign_matter_percent?: number | null
          harvest_date?: string | null
          harvest_season?: string | null
          id?: string
          listing_number: string
          metadata?: Json
          minimum_order_quantity?: number | null
          moisture_percent?: number | null
          oil_content_percent?: number | null
          packaging_type?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_location?: string | null
          price_per_unit?: number | null
          price_type?: string
          protein_percent?: number | null
          quality_grade?: string | null
          quantity_available?: number
          quantity_reserved?: number
          quantity_unit?: string
          region_name?: string | null
          seller_organization_id?: string | null
          seller_user_id?: string | null
          status?: string
          title: string
          updated_at?: string
          visibility_scope?: string
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          commodity_id?: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          description?: string | null
          farm_id?: string | null
          field_id?: string | null
          foreign_matter_percent?: number | null
          harvest_date?: string | null
          harvest_season?: string | null
          id?: string
          listing_number?: string
          metadata?: Json
          minimum_order_quantity?: number | null
          moisture_percent?: number | null
          oil_content_percent?: number | null
          packaging_type?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_location?: string | null
          price_per_unit?: number | null
          price_type?: string
          protein_percent?: number | null
          quality_grade?: string | null
          quantity_available?: number
          quantity_reserved?: number
          quantity_unit?: string
          region_name?: string | null
          seller_organization_id?: string | null
          seller_user_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          visibility_scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "marketplace_commodities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_seller_organization_id_fkey"
            columns: ["seller_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_listings_seller_user_id_fkey"
            columns: ["seller_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_matches: {
        Row: {
          buyer_request_id: string | null
          created_at: string
          id: string
          listing_id: string | null
          match_reason: string | null
          match_score: number | null
          metadata: Json
          status: string
        }
        Insert: {
          buyer_request_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          match_reason?: string | null
          match_score?: number | null
          metadata?: Json
          status?: string
        }
        Update: {
          buyer_request_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          match_reason?: string | null
          match_score?: number | null
          metadata?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_matches_buyer_request_id_fkey"
            columns: ["buyer_request_id"]
            isOneToOne: false
            referencedRelation: "marketplace_buyer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_matches_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offer_messages: {
        Row: {
          created_at: string
          id: string
          message_text: string
          offer_id: string
          sender_role: string | null
          sender_user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_text: string
          offer_id: string
          sender_role?: string | null
          sender_user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message_text?: string
          offer_id?: string
          sender_role?: string | null
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offer_messages_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offer_messages_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_offers: {
        Row: {
          buyer_organization_id: string | null
          buyer_request_id: string | null
          buyer_user_id: string | null
          created_at: string
          currency_code: string
          expires_at: string | null
          id: string
          initiated_by: string
          listing_id: string | null
          metadata: Json
          notes: string | null
          offer_number: string
          offer_status: string
          quantity: number
          quantity_unit: string
          seller_organization_id: string | null
          seller_user_id: string | null
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          buyer_organization_id?: string | null
          buyer_request_id?: string | null
          buyer_user_id?: string | null
          created_at?: string
          currency_code?: string
          expires_at?: string | null
          id?: string
          initiated_by: string
          listing_id?: string | null
          metadata?: Json
          notes?: string | null
          offer_number: string
          offer_status?: string
          quantity: number
          quantity_unit?: string
          seller_organization_id?: string | null
          seller_user_id?: string | null
          total_amount?: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          buyer_organization_id?: string | null
          buyer_request_id?: string | null
          buyer_user_id?: string | null
          created_at?: string
          currency_code?: string
          expires_at?: string | null
          id?: string
          initiated_by?: string
          listing_id?: string | null
          metadata?: Json
          notes?: string | null
          offer_number?: string
          offer_status?: string
          quantity?: number
          quantity_unit?: string
          seller_organization_id?: string | null
          seller_user_id?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_offers_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offers_buyer_request_id_fkey"
            columns: ["buyer_request_id"]
            isOneToOne: false
            referencedRelation: "marketplace_buyer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offers_buyer_user_id_fkey"
            columns: ["buyer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offers_seller_organization_id_fkey"
            columns: ["seller_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_offers_seller_user_id_fkey"
            columns: ["seller_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_payouts: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          payout_amount: number
          payout_status: string
          provider_reference: string | null
          seller_organization_id: string | null
          seller_user_id: string | null
          settlement_id: string
          updated_at: string
          wallet_transaction_id: string | null
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          payout_amount: number
          payout_status?: string
          provider_reference?: string | null
          seller_organization_id?: string | null
          seller_user_id?: string | null
          settlement_id: string
          updated_at?: string
          wallet_transaction_id?: string | null
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          payout_amount?: number
          payout_status?: string
          provider_reference?: string | null
          seller_organization_id?: string | null
          seller_user_id?: string | null
          settlement_id?: string
          updated_at?: string
          wallet_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_payouts_seller_organization_id_fkey"
            columns: ["seller_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_payouts_seller_user_id_fkey"
            columns: ["seller_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_payouts_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "marketplace_settlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_payouts_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "wallet_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_price_observations: {
        Row: {
          commodity_id: string
          country_code: string | null
          created_at: string
          currency_code: string
          id: string
          metadata: Json
          observation_date: string
          price_per_unit: number
          quantity_unit: string
          region_name: string | null
          source_label: string | null
        }
        Insert: {
          commodity_id: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          metadata?: Json
          observation_date: string
          price_per_unit: number
          quantity_unit?: string
          region_name?: string | null
          source_label?: string | null
        }
        Update: {
          commodity_id?: string
          country_code?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          metadata?: Json
          observation_date?: string
          price_per_unit?: number
          quantity_unit?: string
          region_name?: string | null
          source_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_price_observations_commodity_id_fkey"
            columns: ["commodity_id"]
            isOneToOne: false
            referencedRelation: "marketplace_commodities"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_quality_attributes: {
        Row: {
          attribute_name: string
          attribute_value_number: number | null
          attribute_value_text: string | null
          created_at: string
          id: string
          listing_id: string
          unit: string | null
        }
        Insert: {
          attribute_name: string
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          listing_id: string
          unit?: string | null
        }
        Update: {
          attribute_name?: string
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_quality_attributes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_settlements: {
        Row: {
          commission_amount: number
          created_at: string
          currency_code: string
          gross_amount: number
          id: string
          logistics_amount: number
          net_seller_amount: number
          notes: string | null
          settlement_number: string
          settlement_status: string
          trade_id: string
          updated_at: string
        }
        Insert: {
          commission_amount?: number
          created_at?: string
          currency_code?: string
          gross_amount: number
          id?: string
          logistics_amount?: number
          net_seller_amount?: number
          notes?: string | null
          settlement_number: string
          settlement_status?: string
          trade_id: string
          updated_at?: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          currency_code?: string
          gross_amount?: number
          id?: string
          logistics_amount?: number
          net_seller_amount?: number
          notes?: string | null
          settlement_number?: string
          settlement_status?: string
          trade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_settlements_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "marketplace_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_trades: {
        Row: {
          buyer_organization_id: string | null
          buyer_request_id: string | null
          buyer_user_id: string | null
          contract_terms: string | null
          created_at: string
          currency_code: string
          expected_delivery_date: string | null
          expected_pickup_date: string | null
          id: string
          listing_id: string | null
          metadata: Json
          offer_id: string
          quantity: number
          quantity_unit: string
          seller_organization_id: string | null
          seller_user_id: string | null
          total_amount: number
          trade_number: string
          trade_status: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          buyer_organization_id?: string | null
          buyer_request_id?: string | null
          buyer_user_id?: string | null
          contract_terms?: string | null
          created_at?: string
          currency_code?: string
          expected_delivery_date?: string | null
          expected_pickup_date?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json
          offer_id: string
          quantity: number
          quantity_unit?: string
          seller_organization_id?: string | null
          seller_user_id?: string | null
          total_amount: number
          trade_number: string
          trade_status?: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          buyer_organization_id?: string | null
          buyer_request_id?: string | null
          buyer_user_id?: string | null
          contract_terms?: string | null
          created_at?: string
          currency_code?: string
          expected_delivery_date?: string | null
          expected_pickup_date?: string | null
          id?: string
          listing_id?: string | null
          metadata?: Json
          offer_id?: string
          quantity?: number
          quantity_unit?: string
          seller_organization_id?: string | null
          seller_user_id?: string | null
          total_amount?: number
          trade_number?: string
          trade_status?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_trades_buyer_organization_id_fkey"
            columns: ["buyer_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_buyer_request_id_fkey"
            columns: ["buyer_request_id"]
            isOneToOne: false
            referencedRelation: "marketplace_buyer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_buyer_user_id_fkey"
            columns: ["buyer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_seller_organization_id_fkey"
            columns: ["seller_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_trades_seller_user_id_fkey"
            columns: ["seller_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          agronomy_updates: boolean
          created_at: string
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          marketing_updates: boolean
          order_updates: boolean
          payment_updates: boolean
          sms_enabled: boolean
          training_updates: boolean
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean
        }
        Insert: {
          agronomy_updates?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          marketing_updates?: boolean
          order_updates?: boolean
          payment_updates?: boolean
          sms_enabled?: boolean
          training_updates?: boolean
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean
        }
        Update: {
          agronomy_updates?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          marketing_updates?: boolean
          order_updates?: boolean
          payment_updates?: boolean
          sms_enabled?: boolean
          training_updates?: boolean
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body: string
          channel: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          subject: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          subject?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          subject?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          id: string
          message: string
          metadata: Json
          notification_type: string
          organization_id: string | null
          read_at: string | null
          sent_at: string | null
          status: string
          title: string
          user_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json
          notification_type: string
          organization_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title: string
          user_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json
          notification_type?: string
          organization_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          metadata: Json
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number
          metadata?: Json
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          sku?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          metadata?: Json
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency_code: string
          discount_amount: number
          fulfillment_status: string
          id: string
          metadata: Json
          notes: string | null
          order_number: string | null
          payment_status: string
          status: string | null
          subtotal_amount: number
          tax_amount: number
          total_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency_code?: string
          discount_amount?: number
          fulfillment_status?: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_number?: string | null
          payment_status?: string
          status?: string | null
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency_code?: string
          discount_amount?: number
          fulfillment_status?: string
          id?: string
          metadata?: Json
          notes?: string | null
          order_number?: string | null
          payment_status?: string
          status?: string | null
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          joined_at: string
          membership_role: string
          organization_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          membership_role?: string
          organization_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          membership_role?: string
          organization_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country_code: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          organization_type: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          organization_type?: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          organization_type?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          code: string
          config: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          provider_type: string
          supported_currencies: Json
          updated_at: string
        }
        Insert: {
          code: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          provider_type: string
          supported_currencies?: Json
          updated_at?: string
        }
        Update: {
          code?: string
          config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          provider_type?: string
          supported_currencies?: Json
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency_code: string
          gateway_id: string | null
          id: string
          order_id: string | null
          paid_at: string | null
          provider_reference: string | null
          provider_response: Json
          status: string
          subscription_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency_code?: string
          gateway_id?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          provider_reference?: string | null
          provider_response?: Json
          status?: string
          subscription_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: string
          gateway_id?: string | null
          id?: string
          order_id?: string | null
          paid_at?: string | null
          provider_reference?: string | null
          provider_response?: Json
          status?: string
          subscription_id?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          module: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          updated_at?: string
        }
        Relationships: []
      }
      pick_tasks: {
        Row: {
          assigned_to: string | null
          batch_id: string | null
          bin_id: string | null
          created_at: string
          depot_id: string | null
          id: string
          order_id: string | null
          order_item_id: string | null
          quantity_picked: number
          quantity_to_pick: number
          quantity_uom: string
          status: string
          updated_at: string
          variant_id: string | null
          wave_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          batch_id?: string | null
          bin_id?: string | null
          created_at?: string
          depot_id?: string | null
          id?: string
          order_id?: string | null
          order_item_id?: string | null
          quantity_picked?: number
          quantity_to_pick: number
          quantity_uom?: string
          status?: string
          updated_at?: string
          variant_id?: string | null
          wave_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          batch_id?: string | null
          bin_id?: string | null
          created_at?: string
          depot_id?: string | null
          id?: string
          order_id?: string | null
          order_item_id?: string | null
          quantity_picked?: number
          quantity_to_pick?: number
          quantity_uom?: string
          status?: string
          updated_at?: string
          variant_id?: string | null
          wave_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pick_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "storage_bins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_tasks_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "pick_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      pick_waves: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          depot_id: string
          id: string
          priority: number
          released_at: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
          wave_number: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          depot_id: string
          id?: string
          priority?: number
          released_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
          wave_number: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          depot_id?: string
          id?: string
          priority?: number
          released_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
          wave_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "pick_waves_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pick_waves_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      planting_records: {
        Row: {
          area_planted_hectares: number | null
          created_at: string
          crop_id: string | null
          crop_type: string
          expected_harvest_date: string | null
          field_id: string
          id: string
          metadata: Json
          notes: string | null
          plant_population: number | null
          planting_date: string
          planting_depth_cm: number | null
          row_spacing_cm: number | null
          seed_rate: number | null
          status: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          area_planted_hectares?: number | null
          created_at?: string
          crop_id?: string | null
          crop_type: string
          expected_harvest_date?: string | null
          field_id: string
          id?: string
          metadata?: Json
          notes?: string | null
          plant_population?: number | null
          planting_date: string
          planting_depth_cm?: number | null
          row_spacing_cm?: number | null
          seed_rate?: number | null
          status?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          area_planted_hectares?: number | null
          created_at?: string
          crop_id?: string | null
          crop_type?: string
          expected_harvest_date?: string | null
          field_id?: string
          id?: string
          metadata?: Json
          notes?: string | null
          plant_population?: number | null
          planting_date?: string
          planting_depth_cm?: number | null
          row_spacing_cm?: number | null
          seed_rate?: number | null
          status?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planting_records_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planting_records_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_assignments: {
        Row: {
          attribute_id: string
          attribute_option_id: string | null
          attribute_value_boolean: boolean | null
          attribute_value_number: number | null
          attribute_value_text: string | null
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          attribute_id: string
          attribute_option_id?: string | null
          attribute_value_boolean?: boolean | null
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          attribute_id?: string
          attribute_option_id?: string | null
          attribute_value_boolean?: boolean | null
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_assignments_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_assignments_attribute_option_id_fkey"
            columns: ["attribute_option_id"]
            isOneToOne: false
            referencedRelation: "product_attribute_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_assignments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_options: {
        Row: {
          attribute_id: string
          created_at: string
          display_label: string | null
          id: string
          option_value: string
          sort_order: number
        }
        Insert: {
          attribute_id: string
          created_at?: string
          display_label?: string | null
          id?: string
          option_value: string
          sort_order?: number
        }
        Update: {
          attribute_id?: string
          created_at?: string
          display_label?: string | null
          id?: string
          option_value?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_options_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          applies_to_category_id: string | null
          attribute_code: string
          created_at: string
          data_type: string
          description: string | null
          id: string
          is_active: boolean
          is_required: boolean
          is_variant_driver: boolean
          name: string
          updated_at: string
        }
        Insert: {
          applies_to_category_id?: string | null
          attribute_code: string
          created_at?: string
          data_type: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          is_variant_driver?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          applies_to_category_id?: string | null
          attribute_code?: string
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_required?: boolean
          is_variant_driver?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_applies_to_category_id_fkey"
            columns: ["applies_to_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          sku_prefix: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          sku_prefix?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          sku_prefix?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category_assignments: {
        Row: {
          category_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_assignments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collection_items: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "product_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collection_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_report_url: string | null
          failed_rows: number
          file_name: string
          file_type: string
          id: string
          import_source: string | null
          status: string
          success_rows: number
          total_rows: number
          uploaded_by: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_report_url?: string | null
          failed_rows?: number
          file_name: string
          file_type: string
          id?: string
          import_source?: string | null
          status?: string
          success_rows?: number
          total_rows?: number
          uploaded_by?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_report_url?: string | null
          failed_rows?: number
          file_name?: string
          file_type?: string
          id?: string
          import_source?: string | null
          status?: string
          success_rows?: number
          total_rows?: number
          uploaded_by?: string | null
        }
        Relationships: []
      }
      product_import_rows: {
        Row: {
          created_at: string
          created_product_id: string | null
          created_variant_id: string | null
          error_message: string | null
          id: string
          import_job_id: string
          raw_data_json: Json | null
          row_number: number
          validation_status: string
        }
        Insert: {
          created_at?: string
          created_product_id?: string | null
          created_variant_id?: string | null
          error_message?: string | null
          id?: string
          import_job_id: string
          raw_data_json?: Json | null
          row_number: number
          validation_status?: string
        }
        Update: {
          created_at?: string
          created_product_id?: string | null
          created_variant_id?: string | null
          error_message?: string | null
          id?: string
          import_job_id?: string
          raw_data_json?: Json | null
          row_number?: number
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_import_rows_created_product_id_fkey"
            columns: ["created_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_import_rows_created_variant_id_fkey"
            columns: ["created_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_import_rows_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "product_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pack_sizes: {
        Row: {
          created_at: string
          estimated_weight_kg: number | null
          id: string
          is_active: boolean
          is_bulk: boolean
          name: string
          pack_type: string
          quantity_unit: string | null
          quantity_value: number | null
          seed_count: number | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_weight_kg?: number | null
          id?: string
          is_active?: boolean
          is_bulk?: boolean
          name: string
          pack_type: string
          quantity_unit?: string | null
          quantity_value?: number | null
          seed_count?: number | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_weight_kg?: number | null
          id?: string
          is_active?: boolean
          is_bulk?: boolean
          name?: string
          pack_type?: string
          quantity_unit?: string | null
          quantity_value?: number | null
          seed_count?: number | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_pricing_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_buying_price: number | null
          new_margin_percent: number | null
          new_selling_price: number | null
          old_buying_price: number | null
          old_margin_percent: number | null
          old_selling_price: number | null
          product_id: string | null
          variant_id: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_buying_price?: number | null
          new_margin_percent?: number | null
          new_selling_price?: number | null
          old_buying_price?: number | null
          old_margin_percent?: number | null
          old_selling_price?: number | null
          product_id?: string | null
          variant_id?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_buying_price?: number | null
          new_margin_percent?: number | null
          new_selling_price?: number | null
          old_buying_price?: number | null
          old_margin_percent?: number | null
          old_selling_price?: number | null
          product_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_pricing_history_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_subcategories: {
        Row: {
          category_id: string
          code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_attribute_values: {
        Row: {
          attribute_id: string
          attribute_option_id: string | null
          attribute_value_boolean: boolean | null
          attribute_value_number: number | null
          attribute_value_text: string | null
          created_at: string
          id: string
          variant_id: string
        }
        Insert: {
          attribute_id: string
          attribute_option_id?: string | null
          attribute_value_boolean?: boolean | null
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          variant_id: string
        }
        Update: {
          attribute_id?: string
          attribute_option_id?: string | null
          attribute_value_boolean?: boolean | null
          attribute_value_number?: number | null
          attribute_value_text?: string | null
          created_at?: string
          id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_attribute_values_attribute_option_id_fkey"
            columns: ["attribute_option_id"]
            isOneToOne: false
            referencedRelation: "product_attribute_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_attribute_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          buying_price: number | null
          created_at: string
          depot_id: string | null
          height_cm: number | null
          id: string
          is_active: boolean
          is_bulk: boolean
          length_cm: number | null
          margin_percent: number | null
          metadata: Json | null
          pack_size_id: string | null
          product_id: string
          selling_price: number | null
          sku: string
          updated_at: string
          variant_name: string
          variant_status: string
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          barcode?: string | null
          buying_price?: number | null
          created_at?: string
          depot_id?: string | null
          height_cm?: number | null
          id?: string
          is_active?: boolean
          is_bulk?: boolean
          length_cm?: number | null
          margin_percent?: number | null
          metadata?: Json | null
          pack_size_id?: string | null
          product_id: string
          selling_price?: number | null
          sku: string
          updated_at?: string
          variant_name: string
          variant_status?: string
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          barcode?: string | null
          buying_price?: number | null
          created_at?: string
          depot_id?: string | null
          height_cm?: number | null
          id?: string
          is_active?: boolean
          is_bulk?: boolean
          length_cm?: number | null
          margin_percent?: number | null
          metadata?: Json | null
          pack_size_id?: string | null
          product_id?: string
          selling_price?: number | null
          sku?: string
          updated_at?: string
          variant_name?: string
          variant_status?: string
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_pack_size_id_fkey"
            columns: ["pack_size_id"]
            isOneToOne: false
            referencedRelation: "product_pack_sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allow_backorder: boolean
          base_uom: string
          brand: string | null
          category: string | null
          category_id: string | null
          compare_at_price: number | null
          created_at: string | null
          currency_code: string
          default_buying_price: number | null
          default_margin_percent: number | null
          default_selling_price: number | null
          depot_id: string | null
          description: string | null
          height_cm: number | null
          id: string
          image_url: string | null
          is_active: boolean
          is_variant_product: boolean
          length_cm: number | null
          metadata: Json
          name: string
          organization_id: string | null
          price: number | null
          product_type: string
          requires_shipping: boolean
          shipping_weight_kg: number | null
          short_description: string | null
          sku: string | null
          sku_base: string | null
          status: string
          stock_quantity: number
          subcategory_id: string | null
          supplier_id: string | null
          track_inventory: boolean
          updated_at: string
          width_cm: number | null
        }
        Insert: {
          allow_backorder?: boolean
          base_uom?: string
          brand?: string | null
          category?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          currency_code?: string
          default_buying_price?: number | null
          default_margin_percent?: number | null
          default_selling_price?: number | null
          depot_id?: string | null
          description?: string | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_variant_product?: boolean
          length_cm?: number | null
          metadata?: Json
          name: string
          organization_id?: string | null
          price?: number | null
          product_type?: string
          requires_shipping?: boolean
          shipping_weight_kg?: number | null
          short_description?: string | null
          sku?: string | null
          sku_base?: string | null
          status?: string
          stock_quantity?: number
          subcategory_id?: string | null
          supplier_id?: string | null
          track_inventory?: boolean
          updated_at?: string
          width_cm?: number | null
        }
        Update: {
          allow_backorder?: boolean
          base_uom?: string
          brand?: string | null
          category?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          currency_code?: string
          default_buying_price?: number | null
          default_margin_percent?: number | null
          default_selling_price?: number | null
          depot_id?: string | null
          description?: string | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_variant_product?: boolean
          length_cm?: number | null
          metadata?: Json
          name?: string
          organization_id?: string | null
          price?: number | null
          product_type?: string
          requires_shipping?: boolean
          shipping_weight_kg?: number | null
          short_description?: string | null
          sku?: string | null
          sku_base?: string | null
          status?: string
          stock_quantity?: number
          subcategory_id?: string | null
          supplier_id?: string | null
          track_inventory?: boolean
          updated_at?: string
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "product_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          job_title: string | null
          organization_id: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          job_title?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          expected_date: string | null
          id: string
          line_total: number
          product_description: string
          purchase_order_id: string
          quantity: number
          quantity_uom: string
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          expected_date?: string | null
          id?: string
          line_total?: number
          product_description: string
          purchase_order_id: string
          quantity: number
          quantity_uom?: string
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          expected_date?: string | null
          id?: string
          line_total?: number
          product_description?: string
          purchase_order_id?: string
          quantity?: number
          quantity_uom?: string
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string
          currency_code: string
          depot_id: string | null
          expected_date: string | null
          id: string
          metadata: Json
          notes: string | null
          order_date: string
          ordered_by: string | null
          po_number: string
          status: string
          subtotal_amount: number
          supplier_id: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          currency_code?: string
          depot_id?: string | null
          expected_date?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          order_date?: string
          ordered_by?: string | null
          po_number: string
          status?: string
          subtotal_amount?: number
          supplier_id: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          currency_code?: string
          depot_id?: string | null
          expected_date?: string | null
          id?: string
          metadata?: Json
          notes?: string | null
          order_date?: string
          ordered_by?: string | null
          po_number?: string
          status?: string
          subtotal_amount?: number
          supplier_id?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      seed_product_details: {
        Row: {
          created_at: string
          crop_name: string | null
          germination_percent: number | null
          hybrid_name: string | null
          id: string
          maturity_classification: string | null
          maturity_days: number | null
          notes: string | null
          product_id: string
          purity_percent: number | null
          seed_class: string | null
          seeds_per_kg: number | null
          thousand_kernel_weight_g: number | null
          treatment_name: string | null
          updated_at: string
          variety_name: string | null
        }
        Insert: {
          created_at?: string
          crop_name?: string | null
          germination_percent?: number | null
          hybrid_name?: string | null
          id?: string
          maturity_classification?: string | null
          maturity_days?: number | null
          notes?: string | null
          product_id: string
          purity_percent?: number | null
          seed_class?: string | null
          seeds_per_kg?: number | null
          thousand_kernel_weight_g?: number | null
          treatment_name?: string | null
          updated_at?: string
          variety_name?: string | null
        }
        Update: {
          created_at?: string
          crop_name?: string | null
          germination_percent?: number | null
          hybrid_name?: string | null
          id?: string
          maturity_classification?: string | null
          maturity_days?: number | null
          notes?: string | null
          product_id?: string
          purity_percent?: number | null
          seed_class?: string | null
          seeds_per_kg?: number | null
          thousand_kernel_weight_g?: number | null
          treatment_name?: string | null
          updated_at?: string
          variety_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seed_product_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_package_items: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          order_item_id: string | null
          quantity: number
          quantity_uom: string
          shipment_package_id: string
          variant_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          order_item_id?: string | null
          quantity: number
          quantity_uom?: string
          shipment_package_id: string
          variant_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          order_item_id?: string | null
          quantity?: number
          quantity_uom?: string
          shipment_package_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_package_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_package_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_package_items_shipment_package_id_fkey"
            columns: ["shipment_package_id"]
            isOneToOne: false
            referencedRelation: "shipment_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_packages: {
        Row: {
          created_at: string
          fulfillment_batch_id: string
          gross_weight_kg: number | null
          height_cm: number | null
          id: string
          length_cm: number | null
          package_number: string
          package_type: string | null
          status: string
          tracking_number: string | null
          width_cm: number | null
        }
        Insert: {
          created_at?: string
          fulfillment_batch_id: string
          gross_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          length_cm?: number | null
          package_number: string
          package_type?: string | null
          status?: string
          tracking_number?: string | null
          width_cm?: number | null
        }
        Update: {
          created_at?: string
          fulfillment_batch_id?: string
          gross_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          length_cm?: number | null
          package_number?: string
          package_type?: string | null
          status?: string
          tracking_number?: string | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_packages_fulfillment_batch_id_fkey"
            columns: ["fulfillment_batch_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_tests: {
        Row: {
          acid_saturation_percent: number | null
          ammonium_n: number | null
          boron: number | null
          calcium: number | null
          cec: number | null
          clay_percent: number | null
          copper: number | null
          created_at: string
          depth_cm: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          lab_name: string | null
          magnesium: number | null
          manganese: number | null
          nitrate_n: number | null
          notes: string | null
          organic_matter_percent: number | null
          ph_h2o: number | null
          ph_kcl: number | null
          phosphorus: number | null
          potassium: number | null
          raw_results: Json
          sample_code: string | null
          sample_date: string
          sand_percent: number | null
          silt_percent: number | null
          sodium: number | null
          sulphur: number | null
          updated_at: string
          zinc: number | null
        }
        Insert: {
          acid_saturation_percent?: number | null
          ammonium_n?: number | null
          boron?: number | null
          calcium?: number | null
          cec?: number | null
          clay_percent?: number | null
          copper?: number | null
          created_at?: string
          depth_cm?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          lab_name?: string | null
          magnesium?: number | null
          manganese?: number | null
          nitrate_n?: number | null
          notes?: string | null
          organic_matter_percent?: number | null
          ph_h2o?: number | null
          ph_kcl?: number | null
          phosphorus?: number | null
          potassium?: number | null
          raw_results?: Json
          sample_code?: string | null
          sample_date: string
          sand_percent?: number | null
          silt_percent?: number | null
          sodium?: number | null
          sulphur?: number | null
          updated_at?: string
          zinc?: number | null
        }
        Update: {
          acid_saturation_percent?: number | null
          ammonium_n?: number | null
          boron?: number | null
          calcium?: number | null
          cec?: number | null
          clay_percent?: number | null
          copper?: number | null
          created_at?: string
          depth_cm?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          lab_name?: string | null
          magnesium?: number | null
          manganese?: number | null
          nitrate_n?: number | null
          notes?: string | null
          organic_matter_percent?: number | null
          ph_h2o?: number | null
          ph_kcl?: number | null
          phosphorus?: number | null
          potassium?: number | null
          raw_results?: Json
          sample_code?: string | null
          sample_date?: string
          sand_percent?: number | null
          silt_percent?: number | null
          sodium?: number | null
          sulphur?: number | null
          updated_at?: string
          zinc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_tests_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soil_tests_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      spray_program_items: {
        Row: {
          active_ingredient: string | null
          adjuvant: string | null
          application_stage: string | null
          created_at: string
          id: string
          notes: string | null
          product_name: string | null
          rate_per_ha: number | null
          rate_unit: string | null
          reentry_interval_hours: number | null
          sort_order: number
          spray_program_id: string
          target_pest_or_weed: string | null
          timing_label: string | null
          water_volume_l_ha: number | null
          withholding_period_days: number | null
        }
        Insert: {
          active_ingredient?: string | null
          adjuvant?: string | null
          application_stage?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_name?: string | null
          rate_per_ha?: number | null
          rate_unit?: string | null
          reentry_interval_hours?: number | null
          sort_order?: number
          spray_program_id: string
          target_pest_or_weed?: string | null
          timing_label?: string | null
          water_volume_l_ha?: number | null
          withholding_period_days?: number | null
        }
        Update: {
          active_ingredient?: string | null
          adjuvant?: string | null
          application_stage?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          product_name?: string | null
          rate_per_ha?: number | null
          rate_unit?: string | null
          reentry_interval_hours?: number | null
          sort_order?: number
          spray_program_id?: string
          target_pest_or_weed?: string | null
          timing_label?: string | null
          water_volume_l_ha?: number | null
          withholding_period_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spray_program_items_spray_program_id_fkey"
            columns: ["spray_program_id"]
            isOneToOne: false
            referencedRelation: "spray_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      spray_programs: {
        Row: {
          created_at: string
          crop_id: string | null
          crop_stage: string | null
          farm_id: string | null
          field_id: string | null
          id: string
          notes: string | null
          objective: string | null
          program_name: string
          season_label: string | null
          status: string
          tool_run_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_id?: string | null
          crop_stage?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          notes?: string | null
          objective?: string | null
          program_name: string
          season_label?: string | null
          status?: string
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_id?: string | null
          crop_stage?: string | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          notes?: string | null
          objective?: string | null
          program_name?: string
          season_label?: string | null
          status?: string
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spray_programs_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spray_programs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spray_programs_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spray_programs_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spray_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          batch_id: string | null
          bin_id: string | null
          created_at: string
          created_by: string | null
          depot_id: string | null
          id: string
          movement_type: string
          notes: string | null
          quantity: number
          quantity_uom: string
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
          variant_id: string
        }
        Insert: {
          batch_id?: string | null
          bin_id?: string | null
          created_at?: string
          created_by?: string | null
          depot_id?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          quantity: number
          quantity_uom?: string
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          variant_id: string
        }
        Update: {
          batch_id?: string | null
          bin_id?: string | null
          created_at?: string
          created_by?: string | null
          depot_id?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          quantity_uom?: string
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_bin_id_fkey"
            columns: ["bin_id"]
            isOneToOne: false
            referencedRelation: "storage_bins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfer_items: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          notes: string | null
          quantity_uom: string
          received_quantity: number | null
          requested_quantity: number
          sent_quantity: number | null
          transfer_id: string
          variant_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          quantity_uom?: string
          received_quantity?: number | null
          requested_quantity: number
          sent_quantity?: number | null
          transfer_id: string
          variant_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          quantity_uom?: string
          received_quantity?: number | null
          requested_quantity?: number
          sent_quantity?: number | null
          transfer_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfer_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfer_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "stock_transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfers: {
        Row: {
          approved_by: string | null
          created_at: string
          from_depot_id: string
          id: string
          notes: string | null
          requested_by: string | null
          status: string
          to_depot_id: string
          transfer_number: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          from_depot_id: string
          id?: string
          notes?: string | null
          requested_by?: string | null
          status?: string
          to_depot_id: string
          transfer_number: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          from_depot_id?: string
          id?: string
          notes?: string | null
          requested_by?: string | null
          status?: string
          to_depot_id?: string
          transfer_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_from_depot_id_fkey"
            columns: ["from_depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_to_depot_id_fkey"
            columns: ["to_depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_bins: {
        Row: {
          bin_code: string
          bin_type: string
          capacity_kg: number | null
          created_at: string
          depot_id: string
          id: string
          is_active: boolean
          is_pickable: boolean
          name: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          bin_code: string
          bin_type?: string
          capacity_kg?: number | null
          created_at?: string
          depot_id: string
          id?: string
          is_active?: boolean
          is_pickable?: boolean
          name?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          bin_code?: string
          bin_type?: string
          capacity_kg?: number | null
          created_at?: string
          depot_id?: string
          id?: string
          is_active?: boolean
          is_pickable?: boolean
          name?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_bins_depot_id_fkey"
            columns: ["depot_id"]
            isOneToOne: false
            referencedRelation: "depots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_bins_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "depot_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_interval: string
          created_at: string
          currency_code: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          name: string
          price: number
          slug: string
          updated_at: string
        }
        Insert: {
          billing_interval: string
          created_at?: string
          currency_code?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price?: number
          slug: string
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          currency_code?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          end_date: string | null
          id: string
          metadata: Json
          plan_id: string
          provider_reference: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json
          plan_id: string
          provider_reference?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json
          plan_id?: string
          provider_reference?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total: number
          purchase_order_item_id: string | null
          quantity: number
          quantity_uom: string
          supplier_invoice_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total?: number
          purchase_order_item_id?: string | null
          quantity: number
          quantity_uom?: string
          supplier_invoice_id: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total?: number
          purchase_order_item_id?: string | null
          quantity?: number
          quantity_uom?: string
          supplier_invoice_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoice_items_purchase_order_item_id_fkey"
            columns: ["purchase_order_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoice_items_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoices: {
        Row: {
          created_at: string
          currency_code: string
          due_date: string | null
          id: string
          invoice_date: string
          notes: string | null
          purchase_order_id: string | null
          status: string
          subtotal_amount: number
          supplier_id: string
          supplier_invoice_number: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          notes?: string | null
          purchase_order_id?: string | null
          status?: string
          subtotal_amount?: number
          supplier_id: string
          supplier_invoice_number: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          notes?: string | null
          purchase_order_id?: string | null
          status?: string
          subtotal_amount?: number
          supplier_id?: string
          supplier_invoice_number?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoices_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_name: string | null
          created_at: string
          currency_code: string
          email: string | null
          id: string
          is_active: boolean
          metadata: Json
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          supplier_code: string
          supplier_name: string
          tax_number: string | null
          updated_at: string
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          currency_code?: string
          email?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          supplier_code: string
          supplier_name: string
          tax_number?: string | null
          updated_at?: string
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          currency_code?: string
          email?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          supplier_code?: string
          supplier_name?: string
          tax_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          organization_id: string | null
          role_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
          role_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
          role_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          balance_before: number | null
          created_at: string
          id: string
          metadata: Json
          payment_transaction_id: string | null
          reference: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          payment_transaction_id?: string | null
          reference?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          payment_transaction_id?: string | null
          reference?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_payment_transaction_id_fkey"
            columns: ["payment_transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency_code: string
          id: string
          is_active: boolean
          organization_id: string | null
          updated_at: string
          user_id: string | null
          wallet_type: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_type?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          organization_id?: string | null
          updated_at?: string
          user_id?: string | null
          wallet_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_snapshots: {
        Row: {
          created_at: string
          evapotranspiration_mm: number | null
          farm_id: string | null
          field_id: string | null
          humidity_percent: number | null
          id: string
          max_temp_c: number | null
          metadata: Json
          min_temp_c: number | null
          rainfall_mm: number | null
          snapshot_date: string
          source: string | null
          wind_speed_kmh: number | null
        }
        Insert: {
          created_at?: string
          evapotranspiration_mm?: number | null
          farm_id?: string | null
          field_id?: string | null
          humidity_percent?: number | null
          id?: string
          max_temp_c?: number | null
          metadata?: Json
          min_temp_c?: number | null
          rainfall_mm?: number | null
          snapshot_date: string
          source?: string | null
          wind_speed_kmh?: number | null
        }
        Update: {
          created_at?: string
          evapotranspiration_mm?: number | null
          farm_id?: string | null
          field_id?: string | null
          humidity_percent?: number | null
          id?: string
          max_temp_c?: number | null
          metadata?: Json
          min_temp_c?: number | null
          rainfall_mm?: number | null
          snapshot_date?: string
          source?: string | null
          wind_speed_kmh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_snapshots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weather_snapshots_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      website_crawl_pages: {
        Row: {
          content_extracted: boolean
          crawl_target_id: string
          crawled_at: string
          document_id: string | null
          http_status: number | null
          id: string
          metadata: Json
          page_hash: string | null
          page_title: string | null
          page_url: string
          source_id: string | null
        }
        Insert: {
          content_extracted?: boolean
          crawl_target_id: string
          crawled_at?: string
          document_id?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json
          page_hash?: string | null
          page_title?: string | null
          page_url: string
          source_id?: string | null
        }
        Update: {
          content_extracted?: boolean
          crawl_target_id?: string
          crawled_at?: string
          document_id?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json
          page_hash?: string | null
          page_title?: string | null
          page_url?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_crawl_pages_crawl_target_id_fkey"
            columns: ["crawl_target_id"]
            isOneToOne: false
            referencedRelation: "website_crawl_targets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_crawl_pages_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "knowledge_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_crawl_pages_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      website_crawl_targets: {
        Row: {
          allowed_paths: Json
          base_url: string
          blocked_paths: Json
          crawl_depth: number
          crawl_frequency: string
          created_at: string
          id: string
          is_active: boolean
          last_crawled_at: string | null
          metadata: Json
          source_id: string | null
          updated_at: string
        }
        Insert: {
          allowed_paths?: Json
          base_url: string
          blocked_paths?: Json
          crawl_depth?: number
          crawl_frequency?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_crawled_at?: string | null
          metadata?: Json
          source_id?: string | null
          updated_at?: string
        }
        Update: {
          allowed_paths?: Json
          base_url?: string
          blocked_paths?: Json
          crawl_depth?: number
          crawl_frequency?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_crawled_at?: string | null
          metadata?: Json
          source_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_crawl_targets_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_estimator_runs: {
        Row: {
          assumptions: Json
          created_at: string
          crop_id: string | null
          ears_or_plants_per_ha: number | null
          estimated_yield_t_ha: number | null
          farm_id: string | null
          field_id: string | null
          id: string
          kernel_mass_g: number | null
          kernels_per_ear: number | null
          methodology: string | null
          moisture_percent: number | null
          plant_population: number | null
          tool_run_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assumptions?: Json
          created_at?: string
          crop_id?: string | null
          ears_or_plants_per_ha?: number | null
          estimated_yield_t_ha?: number | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          kernel_mass_g?: number | null
          kernels_per_ear?: number | null
          methodology?: string | null
          moisture_percent?: number | null
          plant_population?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assumptions?: Json
          created_at?: string
          crop_id?: string | null
          ears_or_plants_per_ha?: number | null
          estimated_yield_t_ha?: number | null
          farm_id?: string | null
          field_id?: string | null
          id?: string
          kernel_mass_g?: number | null
          kernels_per_ear?: number | null
          methodology?: string | null
          moisture_percent?: number | null
          plant_population?: number | null
          tool_run_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_estimator_runs_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_estimator_runs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_estimator_runs_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_estimator_runs_tool_run_id_fkey"
            columns: ["tool_run_id"]
            isOneToOne: false
            referencedRelation: "agronomy_tool_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_estimator_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_organization: { Args: { org_id: string }; Returns: boolean }
      calculate_margin_percent: {
        Args: { buying_price: number; selling_price: number }
        Returns: number
      }
      current_profile_id: { Args: never; Returns: string }
      generate_ci_number: { Args: never; Returns: string }
      generate_gr_number: { Args: never; Returns: string }
      generate_po_number: { Args: never; Returns: string }
      generate_si_number: { Args: never; Returns: string }
      has_role: { Args: { role_name: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_enrolled_in_course: {
        Args: { target_course_id: string }
        Returns: boolean
      }
      match_knowledge_chunks: {
        Args: {
          filter_access_level?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          access_level: string
          chunk_id: string
          chunk_text: string
          document_id: string
          document_title: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
