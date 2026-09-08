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
      <header className="flex flex-wrap justify-between items-center gap-3 bg-white/[0.02] border border-gray-900 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 sm:gap-7">
          <span className="font-semibold text-sm hidden sm:block">Job Tracker</span>
          <Show when="signed-in">
            <nav className="flex gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-lg ${
                    pathname === link.href
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-700"
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
              <button className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">
                Accedi
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
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