export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-slate-50">
        <div className="p-4">Admin Sidebar</div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
