-- Analytics: track visits, AI token usage, and general events per user.

create table if not exists analytics_event (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references app_user(id) on delete set null,
  username    text,                      -- denormalized for deleted-user reporting
  event_type  text not null,             -- 'visit', 'ai_request', 'project_create', 'project_save', 'snapshot'
  provider    text,                      -- for ai_request: 'anthropic', 'genai-mil', 'local-model'
  model       text,                      -- for ai_request
  input_tokens  integer,
  output_tokens integer,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_analytics_event_user_created   on analytics_event (user_id, created_at desc);
create index if not exists idx_analytics_event_type_created   on analytics_event (event_type, created_at desc);
create index if not exists idx_analytics_event_created        on analytics_event (created_at desc);
