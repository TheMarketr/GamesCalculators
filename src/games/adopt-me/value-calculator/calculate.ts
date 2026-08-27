import type { ValueItem } from '../../../data/types';
export type PetVariant = 'regular' | 'neon' | 'mega';
export interface PetSelection { pet: ValueItem; quantity: number; variant: PetVariant; fly: boolean; ride: boolean }
export const variantMultipliers: Record<PetVariant, number> = { regular: 1, neon: 3.6, mega: 12.5 };
export function petValue(selection: PetSelection) {
  const potionMultiplier = (selection.fly ? 1.08 : 1) * (selection.ride ? 1.06 : 1);
  return selection.pet.value * selection.quantity * variantMultipliers[selection.variant] * potionMultiplier;
}
export function calculatePetCollection(selections: PetSelection[]) {
  const total = selections.reduce((sum, selection) => sum + petValue(selection), 0);
  const averageDemand = selections.length ? selections.reduce((sum, selection) => sum + selection.pet.demand, 0) / selections.length : 0;
  return { total, averageDemand };
}
