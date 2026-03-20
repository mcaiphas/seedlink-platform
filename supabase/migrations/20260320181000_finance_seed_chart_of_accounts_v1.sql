begin;

insert into public.finance_accounts (account_code, account_name, account_type, is_active)
values
('1000','Cash and Bank','asset',true),
('1100','Accounts Receivable','asset',true),
('1200','Inventory','asset',true),
('2000','Accounts Payable','liability',true),
('3000','Owner Equity','equity',true),
('4000','Sales Revenue','income',true),
('5000','Cost of Goods Sold','expense',true),
('6100','Delivery Expense','expense',true),
('6200','Operating Expense','expense',true)
on conflict (account_code) do update
set
  account_name = excluded.account_name,
  account_type = excluded.account_type,
  is_active = excluded.is_active;

commit;
