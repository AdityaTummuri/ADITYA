/** A direct port of `grade()` in QEDCode's src/qedcode/verify/grade.py. */
export interface Evidence {
  failedStage?: string;
  parse: boolean;
  lint: boolean;
  testsPassed: number;
  codeChanged: boolean;
  weakenedTests: boolean;
  fbpa: boolean;
  fullSuiteRan: boolean;
  neededRiskApproval: boolean;
  protectedChanges: boolean;
}
export type Grade = 'A' | 'B' | 'C' | 'D';

export function grade(e: Evidence): Grade | null {
  if (e.failedStage) return null;
  const staticOk = e.parse || e.lint;
  const testsRan = e.testsPassed > 0;
  if (!staticOk && !testsRan) return 'D';
  if (!testsRan) return 'C';
  if (!e.codeChanged) return 'C';
  if (e.weakenedTests) return 'C';
  const g = e.fbpa && e.fullSuiteRan ? 'A' : 'B';
  return g === 'A' && (e.neededRiskApproval || e.protectedChanges) ? 'B' : g;
}
