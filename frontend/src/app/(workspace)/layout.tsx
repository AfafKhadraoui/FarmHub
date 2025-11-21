export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">
        <div className="p-4">Sidebar</div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
