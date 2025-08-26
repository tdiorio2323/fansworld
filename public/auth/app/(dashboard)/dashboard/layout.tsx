export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r p-4">Sidebar</aside>
      <div className="flex flex-col">
        <header className="border-b p-4">Topbar</header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
