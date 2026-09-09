type MatchBarProps = {
  score: number;
};

export default function MatchBar({ score }: MatchBarProps) {
  const color =
    score >= 70 ? "bg-stamp-seal" : score >= 40 ? "bg-stamp-amber" : "bg-stamp-brick";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-foreground/60 mb-1.5">
        <span>Compatibilità profilo</span>
        <span className="font-mono font-medium text-foreground">{score}%</span>
      </div>
      <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}