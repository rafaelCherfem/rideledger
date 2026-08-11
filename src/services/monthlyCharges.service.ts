import { errorMessages } from "@/constants/errorMessages";
import { toMonthlyCharge } from "@/lib/mappers";
import { getCurrentUserId, supabase } from "@/lib/supabase";
import { listRidesByMonth } from "@/services/rides.service";
import type { MonthlyCharge } from "@/types/entities";

export async function calculateMonthlyCharges(
  referenceMonth: string,
): Promise<MonthlyCharge[]> {
  const userId = await getCurrentUserId();
  const rides = await listRidesByMonth(referenceMonth);

  const totalsByPassenger = new Map<string, number>();
  for (const ride of rides) {
    const current = totalsByPassenger.get(ride.passengerId) ?? 0;
    totalsByPassenger.set(ride.passengerId, current + ride.rateCharged);
  }

  if (totalsByPassenger.size === 0) {
    return [];
  }

  const upserts = Array.from(totalsByPassenger.entries()).map(
    ([passengerId, totalAmount]) => ({
      user_id: userId,
      passenger_id: passengerId,
      reference_month: referenceMonth,
      total_amount: totalAmount,
    }),
  );

  const { data, error } = await supabase
    .from("monthly_charges")
    .upsert(upserts, { onConflict: "passenger_id,reference_month" })
    .select("*");

  if (error) {
    throw new Error(errorMessages.unexpected);
  }

  return data.map(toMonthlyCharge);
}

export async function listMonthlyCharges(
  referenceMonth: string,
): Promise<MonthlyCharge[]> {
  const { data, error } = await supabase
    .from("monthly_charges")
    .select("*")
    .eq("reference_month", referenceMonth);

  if (error) {
    throw new Error(errorMessages.unexpected);
  }

  return data.map(toMonthlyCharge);
}

export async function setMonthlyChargePaid(
  id: string,
  paid: boolean,
): Promise<MonthlyCharge> {
  const { data, error } = await supabase
    .from("monthly_charges")
    .update({
      paid,
      paid_at: paid ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(errorMessages.unexpected);
  }

  if (!data) {
    throw new Error(errorMessages.monthlyChargeNotFound);
  }

  return toMonthlyCharge(data);
}
