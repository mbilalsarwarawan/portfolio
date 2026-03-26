import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Muhammad Bilal Awan — Full-Stack Developer',
  description:
    'Full-Stack Developer with 2+ years of experience building scalable web applications using MERN stack and Python frameworks. Delivered 5+ production-ready applications for international clients.',
  openGraph: {
    title: 'Muhammad Bilal Awan — Full-Stack Developer',
    description:
      'Full-Stack Developer building scalable web applications with MERN stack and Python frameworks.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
        <RootLayoutClient>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </RootLayoutClient>
      </body>
    </html>
  );
}
