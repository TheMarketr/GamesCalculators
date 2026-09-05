import { describe, expect, it } from 'vitest';
import { hitChance } from './calculate';
describe('OSRS DPS accuracy branch', () => { it('uses the lower-roll branch when attack is below defence', () => { expect(hitChance(5_000, 10_000)).toBeCloseTo(0.249975, 5); }); });
