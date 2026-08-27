export type WflVerdict = 'WIN' | 'FAIR' | 'LOSE';
export function calculateWfl(yourOffer: number, theirOffer: number, threshold = .08) {
  const difference = theirOffer - yourOffer;
  const percentage = yourOffer ? difference / yourOffer * 100 : theirOffer ? 100 : 0;
  const verdict: WflVerdict = Math.abs(percentage) <= threshold * 100 ? 'FAIR' : percentage > 0 ? 'WIN' : 'LOSE';
  return { yourOffer, theirOffer, difference, percentage, verdict };
}
