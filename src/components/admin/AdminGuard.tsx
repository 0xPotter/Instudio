"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/firebase/AuthProvider";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary/40 animate-pulse">
          Authenticating…
        </span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
