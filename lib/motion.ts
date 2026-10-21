/** Motion constants shared by CSS-in-JS and GSAP (values from DESIGN.md / teardown §5). */
export const EASE_OUT = 'cubic-bezier(.215,.61,.355,1)';
export const EASE_IN_OUT = 'cubic-bezier(.645,.045,.355,1)';
export const DUR = { hover: 0.3, slide: 0.5, wipe: 1.3 } as const;
