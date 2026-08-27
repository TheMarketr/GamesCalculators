import type { SelectedValueItem } from '../../../data/types';
export function calculateBrainrotCollection(items: SelectedValueItem[]) {
  return items.reduce((result, item) => {
    const multiplier = item.multiplier ?? 1;
    result.value += item.value * item.quantity * multiplier;
    result.incomePerSecond += (item.income ?? 0) * item.quantity * multiplier;
    return result;
  }, { value: 0, incomePerSecond: 0, incomePerMinute: 0, incomePerHour: 0 });
}
export function withIncomePeriods(result: ReturnType<typeof calculateBrainrotCollection>) {
  return { ...result, incomePerMinute: result.incomePerSecond * 60, incomePerHour: result.incomePerSecond * 3600 };
}
