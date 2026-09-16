import Link from "next/link";

export default function SectionHeader({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-foreground/10 bg-foreground/3">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        {href ? (
          <Link href={href} className="font-serif text-lg font-semibold hover:underline">
            ← {title}
          </Link>
        ) : (
          <h1 className="font-serif text-lg font-semibold">{title}</h1>
        )}
        {children}
      </div>
    </div>
  );
}