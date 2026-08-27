import {describe,expect,it} from 'vitest';import {calculateWfl} from './calculate';
describe('WFL',()=>{it('returns WIN when receiving materially more',()=>expect(calculateWfl(100,120).verdict).toBe('WIN'));it('returns FAIR inside eight percent',()=>expect(calculateWfl(100,107).verdict).toBe('FAIR'));it('returns LOSE when giving more',()=>expect(calculateWfl(120,100).verdict).toBe('LOSE'))});
