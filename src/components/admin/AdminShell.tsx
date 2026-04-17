"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { signOut } from "@/lib/firebase/auth";

const NAV = [
  { label: "Gestionar", href: "/admin" },
  { label: "Crear", href: "/admin/create" },
];

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminShell({
  title,
  eyebrow,
  actions,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const displayName = user?.displayName ?? "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const photoURL = user?.photoURL;

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-outline-variant/10 bg-neutral-950 md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col gap-12 p-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="IN"
              width={28}
              height={34}
              className="h-7 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-headline text-sm font-black uppercase tracking-tight text-white">
                IN Studio
              </span>
              <span className="font-label text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                Panel Admin
              </span>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            <span className="mb-3 font-label text-[9px] uppercase tracking-[0.3em] text-neutral-600">
              Espacio de trabajo
            </span>
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded px-3 py-2.5 font-label text-[11px] uppercase tracking-widest transition-colors ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-900/60 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span aria-hidden="true">→</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 font-label text-[11px] uppercase tracking-widest text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-white"
            >
              <span>Ver Sitio</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <div className="flex items-center gap-3 border-t border-neutral-900 pt-6">
              {photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photoURL}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 font-label text-[10px] font-bold uppercase tracking-widest text-white">
                  {initials}
                </div>
              )}
              <div className="flex flex-col leading-tight">
                <span className="font-body text-sm text-white">
                  {displayName}
                </span>
                <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                  {user?.email ?? ""}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-left font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white"
            >
              Cerrar sesión →
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="border-b border-outline-variant/10 px-8 py-10 md:px-12 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              {eyebrow && (
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                  {eyebrow}
                </span>
              )}
              <h1 className="font-headline text-4xl font-black uppercase tracking-tighter md:text-5xl">
                {title}
              </h1>
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        </header>
        <main className="px-8 py-10 md:px-12 md:py-14">{children}</main>
      </div>
    </div>
  );
}
