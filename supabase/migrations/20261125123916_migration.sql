alter table public.categories add column if not exists name_so text not null default '';

update public.categories set name_so = case sort_order when 1 then 'Cunto & Qado' when 2 then 'Keeg & Macmacaan' when 3 then 'Cabitaano & Shaah' else name_so end where name_so = '';