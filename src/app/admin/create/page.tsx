import { AdminGuard } from "@/components/admin/AdminGuard";
import { CreateProject } from "@/components/admin/CreateProject";

export default function AdminCreatePage() {
  return (
    <AdminGuard>
      <CreateProject />
    </AdminGuard>
  );
}
