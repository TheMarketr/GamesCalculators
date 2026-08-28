export interface ValueItem {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  value: number;
  demand: number;
  updated: string;
  income?: number;
  /** Zero means the source does not publish a defensible demand score. */
  sourceType?: 'developer-set' | 'game-displayed' | 'community-market' | 'community-wiki';
  sourceLabel?: string;
  sourceUrl?: string;
  unit?: string;
  note?: string;
  baseWeight?: number;
  permanentPrice?: number;
  damage?: number;
  fireRate?: number;
  magazine?: number;
  reload?: number;
  ratingLabel?: string;
  ratingMax?: number;
}

export interface SelectedValueItem extends ValueItem { quantity: number; multiplier?: number }
