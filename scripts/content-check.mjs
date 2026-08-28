import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const projectRoot = process.cwd();
const contentRoot = resolve(projectRoot, 'src/data/tool-content');
const distRoot = resolve(projectRoot, 'dist');
const generatedRoot = existsSync(resolve(distRoot, 'client')) ? resolve(distRoot, 'client') : distRoot;
const reportPath = resolve(projectRoot, 'reports/content-check-report.md');

const knownGenericPhrases = [
  'The practical problem is deciding what to do next',
  'Change one variable and compare scenarios',
  'The calculator is a decision aid',
  'The calculator is most useful when',
  'The calculation follows the assumptions',
  'Transparent by design',
  'Read the result before you act',
  'Inputs, interpretation and limits',
  'players researching',
];

const placeholderPatterns = [
  { label: 'double-brace placeholder', pattern: /\{\{[^}]+\}\}/gi },
  { label: 'template placeholder', pattern: /\[(?:game|tool|keyword|topic|insert[^\]]*)\]/gi },
  { label: 'unfinished marker', pattern: /\b(?:lorem ipsum|TBD|TK|FIXME|TODO)\b/gi },
  { label: 'awkward generated phrase', pattern: /researching\s+(?:pixel circle|\[[^\]]+\]|\$\{[^}]+\})/gi },
];

const sourceFiles = readdirSync(contentRoot)
  .filter((name) => name.endsWith('.ts') && name !== 'types.ts')
  .map((name) => join(contentRoot, name));

const decodeLiteral = (value) => value
  .replace(/\\'/g, "'")
  .replace(/\\n/g, ' ')
  .replace(/\\t/g, ' ')
  .replace(/\\\\/g, '\\')
  .replace(/\s+/g, ' ')
  .trim();

const normalize = (value) => value
  .toLowerCase()
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/[^a-z0-9%+×÷−—–]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenSet = (value) => new Set(normalize(value).split(' ').filter((token) => token.length > 2));
const jaccard = (left, right) => {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

const entries = new Map();
const paragraphs = [];
const genericHits = [];
const placeholderHits = [];

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const shortFile = relative(projectRoot, file).replaceAll('\\', '/');
  let currentKey;

  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const keyMatch = line.match(/^\s*'([^']+\/[^']+)':\s*(?:c\(\{|\{)/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      if (!entries.has(currentKey)) entries.set(currentKey, { file: shortFile, strings: [], allText: [], questions: [] });
      else entries.get(currentKey).duplicate = true;
    }
    if (!currentKey) continue;

    for (const phrase of knownGenericPhrases) {
      if (line.toLowerCase().includes(phrase.toLowerCase())) genericHits.push({ key: currentKey, file: shortFile, line: index + 1, phrase });
    }
    for (const { label, pattern } of placeholderPatterns) {
      pattern.lastIndex = 0;
      for (const match of line.matchAll(pattern)) placeholderHits.push({ key: currentKey, file: shortFile, line: index + 1, label, value: match[0] });
    }

    const questionMatch = line.match(/question:\s*'((?:\\.|[^'\\])*)'/);
    if (questionMatch) entries.get(currentKey).questions.push(decodeLiteral(questionMatch[1]));

    const literalPattern = /'((?:\\.|[^'\\])*)'/g;
    for (const match of line.matchAll(literalPattern)) {
      const text = decodeLiteral(match[1]);
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      if (wordCount >= 4 && !text.startsWith('http')) entries.get(currentKey).allText.push(text);
      if (/\b(?:question|answer):/.test(line)) continue;
      if (text.length >= 90 && wordCount >= 14 && !text.startsWith('http')) {
        const record = { key: currentKey, file: shortFile, line: index + 1, text, normalized: normalize(text) };
        paragraphs.push(record);
        entries.get(currentKey).strings.push(text);
      }
    }
  }
}

const exactGroups = [...paragraphs.reduce((groups, paragraph) => {
  const group = groups.get(paragraph.normalized) ?? [];
  group.push(paragraph);
  groups.set(paragraph.normalized, group);
  return groups;
}, new Map()).values()]
  .filter((group) => new Set(group.map((item) => item.key)).size > 1)
  .sort((a, b) => b.length - a.length);

const similarPairs = [];
for (let leftIndex = 0; leftIndex < paragraphs.length; leftIndex += 1) {
  const left = paragraphs[leftIndex];
  if (left.text.length < 120) continue;
  for (let rightIndex = leftIndex + 1; rightIndex < paragraphs.length; rightIndex += 1) {
    const right = paragraphs[rightIndex];
    if (left.key === right.key || right.text.length < 120) continue;
    const lengthRatio = Math.min(left.text.length, right.text.length) / Math.max(left.text.length, right.text.length);
    if (lengthRatio < 0.7) continue;
    const score = jaccard(left.text, right.text);
    if (score >= 0.82) similarPairs.push({ left, right, score });
  }
}
similarPairs.sort((a, b) => b.score - a.score);

