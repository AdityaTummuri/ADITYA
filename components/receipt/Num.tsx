import { receipts } from '@/content/receipts';

/**
 * A number you can pull: an underlined link to its receipt. A plain anchor, so it works with no
 * JavaScript; with JavaScript the slip opens in place (see ReceiptSlip).
 */
export default function Num({ id, capitalize = false }: { id: string; capitalize?: boolean }) {
  const r = receipts[id];
  if (!r) throw new Error(`Unknown receipt id: ${id}`);
  const value = capitalize ? r.value.charAt(0).toUpperCase() + r.value.slice(1) : r.value;
  return (
    <a href={`/receipts#${id}`} data-receipt={id} className="num">
      {value}
      <span className="sr-only">, see the receipt</span>
    </a>
  );
}
