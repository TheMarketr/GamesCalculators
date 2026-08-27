import {describe,expect,it} from 'vitest';import {checkPlatform} from './calculate';
describe('GTA VI platform status',()=>{it('marks PS5 and Series consoles confirmed',()=>{expect(checkPlatform('ps5').status).toBe('Confirmed');expect(checkPlatform('xbox-series').status).toBe('Confirmed')});it('does not invent a PC date',()=>expect(checkPlatform('pc').status).toBe('Not announced'))});
