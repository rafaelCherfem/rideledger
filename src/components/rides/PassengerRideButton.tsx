import { Check, Plus } from "lucide-react";
import type { Passenger } from "@/types/entities";

interface PassengerRideButtonProps {
  passenger: Passenger;
  registered: boolean;
  registering: boolean;
  onRegister: (passenger: Passenger) => void;
}

export function PassengerRideButton({
  passenger,
  registered,
  registering,
  onRegister,
}: PassengerRideButtonProps) {
  return (
    <button
      type="button"
      disabled={registered || registering}
      onClick={() => onRegister(passenger)}
      className="flex w-full items-center justify-between rounded-lg bg-card p-4 text-left text-card-foreground shadow-sm transition-opacity disabled:opacity-70"
    >
      <span className="font-medium">{passenger.name}</span>
      {registered ? (
        <span className="flex items-center gap-1 text-sm">
          <Check className="h-4 w-4" />
          Registrado
        </span>
      ) : (
        <span className="flex items-center gap-1 text-sm opacity-70">
          <Plus className="h-4 w-4" />
          {registering ? "Registrando..." : "Registrar"}
        </span>
      )}
    </button>
  );
}
