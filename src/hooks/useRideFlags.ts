import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRideFlag,
  listUnresolvedFlags,
  resolveFlag,
} from "@/services/rideFlags.service";

const flagsKey = ["rideFlags"] as const;

export function useUnresolvedFlags() {
  return useQuery({
    queryKey: flagsKey,
    queryFn: listUnresolvedFlags,
  });
}

export function useFlagRide() {
  return useMutation({
    mutationFn: (rideId: string) => createRideFlag(rideId),
  });
}

export function useResolveFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flagId: string) => resolveFlag(flagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flagsKey });
    },
  });
}
