import payload from './trainer-xp.json';
import type { DatasetMeta } from './types';

export const trainerXpMeta = payload.meta as DatasetMeta;
export const trainerXpByLevel = new Map(Object.entries(payload.records as Record<string, number>).map(([level, xp]) => [Number(level), xp]));
export const maxTrainerLevel = Math.max(...trainerXpByLevel.keys());
