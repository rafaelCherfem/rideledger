-- RideLedger — schema inicial
-- passageiros, diárias e cobranças mensais, isolados por usuário via RLS.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- passengers
-- ---------------------------------------------------------------------------
create table public.passengers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  default_daily_rate numeric(10, 2) not null check (default_daily_rate >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index passengers_user_id_idx on public.passengers (user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger passengers_set_updated_at
  before update on public.passengers
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- rides — cada linha é uma diária completa (ida e volta) de um passageiro.
-- rate_charged guarda o valor daquele registro, independente de mudanças
-- futuras no default_daily_rate do passageiro.
-- ---------------------------------------------------------------------------
create table public.rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  passenger_id uuid not null references public.passengers (id) on delete cascade,
  ride_date date not null,
  rate_charged numeric(10, 2) not null check (rate_charged >= 0),
  created_at timestamptz not null default now(),
  unique (passenger_id, ride_date)
);

create index rides_user_id_idx on public.rides (user_id);
create index rides_passenger_id_ride_date_idx on public.rides (passenger_id, ride_date);

-- ---------------------------------------------------------------------------
-- monthly_charges — fechamento mensal por passageiro.
-- ---------------------------------------------------------------------------
create table public.monthly_charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  passenger_id uuid not null references public.passengers (id) on delete cascade,
  reference_month date not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (passenger_id, reference_month)
);

create index monthly_charges_user_id_idx on public.monthly_charges (user_id);
create index monthly_charges_reference_month_idx on public.monthly_charges (reference_month);

-- ---------------------------------------------------------------------------
-- Row Level Security — cada usuário só enxerga e altera seus próprios dados.
-- ---------------------------------------------------------------------------
alter table public.passengers enable row level security;
alter table public.rides enable row level security;
alter table public.monthly_charges enable row level security;

create policy "passengers_owner_select" on public.passengers
  for select using (auth.uid() = user_id);
create policy "passengers_owner_insert" on public.passengers
  for insert with check (auth.uid() = user_id);
create policy "passengers_owner_update" on public.passengers
  for update using (auth.uid() = user_id);
create policy "passengers_owner_delete" on public.passengers
  for delete using (auth.uid() = user_id);

create policy "rides_owner_select" on public.rides
  for select using (auth.uid() = user_id);
create policy "rides_owner_insert" on public.rides
  for insert with check (auth.uid() = user_id);
create policy "rides_owner_update" on public.rides
  for update using (auth.uid() = user_id);
create policy "rides_owner_delete" on public.rides
  for delete using (auth.uid() = user_id);

create policy "monthly_charges_owner_select" on public.monthly_charges
  for select using (auth.uid() = user_id);
create policy "monthly_charges_owner_insert" on public.monthly_charges
  for insert with check (auth.uid() = user_id);
create policy "monthly_charges_owner_update" on public.monthly_charges
  for update using (auth.uid() = user_id);
create policy "monthly_charges_owner_delete" on public.monthly_charges
  for delete using (auth.uid() = user_id);
