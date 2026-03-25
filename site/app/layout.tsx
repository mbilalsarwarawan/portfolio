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
  title: 'Bilal — Full-Stack Developer',
  description:
    'Full-stack developer crafting high-performance web applications, APIs, and design systems. Specializing in React, Node.js, and cloud architecture.',
  openGraph: {
    title: 'Bilal — Full-Stack Developer',
    description:
      'Full-stack developer crafting high-performance web applications.',
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
