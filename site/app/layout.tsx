import type { Metadata, Viewport } from 'next';
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { seo, person } from '@/content/site';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.home.title, template: `%s · ${person.name}` },
  description: seo.home.description,
  applicationName: person.name,
  authors: [{ name: person.fullName, url: SITE_URL }],
  creator: person.fullName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: person.name,
    title: seo.home.title,
    description: seo.home.description,
    url: '/',
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image', title: seo.home.title, description: seo.home.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0e0d0c' },
    { media: '(prefers-color-scheme: light)', color: '#f4f0ea' },
  ],
  colorScheme: 'dark light',
};

// Runs before first paint: dark is the default, a saved "light" choice wins.
const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
