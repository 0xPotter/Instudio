import { AdminGuard } from "@/components/admin/AdminGuard";
import { ManageProjects } from "@/components/admin/ManageProjects";

export default function AdminManagePage() {
  return (
    <AdminGuard>
      <ManageProjects />
    </AdminGuard>
  );
}
