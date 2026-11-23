import type { Evidence, Grade } from '../lib/qed-grade.ts';
import type { Copy } from './types';

/** Copy that lives inside the exhibits of the four rooms. `{id}` tokens are receipts. */
export const matrixCopy = {
  caption: 'Test recordings by true and predicted activity',
  corner: ['Did', 'Model said'] as const,
  f1: 'F1 by class: walk {fs-f1-walk}, sit {fs-f1-sit}, fall {fs-f1-fall}.' as Copy,
};

export type CheckState = 'passed' | 'failed' | 'notRun';

export const ladderCopy = {
  legend: 'Candidate change',
  /** In the order QEDCode runs them. */
  checks: ['Edits apply', 'Code parses', 'Scope: no test weakened', 'Risk: nothing dangerous', 'Lint', 'A test failed before, passes after', 'Related tests', 'Full suite'],
  states: { passed: 'passed', failed: 'failed', notRun: 'not run' } as Record<CheckState, string>,
};

export interface Candidate {
  title: string;
  /** Lines of code; a leading `- ` or `+ ` marks a diff line. */
  code: string[];
  checks: CheckState[];
  evidence: Evidence;
  /** What the repo's own `grade()` returns for this evidence: a grade, or null for a rejection. */
  grade: Grade | null;
  verdict: string;
  note: string;
}

const clean: CheckState[] = Array(8).fill('passed');
const proven: Evidence = { parse: true, lint: true, testsPassed: 3, codeChanged: true, weakenedTests: false, fbpa: true, fullSuiteRan: true, neededRiskApproval: false, protectedChanges: false };

/** Candidate 1 is the repo's own solution and hidden test; 2 to 4 were written for this page. */
export const candidates: Candidate[] = [
  {
    title: 'Keeps existing dashes',
    code: ['cleaned = re.sub(r"[^a-z0-9\\s-]", "", text.lower())'],
    checks: clean,
    evidence: proven,
    grade: 'A',
    verdict: 'Grade A, proven.',
    note: 'This is the repo’s own solution, and the hidden test agrees with it.',
  },
  {
    title: 'Drops existing dashes',
    code: ['cleaned = re.sub(r"[^a-z0-9\\s]", "", text.lower())'],
    checks: clean,
    evidence: proven,
    grade: 'A',
    verdict: 'Grade A, proven, and wrong.',
    note: 'The hidden test expects “Already-slugged” to become “already-slugged”. This returns “alreadyslugged”. The task never said what to do with dashes.',
  },
  {
    title: 'Weakens a test',
    code: ['- assert word_count("one two  three") == 3', '+ assert word_count("one two  three")'],
    checks: ['passed', 'passed', 'failed', 'notRun', 'notRun', 'notRun', 'notRun', 'notRun'],
    evidence: { ...proven, failedStage: 'scope', weakenedTests: true },
    grade: null,
    verdict: 'Rejected at scope.',
    note: 'A candidate may not weaken an existing test to look green, so the later checks never run.',
  },
  {
    title: 'Brings no test',
    code: ['cleaned = re.sub(r"[^a-z0-9\\s-]", "", text.lower())'],
    checks: ['passed', 'passed', 'passed', 'passed', 'passed', 'notRun', 'passed', 'passed'],
    evidence: { ...proven, fbpa: false },
    grade: 'B',
    verdict: 'Grade B, tested.',
    note: 'The tests pass, but nothing proved the exact problem.',
  },
];

export const terrainCopy = {
  sliderLabel: 'Show more of the camera frame',
  frameLabel: 'Camera frame',
  outputLabel: 'Model output',
  legend: ['Solid ground', 'Pliant vegetation', 'Mud', 'Rigid obstacle'],
};

export const kavachCopy = {
  switches: ['A payment app is open', 'The screen is being shared'] as const,
  states: {
    idle: 'Idle. It checks every {kv-idle}.',
    payment: 'Payment open, nothing shared. It checks every {kv-active}.',
    shared: 'Screen shared, no payment open. Nothing is blocked.',
    up: 'Shield up. Touches are blocked.',
    waiting: 'Sharing stopped. Clean check 1 of 2, the shield stays up.',
    dropped: 'Two clean checks. The shield drops.',
    closed: 'Payment closed. The shield drops at once.',
  } as Record<string, Copy>,
  english: 'Attention! Kavach security shield is active. Screen sharing detected during payment. Please disconnect the call immediately to protect your bank account.',
  hindi: 'ध्यान दें! कवच सुरक्षा कवच सक्रिय है। भुगतान के दौरान स्क्रीन शेयरिंग का पता चला है। कृपया अपने बैंक खाते को सुरक्षित रखने के लिए तुरंत कॉल काट दें।',
  spoken: 'The {kv-warning} is spoken aloud on the phone.' as Copy,
};

/** Strings with tokens, for tests. */
export function exhibitCopy(): string[] {
  return [
    matrixCopy.caption,
    matrixCopy.f1,
    ladderCopy.legend,
    ...ladderCopy.checks,
    ...candidates.flatMap((c) => [c.title, c.verdict, c.note]),
    ...terrainCopy.legend,
    ...Object.values(kavachCopy.states),
    kavachCopy.spoken,
    kavachCopy.english,
  ];
}
