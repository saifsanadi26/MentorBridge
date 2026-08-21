import { requireUser } from "@/lib/serverAuth";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  await requireUser({ roles: ["admin"] });

  return <AdminDashboardClient />;
}
