import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency";
import { formatDateDisplay } from "@/utils/date";
import type { Ride } from "@/types/entities";

interface RideHistoryListProps {
  rides: Ride[];
  passengerNames: Record<string, string>;
  deletingId: string | null;
  onDelete: (ride: Ride) => void;
}

export function RideHistoryList({
  rides,
  passengerNames,
  deletingId,
  onDelete,
}: RideHistoryListProps) {
  if (rides.length === 0) {
    return (
      <p className="text-sm opacity-70">
        Nenhuma diária registrada neste mês ainda.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {rides.map((ride) => (
        <li
          key={ride.id}
          className="flex items-center justify-between rounded-lg bg-card p-3 text-card-foreground shadow-sm"
        >
          <div>
            <p className="text-sm font-medium">
              {passengerNames[ride.passengerId] ?? "Passageiro"}
            </p>
            <p className="text-xs opacity-70">
              {formatDateDisplay(ride.rideDate)} ·{" "}
              {formatCurrency(ride.rateCharged)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={deletingId === ride.id}
            onClick={() => onDelete(ride)}
            aria-label="Remover diária"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
