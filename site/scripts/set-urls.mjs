// Writes the public addresses into the site before the production build:
// `node scripts/set-urls.mjs https://workhoraire.example https://app.workhoraire.example`.
// The pages are pre-rendered, so canonical URLs, Open Graph tags, robots.txt,
// sitemap.xml and the links to the application are fixed at build time.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LOCAL_SITE_URL = 'http://localhost:4400';
const LOCAL_APP_URL = 'http://localhost:4200';

function publicUrl(value, name) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute URL, got "${value}"`);
  }
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && !url.hostname.endsWith('.localhost')) {
    throw new Error(`${name} must use https, got "${value}"`);
  }
  return url.origin;
}

const [siteArgument, appArgument] = process.argv.slice(2);
if (!siteArgument || !appArgument) {
  console.error('Usage: node scripts/set-urls.mjs <site URL> <application URL>');
  process.exit(1);
}
const siteUrl = publicUrl(siteArgument, 'SITE_URL');
const appUrl = publicUrl(appArgument, 'APP_URL');

// A public site must not go live with incomplete legal notices (LCEN): the
// publisher's identity comes from src/app/core/legal/legal-info.json.
const siteHost = new URL(siteUrl).hostname;
if (siteHost !== 'localhost' && !siteHost.endsWith('.localhost')) {
  const info = JSON.parse(
    readFileSync(fileURLToPath(new URL('../src/app/core/legal/legal-info.json', import.meta.url)), 'utf8'),
  );
  const required = ['name', 'legalForm', 'address', 'registration', 'vatExempt', 'email', 'phone', 'publicationDirector'];
  const missing = [
    ...required.filter((field) => info.publisher[field] === null).map((field) => `publisher.${field}`),
    ...['address', 'phone'].filter((field) => info.hosting[field] === null).map((field) => `hosting.${field}`),
  ];
  if (missing.length > 0) {
    console.error(`Legal notice incomplete, fill src/app/core/legal/legal-info.json: ${missing.join(', ')}`);
    process.exit(1);
  }
}

const files = ['src/environments/environment.ts', 'public/robots.txt', 'public/sitemap.xml'];
for (const file of files) {
  const path = fileURLToPath(new URL(`../${file}`, import.meta.url));
  const content = readFileSync(path, 'utf8')
    .replaceAll(LOCAL_SITE_URL, siteUrl)
    .replaceAll(LOCAL_APP_URL, appUrl);
  writeFileSync(path, content);
}
console.log(`Site: ${siteUrl}, application: ${appUrl}`);
