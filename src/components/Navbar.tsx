"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const NAV_ITEMS = [
  { key: "work", href: "/work" },
  { key: "visuals", href: "/visuals" },
  { key: "audio", href: "/audio" },
  { key: "labs", href: "/labs" },
  { key: "contact", href: "/#contact" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { t, locale, toggleLocale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-neutral-950/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-screen-3xl items-center justify-between px-6 py-5 md:px-8 md:py-6">
          <Link href="/" aria-label="IN — Home" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="IN"
              width={28}
              height={34}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-12">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`font-label text-[11px] font-medium uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70 ${
                    active
                      ? "border-b border-white pb-1 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.nav.languageLabel}
              className="font-label text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-white"
            >
              <span className={locale === "en" ? "text-white" : ""}>EN</span>
              <span className="mx-1 text-neutral-600">/</span>
              <span className={locale === "es" ? "text-white" : ""}>ES</span>
            </button>

            <button
              type="button"
              className="hidden bg-primary px-6 py-2 font-label text-[11px] uppercase tracking-widest text-on-primary transition-all duration-200 hover:opacity-90 md:inline-block"
            >
              {t.nav.cta}
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.nav.menu}
              className="flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className="sr-only">{t.nav.menu}</span>
              <span aria-hidden="true" className="flex flex-col gap-1.5">
                <span className="block h-px w-6 bg-white" />
                <span className="block h-px w-6 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-sm transform bg-neutral-950 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col pt-8">
          <div className="flex items-center justify-between px-8 pb-12">
            <div>
              <div className="font-headline text-3xl font-black uppercase tracking-tighter text-white">
                IN
              </div>
              <div className="font-label text-lg font-bold tracking-tight text-neutral-500">
                {t.footer.tagline}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.nav.close}
              className="flex h-10 w-10 items-center justify-center text-neutral-400 hover:text-white"
            >
              <span className="sr-only">{t.nav.close}</span>
              <span aria-hidden="true" className="text-2xl">
                ×
              </span>
            </button>
          </div>
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-8 py-6 font-label text-xl font-bold uppercase tracking-tight transition-all ${
                    active
                      ? "border-l-4 border-white bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto p-8">
            <button
              type="button"
              className="w-full bg-primary px-6 py-4 font-label text-[11px] uppercase tracking-widest text-on-primary"
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
