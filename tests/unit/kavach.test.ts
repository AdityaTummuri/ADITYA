import { describe, expect, it } from 'vitest';
import { initialKavach, initialView, intervalFor, kavachReducer, viewReducer, type KavachEvent, type KavachState } from '@/lib/kavach';

const run = (events: KavachEvent[], from: KavachState = initialKavach) => events.reduce(kavachReducer, from);

describe('kavach', () => {
  it('raises the shield within one tick when both are on', () => {
    expect(run(['toggleUpi', 'toggleShare', 'tick']).shield).toBe(true);
    expect(run(['toggleShare', 'toggleUpi']).shield).toBe(true);
  });
  it('never raises the shield for sharing alone', () => {
    expect(run(['toggleShare', 'tick', 'tick', 'tick']).shield).toBe(false);
  });
  it('keeps the shield after one clean tick and drops it after two', () => {
    const up = run(['toggleUpi', 'toggleShare', 'tick']);
    const one = run(['toggleShare', 'tick'], up);
    expect(one.shield).toBe(true);
    expect(one.clean).toBe(1);
    expect(run(['tick'], one).shield).toBe(false);
  });
  it('resets the clean count when sharing comes back', () => {
    const up = run(['toggleUpi', 'toggleShare', 'tick', 'toggleShare', 'tick']);
    const back = run(['toggleShare', 'tick'], up);
    expect(back.clean).toBe(0);
    expect(back.shield).toBe(true);
  });
  it('drops the shield at once when the payment closes', () => {
    const up = run(['toggleUpi', 'toggleShare', 'tick']);
    expect(run(['toggleUpi'], up)).toMatchObject({ shield: false, clean: 0 });
  });
  it('checks every 1000 ms with a payment and every 3000 ms without', () => {
    expect(intervalFor({ upi: true })).toBe(1000);
    expect(intervalFor({ upi: false })).toBe(3000);
  });
  it('does not change on a toggle of sharing until the next tick', () => {
    const up = run(['toggleUpi', 'toggleShare', 'tick']);
    expect(kavachReducer(up, 'toggleShare').shield).toBe(true);
    expect(kavachReducer(up, 'toggleShare').clean).toBe(0);
  });
});

describe('kavach messages', () => {
  const view = (events: KavachEvent[]) => events.reduce(viewReducer, initialView);
  it('walks the states in the plan', () => {
    expect(initialView.msg).toBe('idle');
    expect(view(['toggleUpi']).msg).toBe('payment');
    expect(view(['toggleShare']).msg).toBe('shared');
    expect(view(['toggleUpi', 'toggleShare', 'tick']).msg).toBe('up');
    expect(view(['toggleShare', 'toggleUpi']).msg).toBe('up');
    expect(view(['toggleUpi', 'toggleShare', 'tick', 'toggleShare', 'tick']).msg).toBe('waiting');
    expect(view(['toggleUpi', 'toggleShare', 'tick', 'toggleShare', 'tick', 'tick']).msg).toBe('dropped');
    expect(view(['toggleUpi', 'toggleShare', 'tick', 'toggleUpi']).msg).toBe('closed');
  });
  it('keeps "the shield drops" on screen through quiet ticks', () => {
    const v = view(['toggleUpi', 'toggleShare', 'tick', 'toggleShare', 'tick', 'tick', 'tick', 'tick']);
    expect(v.msg).toBe('dropped');
  });
});
