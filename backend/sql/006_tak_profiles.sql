create table if not exists user_tak_profile (
  id text primary key,
  owner_user_id uuid not null references app_user(id) on delete cascade,
  label text not null default '',
  server_host text not null,
  server_port integer not null default 8089,
  transport text not null default 'tls',
  username text not null default '',
  auth_secret text not null default '',
  client_cert_pem text not null default '',
  client_key_pem text not null default '',
  ca_cert_pem text not null default '',
  client_cert_file_name text not null default '',
  client_key_file_name text not null default '',
  ca_cert_file_name text not null default '',
  client_cert_updated_at timestamptz null,
  client_key_updated_at timestamptz null,
  ca_cert_updated_at timestamptz null,
  last_tested_at timestamptz null,
  last_test_status text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_tak_binding (
  project_id uuid primary key references project(id) on delete cascade,
  tak_profile_id text references user_tak_profile(id) on delete cascade,
  owner_user_id uuid not null references app_user(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_tak_profile_owner_position
  on user_tak_profile (owner_user_id, position asc, updated_at desc);

create index if not exists idx_project_tak_binding_owner_profile
  on project_tak_binding (owner_user_id, tak_profile_id);
