import {describe,expect,it} from 'vitest';import {calculateGardenValue} from './calculate';
describe('garden value',()=>{it('applies squared weight and mutations',()=>expect(calculateGardenValue({baseValue:100,baseWeight:2,weight:4,growthMultiplier:20,mutationMultiplier:3,quantity:2})).toMatchObject({unitValue:24000,totalValue:48000,weightRatio:2}))});
