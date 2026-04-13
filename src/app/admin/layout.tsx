import type { Metadata } from "next";
import { AuthProvider } from "@/lib/firebase/AuthProvider";

export const metadata: Metadata = {
  title: "Admin — IN Studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
