import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calculateMonthlyCharges,
  listMonthlyCharges,
  markMonthlyChargePaid,
  unmarkMonthlyChargePaid,
} from "@/services/monthlyCharges.service";

const monthlyChargesKey = ["monthlyCharges"] as const;

export function useMonthlyCharges(referenceMonth: string) {
  return useQuery({
    queryKey: [...monthlyChargesKey, referenceMonth],
    queryFn: () => listMonthlyCharges(referenceMonth),
  });
}

export function useCalculateMonthlyCharges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referenceMonth: string) => calculateMonthlyCharges(referenceMonth),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monthlyChargesKey });
    },
  });
}

export function useMarkMonthlyChargePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      markMonthlyChargePaid(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monthlyChargesKey });
    },
  });
}

export function useUnmarkMonthlyChargePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unmarkMonthlyChargePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monthlyChargesKey });
    },
  });
}
