-- Analytics admin upgrade: indexes for richer user/provider/intent reporting.

create index if not exists idx_analytics_event_user_type_created
  on analytics_event (user_id, event_type, created_at desc);

create index if not exists idx_analytics_event_provider_model_created
  on analytics_event (provider, model, created_at desc);

create index if not exists idx_analytics_event_intent_created
  on analytics_event ((nullif(meta->>'intent_category', '')), created_at desc);

create index if not exists idx_analytics_event_project_created
  on analytics_event ((nullif(meta->>'project_id', '')), created_at desc);

create index if not exists idx_analytics_event_meta_gin
  on analytics_event using gin (meta);
