import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <span className="text-lg font-semibold tracking-tight text-zinc-900">VanOS</span>
        <div className="flex gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
            Entrar
          </Link>
          <Link href="/register" className={cn(buttonVariants())}>
            Crear cuenta
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-16">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-800/90">SaaS · flotas</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Opera tu alquiler de autocaravanas en un solo panel
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          Reservas, vehículos, clientes e incidencias conectados a Firebase. Inicia sesión para acceder al
          panel de empresa, administración o área de cliente.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
            Empezar
          </Link>
          <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
            Ya tengo cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}
