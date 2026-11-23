import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import CheckAll from '@/components/receipt/CheckAll';
import ReceiptBody from '@/components/receipt/ReceiptBody';
import PageHead from '@/components/ui/PageHead';
import { KIND_WORDS, RECEIPT_GROUPS, receiptGroup, receipts } from '@/content/receipts';
import { receiptsPage } from '@/content/pages';

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
      <PageHead kicker="Proof" title={receiptsPage.h1} tone="pink">
        <p>{receiptsPage.intro}</p>
      </PageHead>
      <div className="container-8bit pb-2xl">
        <div className="max-w-[80rem]">
          <CheckAll />
          <noscript>
            <p className="text-body-sm text-ink-muted">{receiptsPage.noscript}</p>
          </noscript>
        </div>
        {RECEIPT_GROUPS.map((group) => (
          <section key={group} aria-labelledby={`group-${group}`} className="mt-xl">
            <h2 id={`group-${group}`} className="sticker sticker-sun !text-[1.6rem]">{group}</h2>
            <ul className="mt-sm grid gap-x-[3.2rem] lg:grid-cols-2">
              {all.filter((r) => receiptGroup(r) === group).map((r) => (
                <li key={r.id} id={r.id} className="receipt-item scroll-mt-[12rem] border-t-[0.2rem] border-ink px-xxs py-sm">
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
