import Link from "next/link";
import MatchBar from "@/components/MatchBar";
import StatusSelect from "@/components/StatusSelect";
import Button from "./Button";

type Application = {
  id: number;
  position: string;
  status: string;
  matchScore: number | null;
  company: { name: string };
};

type ApplicationCardProps = {
  app: Application;
  onStatusChange: (id: number, status: string) => void;
  onMatch: (id: number) => void;
  onDelete: (id: number) => void;
  isMatching: boolean;
};

export default function ApplicationCard({
  app,
  onStatusChange,
  onMatch,
  onDelete,
  isMatching,
}: ApplicationCardProps) {
  return (
    <li className="bg-white/1 border border-gray-900 rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M5 21V7l8-4v18M13 21V11h6v10M9 9h.01M9 13h.01M9 17h.01"
              />
            </svg>
          </div>
          <div>
            <Link href={`/applications/${app.id}`} className="font-semibold hover:underline">
              {app.position}
            </Link>
            <p className="text-gray-400 text-sm">{app.company.name}</p>
          </div>
        </div>
        <div className="self-start">
          <StatusSelect value={app.status} onChange={(status) => onStatusChange(app.id, status)} />
        </div>
      </div>

      {app.matchScore !== null ? (
        <MatchBar score={app.matchScore} />
      ) : (
        <Button onClick={() => onMatch(app.id)} disabled={isMatching} size="sm" fullWidth>
          {isMatching ? "Valutazione..." : "Valuta match"}
        </Button>
      )}

      <div className="flex justify-end mt-2">
        <Button onClick={() => onDelete(app.id)} variant="danger-ghost" size="sm">
          Elimina
        </Button>
      </div>
    </li>
  );
}