const questionGroups = new Map();
const faqSetGroups = new Map();
for (const [key, entry] of entries) {
  for (const question of entry.questions) {
    const normalizedQuestion = normalize(question);
    const group = questionGroups.get(normalizedQuestion) ?? [];
    group.push({ key, question });
    questionGroups.set(normalizedQuestion, group);
  }
  const setKey = entry.questions.map(normalize).sort().join(' || ');
  if (setKey) {
    const group = faqSetGroups.get(setKey) ?? [];
    group.push(key);
    faqSetGroups.set(setKey, group);
  }
}
const duplicateQuestions = [...questionGroups.values()].filter((group) => new Set(group.map((item) => item.key)).size > 1);
const duplicateFaqSets = [...faqSetGroups.values()].filter((group) => group.length > 1);

const duplicateKeys = [...entries.entries()].filter(([, entry]) => entry.duplicate).map(([key]) => key);
const thinEntries = [...entries.entries()].map(([key, entry]) => ({
  key,
  words: entry.allText.join(' ').split(/\s+/).filter(Boolean).length,
})).filter((entry) => entry.words < 180).sort((a, b) => a.words - b.words);

const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

let generatedKeys = [];
let generatedPages = [];
if (existsSync(generatedRoot)) {
  generatedPages = walk(generatedRoot)
    .filter((file) => file.endsWith('index.html'))
    .map((file) => ({ file, html: readFileSync(file, 'utf8') }))
    .filter((page) => page.html.includes('calculator-shell'))
    .map((page) => ({ ...page, key: relative(generatedRoot, page.file).replaceAll('\\', '/').replace(/\/index\.html$/, '') }))
    .filter((page) => page.key.includes('/'));
  generatedKeys = generatedPages.map((page) => page.key);
}

const decodeHtml = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim();
const legitimateSharedParagraphs = new Set([
  normalize('Official or licensed imagery identifies the game covered by this independent fan utility.'),
  normalize('Each section documents the calculation and the limits that apply to this specific gameplay problem.'),
  normalize('Clear answers about calculations, data, independence, privacy and practical use.'),
]);
const generatedParagraphs = generatedPages.flatMap(({ key, html }) => {
  const start = html.indexOf('data-supporting-content');
  if (start < 0) return [];
  const footer = html.indexOf('<footer', start);
  let supporting = html.slice(start, footer > start ? footer : undefined)
    .replace(/<section class="tool-media-strip"[\s\S]*?<\/section>/g, '')
    .replace(/<section class="related-tools"[\s\S]*?<\/section>/g, '');
  return [...supporting.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)]
    .map((match) => decodeHtml(match[1]))
    .filter((text) => text.length >= 90 && text.split(/\s+/).length >= 14)
    .filter((text) => !legitimateSharedParagraphs.has(normalize(text)))
    .map((text) => ({ key, text, normalized: normalize(text) }));
});
const generatedExactGroups = [...generatedParagraphs.reduce((groups, paragraph) => {
  const group = groups.get(paragraph.normalized) ?? [];
  group.push(paragraph);
  groups.set(paragraph.normalized, group);
  return groups;
}, new Map()).values()].filter((group) => new Set(group.map((item) => item.key)).size > 1);

const generatedSimilarPairs = [];
for (let leftIndex = 0; leftIndex < generatedParagraphs.length; leftIndex += 1) {
  const left = generatedParagraphs[leftIndex];
  if (left.text.length < 120) continue;
  for (let rightIndex = leftIndex + 1; rightIndex < generatedParagraphs.length; rightIndex += 1) {
    const right = generatedParagraphs[rightIndex];
    if (left.key === right.key || right.text.length < 120) continue;
    const lengthRatio = Math.min(left.text.length, right.text.length) / Math.max(left.text.length, right.text.length);
    if (lengthRatio < 0.7 || left.normalized === right.normalized) continue;
    const score = jaccard(left.text, right.text);
    if (score >= 0.82) generatedSimilarPairs.push({ left, right, score });
  }
}
generatedSimilarPairs.sort((a, b) => b.score - a.score);

const sourceKeys = [...entries.keys()].sort();
const generatedKeySet = new Set(generatedKeys);
const sourceKeySet = new Set(sourceKeys);
const missingGenerated = generatedKeys.length ? sourceKeys.filter((key) => !generatedKeySet.has(key)) : [];
const missingSource = generatedKeys.length ? generatedKeys.filter((key) => !sourceKeySet.has(key)) : [];

