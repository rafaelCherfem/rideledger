-- RideLedger — acesso somente-leitura para passageiros + sinalização de diárias.

-- ---------------------------------------------------------------------------
-- passenger_invites — códigos gerados pelo dono para vincular um passageiro
-- a uma conta própria. O código é a única forma de redimir; não há select
-- público sobre essa tabela (a função abaixo cuida da validação).
-- ---------------------------------------------------------------------------
create table public.passenger_invites (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references public.passengers (id) on delete cascade,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  code text not null unique,
  used boolean not null default false,
  used_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  used_at timestamptz
);

create index passenger_invites_passenger_id_idx on public.passenger_invites (passenger_id);

alter table public.passenger_invites enable row level security;

create policy "passenger_invites_owner_select" on public.passenger_invites
  for select using (auth.uid() = owner_user_id);
create policy "passenger_invites_owner_insert" on public.passenger_invites
  for insert with check (auth.uid() = owner_user_id);
create policy "passenger_invites_owner_delete" on public.passenger_invites
  for delete using (auth.uid() = owner_user_id);

-- ---------------------------------------------------------------------------
-- passenger_accounts — vínculo definitivo entre uma conta de login e um
-- passageiro específico. Criado apenas pela função redeem_passenger_invite.
-- ---------------------------------------------------------------------------
create table public.passenger_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  passenger_id uuid not null unique references public.passengers (id) on delete cascade,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.passenger_accounts enable row level security;

create policy "passenger_accounts_owner_select" on public.passenger_accounts
  for select using (auth.uid() = owner_user_id);
create policy "passenger_accounts_self_select" on public.passenger_accounts
  for select using (auth.uid() = user_id);
create policy "passenger_accounts_owner_delete" on public.passenger_accounts
  for delete using (auth.uid() = owner_user_id);

-- ---------------------------------------------------------------------------
-- Função que redime um código de convite de forma atômica e segura.
-- security definer: roda com privilégio elevado, então não precisamos de
-- policy de select pública sobre passenger_invites para isso funcionar.
-- ---------------------------------------------------------------------------
create or replace function public.redeem_passenger_invite(invite_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite record;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado.';
  end if;

  select * into v_invite
  from passenger_invites
  where code = invite_code and used = false
  limit 1;

  if v_invite is null then
    raise exception 'Código inválido ou já utilizado.';
  end if;

  insert into passenger_accounts (user_id, passenger_id, owner_user_id)
  values (auth.uid(), v_invite.passenger_id, v_invite.owner_user_id);

  update passenger_invites
  set used = true, used_by = auth.uid(), used_at = now()
  where id = v_invite.id;
end;
$$;

grant execute on function public.redeem_passenger_invite(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Acesso somente-leitura do passageiro vinculado aos próprios dados.
-- ---------------------------------------------------------------------------
create policy "passengers_self_select" on public.passengers
  for select using (
    id in (select passenger_id from public.passenger_accounts where user_id = auth.uid())
  );

create policy "rides_passenger_self_select" on public.rides
  for select using (
    passenger_id in (select passenger_id from public.passenger_accounts where user_id = auth.uid())
  );

create policy "received_rides_passenger_self_select" on public.received_rides
  for select using (
    passenger_id in (select passenger_id from public.passenger_accounts where user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- ride_flags — sinalização de uma diária pelo passageiro; o dono resolve
-- (descarta) ou exclui a diária (o que já apaga a sinalização, em cascata).
-- ---------------------------------------------------------------------------
create table public.ride_flags (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null unique references public.rides (id) on delete cascade,
  flagged_by uuid not null references auth.users (id) on delete cascade,
  resolved boolean not null default false,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.ride_flags enable row level security;

create policy "ride_flags_passenger_insert" on public.ride_flags
  for insert with check (
    flagged_by = auth.uid()
    and ride_id in (
      select r.id from public.rides r
      join public.passenger_accounts pa on pa.passenger_id = r.passenger_id
      where pa.user_id = auth.uid()
    )
  );

create policy "ride_flags_owner_select" on public.ride_flags
  for select using (
    ride_id in (select id from public.rides where user_id = auth.uid())
  );
create policy "ride_flags_owner_update" on public.ride_flags
  for update using (
    ride_id in (select id from public.rides where user_id = auth.uid())
  );
create policy "ride_flags_owner_delete" on public.ride_flags
  for delete using (
    ride_id in (select id from public.rides where user_id = auth.uid())
  );
