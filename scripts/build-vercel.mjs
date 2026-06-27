/**
 * Build static export for Vercel (base = /).
 * Run: node scripts/build-vercel.mjs
 * Requires the Laravel dev server running: php artisan serve --port=8080
 */
import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');
const APP   = join(ROOT, 'laravel-app');
const OUT   = join(ROOT, 'dist');
const HOT   = join(APP, 'public/hot');
const PORT  = process.env.PORT || 8080;

if (existsSync(HOT)) { rmSync(HOT); console.log('Removed public/hot'); }

// 1. Normal Vite build (base = /)
console.log('Building assets for Vercel…');
execSync('npm run build', { cwd: APP, stdio: 'inherit' });

// 2. Copy assets
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(APP, 'public/build'),  join(OUT, 'build'),  { recursive: true });
cpSync(join(APP, 'public/assets'), join(OUT, 'assets'), { recursive: true });
for (const f of ['favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png',
                  'robots.txt','heropic.svg','logo.svg','paintball_gun.glb']) {
    try { cpSync(join(APP,'public',f), join(OUT,f)); } catch {}
}

// 3. Crawl pages (no path prefix needed — base is /)
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
    const out = join(OUT, dest);
    mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
    writeFileSync(out, html);
    console.log(`  → dist/${dest} (${(html.length/1024).toFixed(1)} KB)`);
}

writeFileSync(join(OUT, '.vercel-out'), '');

// 4. Verify
console.log('\nVerifying…');
for (const { dest } of pages) {
    const c = readFileSync(join(OUT, dest), 'utf8');
    if (c.includes('5173') || c.includes('@vite/client') || c.includes('[::1]')) {
        console.error(`FAIL: ${dest} has dev refs`); process.exit(1);
    }
    console.log(`  ✓ dist/${dest}`);
}
console.log('\ndist/ ready for Vercel.');
