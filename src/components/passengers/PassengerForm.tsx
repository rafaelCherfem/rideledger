import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passengerSchema, type PassengerFormValues } from "@/schemas/passenger.schema";
import type { Passenger } from "@/types/entities";

interface PassengerFormProps {
  initialValues?: Passenger | undefined;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PassengerFormValues) => void;
  onCancel: () => void;
}

export function PassengerForm({
  initialValues,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: PassengerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      defaultDailyRate: initialValues?.defaultDailyRate ?? 0,
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? "",
      defaultDailyRate: initialValues?.defaultDailyRate ?? 0,
    });
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg bg-card p-4 text-card-foreground shadow-sm"
    >
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="defaultDailyRate">Valor da diária</Label>
        <Input
          id="defaultDailyRate"
          type="number"
          step="0.01"
          inputMode="decimal"
          {...register("defaultDailyRate")}
        />
        {errors.defaultDailyRate && (
          <p className="text-xs text-destructive">
            {errors.defaultDailyRate.message}
          </p>
        )}
      </div>

      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
