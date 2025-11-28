import { Sidebar } from "@/app/Dashboard/components/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-72">{children}</main>
        </div>
      </body>
    </html>
  );
}
