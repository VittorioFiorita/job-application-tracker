type ApplicationsToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    sortBy: string;
    onSortByChange: (value: string) => void;
};

const statusOptions = [
    {value: "", label: "Tutti gli status"},
    {value: "inviata", label: "Inviata"},
    {value: "colloquio", label: "Colloquio"},
    {value: "rifiutata", label: "Rifiutata"},
    {value: "accettata", label: "Accettata"},
];

const sortOptions = [
    {value: "date-desc", label: "Più recenti"},
    {value: "date-asc", label: "Meno recenti"},
    {value: "match-desc", label: "Match più alto"},
    {value: "match-asc", label: "Match più basso"},
];

export default function ApplicationsToolbar({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortByChange
}: ApplicationsToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cerca per posizione o azienda..."
                className="flex-1 bg-foreground/3 border border-foreground/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
            />
            <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="bg-foreground/3 border border-foreground/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
                {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                    {opt.label}
                </option>
                ))}
            </select>
            <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="bg-foreground/3 border border-foreground/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
                {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                    {opt.label}
                </option>
                ))}
            </select>
        </div>
    );
}