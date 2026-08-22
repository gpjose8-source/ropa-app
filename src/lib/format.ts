export function usd(n: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);
}

export function toDate(s: string): Date {
  return new Date(s.replace(" ", "T"));
}

export function fechaCorta(s: string): string {
  return toDate(s).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
  });
}

export function fechaHora(s: string): string {
  return toDate(s).toLocaleString("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
