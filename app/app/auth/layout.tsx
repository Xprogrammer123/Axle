export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex bg-background text-text h-screen w-screen flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
