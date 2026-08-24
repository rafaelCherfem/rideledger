import { useQuery } from "@tanstack/react-query";
import { getMyPassengerAccount } from "@/services/passengerAccounts.service";

export function useMyPassengerAccount() {
  return useQuery({
    queryKey: ["myPassengerAccount"],
    queryFn: getMyPassengerAccount,
    staleTime: Infinity,
  });
}
