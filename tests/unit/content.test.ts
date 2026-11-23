import { describe, expect, it } from 'vitest';
import { archive, archiveOwn, archiveTeam } from '@/content/archive';
import { commits } from '@/content/commits';
import { receipts } from '@/content/receipts';
import { rooms } from '@/content/rooms';
import { allCopy, BANNED, DATE_TOKENS, TOKEN, withoutAllowed } from './copy';

const copyIds = () => {
  const ids = new Set<string>();
  for (const s of allCopy()) for (const m of s.matchAll(TOKEN)) ids.add(m[1]);
  return ids;
};

describe('content', () => {
  it('has four rooms in order', () => {
    expect(rooms.map((r) => r.slug)).toEqual(['qedcode', 'fracsst-mamba', 'netra-ugv', 'kavach-upi']);
  });

  it('has 23 archive items with unique slugs', () => {
    expect(archive).toHaveLength(23);
    expect(archiveOwn).toHaveLength(13);
    expect(archiveTeam).toHaveLength(10);
    expect(new Set(archive.map((a) => a.slug)).size).toBe(23);
  });

  it('only uses receipt ids that exist', () => {
    const missing = [...copyIds()].filter((id) => !receipts[id] && !DATE_TOKENS.includes(id));
    expect(missing).toEqual([]);
  });

  it('uses every receipt somewhere in copy', () => {
    const used = copyIds();
    const unused = Object.keys(receipts).filter((id) => !used.has(id));
    expect(unused).toEqual([]);
  });

  it('points every room row at a receipt', () => {
    for (const r of rooms) expect(receipts[r.row.figure]).toBeDefined();
  });

  it('types no digit in any copy string', () => {
    const bad = allCopy().filter((s) => /\d/.test(withoutAllowed(s)));
    expect(bad).toEqual([]);
  });

  it('uses no em dash or en dash', () => {
    expect(allCopy().filter((s) => /[—–]/.test(s))).toEqual([]);
  });

  it('contains nothing from the banned list', () => {
    const hits: string[] = [];
    for (const s of allCopy()) for (const b of BANNED) if (s.includes(b)) hits.push(`${b} in ${s}`);
    expect(hits).toEqual([]);
  });

  it('pins the commit of every repository a receipt names', () => {
    for (const r of Object.values(receipts)) {
      if (r.kind === 'quoted' || r.kind === 'counted') expect(commits[r.repo], r.id).toMatch(/^[0-9a-f]{40}$/);
    }
  });
});
