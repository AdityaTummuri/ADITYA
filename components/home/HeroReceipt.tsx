import ReceiptBody from '@/components/receipt/ReceiptBody';
import { home } from '@/content/pages';
import { receipts } from '@/content/receipts';

/** The open receipt on the home page: the body of `qed-a`, with a live "Check it now". Server HTML. */
export default function HeroReceipt() {
  return (
    <div className="w-full max-w-[46rem]">
      <h2 className="sr-only">{home.receiptHeading}</h2>
      <p className="quiet mb-xs font-cond text-meta text-ink-muted [--qy:1.6rem]">{home.receiptLabel}</p>
      <div className="rounded-md border border-hairline bg-surface-1 p-sm">
        <ReceiptBody receipt={receipts['qed-a']} />
      </div>
    </div>
  );
}
