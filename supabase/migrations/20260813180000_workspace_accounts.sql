-- Workspace logins (hashed). Service role bypasses RLS; anon cannot read rows.

create table if not exists workspace_accounts (
  username text primary key,
  email text unique,
  password_salt text not null,
  password_hash text not null,
  display_name text not null default 'OptiGo',
  created_at timestamptz not null default now()
);

alter table workspace_accounts enable row level security;

insert into workspace_accounts (username, email, password_salt, password_hash, display_name)
values (
  'optigo',
  'optigo@optigo.app',
  '0490868e0e6d407ba553f3114f3faa5e',
  'e76e2849c6aa5c537c07cdb4b9086a4066bfd19490e368b5f9252f2e787dc695',
  'OptiGo'
)
on conflict (username) do nothing;
