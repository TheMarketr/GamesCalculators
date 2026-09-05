import payload from './power-up-costs.json';
import type { DatasetMeta, PowerUpCost } from './types';

export const powerUpMeta = payload.meta as DatasetMeta;
export const powerUpCosts = Object.values(payload.records) as PowerUpCost[];
export const powerUpCostByLevel = new Map(powerUpCosts.map((record) => [record.current_level, record]));
