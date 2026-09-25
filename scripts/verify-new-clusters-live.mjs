import {readFile} from 'node:fs/promises';
const origin='https://gamescalculators.com';
const local=await readFile('dist/sitemap.xml','utf8');
const urls=[...local.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).filter(u=>/^\/(monopoly-go|valorant|coin-master)\//.test(new URL(u).pathname));
const results=[];
for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async url=>{
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)}),html=await response.text();
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1],h1s=html.match(/<h1\b/g)??[];
  const valid=response.status===200&&canonical===url&&h1s.length===1&&!/name="robots" content="[^"]*noindex/.test(html);
  results.push({path:new URL(url).pathname,status:response.status,canonical,valid});
}));
const sitemapResponse=await fetch(origin+'/sitemap.xml',{signal:AbortSignal.timeout(30000)}),sitemap=await sitemapResponse.text();
const baseline=JSON.parse(await readFile('reports/new-clusters-baseline-urls.json','utf8'));
const missing=[...baseline.map(path=>origin+path),...urls].filter(url=>!sitemap.includes(`<loc>${url}</loc>`));
console.log(JSON.stringify({routes:results.sort((a,b)=>a.path.localeCompare(b.path)),existingUrlsPreserved:baseline.length-missing.filter(url=>!urls.includes(url)).length,sitemapUrls:[...sitemap.matchAll(/<loc>/g)].length,missing},null,2));
if(urls.length!==21||results.some(r=>!r.valid)||missing.length||sitemapResponse.status!==200)process.exitCode=1;
