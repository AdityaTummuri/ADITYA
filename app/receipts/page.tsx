import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import CheckAll from '@/components/receipt/CheckAll';
import ReceiptBody from '@/components/receipt/ReceiptBody';
import { KIND_WORDS, RECEIPT_GROUPS, receiptGroup, receipts } from '@/content/receipts';
import { receiptsPage } from '@/content/pages';
import SetLook from '@/components/work/SetLook';

const DESCRIPTION = 'Where every number on this site comes from, and a button to check it.';

export const metadata: Metadata = {
  title: 'Receipts',
  description: DESCRIPTION,
  openGraph: { title: 'Receipts', description: DESCRIPTION, url: '/receipts' },
  alternates: { canonical: '/receipts' },
};

export default function ReceiptsPage() {
  const all = Object.values(receipts);
  return (
    <>
      <SetLook look="grid" />
      <div className="container-8bit pb-2xl pt-[calc(var(--header-height)+4rem)] md:pt-[16rem]">
        <div className="quiet max-w-[80rem]">
          <h1 tabIndex={-1} className="font-display text-display-md font-medium outline-none [text-wrap:balance]">{receiptsPage.h1}</h1>
          <p className="prose-measure mt-xs text-title-md text-ink-muted">{receiptsPage.intro}</p>
          <div className="mt-md">
            <CheckAll />
            <noscript>
              <p className="text-body-sm text-ink-muted">{receiptsPage.noscript}</p>
            </noscript>
          </div>
        </div>
        {RECEIPT_GROUPS.map((group) => (
          <section key={group} aria-labelledby={`group-${group}`} className="quiet mt-2xl">
            <h2 id={`group-${group}`} className="font-display text-title-lg">{group}</h2>
            <ul className="mt-sm grid gap-x-[3.2rem] lg:grid-cols-2">
              {all.filter((r) => receiptGroup(r) === group).map((r) => (
                <li key={r.id} id={r.id} className="receipt-item scroll-mt-[12rem] border-t border-hairline py-sm">
                  <ReceiptBody receipt={r} as="h3" permalink={false} />
                  <p className="mt-xxs text-body-sm text-ink-subtle">{KIND_WORDS[r.kind]}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <SiteFooter links />
    </>
  );
}
