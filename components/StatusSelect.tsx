type StatusSelectProps = {
  value: string;
  onChange: (status: string) => void;
};

const statusColors: Record<string, string> = {
  inviata: "bg-gray-500/20 text-gray-300",
  colloquio: "bg-blue-500/20 text-blue-300",
  rifiutata: "bg-red-500/20 text-red-300",
  accettata: "bg-green-500/20 text-green-300",
};

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs px-3 py-1.5 rounded-full border-none font-medium ${statusColors[value]}`}
    >
      <option value="inviata" className="bg-gray-800 text-gray-200">Inviata</option>
      <option value="colloquio" className="bg-gray-800 text-gray-200">Colloquio</option>
      <option value="rifiutata" className="bg-gray-800 text-gray-200">Rifiutata</option>
      <option value="accettata" className="bg-gray-800 text-gray-200">Accettata</option>
    </select>
  );
}