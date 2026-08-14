import { useMutation } from "@tanstack/react-query";
import { generateMonthlyReceipt } from "@/services/pdf.service";
import { listRidesByMonth } from "@/services/rides.service";
import { downloadFile } from "@/utils/downloadFile";
import type { MonthlyCharge, Passenger } from "@/types/entities";

interface GenerateReceiptInput {
  passenger: Passenger;
  charge: MonthlyCharge;
  referenceMonth: string;
}

export function useGenerateReceipt() {
  return useMutation({
    mutationFn: async ({
      passenger,
      charge,
      referenceMonth,
    }: GenerateReceiptInput) => {
      const rides = await listRidesByMonth(referenceMonth, passenger.id);
      const bytes = await generateMonthlyReceipt({
        passenger,
        charge,
        rides,
        referenceMonth,
      });

      const slug = passenger.name.trim().toLowerCase().replace(/\s+/g, "-");
      downloadFile(bytes, `comprovante-${slug}-${referenceMonth}.pdf`, "application/pdf");
    },
  });
}
