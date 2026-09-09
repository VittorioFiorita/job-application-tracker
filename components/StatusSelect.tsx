type StatusSelectProps = {
  value: string;
  onChange: (status: string) => void;
};

const statusStampClasses: Record<string, string> = {
  inviata: "text-stamp-slate border-stamp-slate outline-stamp-slate",
  colloquio: "text-stamp-amber border-stamp-amber outline-stamp-amber",
  rifiutata: "text-stamp-brick border-stamp-brick outline-stamp-brick",
  accettata: "text-stamp-seal border-stamp-seal outline-stamp-seal",
};

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none bg-transparent text-xs font-mono uppercase tracking-wide font-semibold px-3 py-1 rounded-sm border-2 outline-1 outline-offset-2 -rotate-2 cursor-pointer ${statusStampClasses[value]}`}
    >
      <option value="inviata" className="bg-background text-foreground">Inviata</option>
      <option value="colloquio" className="bg-background text-foreground">Colloquio</option>
      <option value="rifiutata" className="bg-background text-foreground">Rifiutata</option>
      <option value="accettata" className="bg-background text-foreground">Accettata</option>
    </select>
  );
}