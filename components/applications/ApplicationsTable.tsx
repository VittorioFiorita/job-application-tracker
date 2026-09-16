import Link from "next/link";
import StatusSelect from "./StatusSelect";
import Button from "../ui/Button";

type Application = {
    id: number;
    position: string;
    status: string;
    createdAt: string;
    matchScore: number | null;
    company: { name: string };
};

type ApplicationsTableProps = {
    applications: Application[];
    onStatusChange: (id: number, status: string) => void;
    onMatch: (id: number) => void;
    onDelete: (id: number) => void;
    matchingId: number | null;
};

export default function ApplicationsTable({
    applications,
    onStatusChange,
    onMatch,
    onDelete,
    matchingId
}: ApplicationsTableProps) {
    return (
        <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
                <tr className="text-left text-xs text-foreground/40 uppercase tracking-wide">
                <th className="font-medium px-4 pb-2">Posizione</th>
                <th className="font-medium px-4 pb-2">Azienda</th>
                <th className="font-medium px-4 pb-2">Status</th>
                <th className="font-medium px-4 pb-2 w-24">Match</th>
                <th className="font-medium px-4 pb-2">Data</th>
                <th className="font-medium px-4 pb-2 text-right">Azioni</th>
                </tr>
            </thead>
            <tbody>
                {applications.map((app) => (
                <tr key={app.id} className="bg-foreground/3 border border-foreground/10">
                    <td className="px-4 py-3 rounded-l-xl">
                    <Link href={`/applications/${app.id}`} className="font-medium hover:underline">
                        {app.position}
                    </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/60">{app.company.name}</td>
                    <td className="px-4 py-3">
                    <StatusSelect value={app.status} onChange={(status) => onStatusChange(app.id, status)} />
                    </td>
                    <td className="px-4 py-3">
                    {app.matchScore !== null ? (
                        <span
                        className={`font-mono text-xs font-medium ${
                            app.matchScore >= 70
                            ? "text-stamp-seal"
                            : app.matchScore >= 40
                            ? "text-stamp-amber"
                            : "text-stamp-brick"
                        }`}
                        >
                        {app.matchScore}%
                        </span>
                    ) : (
                        <Button onClick={() => onMatch(app.id)} disabled={matchingId === app.id} size="sm">
                        {matchingId === app.id ? "..." : "Valuta"}
                        </Button>
                    )}
                    </td>
                    <td className="px-4 py-3 text-foreground/40 font-mono text-xs">
                    {new Date(app.createdAt).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-3 rounded-r-xl text-right">
                    <Button onClick={() => onDelete(app.id)} variant="danger-ghost" size="sm">
                        Elimina
                    </Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}