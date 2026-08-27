import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const extensions = new Set(['.astro', '.md', '.mdx', '.ts', '.tsx', '.json']);
const suspiciousTerms = [
  'hack', 'crack', 'aimbot', 'wallhack', 'cheat engine', 'dupe exploit', 'bypass',
  'mod APK', 'keygen', 'account generator', 'free Robux generator', 'free V Bucks generator',
];
const expression = new RegExp(`\\b(${suspiciousTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (extensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

const matches = [];
for (const file of await walk(root)) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(expression)) {
    const line = content.slice(0, match.index).split(/\r?\n/).length;
    matches.push(`${relative(root, file)}:${line} — ${match[0]}`);
  }
}
if (matches.length) {
  console.error('Content safety review required:\n' + matches.map((match) => `- ${match}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Content safety check passed: no flagged terms found.');
}
