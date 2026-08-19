import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CarIllustration } from "@/components/illustrations/CarIllustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { signInWithPassword } from "@/services/auth.service";

export function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);

    try {
      await signInWithPassword(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Não foi possível entrar.",
      );
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: "hsl(var(--card))" }}
      />

      <div className="relative w-full max-w-sm">
        <CarIllustration />
        <div className="surface mt-8 p-8">
          <h1 className="text-2xl font-semibold tracking-tight">RideLedger</h1>
          <p className="mt-1 text-sm opacity-70">Entre com sua conta.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
