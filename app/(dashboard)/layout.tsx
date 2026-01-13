
export default function DashboardLayout({
  children,
  sidebar,
  navbar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
}) {
  return (
    <div>
      {sidebar}
      {navbar}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}