alter table user_tak_profile
  add column if not exists client_cert_password_secret text not null default '';

alter table user_tak_profile
  add column if not exists ca_cert_password_secret text not null default '';
