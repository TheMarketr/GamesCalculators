export type Dimension = 'overworld' | 'nether';
export function convertPortalCoordinates(x: number, z: number, from: Dimension) {
  const factor = from === 'overworld' ? 1 / 8 : 8;
  const target: Dimension = from === 'overworld' ? 'nether' : 'overworld';
  const preciseX = x * factor; const preciseZ = z * factor;
  return { from, target, preciseX, preciseZ, x: Math.round(preciseX), z: Math.round(preciseZ) };
}
