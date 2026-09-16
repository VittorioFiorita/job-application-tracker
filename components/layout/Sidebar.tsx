"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/layout/ThemeToggle";

const links = [
  {
    href: "/",
    label: "Candidature",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Statistiche",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V10m5 7V6m5 11v-4" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profilo",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden sm:flex sm:flex-col sm:w-56 sm:h-screen sm:sticky sm:top-0 sm:shrink-0 bg-foreground/3 border-r border-foreground/10 p-4">
        <span className="font-serif font-semibold text-lg mb-8 px-2">JobDossier</span>

        <Show when="signed-in">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wide ${
                  pathname === link.href
                    ? "bg-accent text-white rounded-l-lg rounded-r-none"
                    : "text-foreground/60 hover:bg-foreground/10 rounded-lg"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </Show>

        <div className="mt-auto pt-4 border-t border-foreground/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-lg border border-foreground/20 text-foreground hover:bg-foreground/5 w-full">
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90 w-full">
                Registrati
              </button>
            </SignUpButton>
          </Show>
        </div>
      </aside>

      {/* Barra superiore mobile */}
      <header className="sm:hidden flex items-center justify-between px-4 py-3 bg-foreground/3 border-b border-foreground/10">
        <span className="font-serif font-semibold text-sm">JobDossier</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-lg border border-foreground/20 text-foreground hover:bg-foreground/5">
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90">
                Registrati
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Bottom bar mobile */}
      <Show when="signed-in">
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-background border-t border-foreground/10 py-2 z-40">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wide ${
                pathname === link.href
                  ? "text-accent"
                  : "text-foreground/60"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </Show>
    </>
  );
}