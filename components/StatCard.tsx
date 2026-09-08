type StatCardProps = {
  label: string;
  value: string | number;
  variant?: "default" | "accent" | "success";
};

const variantStyles = {
  default: "bg-gray-800",
  accent: "bg-blue-900/40",
  success: "bg-green-900/40",
};

const textStyles = {
  default: "text-gray-400",
  accent: "text-blue-300",
  success: "text-green-300",
};

export default function StatCard({ label, value, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 ${variantStyles[variant]}`}>
      <p className={`text-xs mb-1 ${textStyles[variant]}`}>{label}</p>
      <p className={`text-2xl font-bold ${variant === "default" ? "" : textStyles[variant]}`}>
        {value}
      </p>
    </div>
  );
}