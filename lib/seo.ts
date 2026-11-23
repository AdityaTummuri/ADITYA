/**
 * Canonical site origin. On Vercel it is the project's real production domain, so it can never point
 * at an address that does not exist; elsewhere NEXT_PUBLIC_SITE_URL, then localhost. Server only.
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (vercel ? `https://${vercel}` : (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')).replace(/\/$/, '');
