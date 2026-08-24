import { z } from "zod";

export const inviteSignupSchema = z
  .object({
    email: z.string().min(1, "Informe o e-mail.").email("E-mail inválido."),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type InviteSignupFormValues = z.infer<typeof inviteSignupSchema>;
