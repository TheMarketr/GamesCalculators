import { describe, expect, it } from 'vitest';
import { gtaCharacters, gtaEditionContents, gtaGameplaySystems, gtaLaunchFacts, gtaLocations } from './reference';

const datasets = {
  characters: { rows: gtaCharacters, count: 10 },
  locations: { rows: gtaLocations, count: 9 },
  gameplaySystems: { rows: gtaGameplaySystems, count: 24 },
  editionContents: { rows: gtaEditionContents, count: 22 },
  launchFacts: { rows: gtaLaunchFacts, count: 12 },
};

describe('GTA VI researched reference data', () => {
  for (const [name, dataset] of Object.entries(datasets)) {
    it(`${name} has the reviewed number of unique sourced records`, () => {
      expect(dataset.rows).toHaveLength(dataset.count);
      expect(new Set(dataset.rows.map((row) => row.slug)).size).toBe(dataset.rows.length);
      expect(dataset.rows.every((row) => row.reviewed === '2026-08-31')).toBe(true);
      expect(dataset.rows.every((row) => Boolean(row.sourceLabel && row.sourceUrl && row.ratingLabel))).toBe(true);
      expect(dataset.rows.every((row) => row.value === 0 && row.rating === 0)).toBe(true);
    });
  }

  it('keeps major launch facts explicit without filling unknowns', () => {
    expect(gtaLaunchFacts.find((row) => row.slug === 'release-date')?.note).toContain('November 19, 2026');
    expect(gtaLaunchFacts.find((row) => row.slug === 'preload')?.note).toContain('November 12, 2026');
    expect(gtaLaunchFacts.find((row) => row.slug === 'pc-status')?.rarity).toBe('Not announced');
    expect(gtaLaunchFacts.find((row) => row.slug === 'physical-package')?.note).toContain('no game disc');
    expect(gtaLaunchFacts.find((row) => row.slug === 'download-size')?.rarity).toBe('Not published here');
  });

  it('covers Rockstar’s six featured Leonida regions', () => {
    const officialRegions = gtaLocations.filter((row) => row.rarity === 'Official region');
    expect(officialRegions).toHaveLength(6);
    expect(officialRegions.map((row) => row.slug)).toEqual(expect.arrayContaining([
      'vice-city', 'leonida-keys', 'grassrivers', 'port-gellhorn', 'ambrosia', 'mount-kalaga',
    ]));
  });
});
