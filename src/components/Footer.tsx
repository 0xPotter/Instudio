"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Vimeo", href: "#" },
];

export function Footer() {
  const { t } = useLocale();

  return (
    <footer
      className="w-full border-t border-neutral-800/10 bg-neutral-950"
    >
      <div className="flex w-full flex-col items-start justify-between gap-16 px-6 py-16 md:flex-row md:items-end md:gap-8 md:px-8 md:py-20">
        <div className="flex w-full flex-col items-start space-y-12 md:w-1/2">
          <Image
            src="/logo.svg"
            alt="IN"
            width={24}
            height={29}
            className="h-6 w-auto self-start opacity-60 grayscale"
          />
          <div className="flex flex-col space-y-4">
            <span className="font-label text-[11px] uppercase tracking-widest text-neutral-500">
              {t.footer.connect}
            </span>
            <div className="flex flex-col space-y-2 font-body text-sm">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-neutral-500 transition-all duration-300 hover:-translate-y-1 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start md:w-1/2 md:items-end">
          <div className="mb-12 flex space-x-12">
            <Link
              href="/contact"
              className="font-body text-sm text-white underline transition-transform hover:-translate-y-1"
            >
              {t.footer.contact}
            </Link>
          </div>
          <div className="mb-6 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
              {t.footer.systemStatus}
            </span>
          </div>
          <div className="font-body text-sm text-neutral-500">
            {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
