import snapshot from './ge-prices.json';
export interface OsrsPriceRecord { id: number; name: string; examine: string; members: boolean; buyLimit: number | null; highAlch: number; lowAlch: number; highPrice: number | null; lowPrice: number | null; highTime: number | null; lowTime: number | null }
export const osrsPriceMeta = snapshot.meta;
export const osrsPriceRecords = snapshot.records as OsrsPriceRecord[];
export const defaultNatureRunePrice = osrsPriceRecords.find((item) => item.name === 'Nature rune')?.highPrice ?? 100;
