alter table app_user
  add column if not exists is_admin boolean not null default false;

update app_user
set is_admin = true
where lower(email) = lower('kyle.hicks@rfsim.local');
