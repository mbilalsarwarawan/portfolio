import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { seo, person } from '@/content/site';
import { SITE_URL } from '@/lib/site';
import './globals.css';

// Display: Archivo with its width axis, set expanded for headlines.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
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
    { media: '(prefers-color-scheme: dark)', color: '#0b0d10' },
    { media: '(prefers-color-scheme: light)', color: '#f4f5f7' },
  ],
  colorScheme: 'dark light',
};

// Runs before first paint: dark is the default, a saved "light" choice wins.
const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
