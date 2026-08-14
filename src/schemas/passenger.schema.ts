import { z } from "zod";

export const passengerSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome.")
    .max(120, "Nome muito longo."),
  defaultDailyRate: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("O valor deve ser maior que zero."),
});

export type PassengerFormValues = z.infer<typeof passengerSchema>;
