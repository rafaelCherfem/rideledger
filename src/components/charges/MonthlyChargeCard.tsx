import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";

interface MonthlyChargeCardProps {
  passengerName: string;
  amount: number;
  status: "closed" | "preview" | "outdated";
  computedAmount?: number | undefined;
  rideAmount: number;
  compensationAmount: number;
  paidAmount: number;
  toggling: boolean;
  generatingReceipt: boolean;
  onMarkPaid: () => void;
  onUnmarkPaid: () => void;
  onGenerateReceipt: () => void;
}

function toCents(value: number): number {
  return Math.round(value * 100);
}

export function MonthlyChargeCard({
  passengerName,
  amount,
  status,
  computedAmount,
  rideAmount,
  compensationAmount,
  paidAmount,
  toggling,
  generatingReceipt,
  onMarkPaid,
  onUnmarkPaid,
  onGenerateReceipt,
}: MonthlyChargeCardProps) {
  const remainingCents = Math.max(0, toCents(amount) - toCents(paidAmount));
  const remaining = remainingCents / 100;
  const isFullyPaid = status !== "preview" && paidAmount > 0 && remainingCents === 0;
  const nothingOwed = amount <= 0;

  return (
    <div
      className={cn(
        "surface p-4",
        isFullyPaid && "ring-2 ring-primary/50",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{passengerName}</p>
        <div className="flex items-center gap-1.5">
          {status === "outdated" && (
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
              Desatualizado
            </span>
          )}
          {status === "preview" && (
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">
              Prévia
            </span>
          )}
          {isFullyPaid && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              <Check className="h-3 w-3" />
              Pago
            </span>
          )}
        </div>
      </div>

      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {formatCurrency(amount)}
      </p>

      {compensationAmount > 0 && (
        <p className="mt-1 text-xs opacity-70">
          Diárias: {formatCurrency(rideAmount)} · Compensação: −
          {formatCurrency(compensationAmount)}
        </p>
      )}

      {status === "outdated" && computedAmount !== undefined && (
        <p className="mt-1 text-xs opacity-70">
          Total atualizado seria {formatCurrency(computedAmount)} — recalcule
          para atualizar.
        </p>
      )}

      {status !== "preview" && paidAmount > 0 && !isFullyPaid && !nothingOwed && (
        <p className="mt-1 text-xs opacity-70">
          Pago: {formatCurrency(paidAmount)} · Falta:{" "}
          {formatCurrency(remaining)}
        </p>
      )}

      {status !== "preview" && nothingOwed && (
        <p className="mt-1 text-xs opacity-70">
          {amount < 0
            ? `Compensação maior que as diárias — sobram ${formatCurrency(Math.abs(amount))} a favor dele.`
            : "Nada a cobrar neste mês."}
        </p>
      )}

      {status !== "preview" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {!nothingOwed &&
            (isFullyPaid ? (
              <Button
                variant="outline"
                size="sm"
                disabled={toggling}
                onClick={onUnmarkPaid}
              >
                {toggling ? "Atualizando..." : "Desmarcar pagamento"}
              </Button>
            ) : (
              <Button size="sm" disabled={toggling} onClick={onMarkPaid}>
                {toggling
                  ? "Atualizando..."
                  : paidAmount > 0
                    ? `Marcar ${formatCurrency(remaining)} como pago`
                    : "Marcar como pago"}
              </Button>
            ))}
          <Button
            variant="outline"
            size="sm"
            disabled={generatingReceipt}
            onClick={onGenerateReceipt}
          >
            {generatingReceipt ? "Gerando..." : "Gerar comprovante"}
          </Button>
        </div>
      )}
    </div>
  );
}
