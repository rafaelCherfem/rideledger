import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPassengerInvite,
  listPassengerInvites,
} from "@/services/passengerAccounts.service";

export function usePassengerInvites(passengerId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["passengerInvites", passengerId],
    queryFn: () => listPassengerInvites(passengerId),
    enabled,
  });
}

export function useCreatePassengerInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passengerId: string) => createPassengerInvite(passengerId),
    onSuccess: (_data, passengerId) => {
      queryClient.invalidateQueries({
        queryKey: ["passengerInvites", passengerId],
      });
    },
  });
}
