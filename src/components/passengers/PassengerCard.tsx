import { Calendar, KeyRound, Pencil, Power, PowerOff } from "lucide-react";
import { useState } from "react";
import { PassengerInvitePanel } from "@/components/passengers/PassengerInvitePanel";
import { Button } from "@/components/ui/button";
import { usePassengerRides } from "@/hooks/useRides";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";
import { currentMonthStart, formatDateDisplay, formatMonthLabel } from "@/utils/date";
import type { Passenger } from "@/types/entities";

interface PassengerCardProps {
  passenger: Passenger;
  onEdit: (passenger: Passenger) => void;
  onToggleActive: (passenger: Passenger) => void;
}

export function PassengerCard({
  passenger,
  onEdit,
  onToggleActive,
}: PassengerCardProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const referenceMonth = currentMonthStart();
  const { data: rides, isLoading } = usePassengerRides(
    passenger.id,
    referenceMonth,
    historyOpen,
  );

  const sortedRides = rides
    ? [...rides].sort((a, b) => (a.rideDate < b.rideDate ? 1 : -1))
    : [];

  return (
    <div
      className={cn(
        "surface p-4",
        !passenger.active && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{passenger.name}</p>
          <p className="text-sm opacity-70">
            {formatCurrency(passenger.defaultDailyRate)} por diária
            {!passenger.active && " · Inativo"}
          </p>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHistoryOpen((open) => !open)}
            aria-label="Ver histórico do mês"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInviteOpen((open) => !open)}
            aria-label="Acesso do passageiro"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(passenger)}
            aria-label="Editar passageiro"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleActive(passenger)}
            aria-label={
              passenger.active ? "Desativar passageiro" : "Reativar passageiro"
            }
          >
            {passenger.active ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {historyOpen && (
        <div className="mt-3 border-t border-black/10 pt-3">
          <p className="mb-2 text-xs font-medium capitalize opacity-70">
            Diárias de {formatMonthLabel(referenceMonth)}
          </p>

          {isLoading && <p className="text-xs opacity-70">Carregando...</p>}

          {!isLoading && sortedRides.length === 0 && (
            <p className="text-xs opacity-70">
              Nenhuma diária registrada neste mês.
            </p>
          )}

          {!isLoading && sortedRides.length > 0 && (
            <ul className="space-y-1">
              {sortedRides.map((ride) => (
                <li key={ride.id} className="flex justify-between text-xs">
                  <span>{formatDateDisplay(ride.rideDate)}</span>
                  <span className="opacity-70">
                    {formatCurrency(ride.rateCharged)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {inviteOpen && <PassengerInvitePanel passengerId={passenger.id} />}
    </div>
  );
}
