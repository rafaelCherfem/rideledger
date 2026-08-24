import { errorMessages } from "@/constants/errorMessages";
import { getCurrentUserId, supabase } from "@/lib/supabase";
import type { FlaggedRide } from "@/types/entities";

const UNIQUE_VIOLATION = "23505";

export async function createRideFlag(rideId: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("ride_flags").insert({
    ride_id: rideId,
    flagged_by: userId,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new Error("Esta diária já foi sinalizada.");
    }
    throw new Error(errorMessages.unexpected);
  }
}

export async function listUnresolvedFlags(): Promise<FlaggedRide[]> {
  const { data: flags, error } = await supabase
    .from("ride_flags")
    .select("*")
    .eq("resolved", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(errorMessages.unexpected);
  }

  if (flags.length === 0) {
    return [];
  }

  const rideIds = flags.map((flag) => flag.ride_id);

  const { data: rides, error: ridesError } = await supabase
    .from("rides")
    .select("*")
    .in("id", rideIds);

  if (ridesError) {
    throw new Error(errorMessages.unexpected);
  }

  const rideById = new Map(rides.map((ride) => [ride.id, ride]));

  return flags.map((flag) => {
    const ride = rideById.get(flag.ride_id);
    return {
      flagId: flag.id,
      rideId: flag.ride_id,
      passengerId: ride?.passenger_id ?? "",
      rideDate: ride?.ride_date ?? "",
      rateCharged: ride?.rate_charged ?? 0,
      createdAt: flag.created_at,
    };
  });
}

export async function resolveFlag(flagId: string): Promise<void> {
  const { error } = await supabase
    .from("ride_flags")
    .update({ resolved: true, resolved_at: new Date().toISOString() })
    .eq("id", flagId);

  if (error) {
    throw new Error(errorMessages.unexpected);
  }
}
