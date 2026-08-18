import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReceivedRide,
  deleteReceivedRide,
  listReceivedRidesByMonth,
  type CreateReceivedRideInput,
} from "@/services/receivedRides.service";

const receivedRidesKey = ["receivedRides"] as const;

export function useReceivedRidesByMonth(referenceMonth: string) {
  return useQuery({
    queryKey: [...receivedRidesKey, referenceMonth],
    queryFn: () => listReceivedRidesByMonth(referenceMonth),
  });
}

export function useCreateReceivedRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReceivedRideInput) => createReceivedRide(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receivedRidesKey });
    },
  });
}

export function useDeleteReceivedRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReceivedRide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receivedRidesKey });
    },
  });
}
