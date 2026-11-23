import { profile } from './profile';

export interface NavLink { label: string; href: string }

export const menuLinks: NavLink[] = [
  { label: 'Start', href: '/' },
  { label: 'Work', href: '/#work' },
  { label: 'Archive', href: '/archive' },
  { label: 'About', href: '/about' },
  { label: 'Receipts', href: '/receipts' },
  { label: 'Contact', href: '/#contact' },
];

export const socials: NavLink[] = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Email', href: `mailto:${profile.email}` },
];

/** The five places the footer row of inner pages links to. */
export const footerLinks: NavLink[] = [
  { label: 'Start', href: '/' },
  { label: 'Work', href: '/#work' },
  { label: 'Archive', href: '/archive' },
  { label: 'About', href: '/about' },
  { label: 'Receipts', href: '/receipts' },
];
