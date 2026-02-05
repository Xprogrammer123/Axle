import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://axle.ai"), // change if different
  title: {
    default: "Axle",
    template: "%s | Axle",
  },
  description:
    "Axle lets you build powerful AI agents that connect your everyday tools like Gmail, Slack, GitHub, Sheets, and more — no code required.",

  applicationName: "Axle",
  category: "Productivity",

  keywords: [
    "AI automation",
    "AI agents",
    "workflow automation",
    "no-code AI",
    "productivity tools",
    "AI integrations",
    "Slack automation",
    "Gmail automation",
    "GitHub automation",
  ],

  authors: [{ name: "Nexia" }],
  creator: "Nexia",
  publisher: "Nexia",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://heyaxle.pxxl.click",
    siteName: "Axle",
    title: "Axle — Automate Workflows with AI",
    description:
      "Create AI agents that work across your apps. Automate tasks, sync tools, and move faster with Axle.",
    images: [
      {
        url: "/ogimg.png", // you NEED this
        width: 1200,
        height: 630,
        alt: "Axle AI Automation Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Axle — Automate Workflows with AI",
    description:
      "Build AI agents that connect your tools and get work done for you. No code. Full control.",
    images: ["/ogimg.png"],
    creator: "@heyaxle", // change if needed
  },

  icons: {
    icon: "/beta/logo.svg",
    shortcut: "/beta/logo.svg",
    apple: "/beta/logo.svg",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}