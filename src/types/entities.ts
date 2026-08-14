export interface Passenger {
  id: string;
  name: string;
  defaultDailyRate: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  rideDate: string;
  rateCharged: number;
  createdAt: string;
}

export interface MonthlyCharge {
  id: string;
  passengerId: string;
  referenceMonth: string;
  totalAmount: number;
  paid: boolean;
  paidAmount: number;
  paidAt: string | null;
  createdAt: string;
}
