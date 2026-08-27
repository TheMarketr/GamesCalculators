import {describe,expect,it} from 'vitest';import {calculateEnchant} from './calculate';
describe('enchant planner',()=>{it('plans a level 30 bottom-slot setup',()=>expect(calculateEnchant(30,3)).toMatchObject({bookshelves:15,lapis:3,levelsConsumed:3,recommendedPlayerLevel:30}));it('clamps inputs',()=>expect(calculateEnchant(90,8).targetLevel).toBe(30))});
