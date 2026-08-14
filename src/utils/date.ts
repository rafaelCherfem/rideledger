export function todayISODate(): string {
  const now = new Date();
  return toISODate(now);
}

export function currentMonthStart(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export function formatDateDisplay(dateISO: string): string {
  const [year, month, day] = dateISO.split("-");
  return `${day}/${month}/${year}`;
}

export function formatMonthLabel(referenceMonth: string): string {
  const [year, month] = referenceMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function previousMonth(referenceMonth: string): string {
  const [year, month] = referenceMonth.split("-").map(Number);
  return toReferenceMonth(new Date(year, month - 2, 1));
}

export function nextMonth(referenceMonth: string): string {
  const [year, month] = referenceMonth.split("-").map(Number);
  return toReferenceMonth(new Date(year, month, 1));
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toReferenceMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}
