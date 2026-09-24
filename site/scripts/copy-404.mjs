// Runs after `npm run build`. Angular prerenders the "/404" route to 404/index.html; static web
// servers (nginx `error_page`, Caddy `handle_errors`, most static hosts) expect 404.html instead.
import { copyFileSync, existsSync } from 'node:fs';

const browserDir = new URL('../dist/site/browser/', import.meta.url);
const source = new URL('404/index.html', browserDir);

if (!existsSync(source)) {
  console.error('dist/site/browser/404/index.html is missing: the build did not prerender it.');
  process.exit(1);
}

copyFileSync(source, new URL('404.html', browserDir));
console.log('Copied 404/index.html to dist/site/browser/404.html');
