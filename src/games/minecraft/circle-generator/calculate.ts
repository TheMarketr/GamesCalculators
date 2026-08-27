export interface CircleOptions { diameter: number; thickness: number; filled: boolean }
export interface CircleResult { grid: boolean[][]; blockCount: number; rows: string[] }

export function generateCircle(options: CircleOptions): CircleResult {
  const diameter = Math.max(3, Math.min(101, Math.round(options.diameter)));
  const thickness = Math.max(1, Math.min(Math.floor(diameter / 2), Math.round(options.thickness)));
  const center = (diameter - 1) / 2;
  const outerRadius = diameter / 2;
  const innerRadius = Math.max(0, outerRadius - thickness);
  const grid = Array.from({ length: diameter }, (_, y) => Array.from({ length: diameter }, (_, x) => {
    const distance = Math.hypot(x - center, y - center);
    return distance <= outerRadius && (options.filled || distance > innerRadius);
  }));
  const rows = grid.map((row, index) => {
    const runs: string[] = [];
    let start = -1;
    row.forEach((on, column) => {
      if (on && start < 0) start = column + 1;
      if (start > 0 && (!on || column === row.length - 1)) {
        const end = on && column === row.length - 1 ? column + 1 : column;
        runs.push(start === end ? `block ${start}` : `blocks ${start}–${end}`);
        start = -1;
      }
    });
    return `Row ${index + 1}: ${runs.length ? runs.join(', ') : 'empty'}`;
  });
  return { grid, blockCount: grid.flat().filter(Boolean).length, rows };
}
