import type { Project, ProjectGroup } from './types';

const gh = (r: string) => `https://github.com/AdityaTummuri/${r}`;

export const projects: Project[] = [
  {
    slug: 'rotormind', title: 'RotorMind / MotorSafe', group: 'embedded-robotics', category: 'Embedded & Robotics', status: 'Prototype',
    summary: 'A predictive motor-health prototype that reads sensor signals to flag abnormal behaviour.',
    tags: ['Sensors', 'Signal analysis', 'Embedded'],
    outcome: '3× faster anomaly detection vs. threshold-only baseline',
    tradeoff: 'Chose time-domain statistical features over a full FFT pipeline to stay within the MCU’s RAM budget and avoid floating-point library dependencies.',
    footnote: 'The hardest part was sensor calibration drift across temperature ranges. Ended up implementing a running baseline correction that re-zeroes every 500 samples.',
    question: 'Can a motor tell you it’s unwell before it fails?',
    featured: true, order: 1,
  },
  {
    slug: 'netra-ugv', title: 'NETRA-UGV', group: 'embedded-robotics', category: 'Embedded & Robotics', status: 'Collaborative',
    summary: 'Team work on terrain segmentation for an unmanned ground vehicle.',
    tags: ['Segmentation', 'Computer vision', 'UGV'],
    outcome: '92% mIoU on custom off-road test set',
    tradeoff: 'Used a lightweight encoder-decoder over a heavier transformer backbone because inference had to run at 15 fps on an embedded GPU with a 10W power envelope.',
    footnote: 'Label noise in the training set was the real bottleneck — spent more time writing annotation QA scripts than training the model itself.',
    question: 'Where is it safe for a ground vehicle to drive?',
    repo: gh('Netra-UGV'),
    featured: true, order: 2,
  },
  {
    slug: 'fracsst-mamba', title: 'FracSST-Mamba', group: 'ai-ml', category: 'AI/ML', status: 'Research prototype',
    summary: 'Exploring state-space sequence models for human activity recognition from radar returns.',
    tags: ['Radar', 'Mamba / SSM', 'PyTorch'],
    outcome: '4.2% accuracy gain over LSTM baseline on micro-Doppler dataset',
    tradeoff: 'Mamba’s linear-time sequence scanning fits long radar sweeps where transformers hit quadratic memory walls. Trade-off: less interpretable attention maps.',
    footnote: 'Fractional Fourier features improved separability of overlapping gestures but required careful numerical stability — clamped magnitudes to avoid NaN gradients during training.',
    question: 'What does a person’s movement look like to a radar?',
    repo: gh('FracSST-Mamba'),
    featured: true, order: 3,
  },
  {
    slug: 'vocal-biomarker-edge', title: 'Vocal Biomarker Edge', group: 'ai-ml', category: 'AI/ML', status: 'Prototype',
    summary: 'Client-side acoustic feature extraction from voice recordings, kept entirely on the device.',
    tags: ['DSP', 'Audio features', 'Browser'],
    outcome: '<120ms feature extraction on mid-range Android Chrome',
    tradeoff: 'Runs entirely in the browser via Web Audio API + WASM instead of a server roundtrip — eliminates privacy concerns but limits model size to what fits in a ServiceWorker cache.',
    footnote: 'Safari’s AudioWorklet implementation had subtle timing bugs that caused frame drops. Fell back to ScriptProcessorNode on WebKit with a 512-sample buffer compromise.',
    repo: gh('vocal-biomarker-edge'),
    featured: false, order: 4,
  },
  {
    slug: 'kavach-upi', title: 'Kavach-UPI', group: 'systems', category: 'Systems', status: 'Prototype',
    summary: 'An on-device Android security prototype for UPI payment flows.',
    tags: ['Android', 'On-device', 'Security'],
    outcome: 'Zero-network-call verification in <80ms',
    tradeoff: 'On-device verification via Android Keystore attestation rather than server-side OTP — trades server control for latency and offline capability.',
    footnote: 'Had to handle the case where Keystore hardware backing isn’t available on budget devices — falls back to software keys with a clear user warning.',
    repo: gh('Kavach-UPI'),
    featured: false, order: 5,
  },
  {
    slug: 'my-terminal', title: 'MY_TERMINAL', group: 'systems', category: 'Systems', status: 'Tooling',
    summary: 'A portable terminal environment — shell, prompt and tooling I carry between machines.',
    tags: ['Shell', 'Dotfiles', 'Portable'],
    outcome: '<2s full bootstrap on a fresh Debian install',
    tradeoff: 'Single idempotent setup script over a full config manager like Ansible — simpler to debug when something breaks on an unfamiliar distro.',
    footnote: 'The trickiest part is font and locale detection across WSL, native Linux, and macOS — ended up probing $TERM_PROGRAM and os-release to pick code paths.',
    question: 'Can one terminal follow me between every machine I touch?',
    repo: gh('MY_TERMINAL'),
    featured: true, order: 6,
  },
  {
    slug: 'hp-omen-fan-control', title: 'HP OMEN CPU Fan Control', group: 'systems', category: 'Systems', status: 'Tooling',
    summary: 'CPU fan control for HP OMEN laptops on Linux, where vendor tooling doesn’t exist.',
    tags: ['Linux', 'Hardware I/O', 'Thermals'],
    outcome: '15°C peak temperature drop under sustained load',
    tradeoff: 'Direct EC register writes via /dev/port over a kernel module approach — faster to iterate but requires root and careful validation per BIOS revision.',
    footnote: 'Fail-safe is critical: if the script crashes, the EC reverts to BIOS-default fan curves within 3 seconds. Tested by kill -9 during thermal stress.',
    repo: gh('Hp-OMEN-cpu-fan-control'),
    featured: false, order: 7,
  },
  {
    slug: 'ghostos-x', title: 'GhostOS-X', group: 'systems', category: 'Systems', status: 'Tooling',
    summary: 'Scripts and configuration for automating my everyday Linux workflow.',
    tags: ['Linux', 'Shell', 'Automation'],
    outcome: '12 manual steps → 1 command for workspace setup',
    tradeoff: 'Bash scripts over a declarative tool like Nix — lower learning curve, easier to share with teammates who just need it to work.',
    footnote: 'Idempotency is enforced by checking state before mutating — every function exits cleanly if the target state already exists.',
    repo: gh('ghostos-x'),
    featured: false, order: 8,
  },
  {
    slug: 'trapsight', title: 'TrapSight', group: 'experiments', category: 'Experiments', status: 'Concept',
    summary: 'A browser concept for auditing checkout pages for dark patterns.',
    tags: ['Browser', 'UX audit'],
    event: 'Next Byte Hacks V2',
    outcome: 'Flags 6 common dark-pattern categories in DOM',
    tradeoff: 'Content-script DOM heuristics over ML classification — more transparent, no model to ship, and easier for users to verify flagged elements.',
    footnote: 'Biggest false-positive source: legitimate urgency indicators (‘only 2 left’) vs. manufactured scarcity. Currently uses a conservative allowlist.',
    repo: gh('TrapSight'),
    featured: false, order: 9,
  },
  {
    slug: 'lumina', title: '3d-website / Lumina', group: 'experiments', category: 'Experiments', status: 'Experiment',
    summary: 'Interactive 3D gallery and showroom experiments on the web.',
    tags: ['WebGL', '3D', 'Web'],
    event: 'WebChamp Hackathon',
    outcome: '60fps on M1 MacBook Air at 1440p',
    tradeoff: 'Three.js over raw WebGL for iteration speed — the abstraction cost is acceptable for a gallery where draw calls stay under 200.',
    footnote: 'LOD switching and texture compression (KTX2/Basis) were essential to keep the initial load under 3MB on mobile connections.',
    repo: gh('3d-website'),
    featured: false, order: 10,
  },
  {
    slug: 'the-palesignal', title: 'The-PaleSignal', group: 'experiments', category: 'Experiments', status: 'Concept',
    summary: 'An interactive sci-fi terminal concept built around narrative and text interfaces.',
    tags: ['Interactive fiction', 'Terminal UI'],
    outcome: '3 branching narrative paths, ~8 min playthrough',
    tradeoff: 'Finite state machine over a parser-based adventure engine — simpler to author and debug, at the cost of less dynamic world interaction.',
    footnote: 'Text rendering timing is hand-tuned per line to create a teletype feel without frustrating the reader — settled on 28ms/char with a skip-ahead on any keypress.',
    featured: false, order: 11,
  },
  {
    slug: 'leaselens', title: 'LeaseLens', group: 'ai-ml', category: 'AI/ML / LegalTech', status: 'Hackathon', event: 'PromptWars Virtual 2026',
    summary: 'Multi-agent legal AI system that analyzes residential rent agreements against empirical regional market baselines to surface clauses deviating statistically from the norm.',
    tags: ['Python', 'HTML', 'JavaScript', 'CSS', 'Shell'], repo: gh('LeaseLens'),
    featured: false, order: 12,
  },
  {
    slug: 'moneyball-2', title: 'Moneyball 2.0', group: 'products-analytics', category: 'Sports Analytics', status: 'Open source',
    summary: 'Interactive open-source web app for sports GMs to replicate departed star players using algorithmic similarity scoring, cost-efficiency metrics, and blind scouting.',
    tags: ['Python', 'Streamlit'], repo: gh('MoneyBall-2.0'),
    featured: false, order: 13,
  },
  {
    slug: 'armmimic', title: 'ArmMimic (Exo-Mimic)', group: 'embedded-robotics', category: 'Robotics & Embedded', status: 'Prototype',
    summary: 'Real-time teleoperation system mapping human arm gesture kinematics to a multi-DOF robotic manipulator via ESP32 and Raspberry Pi controllers.',
    tags: ['Python', 'C++'], repo: gh('ArmMimic'),
    featured: false, order: 14,
  },
  {
    slug: 'scopecreep-ai', title: 'ScopeCreep.ai', group: 'ai-ml', category: 'Developer Productivity / AI Agents', status: 'Hackathon', event: 'Mind the Product Hackathon',
    summary: 'AI-powered sprint watchdog that catches silent scope creep, PR feature drift, and architectural misalignment before releases derail.',
    tags: ['JavaScript', 'Python'], repo: gh('ScopeCreep.ai'),
    featured: false, order: 15,
  },
  {
    slug: 'fifa-nexusmatrix', title: 'FIFA NexusMatrix', group: 'ai-ml', category: 'Computer Vision & AR', status: 'Hackathon', event: 'FIFA World Cup 2026 Innovation',
    summary: 'Combines macroscopic fluid dynamics crowd predictions with real-time WebAR navigation overlays for FIFA World Cup 2026 stadium egress.',
    tags: ['Python', 'TypeScript'], repo: gh('FIFA_NexusMatrix'),
    featured: false, order: 16,
  },
  {
    slug: 'ascii-cam', title: 'ASCII_CAM', group: 'experiments', category: 'Mobile / Creative App', status: 'Released',
    summary: 'High-performance ASCII camera app in Flutter translating live camera feeds into stylized ASCII art. Cross-platform: Android, Linux, Windows.',
    tags: ['Dart', 'Flutter', 'Kotlin', 'C++'], repo: gh('ASCII_CAM'),
    featured: false, order: 17,
  },
  {
    slug: 'sudo-shoot', title: 'SUDO_SHOOT', group: 'experiments', category: 'Game Engine / Low-Level Graphics', status: 'Project',
    summary: 'Ultra-stylized 3D tactical terminal shooter running inside the terminal, built in Go using Ebitengine.',
    tags: ['Go'], repo: gh('SUDO_SHOOT'),
    featured: false, order: 18,
  },
  {
    slug: 'rosterresilience', title: 'RosterResilience', group: 'products-analytics', category: 'Sports Science / Simulation', status: 'Open source',
    summary: 'Micro-climate physics engine simulating physiological fatigue and performance degradation of athletes across varied ambient conditions.',
    tags: ['Python', 'Streamlit'], repo: gh('RosterResilience'),
    featured: false, order: 19,
  },
  {
    slug: 'multiboot-toolkit', title: 'Multiboot Toolkit (cool_ventoy)', group: 'systems', category: 'DevOps / System Administration', status: 'Tooling',
    summary: 'Professional Ventoy-based multiboot USB theme and configuration project for IT technicians and system admins.',
    tags: ['Ventoy', 'DevOps'], repo: gh('cool_ventoy'),
    featured: false, order: 20,
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);

export const projectsByGroup = projects.reduce(
  (acc, p) => {
    acc[p.group].push(p);
    return acc;
  },
  { 'embedded-robotics': [], 'ai-ml': [], systems: [], experiments: [], 'products-analytics': [] } as Record<ProjectGroup, Project[]>,
);

export const caseStudyProjects = projects.filter((p) => p.tradeoff);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Splits an outcome sentence into a headline number and its label for a stat tile. */
export function splitOutcome(outcome: string): { value: string; label: string } {
  const lead = outcome.match(/^([<~]?\d[\d.,]*\s?[%×x°\w]*?)\s+(.+)$/);
  if (lead && /^[<~]?\d/.test(lead[1])) return { value: lead[1], label: lead[2] };
  const any = outcome.match(/[<~]?\d[\d.,]*[%×x°\w]*/);
  if (any) return { value: any[0], label: outcome };
  const [first, ...rest] = outcome.split(' ');
  return { value: first, label: rest.join(' ') };
}

/** Previous/next in a cycle: featured projects cycle among themselves, the rest among the other case studies. */
export function adjacentProject(slug: string): { prev: Project; next: Project } | undefined {
  const me = getProject(slug);
  if (!me) return undefined;
  const pool = me.featured ? featuredProjects : caseStudyProjects.filter((p) => !p.featured);
  const i = pool.findIndex((p) => p.slug === slug);
  if (i < 0) return undefined;
  return { prev: pool[(i - 1 + pool.length) % pool.length], next: pool[(i + 1) % pool.length] };
}
