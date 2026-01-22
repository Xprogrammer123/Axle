import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://heyaxle.vercel.app'), // change to your real domain

  title: {
    default: 'Axle',
    template: '%s | Axle',
  },

  description:
    'Axle lets you create intelligent AI agents that automate workflows across 80+ integrations like GitHub, Google, X, Slack, and more.',

  applicationName: 'Axle',

  keywords: [
    'AI automation',
    'workflow automation',
    'AI agents',
    'no-code automation',
    'productivity tools',
    'AI integrations',
    'Zapier alternative',
    'AI workflows',
  ],

  authors: [{ name: 'Nexia' }],
  creator: 'Nexia',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: [{ url: '/beta/logo.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/beta/logo.svg' }],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heyaxle.vercel.app',
    siteName: 'Axle',
    title: 'Axle',
    description:
      'Create intelligent AI agents that automate your workflows across 80+ apps.',
    images: [
      {
        url: '/og.png', // 1200x630
        width: 1200,
        height: 630,
        alt: 'Axle — AI-Powered Workflow Automation',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Axle — AI-Powered Workflow Automation',
    description:
      'Build AI agents that work across GitHub, Google, X, Slack, and more.',
    images: ['/og.png'],
    creator: '@heyaxle', // optional
  },

  category: 'Technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
