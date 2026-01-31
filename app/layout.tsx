import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Axle - Automate with AI",
    description: "Build powerful AI helpers by simply describing what you want.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <UIProvider>
                    {children}
                </UIProvider>
            </body>
        </html>
    );
}
