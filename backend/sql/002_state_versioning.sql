-- Phase 0: record which client schema version last wrote each project's state,
-- and when the client said it saved. These columns are informational only for
-- now; Phase 1b will use state_schema_version for conflict detection.

alter table project
  add column if not exists state_schema_version integer not null default 0,
  add column if not exists client_saved_at timestamptz;

alter table project_snapshot
  add column if not exists state_schema_version integer not null default 0;
