type StatCardProps = {
  label: string;
  value: string | number;
  variant?: "default" | "amber" | "seal";
};

const variantStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "bg-foreground/5",
  amber: "bg-stamp-amber/10",
  seal: "bg-stamp-seal/10",
};

const textStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "text-foreground/60",
  amber: "text-stamp-amber",
  seal: "text-stamp-seal",
};

export default function StatCard({ label, value, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 ${variantStyles[variant]}`}>
      <p className={`text-xs mb-1 ${textStyles[variant]}`}>{label}</p>
      <p className={`text-2xl font-mono font-bold ${variant === "default" ? "" : textStyles[variant]}`}>
        {value}
      </p>
    </div>
  );
}