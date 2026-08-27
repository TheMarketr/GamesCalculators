import type { SelectedValueItem } from '../../../data/types';
export interface TradeResult { yourTotal: number; theirTotal: number; difference: number; percentage: number; verdict: 'Good' | 'Fair' | 'Bad'; yourDemand: number; theirDemand: number }
const total = (items: SelectedValueItem[]) => items.reduce((sum, item) => sum + item.value * item.quantity * (item.multiplier ?? 1), 0);
const demand = (items: SelectedValueItem[]) => items.length ? items.reduce((sum, item) => sum + item.demand * item.quantity, 0) / items.reduce((sum, item) => sum + item.quantity, 0) : 0;
export function calculateTrade(yours: SelectedValueItem[], theirs: SelectedValueItem[], fairThreshold = .07): TradeResult {
  const yourTotal = total(yours); const theirTotal = total(theirs); const difference = theirTotal - yourTotal;
  const percentage = yourTotal ? difference / yourTotal * 100 : theirTotal ? 100 : 0;
  const ratio = yourTotal ? difference / yourTotal : 0;
  const verdict = Math.abs(ratio) <= fairThreshold ? 'Fair' : ratio > fairThreshold ? 'Good' : 'Bad';
  return { yourTotal, theirTotal, difference, percentage, verdict, yourDemand: demand(yours), theirDemand: demand(theirs) };
}
