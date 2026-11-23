/** The shield's decision, as ThreatStateEvaluator and KavachAccessibilityService make it, one tick at a time. */
export interface KavachState {
  upi: boolean;
  share: boolean;
  shield: boolean;
  /** Consecutive checks that found no shared screen while a payment is open. */
  clean: number;
}
export type KavachEvent = 'toggleUpi' | 'toggleShare' | 'tick';

/** Two clean checks before the shield drops. */
export const CLEAN_CHECKS = 2;
export const ACTIVE_INTERVAL_MS = 1000;
export const IDLE_INTERVAL_MS = 3000;

export const initialKavach: KavachState = { upi: false, share: false, shield: false, clean: 0 };

/** Milliseconds between checks: fast during a payment, slow otherwise. */
export function intervalFor(s: Pick<KavachState, 'upi'>): number {
  return s.upi ? ACTIVE_INTERVAL_MS : IDLE_INTERVAL_MS;
}

function evaluate(s: KavachState): KavachState {
  if (!s.upi) return { ...s, shield: false, clean: 0 };
  if (s.share) return { ...s, shield: true, clean: 0 };
  const clean = s.clean + 1;
  return { ...s, clean, shield: clean >= CLEAN_CHECKS ? false : s.shield };
}

export function kavachReducer(s: KavachState, e: KavachEvent): KavachState {
  const base: KavachState = { upi: s.upi, share: s.share, shield: s.shield, clean: s.clean };
  switch (e) {
    case 'toggleUpi': {
      const next = { ...base, upi: !base.upi, clean: 0 };
      // the source evaluates at once when the payment context changes
      return next.upi ? evaluate(next) : { ...next, shield: false };
    }
    case 'toggleShare':
      // nothing changes by itself until the next tick
      return { ...base, share: !base.share };
    case 'tick':
      return evaluate(base);
  }
}

export type KavachMessage = 'idle' | 'payment' | 'shared' | 'up' | 'waiting' | 'dropped' | 'closed';

function describe(prev: KavachState, next: KavachState): KavachMessage {
  if (next.shield) return next.clean > 0 ? 'waiting' : 'up';
  if (prev.shield) return next.upi ? 'dropped' : 'closed';
  if (next.upi) return 'payment';
  return next.share ? 'shared' : 'idle';
}

/** State plus the status line that describes it. */
export interface KavachView extends KavachState { msg: KavachMessage }
export const initialView: KavachView = { ...initialKavach, msg: 'idle' };

export function viewReducer(v: KavachView, e: KavachEvent): KavachView {
  const next = kavachReducer(v, e);
  // a tick that changes nothing you can see keeps the line you were reading (for example "The shield drops")
  const msg = e === 'tick' && !v.shield && !next.shield ? v.msg : describe(v, next);
  return { ...next, msg };
}
