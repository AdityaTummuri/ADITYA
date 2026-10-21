/** Canonical site origin. Set NEXT_PUBLIC_SITE_URL in the deployment; localhost is only the build-time default. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
