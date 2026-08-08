import AdminNav from "@/components/admin/AdminNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
