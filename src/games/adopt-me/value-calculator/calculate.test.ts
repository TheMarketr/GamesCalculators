import {describe,expect,it} from 'vitest';import {calculatePetCollection,petValue} from './calculate';
const pet={slug:'test',name:'Test',category:'pet',rarity:'legendary',value:10,demand:8,updated:'2026-08-26',lastReviewed:'2026-08-26'};
describe('pet values',()=>{it('applies variant and potion multipliers',()=>expect(petValue({pet,quantity:2,variant:'neon',fly:true,ride:false})).toBeCloseTo(77.76));it('totals a collection',()=>expect(calculatePetCollection([{pet,quantity:1,variant:'regular',fly:false,ride:false}]).total).toBe(10))});
