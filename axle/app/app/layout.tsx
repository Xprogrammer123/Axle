import ActivityBar from "@/components/ActivityBar";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen bg-dark flex-col">
            <Header />
          <div className="flex h-full w-full">
          <Sidebar />
            {children}
            <ActivityBar />
            </div>
        </div>
      </body>
    </html>
  );
}
