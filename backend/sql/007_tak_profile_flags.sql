alter table user_tak_profile
  add column if not exists enroll_for_client_cert boolean not null default false;

alter table user_tak_profile
  add column if not exists use_authentication boolean not null default false;
