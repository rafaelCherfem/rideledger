import { Outlet } from "react-router-dom";
import { useMyPassengerAccount } from "@/hooks/usePassengerAccount";
import { PassengerPortalPage } from "@/pages/PassengerPortalPage";

export function RoleRouter() {
  const { data: passengerAccount, isLoading } = useMyPassengerAccount();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm opacity-70">Carregando...</p>
      </div>
    );
  }

  if (passengerAccount) {
    return <PassengerPortalPage passengerId={passengerAccount.passengerId} />;
  }

  return <Outlet />;
}
