create extension if not exists pgcrypto;

create table if not exists app_user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references app_user(id) on delete cascade,
  name text not null,
  description text not null default '',
  latest_state_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_snapshot (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  label text not null,
  state_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_project_owner_updated on project (owner_user_id, updated_at desc);
create index if not exists idx_project_snapshot_project_created on project_snapshot (project_id, created_at desc);