-- RideLedger — pagamento parcial no fechamento mensal.
-- paid_amount registra quanto já foi efetivamente pago daquela competência,
-- independente do total_amount mudar depois por causa de um recálculo.

alter table public.monthly_charges
  add column paid_amount numeric(10, 2) not null default 0 check (paid_amount >= 0);

update public.monthly_charges
  set paid_amount = total_amount
  where paid = true;
