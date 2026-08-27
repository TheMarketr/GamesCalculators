export function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(value);
}
export function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 seconds';
  const hours = Math.floor(seconds / 3600); const minutes = Math.floor(seconds % 3600 / 60); const secs = Math.round(seconds % 60);
  return [hours && `${hours}h`, minutes && `${minutes}m`, secs && `${secs}s`].filter(Boolean).join(' ');
}
