import type { MetadataRoute } from 'next';
import { caseStudyProjects } from '@/content/projects';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    ...caseStudyProjects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, priority: 0.7 })),
  ];
}
