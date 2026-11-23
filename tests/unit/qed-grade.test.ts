import { describe, expect, it } from 'vitest';
import { grade, type Evidence } from '@/lib/qed-grade';

const base: Evidence = { parse: true, lint: true, testsPassed: 3, codeChanged: true, weakenedTests: false, fbpa: true, fullSuiteRan: true, neededRiskApproval: false, protectedChanges: false };
const g = (over: Partial<Evidence>) => grade({ ...base, ...over });

describe('grade', () => {
  it('rejects a candidate that failed a stage', () => expect(g({ failedStage: 'scope' })).toBeNull());
  it('gives D when nothing was checked', () => expect(g({ parse: false, lint: false, testsPassed: 0 })).toBe('D'));
  it('gives C when only static checks passed', () => expect(g({ testsPassed: 0 })).toBe('C'));
  it('gives C when the code did not change', () => expect(g({ codeChanged: false })).toBe('C'));
  it('gives C when a test was weakened', () => expect(g({ weakenedTests: true })).toBe('C'));
  it('gives A with a fail-before pass-after test and the full suite', () => expect(g({})).toBe('A'));
  it('gives B without a fail-before pass-after test', () => expect(g({ fbpa: false })).toBe('B'));
  it('gives B when the full suite did not run', () => expect(g({ fullSuiteRan: false })).toBe('B'));
  it('caps A at B when a risk needed approval', () => expect(g({ neededRiskApproval: true })).toBe('B'));
  it('caps A at B when protected files changed', () => expect(g({ protectedChanges: true })).toBe('B'));
  it('stays B when B was capped further', () => expect(g({ fbpa: false, protectedChanges: true })).toBe('B'));
  it('lets lint carry the static checks when parsing is off', () => expect(g({ parse: false, testsPassed: 0 })).toBe('C'));
});

describe('the four candidates of the exhibit', () => {
  it('give A, A, rejected, B, and the marks agree with the grade', async () => {
    const { candidates } = await import('@/content/exhibits');
    expect(candidates.map((c) => grade(c.evidence))).toEqual(['A', 'A', null, 'B']);
    for (const c of candidates) {
      expect(grade(c.evidence)).toBe(c.grade);
      expect(c.checks).toHaveLength(8);
      // a rejection stops at the first failed check and nothing after it runs
      const failed = c.checks.indexOf('failed');
      if (failed >= 0) expect(c.checks.slice(failed + 1).every((s) => s === 'notRun')).toBe(true);
      expect(Boolean(c.evidence.failedStage)).toBe(failed >= 0);
    }
  });
});
