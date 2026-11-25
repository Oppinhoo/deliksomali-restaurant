create table if not exists public.categories (id uuid primary key default gen_random_uuid(), name text not null, image_url text, sort_order int not null default 0, created_at timestamptz not null default now());

create table if not exists public.menu_items (id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete cascade, name text not null, description text not null default '', price numeric(10,2) not null default 0, discount_percent int not null default 0 check (discount_percent between 0 and 100), discount_active boolean not null default false, image_url text, available boolean not null default true, featured boolean not null default false, sort_order int not null default 0, created_at timestamptz not null default now());

create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select coalesce(auth.jwt() ->> 'email', '') = 'dileksomaliarestaurant@gmail.com' $$;

alter table public.categories enable row level security;

alter table public.menu_items enable row level security;

alter table public.site_settings enable row level security;

create policy "public read categories" on public.categories for select using (true);

create policy "admin write categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read menu_items" on public.menu_items for select using (true);

create policy "admin write menu_items" on public.menu_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read settings" on public.site_settings for select using (true);

create policy "admin write settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');

create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());

create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

insert into public.categories (id, name, sort_order) values ('00000000-0000-0000-0000-000000000001','Food & Meals',1),('00000000-0000-0000-0000-000000000002','Cakes & Desserts',2),('00000000-0000-0000-0000-000000000003','Drinks & Beverages',3) on conflict (id) do nothing;

insert into public.menu_items (name, description, price, discount_percent, discount_active, image_url, available, featured, category_id, sort_order) values ('Truffle Margherita','San Marzano tomato, fior di latte, black truffle oil.',18,0,false,'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop',true,true,'00000000-0000-0000-0000-000000000001',1),('Wagyu Burger','Aged wagyu patty, gold cheddar, caramelised onions.',26,15,true,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',true,true,'00000000-0000-0000-0000-000000000001',2),('Herb Grilled Salmon','Atlantic salmon, lemon beurre blanc, seasonal greens.',29,0,false,'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop',false,false,'00000000-0000-0000-0000-000000000001',3),('Dark Chocolate Cake','Layered ganache, sea salt, fresh berries.',12,20,true,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=450&fit=crop',true,true,'00000000-0000-0000-0000-000000000002',1),('Gold Leaf Cheesecake','Vanilla bean cheesecake with a 24k gold leaf finish.',14,0,false,'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=450&fit=crop',true,false,'00000000-0000-0000-0000-000000000002',2),('Signature Espresso','Double shot, single-origin beans, rich crema.',4.5,0,false,'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop',true,false,'00000000-0000-0000-0000-000000000003',1),('Golden Mango Smoothie','Alphonso mango, coconut milk, passion fruit.',7,10,true,'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&h=450&fit=crop',true,false,'00000000-0000-0000-0000-000000000003',2);

insert into public.site_settings (key, value) values ('contact', '{"whatsapp":"15550000000","phone":"+1 555 000 0000","email":"hello@restaurant.com","address":"123 Gold Avenue, City Centre","hours":"Mon-Sun: 10:00 - 23:00","facebook":"","instagram":"","tiktok":""}'::jsonb), ('home', '{"hero_title":"Where Every Plate Is Gold","welcome":"Welcome to our table","description":"Refined cuisine, handcrafted cakes and artisan drinks, served with warmth.","hero_image":"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"}'::jsonb) on conflict (key) do nothing;