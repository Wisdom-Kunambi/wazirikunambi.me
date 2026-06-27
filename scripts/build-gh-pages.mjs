import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');
const APP   = join(ROOT, 'laravel-app');
const DOCS  = join(ROOT, 'docs');
const BASE  = '/wazirikunambi.me';
const HOT   = join(APP, 'public/hot');
const PORT  = process.env.PORT || 8080;

if (existsSync(HOT)) { rmSync(HOT); console.log('Removed public/hot'); }

// 1. Build with GH Pages base
console.log('Building assets for GitHub Pages…');
execSync('npm run build:gh-pages', { cwd: APP, stdio: 'inherit' });

// 2. Clean and recreate docs/
if (existsSync(DOCS)) rmSync(DOCS, { recursive: true });
mkdirSync(DOCS, { recursive: true });
cpSync(join(APP, 'public/build'),  join(DOCS, 'build'),  { recursive: true });
cpSync(join(APP, 'public/assets'), join(DOCS, 'assets'), { recursive: true });
for (const f of ['favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png',
                  'robots.txt','heropic.svg','logo.svg','paintball_gun.glb']) {
    try { cpSync(join(APP,'public',f), join(DOCS,f)); } catch {}
}

// 3. Crawl pages
function fixHtml(html) {
    html = html.replace(/https?:\/\/localhost(:\d+)?\/build\//g, '/build/');
    html = html.replace(/https?:\/\/localhost(:\d+)?\/assets\//g, '/assets/');
    html = html.replace(/href="\/build\//g,     `href="${BASE}/build/`);
    html = html.replace(/src="\/build\//g,      `src="${BASE}/build/`);
    html = html.replace(/"\/build\//g,           `"${BASE}/build/`);
    html = html.replace(/href="\/assets\//g,    `href="${BASE}/assets/`);
    html = html.replace(/src="\/assets\//g,     `src="${BASE}/assets/`);
    html = html.replace(/href="\/favicon/g,     `href="${BASE}/favicon`);
    html = html.replace(/href="\/apple-touch/g, `href="${BASE}/apple-touch`);
    html = html.replace(/["']\/paintball_gun\.glb["']/g, `"${BASE}/paintball_gun.glb"`);
    return html;
}
const pages = [
    { url: `http://localhost:${PORT}`,          dest: 'index.html' },
    { url: `http://localhost:${PORT}/projects`, dest: 'projects/index.html' },
    { url: `http://localhost:${PORT}/resume`,   dest: 'resume/index.html' },
];
for (const { url, dest } of pages) {
    console.log(`Fetching ${url}…`);
    const html = execSync(`curl -s "${url}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
    if (html.includes('5173') || html.includes('@vite/client')) {
        console.error('ERROR: dev server refs in HTML — delete public/hot and retry');
        process.exit(1);
    }
    const fixed = fixHtml(html);
    const out = join(DOCS, dest);
    mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
    writeFileSync(out, fixed);
    console.log(`  → docs/${dest} (${(fixed.length/1024).toFixed(1)} KB)`);
}

// 4. SPA fallback
const notFound = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Waziri Kunambi</title>
<script>var l=window.location;l.replace(l.protocol+'//'+l.hostname+(l.port?':'+l.port:'')+
l.pathname.split('/').slice(0,2).join('/')+'/?p=/'+l.pathname.slice(1).split('/').slice(1).join('/').replace(/&/g,'~and~')+(l.search?'&q='+l.search.slice(1).replace(/&/g,'~and~'):'')+l.hash)
</script></head><body></body></html>`;
writeFileSync(join(DOCS,'404.html'), notFound);
writeFileSync(join(DOCS,'.nojekyll'), '');

const indexHtml = readFileSync(join(DOCS,'index.html'),'utf8');
writeFileSync(join(DOCS,'index.html'), indexHtml.replace('<head>',
    '<head><script>(function(l){if(l.search[1]==="/"){var d=l.search.slice(1).split("&").map(function(s){return s.replace(/~and~/g,"&")});window.history.replaceState(null,null,l.pathname.slice(0,-1)+d[0]+(d[1]?"?"+d[1]:"")+l.hash)}}(window.location))</script>'));

// 5. Verify
console.log('\nVerifying…');
for (const { dest } of pages) {
    const c = readFileSync(join(DOCS, dest), 'utf8');
    if (c.includes('5173') || c.includes('@vite/client') || c.includes('[::1]')) {
        console.error(`FAIL: ${dest} has dev refs`); process.exit(1);
    }
    console.log(`  ✓ docs/${dest}`);
}
console.log('\ndocs/ ready for GitHub Pages.');
