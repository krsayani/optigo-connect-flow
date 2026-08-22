-- Align workspace account branding with the LensFlow rename.

alter table workspace_accounts
  alter column display_name set default 'LensFlow';

update workspace_accounts
set display_name = 'LensFlow'
where display_name = 'OptiGo';
