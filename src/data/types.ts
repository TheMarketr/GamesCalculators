export interface ValueItem {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  value: number;
  demand: number;
  updated: string;
  income?: number;
}

export interface SelectedValueItem extends ValueItem { quantity: number; multiplier?: number }
