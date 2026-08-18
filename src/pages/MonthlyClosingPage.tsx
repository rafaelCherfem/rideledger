import { useMemo, useState } from "react";
import { MonthlyChargeCard } from "@/components/charges/MonthlyChargeCard";
import { Button } from "@/components/ui/button";
import {
  useCalculateMonthlyCharges,
  useMarkMonthlyChargePaid,
  useMonthlyCharges,
  useUnmarkMonthlyChargePaid,
} from "@/hooks/useMonthlyCharges";
import { usePassengers } from "@/hooks/usePassengers";
import { useReceivedRidesByMonth } from "@/hooks/useReceivedRides";
import { useGenerateReceipt } from "@/hooks/useReceipt";
import { useRidesByMonth } from "@/hooks/useRides";
import {
  currentMonthStart,
  formatMonthLabel,
  nextMonth,
  previousMonth,
} from "@/utils/date";
import type { MonthlyCharge, Passenger } from "@/types/entities";

function amountsMatch(a: number, b: number): boolean {
  return Math.round(a * 100) === Math.round(b * 100);
}

export function MonthlyClosingPage() {
  const [referenceMonth, setReferenceMonth] = useState(currentMonthStart());

  const { data: passengers } = usePassengers(true);
  const { data: rides, isLoading: loadingRides } = useRidesByMonth(referenceMonth);
  const { data: receivedRides, isLoading: loadingReceived } =
    useReceivedRidesByMonth(referenceMonth);
  const {
    data: charges,
    isLoading: loadingCharges,
    isError: chargesError,
  } = useMonthlyCharges(referenceMonth);

  const calculate = useCalculateMonthlyCharges();
  const markPaid = useMarkMonthlyChargePaid();
  const unmarkPaid = useUnmarkMonthlyChargePaid();
  const generateReceipt = useGenerateReceipt();

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const passengersById = useMemo(() => {
    const map = new Map<string, Passenger>();
    for (const passenger of passengers ?? []) {
      map.set(passenger.id, passenger);
    }
    return map;
  }, [passengers]);

  const rideTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const ride of rides ?? []) {
      totals.set(
        ride.passengerId,
        (totals.get(ride.passengerId) ?? 0) + ride.rateCharged,
      );
    }
    return totals;
  }, [rides]);

  const compensationTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const received of receivedRides ?? []) {
      totals.set(
        received.passengerId,
        (totals.get(received.passengerId) ?? 0) + received.amount,
      );
    }
    return totals;
  }, [receivedRides]);

  const chargesByPassenger = useMemo(() => {
    const map = new Map<string, MonthlyCharge>();
    for (const charge of charges ?? []) {
      map.set(charge.passengerId, charge);
    }
    return map;
  }, [charges]);

  const passengerIds = useMemo(() => {
    const ids = new Set<string>([
      ...rideTotals.keys(),
      ...compensationTotals.keys(),
      ...chargesByPassenger.keys(),
    ]);
    return Array.from(ids);
  }, [rideTotals, compensationTotals, chargesByPassenger]);

  async function handleCalculate() {
    setCalculateError(null);

    try {
      await calculate.mutateAsync(referenceMonth);
    } catch (error) {
      setCalculateError(
        error instanceof Error ? error.message : "Não foi possível calcular.",
      );
    }
  }

  async function handleMarkPaid(chargeId: string, amount: number) {
    setActionError(null);
    setTogglingId(chargeId);

    try {
      await markPaid.mutateAsync({ id: chargeId, amount });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o pagamento.",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleUnmarkPaid(chargeId: string) {
    setActionError(null);
    setTogglingId(chargeId);

    try {
      await unmarkPaid.mutateAsync(chargeId);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o pagamento.",
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleGenerateReceipt(passenger: Passenger, charge: MonthlyCharge) {
    setActionError(null);
    setGeneratingId(charge.id);

    try {
      await generateReceipt.mutateAsync({ passenger, charge, referenceMonth });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o comprovante.",
      );
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6 pb-24">
      <h1 className="text-xl font-semibold">Cobranças</h1>

      <div className="flex items-center justify-between rounded-lg bg-card p-3 text-card-foreground shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReferenceMonth(previousMonth(referenceMonth))}
        >
          ← Anterior
        </Button>
        <span className="text-sm font-medium capitalize">
          {formatMonthLabel(referenceMonth)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReferenceMonth(nextMonth(referenceMonth))}
        >
          Próximo →
        </Button>
      </div>

      <Button onClick={handleCalculate} disabled={calculate.isPending}>
        {calculate.isPending ? "Calculando..." : "Calcular fechamento"}
      </Button>

      {calculateError && (
        <p className="text-sm text-destructive">{calculateError}</p>
      )}

      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      {(loadingRides || loadingCharges || loadingReceived) && (
        <p className="text-sm opacity-70">Carregando...</p>
      )}

      {chargesError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar o fechamento deste mês.
        </p>
      )}

      {!loadingRides && !loadingCharges && passengerIds.length === 0 && (
        <p className="text-sm opacity-70">
          Nenhuma diária registrada nesta competência ainda.
        </p>
      )}

      <div className="space-y-2">
        {passengerIds.map((passengerId) => {
          const rideAmount = rideTotals.get(passengerId) ?? 0;
          const compensationAmount = compensationTotals.get(passengerId) ?? 0;
          const computed = rideAmount - compensationAmount;
          const stored = chargesByPassenger.get(passengerId);
          const passenger = passengersById.get(passengerId);
          const passengerName = passenger?.name ?? "Passageiro";

          if (!stored) {
            return (
              <MonthlyChargeCard
                key={passengerId}
                passengerName={passengerName}
                amount={computed}
                status="preview"
                rideAmount={rideAmount}
                compensationAmount={compensationAmount}
                paidAmount={0}
                toggling={false}
                generatingReceipt={false}
                onMarkPaid={() => {}}
                onUnmarkPaid={() => {}}
                onGenerateReceipt={() => {}}
              />
            );
          }

          const outdated = !amountsMatch(stored.totalAmount, computed);

          return (
            <MonthlyChargeCard
              key={passengerId}
              passengerName={passengerName}
              amount={stored.totalAmount}
              status={outdated ? "outdated" : "closed"}
              computedAmount={outdated ? computed : undefined}
              rideAmount={rideAmount}
              compensationAmount={compensationAmount}
              paidAmount={stored.paidAmount}
              toggling={togglingId === stored.id}
              generatingReceipt={generatingId === stored.id}
              onMarkPaid={() => handleMarkPaid(stored.id, stored.totalAmount)}
              onUnmarkPaid={() => handleUnmarkPaid(stored.id)}
              onGenerateReceipt={() =>
                passenger && handleGenerateReceipt(passenger, stored)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
