export interface FpsInput { gpuFps: number; cpuFactor: number; resolution: '1080p' | '1440p' | '4k'; preset: 'performance' | 'low' | 'medium' | 'high' | 'epic' }
const resolutionFactors = { '1080p': 1, '1440p': .74, '4k': .43 } as const;
const presetFactors = { performance: 1.4, low: 1.18, medium: 1, high: .78, epic: .57 } as const;
export function estimateFps(input: FpsInput) {
  const center = input.gpuFps * input.cpuFactor * resolutionFactors[input.resolution] * presetFactors[input.preset];
  return { low: Math.max(20, Math.round(center * .85)), high: Math.max(25, Math.round(center * 1.15)), center: Math.round(center), bottleneck: input.cpuFactor < .85 ? 'CPU may limit high frame rates' : 'Balanced estimate' };
}
