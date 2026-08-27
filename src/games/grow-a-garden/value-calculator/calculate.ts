export interface GardenValueInput { baseValue: number; baseWeight: number; weight: number; growthMultiplier: number; mutationMultiplier: number; quantity: number }
export function calculateGardenValue(input: GardenValueInput) {
  const baseWeight = Math.max(.01, input.baseWeight);
  const ratio = Math.max(0, input.weight) / baseWeight;
  const unitValue = Math.max(0, input.baseValue) * ratio ** 2 * Math.max(1, input.growthMultiplier) * Math.max(1, input.mutationMultiplier);
  return { unitValue: Math.round(unitValue), totalValue: Math.round(unitValue * Math.max(1, Math.floor(input.quantity))), weightRatio: ratio };
}
