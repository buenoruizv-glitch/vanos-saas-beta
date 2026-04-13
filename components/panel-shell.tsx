"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string };

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [{ href: "/admin", label: "Resumen" }],
  empresa: [
    { href: "/empresa", label: "Panel" },
    { href: "/empresa/vehicles", label: "Vehículos" },
    { href: "/empresa/bookings", label: "Reservas" },
    { href: "/empresa/clients", label: "Clientes" },
  ],
  cliente: [{ href: "/cliente", label: "Inicio" }],
};

export function PanelShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = navByRole[role];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight text-zinc-900">
              VanOS
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    pathname === item.href && "bg-zinc-100 text-zinc-900",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => void logout()}>
            Salir
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
