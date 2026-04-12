"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { label: "Manage", href: "/admin" },
  { label: "Create", href: "/admin/create" },
];

const ADMIN_USER = {
  name: "Jeremy Campos",
  role: "Founder",
  initials: "JC",
};

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
                Admin Console
              </span>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            <span className="mb-3 font-label text-[9px] uppercase tracking-[0.3em] text-neutral-600">
              Workspace
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
            <div className="flex items-center gap-3 border-t border-neutral-900 pt-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 font-label text-[10px] font-bold uppercase tracking-widest text-white">
                {ADMIN_USER.initials}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-body text-sm text-white">
                  {ADMIN_USER.name}
                </span>
                <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
                  {ADMIN_USER.role}
                </span>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="font-label text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white"
            >
              Sign Out →
            </Link>
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
