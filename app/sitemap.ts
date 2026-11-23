import type { MetadataRoute } from 'next';
import { rooms } from '@/content/rooms';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    ...rooms.map((r) => ({ url: `${SITE_URL}/work/${r.slug}`, priority: 0.8 })),
    { url: `${SITE_URL}/archive`, priority: 0.6 },
    { url: `${SITE_URL}/about`, priority: 0.6 },
    { url: `${SITE_URL}/receipts`, priority: 0.6 },
  ];
}
