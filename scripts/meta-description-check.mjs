import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const pages = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(filename);
    else if (entry.name.endsWith('.html')) pages.push(filename);
  }
}

function decode(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function pageUrl(filename) {
  const relative = path.relative(dist, filename).replaceAll('\\', '/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/index\.html$/, '').replace(/\.html$/, '')}`;
}

await walk(dist);

const failures = [];
for (const filename of pages) {
  const html = await readFile(filename, 'utf8');
  if (/name="robots" content="noindex/i.test(html)) continue;
  const match = html.match(/<meta name="description" content="([^"]*)"/i);
  if (!match) {
    failures.push({ url: pageUrl(filename), length: 0, description: 'Missing description' });
    continue;
  }
  const description = decode(match[1]);
  if (description.length < 130 || description.length > 150) {
    failures.push({ url: pageUrl(filename), length: description.length, description });
  }
}

console.log(`Checked ${pages.length} generated HTML pages.`);
if (failures.length) {
  console.error(`Found ${failures.length} indexable meta descriptions outside 130-150 characters:`);
  for (const failure of failures.sort((a, b) => a.length - b.length || a.url.localeCompare(b.url))) {
    console.error(`${String(failure.length).padStart(3)}  ${failure.url}  ${failure.description}`);
  }
  process.exitCode = 1;
} else {
  console.log('All indexable meta descriptions are 130-150 characters.');
}
