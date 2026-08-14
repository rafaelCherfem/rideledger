import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";

interface MonthlyChargeCardProps {
  passengerName: string;
  amount: number;
  status: "closed" | "preview" | "outdated";
  computedAmount?: number;
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

  return (
    <div
      className={cn(
        "rounded-lg bg-card p-4 text-card-foreground shadow-sm",
        isFullyPaid && "ring-2 ring-emerald-600/40",
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
            <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
              <Check className="h-3 w-3" />
              Pago
            </span>
          )}
        </div>
      </div>

      <p className="mt-1 text-lg font-semibold">{formatCurrency(amount)}</p>

      {status === "outdated" && computedAmount !== undefined && (
        <p className="mt-1 text-xs opacity-70">
          Diárias somam {formatCurrency(computedAmount)} — recalcule para
          atualizar.
        </p>
      )}

      {status !== "preview" && paidAmount > 0 && !isFullyPaid && (
        <p className="mt-1 text-xs opacity-70">
          Pago: {formatCurrency(paidAmount)} · Falta:{" "}
          {formatCurrency(remaining)}
        </p>
      )}

      {status !== "preview" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {isFullyPaid ? (
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
          )}
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
