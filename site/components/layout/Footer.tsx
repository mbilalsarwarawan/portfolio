import Link from 'next/link';
import type { Contact } from '@/lib/content';
import type { NavItem } from './Navbar';
import { LocalTime } from './LocalTime';

interface FooterProps {
  name: string;
  contact: Contact;
  items: NavItem[];
  location: string;
}

export function Footer({ name, contact, items, location }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = [
    contact.githubUrl && { label: 'GitHub', href: contact.githubUrl },
    contact.linkedinUrl && { label: 'LinkedIn', href: contact.linkedinUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="relative border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="t-eyebrow mb-4">Get in touch</p>
          <a
            href={`mailto:${contact.email}`}
            className="group inline-block break-all font-display text-h3 font-semibold leading-tight tracking-tight text-fg transition-colors duration-[var(--dur-base)] hover:text-accent sm:break-normal"
            data-cursor="link"
          >
            {contact.email}
            <span className="block h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden="true" />
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="t-eyebrow mb-4">Site</p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="t-eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors hover:text-fg">
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-line py-6 text-small text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {name}
        </p>
        <p className="t-mono">
          {location} · <LocalTime timeZone="Asia/Karachi" />
        </p>
      </div>
    </footer>
  );
}
