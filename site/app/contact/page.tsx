'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetch('/api/contact-info').then((r) => r.json()).then(setContactInfo);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-20 md:pt-24 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-20">
              <div>
                <span className="label-caps mb-6 block">Get in Touch</span>
                <h1 className="heading-display text-[clamp(2.5rem,5vw,4.5rem)]">
                  Let&apos;s build
                  <br />
                  something{' '}
                  <span style={{ color: 'var(--accent)' }}>great</span>
                </h1>
              </div>
              <div className="flex items-end">
                <p
                  className="text-lg md:text-xl leading-relaxed max-w-md"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Have a project in mind or want to collaborate? Drop me a message
                  and I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>

            <div className="section-divider mb-16" />

            {/* Form */}
            <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
              {/* Sidebar info */}
              <div className="space-y-8">
                <div>
                  <div className="label-caps mb-3">Email</div>
                  <a
                    href={`mailto:${contactInfo?.email || ''}`}
                    className="text-sm font-medium transition-colors duration-200 hover:opacity-70"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {contactInfo?.email || ''}
                  </a>
                </div>
                <div>
                  <div className="label-caps mb-3">Based in</div>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {contactInfo?.location || ''}
                  </span>
                </div>
                <div>
                  <div className="label-caps mb-3">Socials</div>
                  <div className="flex gap-4">
                    {[
                      ...(contactInfo?.github_url ? [{ label: 'GitHub', href: contactInfo.github_url }] : []),
                      ...(contactInfo?.linkedin_url ? [{ label: 'LinkedIn', href: contactInfo.linkedin_url }] : []),
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium transition-colors duration-200"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--text-tertiary)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="name"
                    className="label-caps mb-3 block"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="label-caps mb-3 block"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input w-full"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="label-caps mb-3 block"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-input w-full resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div
                    className="py-3 px-4 text-sm font-medium"
                    style={{
                      color: 'var(--success)',
                      border: '1px solid var(--success-border)',
                      background: 'var(--success-bg)',
                    }}
                  >
                    Message sent — I&apos;ll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div
                    className="py-3 px-4 text-sm font-medium"
                    style={{
                      color: 'var(--error)',
                      border: '1px solid var(--error-border)',
                      background: 'var(--error-bg)',
                    }}
                  >
                    Something went wrong. Please try again.
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ y: isLoading ? 0 : -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}



