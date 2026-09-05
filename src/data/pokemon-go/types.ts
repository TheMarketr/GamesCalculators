export interface DatasetMeta {
  source: string;
  sourceUrl: string;
  sourceType: string;
  reviewed: string;
  unit: string;
  notes: string;
}

export interface PokemonSpecies {
  id: string;
  dex: number;
  name: string;
  form: string;
  baseAttack: number;
  baseDefense: number;
  baseStamina: number;
}

export interface CpMultiplier { level: number; multiplier: number }
export interface EvolutionEdge { fromId: string; fromName: string; toId: string; toName: string; candyRequired: number | null }
export interface PowerUpCost { current_level: number; level_after_powering: number; stardust_to_upgrade: number; candy_to_upgrade: number; xl_candy_to_upgrade: number }
export interface PokemonMove { name: string; power: number; energy_delta: number; duration?: number; turn_duration?: number; type: string }
export interface PokemonMovePool { fast: string[]; charged: string[]; eliteFast: string[]; eliteCharged: string[] }
