import type { MetadataRoute } from 'next';
import { notes } from '@/content/notes';
import { caseStudyProjects } from '@/content/projects';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    ...caseStudyProjects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, priority: 0.7 })),
    ...notes.map((n) => ({ url: `${SITE_URL}/notes/${n.slug}`, priority: 0.6 })),
  ];
}
