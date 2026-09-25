import {readFile,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const root=resolve('dist');
const baseline=JSON.parse(await readFile('reports/new-clusters-baseline-urls.json','utf8'));
const paths={
  'monopoly-go':['','tycoon-club','events','golden-blitz','wiki','sticker-safe-calculator','partner-event'],
  valorant:['','crosshair','sens-converter','crosshair-codes','best-crosshairs','crosshair-settings','edpi-calculator','scoped-sensitivity-calculator','rank-progress-calculator'],
  'coin-master':['','free-spins','reward-calendar-tracker','how-to-get-free-spins','village-mania-guide'],
};
const withheld=['monopoly-go/free-dice-links','monopoly-go/board-cost-calculator','monopoly-go/sticker-tracker','valorant/rank-distribution','coin-master/village-cost-calculator','coin-master/village-progress-calculator','coin-master/card-set-tracker','coin-master/free-coins'];
const errors=[],titles=new Set(),descriptions=new Set();
for(const url of baseline){try{await access(join(root,url,'index.html'));}catch{errors.push(`Existing URL missing: ${url}`);}}
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');
let count=0;
for(const [game,slugs]of Object.entries(paths))for(const slug of slugs){
  const url=`/${game}/${slug?slug+'/':''}`,html=await readFile(join(root,url,'index.html'),'utf8');count++;
  if(!sitemap.includes(`https://gamescalculators.com${url}`))errors.push(`Missing sitemap URL: ${url}`);
  if((html.match(/<h1\b/g)??[]).length!==1)errors.push(`H1 count: ${url}`);
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1],desc=html.match(/<meta\s+name="description"\s+content="([^"]*)"/s)?.[1];
  if(!title||titles.has(title))errors.push(`Duplicate/missing title: ${url}`);titles.add(title);
  if(!desc||descriptions.has(desc))errors.push(`Duplicate/missing description: ${url}`);descriptions.add(desc);
  if(!html.includes(`rel="canonical" href="https://gamescalculators.com${url}"`))errors.push(`Canonical mismatch: ${url}`);
  if(!html.match(/property="og:image" content="[^"]+\.png"/))errors.push(`Missing PNG preview: ${url}`);
  const og=html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if(og){try{const png=await readFile(join(root,new URL(og).pathname));if(png.readUInt32BE(16)!==1200||png.readUInt32BE(20)!==630)errors.push(`OG dimensions: ${url}`);}catch{errors.push(`OG file missing: ${url}`);}}
  if(url==='/coin-master/free-spins/'&&!html.includes('data-ads-disabled="true"'))errors.push('Coin Master rewards must disable ad injection');
  for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
    const path=decodeURI(match[1].split(/[?#]/)[0]);if(path.startsWith('//'))continue;
    try{await access(join(root,path,path.endsWith('/')?'index.html':''));}catch{errors.push(`Broken local link/asset on ${url}: ${path}`);}
  }
}
for(const path of withheld){try{await access(join(root,path,'index.html'));errors.push(`Withheld page published: ${path}`);}catch{}}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`New-cluster build audit passed: ${count} new routes, ${baseline.length} preserved URLs, canonical/H1/title/description/PNG/sitemap/internal assets checked; 8 withheld routes absent.`);
