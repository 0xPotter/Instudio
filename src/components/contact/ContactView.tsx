"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const CONTACT_DETAILS = {
  phone: "+52 33 0000 0000",
  email: "hello@instudio.mx",
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
];

type Status = "idle" | "sending" | "sent";

export function ContactView() {
  const { t } = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    // TODO: wire to real submission endpoint (Resend / Cloudflare Worker / Supabase Edge Fn)
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("sent");
    (event.target as HTMLFormElement).reset();
  }

  return (
    <section className="bg-surface pb-32 pt-32 md:pt-40">
      <div className="container mx-auto max-w-screen-3xl px-6 md:px-8">
        {/* Header */}
        <header className="mb-20 flex max-w-3xl flex-col gap-6 md:mb-28">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
            {t.contactPage.eyebrow}
          </span>
          <h1 className="font-headline text-6xl font-black uppercase tracking-tighter md:text-8xl">
            {t.contactPage.title}
          </h1>
          <p className="max-w-xl font-body text-base leading-relaxed text-primary/60 md:text-lg">
            {t.contactPage.intro}
          </p>
        </header>

        <div className="grid gap-20 md:grid-cols-12 md:gap-16">
          {/* Direct details */}
          <aside className="md:col-span-4">
            <div className="flex flex-col gap-12">
              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                  {t.contactPage.directLabel}
                </span>
                <div className="mt-6 flex flex-col gap-6">
                  <div>
                    <span className="block font-label text-[10px] uppercase tracking-widest text-primary/40">
                      {t.contactPage.phoneLabel}
                    </span>
                    <a
                      href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
                      className="mt-2 block font-body text-lg text-primary transition-opacity hover:opacity-70 md:text-xl"
                    >
                      {CONTACT_DETAILS.phone}
                    </a>
                  </div>
                  <div>
                    <span className="block font-label text-[10px] uppercase tracking-widest text-primary/40">
                      {t.contactPage.emailLabel}
                    </span>
                    <a
                      href={`mailto:${CONTACT_DETAILS.email}`}
                      className="mt-2 block font-body text-lg text-primary transition-opacity hover:opacity-70 md:text-xl"
                    >
                      {CONTACT_DETAILS.email}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
                  {t.contactPage.socialLabel}
                </span>
                <div className="mt-6 flex flex-col gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-body text-base text-primary/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-8">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
              {t.contactPage.formHeading}
            </span>
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-8"
              noValidate
            >
              <div className="grid gap-8 md:grid-cols-2">
                <Field
                  id="name"
                  label={t.contactPage.form.name}
                  type="text"
                  required
                />
                <Field
                  id="email"
                  label={t.contactPage.form.email}
                  type="email"
                  required
                />
              </div>
              <Field
                id="subject"
                label={t.contactPage.form.subject}
                type="text"
              />
              <FieldTextarea
                id="message"
                label={t.contactPage.form.message}
                required
              />

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center rounded-full border border-primary px-10 py-4 font-label text-[11px] uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "sending"
                    ? t.contactPage.form.sending
                    : t.contactPage.form.submit}
                </button>
                {status === "sent" && (
                  <span className="font-label text-[11px] uppercase tracking-widest text-primary/60">
                    {t.contactPage.form.sent}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type: "text" | "email";
  required?: boolean;
};

function Field({ id, label, type, required }: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
        {required && <span className="ml-1 text-primary/60">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="border-b border-primary/20 bg-transparent py-3 font-body text-base text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary md:text-lg"
      />
    </label>
  );
}

type FieldTextareaProps = {
  id: string;
  label: string;
  required?: boolean;
};

function FieldTextarea({ id, label, required }: FieldTextareaProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40">
        {label}
        {required && <span className="ml-1 text-primary/60">*</span>}
      </span>
      <textarea
        id={id}
        name={id}
        required={required}
        rows={6}
        className="resize-none border-b border-primary/20 bg-transparent py-3 font-body text-base text-primary outline-none transition-colors placeholder:text-primary/30 focus:border-primary md:text-lg"
      />
    </label>
  );
}
