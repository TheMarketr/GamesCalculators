import {describe,expect,it} from 'vitest';import {calculateXp,totalXpAtLevel} from './calculate';
describe('Minecraft XP',()=>{it('uses the vanilla piecewise totals',()=>{expect(totalXpAtLevel(16)).toBe(352);expect(totalXpAtLevel(30)).toBe(1395);expect(totalXpAtLevel(32)).toBe(1628)});it('calculates the difference between levels',()=>expect(calculateXp(16,30).xp).toBe(1043))});
