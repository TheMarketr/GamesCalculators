export const GTA_VI_RELEASE_ISO = '2026-11-19T00:00:00-08:00';
export function calculateCountdown(now: number, target = new Date(GTA_VI_RELEASE_ISO).getTime()) {
  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(totalSeconds / 86400); const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60); const seconds = totalSeconds % 60;
  return { totalSeconds, days, hours, minutes, seconds, released: totalSeconds === 0 };
}
