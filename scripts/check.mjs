import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  products,
  categories,
  faq,
  ppfProducts,
  colorProducts,
  windowProducts,
  performanceFilters,
} from '../src/data/catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'));
const publicSiteUrl = site.siteUrl || (process.env.GITHUB_REPOSITORY ? `https://${process.env.GITHUB_REPOSITORY.split('/')[0]}.github.io` : '');
const assets = JSON.parse(await readFile(path.join(root, 'src/data/asset-sources.json'), 'utf8'));
const routes = JSON.parse(await readFile(path.join(dist, 'routes.json'), 'utf8'));
const expectedSources = new Set([
  'AUTO Tailor 隐形车衣.中文版.pdf',
  'AT TPU宣传册.中文版.pdf',
  'AT窗膜画册中文版.pdf',
]);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));
const routeFile = route => path.join(dist, route.endsWith('/') ? `${route.slice(1)}index.html` : route.slice(1));
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);

assert.equal(products.length, 40, 'The catalogue must contain exactly 40 entries.');
assert.equal(ppfProducts.length, 8);
assert.equal(colorProducts.length, 11);
assert.equal(windowProducts.length, 21);
assert.equal(new Set(products.map(product => product.slug)).size, 40, 'Product slugs must be unique.');
assert.equal(new Set(products.map(product => product.name)).size, 40, 'Product names must be unique.');
assert.equal(new Set(routes.map(route => route.route)).size, routes.length, 'Built routes must be unique.');
assert.equal(routes.length, 49, 'The build must contain exactly 49 routes.');
assert.equal(new Set(routes.map(route => route.title)).size, 49, 'Every route needs a unique title.');

for (const category of categories) {
  assert.equal(products.filter(product => product.category === category.id).length, category.count);
}

for (const product of products) {
  assert.ok(product.name && product.chineseName && product.description && product.imageNote);
  assert.ok(product.specs.length >= 3 && product.features.length >= 3 && product.care.length >= 2);
  assert.ok(product.performance && product.performance.split(' ').length >= 1);
  assert.ok(expectedSources.has(product.source.file), `Unexpected source for ${product.slug}.`);
  assert.ok(Number.isInteger(product.source.page) && product.source.page > 0);
  if (product.category === 'paint-protection-film') assert.ok(product.source.page >= 16 && product.source.page <= 27);
  if (product.category === 'color-ppf') assert.equal(product.source.page, 31);
  if (product.category === 'window-film') assert.ok([5, 7, 9, 11].includes(product.source.page));
  assert.ok(assets.some(asset => asset.asset === product.image), `Missing source record for ${product.image}.`);
  await stat(path.join(root, 'public', product.image.slice(1)));
  if (product.evidence) {
    assert.ok(assets.some(asset => asset.asset === product.evidence), `Missing source record for ${product.evidence}.`);
    await stat(path.join(root, 'public', product.evidence.slice(1)));
  }
  assert.ok(!/(?:CNY|RMB|¥|￥|\bprice\b)/i.test(JSON.stringify(product)), `Price data must not be published for ${product.slug}.`);

  const html = await readFile(routeFile(`/products/${product.slug}/`), 'utf8');
  assert.ok(html.includes(`/contact/?product=${product.slug}`), `Missing inquiry link for ${product.slug}.`);
  assert.ok(html.includes(escapeHtml(product.source.file)), `Missing source file for ${product.slug}.`);
  assert.ok(html.includes(`Page ${product.source.page}`), `Missing source page for ${product.slug}.`);
  for (const [key, value] of product.specs) {
    assert.ok(html.includes(escapeHtml(key)) && html.includes(escapeHtml(value)), `Rendered specification mismatch for ${product.slug}: ${key}.`);
  }
}

for (const filter of performanceFilters) {
  assert.ok(products.some(product => product.performance.split(' ').includes(filter.id)), `Unused performance filter ${filter.id}.`);
}
assert.ok(faq.length >= 9 && faq.every(item => item.source), 'FAQ entries need source notes.');

for (const asset of assets) {
  assert.ok(asset.source && Number.isInteger(asset.page) && asset.page > 0);
  assert.ok(expectedSources.has(asset.source), `Unexpected asset source ${asset.source}.`);
  await stat(path.join(root, 'public', asset.asset.slice(1)));
}

let deployedFiles = 0;
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      assert.ok(!['node_modules', '.cache', '__MACOSX'].includes(entry.name));
      await scan(full);
      continue;
    }
    deployedFiles++;
    assert.ok(!/\.(php|sql|exe|zip|env)$/i.test(entry.name), `Unexpected deployed file ${full}.`);
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const text = await readFile(full, 'utf8');
    assert.ok(
      !/(?:fahuo100|alipay|tenpay|wechat.?pay|stripe|paypal|shopping.?cart|add.?to.?cart|buy.?now|checkout|member\/login|card[_-]?key|automatic.?delivery)/i.test(text),
      `Transaction or legacy code found in ${full}.`,
    );
    assert.ok(
      !/(?:BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|api[_-]?secret\s*[:=]|private[_-]?key\s*[:=])/i.test(text),
      `Secret-like content found in ${full}.`,
    );
  }
}
await scan(dist);
await scan(path.join(root, 'src'));
await scan(path.join(root, 'public'));

for (const route of routes) {
  const html = await readFile(routeFile(route.route), 'utf8');
  assert.ok(/<html lang="en">/.test(html));
  assert.ok(/<title>[^<]+ \| AUTO Tailor<\/title>/.test(html));
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  assert.ok(description.length >= 50, `Description too short for ${route.route}.`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One H1 required for ${route.route}.`);
  if (route.route === '/404.html') assert.ok(html.includes('<meta name="robots" content="noindex">'));
  else assert.ok(!html.includes('<meta name="robots" content="noindex">'));
  if (publicSiteUrl) {
    assert.ok(html.includes('<link rel="canonical"'));
    if (route.route !== '/404.html') assert.ok(!html.includes('<meta name="robots" content="noindex">'));
  } else {
    assert.ok(!html.includes('<link rel="canonical"'));
  }
}

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (publicSiteUrl) {
  assert.ok(robots.startsWith('User-agent: *\nAllow: /'));
  await stat(path.join(dist, 'sitemap.xml'));
} else {
  assert.equal(robots, 'User-agent: *\nDisallow: /\n');
}

console.log(`PASS: ${routes.length} built pages, ${products.length} unique sourced products, 3 category counts, ${assets.length} source-mapped assets, performance metadata, inquiry links, SEO/robots rules, no legacy commerce or secrets (${deployedFiles} deployed files scanned).`);
