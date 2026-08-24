import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreatePassengerInvite,
  usePassengerInvites,
} from "@/hooks/usePassengerInvites";

interface PassengerInvitePanelProps {
  passengerId: string;
}

export function PassengerInvitePanel({ passengerId }: PassengerInvitePanelProps) {
  const { data: invites, isLoading } = usePassengerInvites(passengerId, true);
  const createInvite = useCreatePassengerInvite();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasLinkedAccount = invites?.some((invite) => invite.used) ?? false;
  const pendingInvite = invites?.find((invite) => !invite.used);

  async function handleCreate() {
    setError(null);

    try {
      await createInvite.mutateAsync(passengerId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível gerar o código.",
      );
    }
  }

  function handleCopy(code: string) {
    const url = `${window.location.origin}/convite/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current));
      }, 2000);
    });
  }

  return (
    <div className="mt-3 border-t border-black/10 pt-3">
      <p className="mb-2 text-xs font-medium opacity-70">
        Acesso do passageiro
      </p>

      {isLoading && <p className="text-xs opacity-70">Carregando...</p>}

      {!isLoading && hasLinkedAccount && (
        <p className="text-xs">Este passageiro já tem acesso próprio.</p>
      )}

      {!isLoading && !hasLinkedAccount && pendingInvite && (
        <div className="flex items-center justify-between gap-2 rounded-md bg-black/5 px-3 py-2">
          <span className="font-mono text-xs">{pendingInvite.code}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(pendingInvite.code)}
          >
            {copiedCode === pendingInvite.code ? "Copiado!" : "Copiar link"}
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {!isLoading && !hasLinkedAccount && !pendingInvite && (
        <Button
          variant="outline"
          size="sm"
          disabled={createInvite.isPending}
          onClick={handleCreate}
        >
          {createInvite.isPending ? "Gerando..." : "Gerar código de convite"}
        </Button>
      )}
    </div>
  );
}
