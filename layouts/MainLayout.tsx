export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
} 