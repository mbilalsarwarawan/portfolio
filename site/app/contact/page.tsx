'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ContactLinksSkeleton, SkeletonBlock } from '@/components/Skeleton';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
}

interface ContactLink {
  label: string;
  value: string;
  href?: string;
  note: string;
  accent: string;
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/contact-info')
      .then((r) => r.json())
      .then((data: ContactInfo) => {
        if (!cancelled) {
          setContactInfo(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContactInfo(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const contactLinks: ContactLink[] = [
    {
      label: 'Email',
      value: contactInfo?.email || 'Email coming soon',
      href: contactInfo?.email ? `mailto:${contactInfo.email}` : undefined,
      note: 'Best for project inquiries, freelance work, and collaborations.',
      accent: '01',
    },
    {
      label: 'GitHub',
      value: 'See code and experiments',
      href: contactInfo?.github_url || undefined,
      note: 'Browse shipping work, side projects, and implementation details.',
      accent: '02',
    },
    {
      label: 'LinkedIn',
      value: 'Professional background',
      href: contactInfo?.linkedin_url || undefined,
      note: 'Use this if you prefer a more formal intro or hiring outreach.',
      accent: '03',
    },
  ].filter((item): item is ContactLink & { href: string } => Boolean(item.href));

  const responseSignals = [
    'Open to freelance, contract, and full-time opportunities',
    'Strong fit for product builds, dashboards, AI integrations, and full-stack delivery',
    `Based in ${contactInfo?.location || 'Pakistan'} and comfortable working asynchronously`,
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-20 md:pt-24 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-20">
              <div>
                <span className="label-caps mb-6 block">Get in Touch</span>
                <h1 className="heading-display text-[clamp(2.5rem,5vw,4.5rem)]">
                  Start the
                  <br />
                  conversation{' '}
                  <span style={{ color: 'var(--accent)' }}>directly</span>
                </h1>
              </div>
              <div className="flex items-end">
                <p
                  className="text-lg md:text-xl leading-relaxed max-w-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  This page is now a clean handoff point. Reach out by email or
                  through my public profiles, and we can move the conversation
                  forward from there.
                </p>
              </div>
            </div>

            <div className="section-divider mb-16" />

            <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden border surface-noise"
                style={{
                  borderColor: 'var(--border)',
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--bg-surface) 82%, transparent), color-mix(in srgb, var(--accent) 10%, var(--bg)))',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 70%, white), transparent)',
                  }}
                />
                <div className="p-8 md:p-10 lg:p-12">
                  <div className="flex items-start justify-between gap-6 mb-12">
                    <div>
                      <div className="label-caps mb-4">Direct Channel</div>
                      <h2 className="heading-section text-[clamp(1.8rem,4vw,3.4rem)] max-w-[12ch]">
                        Reach out where the conversation actually starts.
                      </h2>
                    </div>
                    <div
                      className="hidden md:flex h-16 w-16 items-center justify-center rounded-full border text-sm"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--accent)',
                        background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      LIVE
                    </div>
                  </div>

                  <div aria-busy={loading}>
                    {loading ? (
                      <ContactLinksSkeleton count={3} />
                    ) : (
                      <div className="grid gap-4">
                        {contactLinks.map((item, index) => (
                          <motion.a
                            key={item.label}
                            href={item.href}
                            target={item.label === 'Email' ? undefined : '_blank'}
                            rel={item.label === 'Email' ? undefined : 'noopener noreferrer'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="group grid gap-4 border px-5 py-5 md:grid-cols-[auto_1fr_auto] md:items-center"
                            style={{
                              borderColor: 'var(--border)',
                              background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
                            }}
                          >
                            <div
                              className="text-xs tracking-[0.3em]"
                              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                            >
                              {item.accent}
                            </div>
                            <div>
                              <div className="label-caps mb-2">{item.label}</div>
                              <div
                                className="text-lg md:text-xl break-all md:break-normal transition-colors duration-300 group-hover:text-[var(--accent)]"
                                style={{ fontFamily: 'var(--font-display)' }}
                              >
                                {item.value}
                              </div>
                              <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                                {item.note}
                              </p>
                            </div>
                            <div
                              className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                              style={{ color: 'var(--text-tertiary)' }}
                            >
                              Open
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3" aria-busy={loading}>
                    {loading ? (
                      <>
                        <SkeletonBlock className="h-12 w-36" />
                        <SkeletonBlock className="h-12 w-28" />
                      </>
                    ) : (
                      <>
                        {contactInfo?.email && (
                          <a href={`mailto:${contactInfo.email}`} className="btn-primary">
                            Email Bilal
                          </a>
                        )}
                        {contactInfo?.linkedin_url && (
                          <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                            LinkedIn
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="border p-8 md:p-10"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                >
                  <div className="label-caps mb-4">What To Send</div>
                  <div className="space-y-4 text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                      A short intro, project scope, timeline, and any useful links
                      are enough to get a productive reply started.
                    </p>
                    <p>
                      If you&apos;re hiring, include team context, role expectations,
                      and whether the work is contract, freelance, or full-time.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="border p-8 md:p-10"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                >
                  <div className="label-caps mb-5">Availability Snapshot</div>
                  <div className="space-y-4" aria-busy={loading}>
                    {loading ? (
                      Array.from({ length: 3 }, (_, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <SkeletonBlock className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <SkeletonBlock className="h-4 w-full" />
                            <SkeletonBlock className="h-4 w-5/6" />
                          </div>
                        </div>
                      ))
                    ) : (
                      responseSignals.map((signal) => (
                        <div key={signal} className="flex items-start gap-3">
                          <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
                          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                            {signal}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.39, ease: [0.16, 1, 0.3, 1] }}
                  className="border p-8 md:p-10"
                  style={{
                    borderColor: 'var(--border)',
                    background:
                      'linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 6%, transparent))',
                  }}
                >
                  <div className="label-caps mb-3">Base</div>
                  {loading ? (
                    <div className="space-y-3" aria-busy="true">
                      <SkeletonBlock className="h-8 w-32" />
                      <SkeletonBlock className="h-4 w-full max-w-sm" />
                      <SkeletonBlock className="h-4 w-5/6 max-w-sm" />
                    </div>
                  ) : (
                    <>
                      <div
                        className="text-xl md:text-2xl mb-3"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                      >
                        {contactInfo?.location || 'Pakistan'}
                      </div>
                      <p className="text-sm md:text-base max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                        Remote-friendly, async-ready, and comfortable collaborating across time zones.
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
