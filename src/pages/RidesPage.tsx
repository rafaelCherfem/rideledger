import { useMemo, useState } from "react";
import { PassengerRideButton } from "@/components/rides/PassengerRideButton";
import { RideHistoryList } from "@/components/rides/RideHistoryList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePassengers } from "@/hooks/usePassengers";
import { useCreateRide, useDeleteRide, useRidesByMonth } from "@/hooks/useRides";
import { currentMonthStart, formatMonthLabel, todayISODate } from "@/utils/date";
import type { Passenger, Ride } from "@/types/entities";

export function RidesPage() {
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const referenceMonth = currentMonthStart();

  const { data: passengers, isLoading: loadingPassengers } = usePassengers();
  const {
    data: rides,
    isLoading: loadingRides,
    isError: ridesError,
  } = useRidesByMonth(referenceMonth);

  const createRide = useCreateRide();
  const deleteRide = useDeleteRide();

  const [rideError, setRideError] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const ridesOnSelectedDate = useMemo(
    () =>
      new Set(
        (rides ?? [])
          .filter((ride) => ride.rideDate === selectedDate)
          .map((ride) => ride.passengerId),
      ),
    [rides, selectedDate],
  );

  const passengerNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const passenger of passengers ?? []) {
      map[passenger.id] = passenger.name;
    }
    return map;
  }, [passengers]);

  const sortedRides = useMemo(
    () => [...(rides ?? [])].sort((a, b) => (a.rideDate < b.rideDate ? 1 : -1)),
    [rides],
  );

  async function handleRegister(passenger: Passenger) {
    setRideError(null);
    setRegisteringId(passenger.id);

    try {
      await createRide.mutateAsync({
        passengerId: passenger.id,
        rideDate: selectedDate,
      });
    } catch (error) {
      setRideError(
        error instanceof Error ? error.message : "Não foi possível registrar.",
      );
    } finally {
      setRegisteringId(null);
    }
  }

  async function handleDelete(ride: Ride) {
    setDeletingId(ride.id);

    try {
      await deleteRide.mutateAsync(ride.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold">Diárias</h1>
        <p className="text-sm opacity-70">
          Toque no passageiro para registrar a diária.
        </p>
      </div>

      <div className="max-w-[200px] space-y-1">
        <Label htmlFor="rideDate">Data</Label>
        <Input
          id="rideDate"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
      </div>

      {rideError && <p className="text-sm text-destructive">{rideError}</p>}

      {loadingPassengers && (
        <p className="text-sm opacity-70">Carregando passageiros...</p>
      )}

      {!loadingPassengers && passengers?.length === 0 && (
        <p className="text-sm opacity-70">
          Cadastre um passageiro antes de registrar diárias.
        </p>
      )}

      <div className="space-y-2">
        {passengers?.map((passenger) => (
          <PassengerRideButton
            key={passenger.id}
            passenger={passenger}
            registered={ridesOnSelectedDate.has(passenger.id)}
            registering={registeringId === passenger.id}
            onRegister={handleRegister}
          />
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold opacity-70">
          Histórico de {formatMonthLabel(referenceMonth)}
        </h2>

        {loadingRides && <p className="text-sm opacity-70">Carregando...</p>}

        {ridesError && (
          <p className="text-sm text-destructive">
            Não foi possível carregar o histórico do mês.
          </p>
        )}

        {!loadingRides && !ridesError && (
          <RideHistoryList
            rides={sortedRides}
            passengerNames={passengerNames}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
