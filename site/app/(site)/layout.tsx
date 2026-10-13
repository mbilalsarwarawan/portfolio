import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/layout/ChatWidget';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { Cursor } from '@/components/ui/Cursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { getContact } from '@/lib/content';
import { personJsonLd } from '@/lib/site';
import { hero, nav, person } from '@/content/site';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContact();
  const sameAs = [contact.githubUrl, contact.linkedinUrl].filter(Boolean) as string[];

  return (
    <MotionProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar name={person.name} items={nav} cta={hero.primaryCta} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer name={person.fullName} contact={contact} items={nav} location={person.location} />
      <ChatWidget />
      <Cursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(sameAs, contact.email)) }}
      />
    </MotionProvider>
  );
}
