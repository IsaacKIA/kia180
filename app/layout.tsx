import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0A0C',
};

export const metadata: Metadata = {
  title: 'KIA 180 — Personal Growth & Execution OS',
  description:
    'Turn a 180-day vision into daily execution. Goals, money, ventures, and AI coaching — all connected in one executive command centre.',
  keywords: 'KIA 180, personal operating system, execution, business growth, AI coaching',
  authors: [{ name: 'Isaac Agya Koomson' }],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A0A0C] text-[#F7F5F0] antialiased">
        {children}
      </body>
    </html>
  );
}
