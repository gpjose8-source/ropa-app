export default function KpiCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const tones = {
    default: "border-gray-200",
    good: "border-green-300",
    warn: "border-amber-500/50",
    bad: "border-red-500/60",
  } as const;
  const valueTones = {
    default: "text-black",
    good: "text-green-700",
    warn: "text-amber-300",
    bad: "text-red-300",
  } as const;

  return (
    <div className={`rounded-xl border bg-white p-4 ${tones[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-800">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueTones[tone]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
