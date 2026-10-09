import { ButtonLink } from '@/components/ui/Button';
import { Emphasis } from '@/components/ui/Emphasis';
import { pages } from '@/content/site';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="t-mono mb-6 text-accent">404</p>
      <h1 className="t-h1 max-w-[16ch] text-fg">
        <Emphasis text={pages.notFound.title} />
      </h1>
      <p className="t-lead mt-6">{pages.notFound.body}</p>
      <div className="mt-10">
        <ButtonLink href="/">{pages.notFound.cta}</ButtonLink>
      </div>
    </section>
  );
}
