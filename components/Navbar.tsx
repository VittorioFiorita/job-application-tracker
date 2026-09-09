"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Candidature" },
  { href: "/stats", label: "Statistiche" },
  { href: "/profile", label: "Profilo" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex flex-wrap justify-between items-center gap-3 bg-foreground/3 border border-foreground/10 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 sm:gap-7">
          <span className="font-serif font-semibold text-sm hidden sm:block">Job Tracker</span>
          <Show when="signed-in">
            <nav className="flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-lg ${
                    pathname === link.href
                      ? "bg-accent text-white font-medium"
                      : "text-foreground/60 hover:bg-foreground/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Show>
        </div>
        <div className="flex gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-foreground/20 text-foreground hover:bg-foreground/5">
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90">
                Registrati
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
    </div>
  );
}