const lines = [
  '# Content Quality Check',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Summary',
  '',
  `- Structured calculator pages: ${sourceKeys.length}`,
  `- Generated calculator pages inspected: ${generatedKeys.length || 'not available (run build first)'}`,
  `- Exact duplicated substantive paragraph groups: ${exactGroups.length}`,
  `- Highly similar paragraph pairs (Jaccard ≥ 0.82): ${similarPairs.length}`,
  `- Generated exact duplicated paragraph groups: ${generatedExactGroups.length}`,
  `- Generated highly similar paragraph pairs: ${generatedSimilarPairs.length}`,
  `- Identical FAQ sets: ${duplicateFaqSets.length}`,
  `- Exact FAQ questions reused across tools: ${duplicateQuestions.length}`,
  `- Known generic phrase hits: ${genericHits.length}`,
  `- Placeholder or awkward phrase hits: ${placeholderHits.length}`,
  `- Thin structured entries (<180 counted words): ${thinEntries.length}`,
  '',
  '## Exact duplicated substantive paragraphs',
  '',
  ...(exactGroups.length ? exactGroups.map((group) => `- ${group.length} uses: ${group.map((item) => item.key).join(', ')}\n  - “${group[0].text.slice(0, 240)}${group[0].text.length > 240 ? '…' : ''}”`) : ['- None.']),
  ...(generatedExactGroups.length ? generatedExactGroups.map((group) => `- Generated ${group.length} uses: ${group.map((item) => item.key).join(', ')}\n  - “${group[0].text.slice(0, 240)}${group[0].text.length > 240 ? '…' : ''}”`) : ['- No generated duplicates after legitimate shared UI exclusions.']),
  '',
  '## Highly similar supporting paragraphs',
  '',
  ...(similarPairs.length ? similarPairs.slice(0, 50).map(({ left, right, score }) => `- ${(score * 100).toFixed(1)}% — ${left.key} ↔ ${right.key}\n  - “${left.text.slice(0, 150)}…”\n  - “${right.text.slice(0, 150)}…”`) : ['- None.']),
  ...(generatedSimilarPairs.length ? generatedSimilarPairs.slice(0, 50).map(({ left, right, score }) => `- Generated ${(score * 100).toFixed(1)}% — ${left.key} ↔ ${right.key}\n  - “${left.text.slice(0, 150)}…”\n  - “${right.text.slice(0, 150)}…”`) : ['- No generated high-similarity pairs.']),
  ...(similarPairs.length > 50 ? [`- ${similarPairs.length - 50} additional pairs omitted from the readable top-50 list.`] : []),
  '',
  '## FAQ duplication',
  '',
  ...(duplicateFaqSets.length ? duplicateFaqSets.map((group) => `- Identical set: ${group.join(', ')}`) : ['- No identical FAQ sets.']),
  ...(duplicateQuestions.length ? duplicateQuestions.map((group) => `- Reused question across ${group.map((item) => item.key).join(', ')}: “${group[0].question}”`) : ['- No exact FAQ questions reused across tools.']),
  '',
  '## Generic phrases and placeholders',
  '',
  ...(genericHits.length ? genericHits.map((hit) => `- ${hit.key} (${hit.file}:${hit.line}): ${hit.phrase}`) : ['- No known generic template phrases.']),
  ...(placeholderHits.length ? placeholderHits.map((hit) => `- ${hit.key} (${hit.file}:${hit.line}): ${hit.label} “${hit.value}”`) : ['- No placeholder or awkward generated phrases.']),
  '',
  '## Coverage',
  '',
  ...(duplicateKeys.length ? duplicateKeys.map((key) => `- Duplicate structured key: ${key}`) : ['- No duplicate structured keys.']),
  ...(missingGenerated.length ? missingGenerated.map((key) => `- Structured page missing from generated site: ${key}`) : ['- No structured pages missing from the generated site.']),
  ...(missingSource.length ? missingSource.map((key) => `- Generated calculator missing structured content: ${key}`) : ['- No generated calculators missing structured content.']),
  ...(thinEntries.length ? thinEntries.map((entry) => `- Thin entry: ${entry.key} (${entry.words} counted words)`) : ['- Every structured entry clears the 180-word floor.']),
  '',
  '## Notes',
  '',
  '- Navigation, legal text, game-media credits, component labels, and other legitimate shared UI are intentionally excluded from substantive paragraph matching.',
  '- Similarity warnings are non-blocking review prompts. Exact duplicates, identical FAQ sets, known template phrases, placeholders, duplicate keys, missing coverage, and thin entries fail the check.',
  '',
];

mkdirSync(resolve(projectRoot, 'reports'), { recursive: true });
writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');

const blockingCount = exactGroups.length + generatedExactGroups.length + duplicateFaqSets.length + genericHits.length + placeholderHits.length + duplicateKeys.length + missingGenerated.length + missingSource.length + thinEntries.length;
process.stdout.write(lines.slice(0, 18).join('\n'));
process.stdout.write(`\n\nReport: ${relative(projectRoot, reportPath).replaceAll('\\', '/')}\n`);
process.stdout.write(blockingCount ? `FAILED with ${blockingCount} blocking issue(s).\n` : `PASSED with ${similarPairs.length + generatedSimilarPairs.length + duplicateQuestions.length} non-blocking warning(s).\n`);
if (blockingCount) process.exitCode = 1;
