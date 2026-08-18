-- RideLedger — compensação por caronas recebidas.
-- Quando um passageiro dá uma carona de volta, o valor (informado na hora,
-- pode variar) é abatido do total que ele deve naquele mês. O total pode
-- ficar negativo se ele te der mais caronas do que você deu a ele.

create table public.received_rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  passenger_id uuid not null references public.passengers (id) on delete cascade,
  received_date date not null,
  amount numeric(10, 2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index received_rides_user_id_idx on public.received_rides (user_id);
create index received_rides_passenger_id_received_date_idx
  on public.received_rides (passenger_id, received_date);

alter table public.received_rides enable row level security;

create policy "received_rides_owner_select" on public.received_rides
  for select using (auth.uid() = user_id);
create policy "received_rides_owner_insert" on public.received_rides
  for insert with check (auth.uid() = user_id);
create policy "received_rides_owner_update" on public.received_rides
  for update using (auth.uid() = user_id);
create policy "received_rides_owner_delete" on public.received_rides
  for delete using (auth.uid() = user_id);

-- total_amount agora pode ser negativo (compensação maior que as diárias dadas).
alter table public.monthly_charges
  drop constraint if exists monthly_charges_total_amount_check;
