import type { FormulaKey } from './profiles';

export type MetricFormat = 'number' | 'compact' | 'percent' | 'duration' | 'currency' | 'text';
export interface CalculationMetric {
  label: string;
  value: number | string;
  format?: MetricFormat;
  suffix?: string;
  tone?: 'default' | 'good' | 'warn' | 'bad';
}

const n = (values: Record<string, number>, key: string, fallback = 0) => Number.isFinite(values[key]) ? values[key] : fallback;
const positive = (value: number, fallback = 0) => Number.isFinite(value) ? Math.max(fallback, value) : fallback;
const percent = (value: number) => Math.min(100, Math.max(0, value));

export function calculateSecondary(formula: FormulaKey, values: Record<string, number>): CalculationMetric[] {
  switch (formula) {
    case 'mutation': {
      const multiplier = positive(n(values, 'primary', 1), 0) * positive(n(values, 'secondary', 1), 0);
      const each = positive(n(values, 'base')) * multiplier;
      return [
        { label: 'Combined multiplier', value: multiplier, suffix: '×' },
        { label: 'Value per item', value: each, format: 'compact', tone: 'good' },
        { label: 'Total value', value: each * positive(n(values, 'quantity', 1), 0), format: 'compact' },
      ];
    }
    case 'profit': {
      const investment = positive(n(values, 'cost')) * positive(n(values, 'quantity'));
      const revenue = positive(n(values, 'sale')) * positive(n(values, 'harvests')) * positive(n(values, 'quantity'));
      const profit = revenue - investment;
      return [
        { label: 'Revenue', value: revenue, format: 'compact' },
        { label: 'Profit', value: profit, format: 'compact', tone: profit >= 0 ? 'good' : 'bad' },
        { label: 'Return on cost', value: investment ? profit / investment * 100 : 0, format: 'percent' },
        { label: 'Harvests to repay seed', value: n(values, 'sale') > 0 ? Math.ceil(n(values, 'cost') / n(values, 'sale')) : 0 },
      ];
    }
    case 'damage': {
      const raw = positive(n(values, 'base')) * (1 + positive(n(values, 'stat')) / 2550 * .6) * (1 + positive(n(values, 'mastery')) / 600 * .25) * (1 + positive(n(values, 'bonus')) / 100);
      const final = raw * (1 - percent(n(values, 'defense')) / 100);
      return [
        { label: 'Raw combo estimate', value: raw, format: 'compact' },
        { label: 'After defense', value: final, format: 'compact', tone: 'good' },
        { label: 'Damage prevented', value: raw - final, format: 'compact' },
      ];
    }
    case 'stats': {
      const used = positive(n(values, 'one')) + positive(n(values, 'two')) + positive(n(values, 'three'));
      const remaining = n(values, 'total') - used;
      const spread = Math.max(n(values, 'one'), n(values, 'two'), n(values, 'three')) - Math.min(n(values, 'one'), n(values, 'two'), n(values, 'three'));
      return [
        { label: 'Points used', value: used, format: 'number' },
        { label: 'Points remaining', value: remaining, format: 'number', tone: remaining < 0 ? 'bad' : 'good' },
        { label: 'Budget used', value: n(values, 'total') ? used / n(values, 'total') * 100 : 0, format: 'percent' },
        { label: 'Largest allocation gap', value: spread, format: 'number' },
      ];
    }
    case 'build': {
      const offense = positive(n(values, 'fruit')) + positive(n(values, 'melee')) + positive(n(values, 'sword'));
      const defense = positive(n(values, 'defense'));
      const total = offense + defense;
      return [
        { label: 'Total allocated', value: total, format: 'number' },
        { label: 'Offense share', value: total ? offense / total * 100 : 0, format: 'percent' },
        { label: 'Defense share', value: total ? defense / total * 100 : 0, format: 'percent' },
        { label: 'Build style', value: total && defense / total > .4 ? 'Durable' : offense > defense * 2 ? 'Aggressive' : 'Balanced', format: 'text', tone: 'good' },
      ];
    }
    case 'mastery': {
      const levels = positive(n(values, 'target') - n(values, 'current'));
      const actions = Math.ceil(levels * positive(n(values, 'actions')));
      return [
        { label: 'Mastery levels remaining', value: levels },
        { label: 'Estimated actions', value: actions, format: 'number' },
        { label: 'Session time', value: actions * positive(n(values, 'seconds')), format: 'duration', tone: 'good' },
      ];
    }
    case 'income': {
      const perSecond = positive(n(values, 'base')) * positive(n(values, 'quantity')) * positive(n(values, 'multiplier'));
      return [
        { label: 'Income per second', value: perSecond, format: 'compact' },
        { label: 'Income per minute', value: perSecond * 60, format: 'compact' },
        { label: 'Income per hour', value: perSecond * 3600, format: 'compact' },
        { label: 'Custom session total', value: perSecond * positive(n(values, 'minutes')) * 60, format: 'compact', tone: 'good' },
      ];
    }
    case 'rebirth': {
      const remaining = positive(n(values, 'target') - n(values, 'current'));
      const rate = positive(n(values, 'income')) * positive(n(values, 'boost', 1));
      return [
        { label: 'Cash remaining', value: remaining, format: 'compact' },
        { label: 'Effective income/sec', value: rate, format: 'compact' },
        { label: 'Estimated time', value: rate ? remaining / rate : 0, format: 'duration', tone: 'good' },
      ];
    }
    case 'crafting': {
      const woodCost = Math.max(1, positive(n(values, 'woodCost'), 1));
      const scrapCost = Math.max(1, positive(n(values, 'scrapCost'), 1));
      const crafts = Math.floor(Math.min(positive(n(values, 'wood')) / woodCost, positive(n(values, 'scrap')) / scrapCost));
      return [
        { label: 'Complete crafts', value: crafts, tone: 'good' },
        { label: 'Wood left', value: positive(n(values, 'wood')) - crafts * woodCost },
        { label: 'Scrap left', value: positive(n(values, 'scrap')) - crafts * scrapCost },
      ];
    }
    case 'fuel': {
      const nights = positive(n(values, 'target') - n(values, 'current'));
      const base = nights * positive(n(values, 'perNight'));
      const total = Math.ceil(base * (1 + percent(n(values, 'reserve')) / 100));
      return [
        { label: 'Nights remaining', value: nights },
        { label: 'Base fuel needed', value: Math.ceil(base) },
        { label: 'Fuel with reserve', value: total, tone: 'good' },
      ];
    }
    case 'food': {
      const nights = positive(n(values, 'target') - n(values, 'current'));
      const total = Math.ceil(nights * positive(n(values, 'players')) * positive(n(values, 'perNight')));
      return [
        { label: 'Nights remaining', value: nights },
        { label: 'Meals needed', value: total },
        { label: 'Recommended with 10% reserve', value: Math.ceil(total * 1.1), tone: 'good' },
      ];
    }
    case 'progress': {
      const target = Math.max(1, positive(n(values, 'target'), 1));
      const current = percent(n(values, 'current') / target * 100);
      return [
        { label: 'Run progress', value: current, format: 'percent', tone: 'good' },
        { label: 'Nights remaining', value: positive(target - n(values, 'current')) },
        { label: 'Active players', value: positive(n(values, 'players')) },
      ];
    }
    case 'run': {
      const nights = positive(n(values, 'target') - n(values, 'current'));
      const foodNeeded = Math.ceil(nights * positive(n(values, 'players')) * .75);
      const fuelNeeded = Math.ceil(nights * 3);
      const readiness = percent(Math.min(foodNeeded ? n(values, 'food') / foodNeeded : 1, fuelNeeded ? n(values, 'fuel') / fuelNeeded : 1) * 100);
      return [
        { label: 'Nights remaining', value: nights },
        { label: 'Food gap', value: Math.max(0, foodNeeded - n(values, 'food')), tone: n(values, 'food') >= foodNeeded ? 'good' : 'warn' },
        { label: 'Fuel gap', value: Math.max(0, fuelNeeded - n(values, 'fuel')), tone: n(values, 'fuel') >= fuelNeeded ? 'good' : 'warn' },
        { label: 'Supply readiness', value: readiness, format: 'percent', tone: readiness >= 100 ? 'good' : 'warn' },
      ];
    }
    case 'neon':
    case 'mega': {
      const target = formula === 'mega' ? 16 : 4;
      const missing = positive(target - n(values, 'owned'));
      const petsToAge = positive(target - n(values, 'fullGrown'));
      return [
        { label: 'Base pets required', value: target },
        { label: 'Pets still needed', value: missing, tone: missing ? 'warn' : 'good' },
        { label: 'Pets still to age', value: petsToAge },
        { label: 'Estimated tasks remaining', value: petsToAge * positive(n(values, 'tasksPerPet')), format: 'number' },
      ];
    }
    case 'age': {
      const tasks = positive(n(values, 'stages')) * positive(n(values, 'tasksPerStage'));
      return [
        { label: 'Tasks remaining', value: tasks, format: 'number' },
        { label: 'Estimated play time', value: tasks * positive(n(values, 'minutesPerTask')) * 60, format: 'duration', tone: 'good' },
        { label: 'Stages remaining', value: positive(n(values, 'stages')) },
      ];
    }
    case 'odds': {
      const chance = Math.min(1, positive(n(values, 'chance')) / 100 * positive(n(values, 'boost'), 1));
      const attempts = Math.floor(positive(n(values, 'attempts')));
      const atLeastOne = chance >= 1 ? 1 : 1 - Math.pow(1 - chance, attempts);
      return [
        { label: 'Effective chance each', value: chance * 100, format: 'percent' },
        { label: 'At least one after attempts', value: atLeastOne * 100, format: 'percent', tone: 'good' },
        { label: 'Expected attempts for one', value: chance ? Math.ceil(1 / chance) : 'Not reachable', format: chance ? 'number' : 'text' },
        { label: 'Miss chance', value: (1 - atLeastOne) * 100, format: 'percent' },
      ];
    }
    case 'power': {
      const total = positive(n(values, 'base')) * positive(n(values, 'quantity')) * (1 + positive(n(values, 'boost')) / 100) * (1 + positive(n(values, 'enchant')) / 100);
      return [
        { label: 'Base team power', value: n(values, 'base') * n(values, 'quantity'), format: 'compact' },
        { label: 'Boosted team power', value: total, format: 'compact', tone: 'good' },
        { label: 'Power gained from boosts', value: total - n(values, 'base') * n(values, 'quantity'), format: 'compact' },
      ];
    }
    case 'enchant': {
      const copies = Math.max(1, Math.floor(positive(n(values, 'copies'), 1)));
      const falloff = percent(n(values, 'falloff')) / 100;
      let total = 0;
      for (let index = 0; index < copies; index += 1) total += positive(n(values, 'base')) * Math.pow(falloff, index);
      return [
        { label: 'Combined estimated bonus', value: total, format: 'percent', tone: 'good' },
        { label: 'Simple sum without falloff', value: n(values, 'base') * copies, format: 'percent' },
        { label: 'Efficiency retained', value: n(values, 'base') * copies ? total / (n(values, 'base') * copies) * 100 : 0, format: 'percent' },
      ];
    }
    case 'diamonds': {
      const perMinute = positive(n(values, 'rate')) * (1 + positive(n(values, 'boost')) / 100);
      return [
        { label: 'Diamonds per minute', value: perMinute, format: 'compact' },
        { label: 'Diamonds per hour', value: perMinute * 60, format: 'compact' },
        { label: 'Session total', value: perMinute * positive(n(values, 'minutes')), format: 'compact', tone: 'good' },
      ];
    }
    case 'coordinates': {
      const fromOverworld = n(values, 'scale', 8) >= 4;
      const multiplier = fromOverworld ? 1 / 8 : 8;
      return [
        { label: fromOverworld ? 'Nether X' : 'Overworld X', value: Math.round(n(values, 'x') * multiplier) },
        { label: fromOverworld ? 'Nether Z' : 'Overworld Z', value: Math.round(n(values, 'z') * multiplier) },
        { label: 'Travel scale', value: fromOverworld ? 'Overworld → Nether (÷8)' : 'Nether → Overworld (×8)', format: 'text', tone: 'good' },
      ];
    }
    case 'coordinate-delta': {
      const dx = n(values, 'x2') - n(values, 'x1');
      const dz = n(values, 'z2') - n(values, 'z1');
      const direction = Math.abs(dx) > Math.abs(dz) ? (dx >= 0 ? 'East' : 'West') : (dz >= 0 ? 'South' : 'North');
      return [
        { label: 'X offset', value: dx },
        { label: 'Z offset', value: dz },
        { label: 'Straight-line distance', value: Math.hypot(dx, dz), format: 'number', suffix: ' blocks' },
        { label: 'Primary direction', value: direction, format: 'text', tone: 'good' },
      ];
    }
    case 'anvil': {
      const priorPenalty = Math.pow(2, Math.floor(positive(n(values, 'priorWorks')))) - 1;
      const total = positive(n(values, 'itemCost')) + positive(n(values, 'enchantCost')) + priorPenalty + (n(values, 'rename') >= 1 ? 1 : 0);
      return [
        { label: 'Prior-work penalty', value: priorPenalty },
        { label: 'Estimated level cost', value: total, tone: total >= 40 ? 'bad' : 'good' },
        { label: 'Survival result', value: total >= 40 ? 'Too Expensive' : 'Allowed', format: 'text', tone: total >= 40 ? 'bad' : 'good' },
      ];
    }
    case 'dome': {
      const radius = positive(n(values, 'diameter')) / 2;
      const blocks = Math.ceil(2 * Math.PI * radius * radius * positive(n(values, 'thickness')) * .82);
      return [
        { label: 'Radius', value: radius, suffix: ' blocks' },
        { label: 'Horizontal layers', value: Math.ceil(radius) },
        { label: 'Estimated shell blocks', value: blocks, format: 'number', tone: 'good' },
        { label: 'Footprint', value: `${Math.round(n(values, 'diameter'))} × ${Math.round(n(values, 'diameter'))}`, format: 'text' },
      ];
    }
    case 'sphere': {
      const radius = positive(n(values, 'diameter')) / 2;
      const hollow = n(values, 'hollow') >= .5;
      const blocks = hollow
        ? 4 * Math.PI * radius * radius * positive(n(values, 'thickness')) * .82
        : 4 / 3 * Math.PI * Math.pow(radius, 3) * .74;
      return [
        { label: 'Build type', value: hollow ? 'Hollow shell' : 'Filled sphere', format: 'text' },
        { label: 'Radius', value: radius, suffix: ' blocks' },
        { label: 'Estimated blocks', value: Math.ceil(blocks), format: 'number', tone: 'good' },
        { label: 'Layer count', value: Math.ceil(n(values, 'diameter')) },
      ];
    }
    case 'distance': {
      const dx = n(values, 'x2') - n(values, 'x1');
      const dy = n(values, 'y2') - n(values, 'y1');
      const dz = n(values, 'z2') - n(values, 'z1');
      const horizontal = Math.hypot(dx, dz);
      return [
        { label: 'Horizontal distance', value: horizontal, format: 'number', suffix: ' blocks' },
        { label: '3D distance', value: Math.hypot(dx, dy, dz), format: 'number', suffix: ' blocks', tone: 'good' },
        { label: 'Nether-equivalent horizontal', value: horizontal / 8, format: 'number', suffix: ' blocks' },
        { label: 'Vertical change', value: dy, suffix: ' blocks' },
      ];
    }
    case 'minecraft-damage': {
      const damage = positive(n(values, 'damage'));
      const armor = positive(n(values, 'armor'));
      const toughness = positive(n(values, 'toughness'));
      const armorTerm = Math.min(20, Math.max(armor / 5, armor - damage / (2 + toughness / 4)));
      const afterArmor = damage * (1 - armorTerm / 25);
      const final = afterArmor * (1 - percent(n(values, 'protection')) / 100);
      return [
        { label: 'Damage after armor', value: afterArmor, format: 'number' },
        { label: 'Final damage', value: final, format: 'number', tone: 'good' },
        { label: 'Damage prevented', value: damage - final, format: 'number' },
        { label: 'Hearts lost', value: final / 2, format: 'number', suffix: ' ♥' },
      ];
    }
    case 'spiral': {
      const height = Math.ceil(positive(n(values, 'height')));
      const turns = positive(n(values, 'turns'));
      const width = positive(n(values, 'width'));
      return [
        { label: 'Steps required', value: height },
        { label: 'Degrees per step', value: height ? 360 * turns / height : 0, format: 'number', suffix: '°' },
        { label: 'Estimated stair blocks', value: Math.ceil(height * width * 1.2), format: 'number', tone: 'good' },
        { label: 'Footprint diameter', value: Math.ceil(n(values, 'radius') * 2 + width), suffix: ' blocks' },
      ];
    }
    case 'stack': {
      const count = Math.floor(positive(n(values, 'count')));
      const size = Math.max(1, Math.floor(positive(n(values, 'stackSize'), 1)));
      const full = Math.floor(count / size);
      const leftovers = count % size;
      return [
        { label: 'Full stacks', value: full, format: 'number', tone: 'good' },
        { label: 'Leftover items', value: leftovers },
        { label: 'Slots required', value: full + (leftovers ? 1 : 0) },
        { label: 'Shulker boxes required', value: Math.ceil((full + (leftovers ? 1 : 0)) / 27) },
      ];
    }
    case 'oval': {
      const width = positive(n(values, 'width'));
      const height = positive(n(values, 'height'));
      const area = Math.PI * width / 2 * height / 2 * .82;
      const circumference = Math.PI * (3 * (width / 2 + height / 2) - Math.sqrt((3 * width / 2 + height / 2) * (width / 2 + 3 * height / 2)));
      return [
        { label: 'Rows', value: Math.ceil(height) },
        { label: 'Filled block estimate', value: Math.ceil(area), format: 'number' },
        { label: 'Outline block estimate', value: Math.ceil(circumference * positive(n(values, 'thickness'))), format: 'number', tone: 'good' },
        { label: 'Dimensions', value: `${Math.round(width)} × ${Math.round(height)}`, format: 'text' },
      ];
    }
    case 'account': {
      const count = positive(n(values, 'skins')) + positive(n(values, 'pickaxes')) + positive(n(values, 'emotes'));
      const vbucks = count * positive(n(values, 'average'));
      return [
        { label: 'Cosmetics counted', value: count, format: 'number' },
        { label: 'Entered replacement total', value: vbucks, format: 'compact', suffix: ' V-Bucks', tone: 'good' },
        { label: 'Approx. store-cost equivalent', value: vbucks / 1000 * 8, format: 'currency' },
      ];
    }
    case 'edpi': {
      const edpi = positive(n(values, 'dpi')) * positive(n(values, 'sensitivity')) / 100;
      const band = edpi < 40 ? 'Low sensitivity' : edpi <= 80 ? 'Medium sensitivity' : 'High sensitivity';
      return [
        { label: 'eDPI', value: edpi, format: 'number', tone: 'good' },
        { label: 'Sensitivity band', value: band, format: 'text' },
        { label: '360° consistency index', value: edpi ? 1000 / edpi : 0, format: 'number' },
      ];
    }
    case 'sensitivity': {
      const edpi = positive(n(values, 'currentDpi')) * positive(n(values, 'currentSensitivity')) / 100;
      const target = positive(n(values, 'targetDpi'));
      return [
        { label: 'Current eDPI', value: edpi, format: 'number' },
        { label: 'Matching new sensitivity', value: target ? edpi / target * 100 : 0, format: 'percent', tone: 'good' },
        { label: 'DPI multiplier', value: n(values, 'currentDpi') ? target / n(values, 'currentDpi') : 0, suffix: '×' },
      ];
    }
    case 'level': {
      const levels = positive(n(values, 'target') - n(values, 'current'));
      const xp = levels * positive(n(values, 'xpPerLevel'));
      return [
        { label: 'Levels remaining', value: levels },
        { label: 'XP remaining', value: xp, format: 'compact', tone: 'good' },
        { label: 'Estimated matches', value: n(values, 'xpPerMatch') > 0 ? Math.ceil(xp / n(values, 'xpPerMatch')) : 0, format: 'number' },
      ];
    }
    case 'battle-pass': {
      const levels = positive(n(values, 'target') - n(values, 'current'));
      const xp = levels * positive(n(values, 'xpPerLevel'));
      const days = Math.max(1, positive(n(values, 'days'), 1));
      const daily = xp / days;
      return [
        { label: 'Total XP remaining', value: xp, format: 'compact' },
        { label: 'Daily XP target', value: daily, format: 'compact', tone: 'good' },
        { label: 'Matches per day', value: n(values, 'xpPerMatch') > 0 ? Math.ceil(daily / n(values, 'xpPerMatch')) : 0 },
        { label: 'Levels per day', value: levels / days, format: 'number' },
      ];
    }
    case 'ttk': {
      const damage = Math.max(.01, positive(n(values, 'damage'), .01));
      const rpm = Math.max(.01, positive(n(values, 'rpm'), .01));
      const shots = Math.ceil(positive(n(values, 'health')) / damage);
      return [
        { label: 'Shots to eliminate', value: shots },
        { label: 'Estimated TTK', value: Math.max(0, shots - 1) / (rpm / 60), format: 'number', suffix: ' sec', tone: 'good' },
        { label: 'Sustained DPS', value: damage * rpm / 60, format: 'number' },
      ];
    }
    case 'gta-cost': {
      const subtotal = positive(n(values, 'base')) + positive(n(values, 'extras'));
      const total = subtotal * (1 + percent(n(values, 'tax')) / 100);
      const gap = total - positive(n(values, 'saved'));
      return [
        { label: 'Estimated checkout total', value: total, format: 'currency', tone: 'good' },
        { label: 'Amount still to save', value: Math.max(0, gap), format: 'currency', tone: gap <= 0 ? 'good' : 'warn' },
        { label: 'Budget remaining after purchase', value: Math.max(0, -gap), format: 'currency' },
      ];
    }
    case 'map-size': {
      const width = positive(n(values, 'width'));
      const height = positive(n(values, 'height'));
      const diagonal = Math.hypot(width, height);
      const speed = positive(n(values, 'speed'));
      return [
        { label: 'Scenario area', value: width * height, format: 'number', suffix: ' km²' },
        { label: 'Corner-to-corner distance', value: diagonal, format: 'number', suffix: ' km' },
        { label: 'Travel time at entered speed', value: speed ? diagonal / speed * 3600 : 0, format: 'duration', tone: 'good' },
      ];
    }
    case 'edition': {
      const priceGap = positive(n(values, 'premium')) - positive(n(values, 'standard'));
      const net = positive(n(values, 'extrasValue')) - priceGap;
      return [
        { label: 'Ultimate price difference', value: priceGap, format: 'currency' },
        { label: 'Your extras value', value: positive(n(values, 'extrasValue')), format: 'currency' },
        { label: 'Net value to you', value: net, format: 'currency', tone: net >= 0 ? 'good' : 'warn' },
        { label: 'Better fit', value: net >= 0 ? 'Ultimate Edition' : 'Standard Edition', format: 'text', tone: 'good' },
      ];
    }
    case 'gta-mission': {
      const gross = positive(n(values, 'payout')) * (1 + positive(n(values, 'bonus')) / 100);
      const net = Math.max(0, gross - positive(n(values, 'cost')));
      const minutes = Math.max(.1, positive(n(values, 'minutes'), .1));
      const runs = positive(n(values, 'runs'));
      return [
        { label: 'Net payout per run', value: net, format: 'currency', tone: 'good' },
        { label: 'Estimated profit per hour', value: net * 60 / minutes, format: 'currency' },
        { label: 'Planned session earnings', value: net * runs, format: 'currency' },
        { label: 'Planned session time', value: minutes * runs * 60, format: 'duration' },
      ];
    }
    case 'gta-split': {
      const pool = Math.max(0, positive(n(values, 'take')) - positive(n(values, 'cost')));
      const players = Math.max(1, Math.floor(positive(n(values, 'players'), 1)));
      const leaderShare = players === 1 ? pool : pool * percent(n(values, 'leader')) / 100;
      const crewShare = players > 1 ? Math.max(0, pool - leaderShare) / (players - 1) : 0;
      return [
        { label: 'Net pool after costs', value: pool, format: 'currency' },
        { label: 'Leader payout', value: leaderShare, format: 'currency', tone: 'good' },
        { label: 'Each other crew member', value: crewShare, format: 'currency' },
        { label: 'Crew members paid', value: players },
      ];
    }
    case 'gta-wanted': {
      const baseRisk = positive(n(values, 'witnesses')) * 8 + positive(n(values, 'heat')) * 10 + positive(n(values, 'knownVehicle')) * 18 + positive(n(values, 'knownOutfit')) * 12;
      const reduction = positive(n(values, 'changedVehicle')) * 24 + positive(n(values, 'changedOutfit')) * 16;
      const risk = percent(baseRisk - reduction);
      const label = risk >= 70 ? 'High exposure' : risk >= 35 ? 'Moderate exposure' : 'Lower exposure';
      return [
        { label: 'Planning risk score', value: risk, format: 'percent', tone: risk >= 70 ? 'bad' : risk >= 35 ? 'warn' : 'good' },
        { label: 'Escape status', value: label, format: 'text' },
        { label: 'Risk reduced by changes', value: Math.min(baseRisk, reduction), suffix: ' points', tone: reduction ? 'good' : 'warn' },
        { label: 'Next priority', value: n(values, 'knownVehicle') && !n(values, 'changedVehicle') ? 'Change known vehicle' : n(values, 'knownOutfit') && !n(values, 'changedOutfit') ? 'Change visible outfit' : 'Break sight and leave search area', format: 'text' },
      ];
    }
    case 'gta-garage': {
      const vehicles = positive(n(values, 'vehicles'));
      const purchase = vehicles * positive(n(values, 'averagePrice'));
      const upgrades = vehicles * positive(n(values, 'upgrades'));
      const invested = purchase + upgrades + positive(n(values, 'fees'));
      return [
        { label: 'Vehicle purchase total', value: purchase, format: 'currency' },
        { label: 'Upgrade total', value: upgrades, format: 'currency' },
        { label: 'Total garage investment', value: invested, format: 'currency', tone: 'good' },
        { label: 'Scenario resale value', value: invested * percent(n(values, 'resaleRate')) / 100, format: 'currency' },
      ];
    }
    case 'gta-session': {
      const session = positive(n(values, 'session'));
      const reserved = Math.min(session, positive(n(values, 'freeRoam')));
      const missionBlock = Math.max(1, positive(n(values, 'mission')) + positive(n(values, 'travel')));
      const missionMinutes = Math.max(0, session - reserved);
      const missions = Math.floor(missionMinutes / missionBlock);
      const unused = Math.max(0, missionMinutes - missions * missionBlock);
      return [
        { label: 'Missions that fit', value: missions, tone: 'good' },
        { label: 'Reserved free-roam time', value: reserved * 60, format: 'duration' },
        { label: 'Unallocated buffer', value: unused * 60, format: 'duration' },
        { label: 'Planned session length', value: session * 60, format: 'duration' },
      ];
    }
  }
}
