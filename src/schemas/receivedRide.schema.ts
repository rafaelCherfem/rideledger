import { z } from "zod";

export const receivedRideSchema = z.object({
  passengerId: z.string().min(1, "Selecione um passageiro."),
  receivedDate: z.string().min(1, "Informe a data."),
  amount: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("O valor deve ser maior que zero."),
});

export type ReceivedRideFormValues = z.infer<typeof receivedRideSchema>;
