// Shared formatting helpers.
// Previously every view re-implemented its own money/date formatter, which is how the
// app ended up showing GHS in one place, USD in another and EUR in a third. Everything
// that displays money or dates should go through these so the whole app stays consistent.

/** All in-app money values are USD. Signed=true prefixes a '+' for positive amounts. */
export function formatMoney(v: any, signed = false): string {
  const n = Number(v || 0);
  const sign = signed && n >= 0 ? '+' : '';
  return `USD ${sign}${n.toFixed(2)}`;
}

export function formatPercent(v: any): string {
  return v == null ? '—' : `${Number(v).toFixed(1)}%`;
}

export function formatDate(v?: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!v) return '—';
  return new Date(v).toLocaleDateString(undefined, opts || { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(v?: string | null): string {
  if (!v) return '—';
  return new Date(v).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}
