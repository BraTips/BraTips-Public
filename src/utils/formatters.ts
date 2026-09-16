const USD = 'USD';

export function formatMoney(value: unknown, showSign = false): string {
  const amount = Number(value ?? 0);
  const safe = Number.isFinite(amount) ? amount : 0;
  const sign = showSign && safe > 0 ? '+' : safe < 0 ? '-' : '';
  return `${sign}${USD} ${Math.abs(safe).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}
export function formatProfit(value: unknown): string { return formatMoney(value, true); }
export function formatOdds(value: unknown): string { const amount=Number(value); return Number.isFinite(amount)&&amount>0?amount.toFixed(2):'—'; }
export function formatDate(value: unknown): string { if(!value)return '—'; const date=new Date(String(value)); return Number.isNaN(date.getTime())?'—':date.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'}); }
export function formatShortDate(value: unknown): string { if(!value)return '—'; const raw=String(value); const date=/^\d{4}-\d{2}-\d{2}$/.test(raw)?new Date(`${raw}T00:00:00Z`):new Date(raw); return Number.isNaN(date.getTime())?'—':date.toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
export function formatDateTime(value: unknown): string { if(!value)return '—'; const date=new Date(String(value)); return Number.isNaN(date.getTime())?'—':date.toLocaleString(undefined,{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
export function formatTime(value: unknown): string { if(!value)return '—'; const date=new Date(String(value)); return Number.isNaN(date.getTime())?'—':date.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}); }
export function formatNumber(value: unknown): string { const n=Number(value??0); return Number.isFinite(n)?n.toLocaleString():'0'; }
export function formatPercent(value: unknown, decimals=1): string { const n=Number(value); return Number.isFinite(n)?`${n.toFixed(decimals)}%`:'—'; }
