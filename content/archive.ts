import type { ArchiveItem } from './types';

/** "On my own", in page order. */
export const archiveOwn: ArchiveItem[] = [
  { slug: 'saans', title: 'Saans', repo: 'Saans', line: 'Plans a household’s day around air pollution, in English or Hindi. The language model may never write a digit.', proof: '{ar-saans}, CI green' },
  { slug: 'qedcode-benchy', title: 'QEDCode-benchy', repo: 'QEDCode-benchy', line: 'A benchmark that runs the same model alone and through QEDCode, judged by hidden tests.', proof: '{ar-benchy} in its standard suite' },
  { slug: 'qedcode-agentskill', title: 'QEDCode-AgentSkill', repo: 'QEDCode-AgentSkill', line: 'Teaches coding agents how to use QEDCode.', proof: '{ar-agentskill} commits' },
  { slug: 'occasio', title: 'Occasio', repo: 'Occasio', line: 'An event planner. A rules engine decides every rupee, the model only writes the words.', proof: '{ar-occasio}', live: 'https://occasio-zeta.vercel.app' },
  { slug: 'leaselens', title: 'LeaseLens', repo: 'LeaseLens', line: 'Flags rent-agreement clauses that differ from market norms. PromptWars Virtual 2026.', proof: '{ar-leaselens} commits', live: 'https://lease-lens-ten.vercel.app' },
  { slug: 'fifa-nexusmatrix', title: 'FIFA NexusMatrix', repo: 'FIFA_NexusMatrix', line: 'Designed to forecast crowd density in stadiums {ar-fifa-ahead} ahead.', proof: '{ar-fifa}', live: 'https://fifa-nexus-matrix.vercel.app' },
  { slug: 'companion-ai', title: 'companion.AI', repo: 'companion.AI', line: 'An attendance and timetable companion with deterministic maths.', proof: '{ar-companion}' },
  { slug: 'ghostos-x', title: 'GhostOS X', repo: 'ghostos-x', line: 'Predicts your next desktop action with a time-decayed Markov chain, in standard-library Python.', proof: '{ar-ghostos}, the most of any of my repos' },
  { slug: 'hp-omen-fan-control', title: 'HP OMEN Fan Control', repo: 'Hp-OMEN-cpu-fan-control', line: 'A Tkinter front end to nbfc-linux, for a laptop the vendor does not support on Linux.', proof: '{ar-omen}' },
  { slug: 'omen-terminal', title: 'OMEN Terminal', repo: 'MY_TERMINAL', line: 'Kitty, Zsh and Starship with a dry-run installer for three distros.', proof: '{ar-terminal}' },
  { slug: 'rosterresilience', title: 'RosterResilience', repo: 'RosterResilience', line: 'How altitude and weather bend a ball’s flight.', proof: '{ar-roster} commits' },
  { slug: 'sudo-shoot', title: 'SUDO_SHOOT', repo: 'SUDO_SHOOT', line: 'A text-textured raycasting shooter written in Go.', proof: '{ar-sudo} per frame' },
  { slug: 'multiboot-toolkit', title: 'Multiboot Toolkit', repo: 'cool_ventoy', line: 'A Ventoy boot theme.', proof: '{ar-ventoy}' },
];

/** "With a team": the proof says how many commits are Aditya’s. */
export const archiveTeam: ArchiveItem[] = [
  { slug: 'vocal-biomarker-edge', title: 'Vocal Biomarker Edge', repo: 'vocal-biomarker-edge', line: 'Pitch, jitter and shimmer from a voice, in the browser. I wrote the algorithms, Lochan B the dashboard.', proof: '{ar-vocal}, CI green, {ar-vocal-commits} commits mine' },
  { slug: 'trapsight', title: 'TrapSight', repo: 'TrapSight', line: 'A Chrome extension that freezes checkout and reads the fine print. Next Byte Hacks V2.', proof: '{ar-trapsight} commits mine' },
  { slug: 'scopecreep-ai', title: 'ScopeCreep.ai', repo: 'ScopeCreep.ai', line: 'Flags work that falls outside the spec. Mind the Product hackathon.', proof: '{ar-scopecreep} commits mine', live: 'https://scopecreep-ai.vercel.app' },
  { slug: 'moneyball-2', title: 'Moneyball 2.0', repo: 'MoneyBall-2.0', line: 'Finds cheaper look-alikes of NBA stars.', proof: '{ar-moneyball}', live: 'https://moneyball-2.streamlit.app' },
  { slug: 'silverlink', title: 'SilverLink', repo: 'silverlink', line: 'Keeps older people connected to the family looking after them.', proof: '{ar-silverlink} commits mine' },
  { slug: 'guardian-link', title: 'guardian_link', repo: 'guardian_link', line: 'A child-protection and digital forensics platform.', proof: '{ar-guardian} commits mine' },
  { slug: 'aqua-pulse', title: 'aqua-pulse', repo: 'aqua-pulse', line: 'A software-defined sonar payload and its ground station.', proof: '{ar-aqua} commits mine' },
  { slug: 'vayugrid', title: 'VayuGrid', repo: 'VayuGrid', line: 'Air-quality sensing and planning across India.', proof: '{ar-vayu} commits mine' },
  { slug: 'specrag', title: 'specRAG', repo: 'specRAG', line: 'Checks firmware against the chip’s datasheet.', proof: '{ar-specrag} commits mine' },
  { slug: 'ideation-goat', title: 'ideation-goat', repo: 'ideation-goat', line: 'Ranks open-source libraries for a project idea and links every figure to its source.', proof: '{ar-goat} commits mine' },
];

export const archive: ArchiveItem[] = [...archiveOwn, ...archiveTeam];
