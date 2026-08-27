export const gpus = [
  { slug: 'integrated', name: 'Integrated graphics', fps: 42 }, { slug: 'gtx-1650', name: 'GeForce GTX 1650', fps: 92 },
  { slug: 'rtx-2060', name: 'GeForce RTX 2060', fps: 138 }, { slug: 'rtx-3060', name: 'GeForce RTX 3060', fps: 178 },
  { slug: 'rx-6600', name: 'Radeon RX 6600', fps: 184 }, { slug: 'rtx-4060', name: 'GeForce RTX 4060', fps: 216 },
  { slug: 'rx-7800-xt', name: 'Radeon RX 7800 XT', fps: 315 }, { slug: 'rtx-4070-super', name: 'GeForce RTX 4070 Super', fps: 345 },
  { slug: 'rtx-5070', name: 'GeForce RTX 5070', fps: 390 }, { slug: 'rtx-5090', name: 'GeForce RTX 5090', fps: 620 },
];
export const cpus = [
  { slug: 'entry', name: 'Entry 4-core CPU', factor: .68 }, { slug: 'i5-10400', name: 'Core i5-10400 / Ryzen 5 3600', factor: .85 },
  { slug: 'i5-12400', name: 'Core i5-12400 / Ryzen 5 5600', factor: 1 }, { slug: 'i5-14600k', name: 'Core i5-14600K / Ryzen 7 7700', factor: 1.18 },
  { slug: 'x3d', name: 'Recent Ryzen X3D / high-end gaming CPU', factor: 1.34 },
];
