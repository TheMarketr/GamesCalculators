import { describe, expect, it } from 'vitest';
import { palsById } from '../../../data/palworld/pals';
import { calculateBreeding } from './calculate';
describe('Palworld current special combinations', () => { it('keeps a reviewed special override in the local dataset', () => { const a = palsById.get('Baphomet')!; const b = palsById.get('GhostBeast')!; expect(calculateBreeding(a, b).child.id).toBe('Baphomet_Dark'); }); });
