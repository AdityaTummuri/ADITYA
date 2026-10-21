import { profile } from '@/content/profile';

/** Two large text-link rows: the way in. */
export default function ContactLinks() {
  const row = 'block border-t border-hairline py-sm font-display text-title-lg tracking-[-0.03em] [overflow-wrap:anywhere] transition-colors duration-300 ease-out-cubic hover:text-primary md:text-headline';
  return (
    <div>
      <a href={`mailto:${profile.email}`} className={row}>{profile.email}</a>
      <a href={profile.github} className={`${row} border-b`}>github.com/AdityaTummuri</a>
    </div>
  );
}
