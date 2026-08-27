import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(projectRoot, 'dist');
const clientDirectory = path.join(distDirectory, 'client');
const serverDirectory = path.join(distDirectory, 'server');

await rm(clientDirectory, { recursive: true, force: true });
await rm(serverDirectory, { recursive: true, force: true });
await mkdir(clientDirectory, { recursive: true });

for (const entry of await readdir(distDirectory)) {
  if (entry === '.openai' || entry === 'client' || entry === 'server') continue;
  await rename(path.join(distDirectory, entry), path.join(clientDirectory, entry));
}

await mkdir(serverDirectory, { recursive: true });
await writeFile(
  path.join(serverDirectory, 'index.js'),
  `export default {
  async fetch(request, env) {
    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('Static asset binding is unavailable.', { status: 503 });
    }
    return env.ASSETS.fetch(request);
  },
};
`,
  'utf8',
);
