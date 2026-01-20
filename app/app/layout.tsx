import Header from "@/components-beta/Header";
import Sidebar from "@/components-beta/Sidebar";
import MobileNav from "@/components-beta/MobileNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-[#FAFAFA] text-dark flex w-screen h-screen">
          <MobileNav />
          <Sidebar />
          <div className="flex w-screen md:w-[80%] flex-col">
          <Header />
          {children}
          </div>
        </div>
      </body>
    </html>
  );
}
