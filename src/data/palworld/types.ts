export interface PalworldMeta { source: string; sourceUrl: string; sourceType: string; reviewed: string; unit: string; notes: string }
export interface Pal { id: string; bpClass: string; name: string; number: string; breedingPower: number; rarity: number; maleProbability: number; elements: string[]; order: number; isBoss: boolean; regularEligible: boolean; baseHp: number | null; baseAttack: number | null; baseDefense: number | null }
export interface SpecialBreedingCombination { parentAId: string; parentBId: string; childId: string; parentAGender: string | null; parentBGender: string | null }
export interface PalPassive { id: string; name: string; workSpeed: number; attack: number; defense: number; movement: number; source: string; sourceUrl: string; reviewed: string }
