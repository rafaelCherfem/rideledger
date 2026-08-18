import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { formatDateDisplay } from "@/utils/date";
import type { Passenger, Ride } from "@/types/entities";

interface PassengerRideButtonProps {
  passenger: Passenger;
  registered: boolean;
  registering: boolean;
  monthRides: Ride[];
  deletingId: string | null;
  onRegister: (passenger: Passenger) => void;
  onDeleteRide: (ride: Ride) => void;
}

export function PassengerRideButton({
  passenger,
  registered,
  registering,
  monthRides,
  deletingId,
  onRegister,
  onDeleteRide,
}: PassengerRideButtonProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedRides = [...monthRides].sort((a, b) =>
    a.rideDate < b.rideDate ? 1 : -1,
  );

  return (
    <div className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-stretch">
        <button
          type="button"
          disabled={registered || registering}
          onClick={() => onRegister(passenger)}
          className="flex flex-1 items-center justify-between p-4 text-left transition-opacity disabled:opacity-70"
        >
          <span className="font-medium">{passenger.name}</span>
          <span className="flex items-center gap-1 text-sm opacity-70">
            {registered
              ? "Registrado"
              : registering
                ? "Registrando..."
                : "Registrar"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-label={
            expanded ? "Esconder histórico do mês" : "Ver histórico do mês"
          }
          aria-expanded={expanded}
          className="flex items-center px-3"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-black/10 px-4 py-3">
          {sortedRides.length === 0 ? (
            <p className="text-xs opacity-70">
              Nenhuma diária registrada neste mês.
            </p>
          ) : (
            <ul className="space-y-1">
              {sortedRides.map((ride) => (
                <li
                  key={ride.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span>
                    {formatDateDisplay(ride.rideDate)} ·{" "}
                    {formatCurrency(ride.rateCharged)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === ride.id}
                    onClick={() => onDeleteRide(ride)}
                    aria-label="Remover diária"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
