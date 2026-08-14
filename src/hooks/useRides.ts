import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRide,
  deleteRide,
  listRidesByMonth,
  type CreateRideInput,
} from "@/services/rides.service";

const ridesKey = ["rides"] as const;

export function useRidesByMonth(referenceMonth: string) {
  return useQuery({
    queryKey: [...ridesKey, referenceMonth],
    queryFn: () => listRidesByMonth(referenceMonth),
  });
}

export function usePassengerRides(
  passengerId: string,
  referenceMonth: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...ridesKey, referenceMonth, passengerId],
    queryFn: () => listRidesByMonth(referenceMonth, passengerId),
    enabled,
  });
}

export function useCreateRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRideInput) => createRide(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ridesKey });
    },
  });
}

export function useDeleteRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ridesKey });
    },
  });
}
