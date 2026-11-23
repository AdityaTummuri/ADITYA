import type { NextConfig } from 'next';

/** Every old case-study URL still lands somewhere that explains it. */
const moved: [string, string][] = [
  ['/work', '/#work'],
  ['/work/rotormind', '/archive#removed'],
  ['/work/lumina', '/archive#removed'],
  ['/work/the-palesignal', '/archive#removed'],
  ['/work/vocal-biomarker-edge', '/archive#vocal-biomarker-edge'],
  ['/work/my-terminal', '/archive#omen-terminal'],
  ['/work/hp-omen-fan-control', '/archive#hp-omen-fan-control'],
  ['/work/ghostos-x', '/archive#ghostos-x'],
  ['/work/trapsight', '/archive#trapsight'],
];

const nextConfig: NextConfig = {
  async redirects() {
    return moved.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
