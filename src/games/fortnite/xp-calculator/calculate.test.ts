import {describe,expect,it} from 'vitest';import {calculateFortniteXp} from './calculate';
describe('Fortnite XP planner',()=>{it('subtracts current-level progress and estimates matches',()=>expect(calculateFortniteXp({currentLevel:10,targetLevel:12,currentLevelXp:20000,xpPerLevel:80000,xpPerMatch:28000})).toMatchObject({levelsRemaining:2,xpNeeded:140000,matches:5,progressPercent:25}))});
