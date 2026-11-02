import { fileURLToPath } from 'node:url';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url)).replaceAll('\\', '/').replace(/\/$/, '');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
const shots = `${root}/docs/screenshots`;
await mkdir(shots, { recursive: true });

const routes = JSON.parse(await readFile(`${root}/dist/routes.json`, 'utf8'));
const products = JSON.parse(await readFile(`${root}/docs/product-inventory.json`, 'utf8'));
const countPerformance = (id, category) => products.filter(product =>
  product.performance.split(' ').includes(id) && (!category || product.category === category)
).length;
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
const failedRequests = [];
const badResponses = [];
const layoutIssues = [];
const elementOverflows = [];
const links = new Set();
const titles = new Map();
const checks = [];
const screenshots = [];
const postRequests = [];
let acceptedPayload;

page.on('pageerror', error => errors.push({ route: page.url(), message: error.message }));
page.on('console', message => {
  if (message.type() === 'error') errors.push({ route: page.url(), message: message.text() });
});
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
page.on('response', response => {
  if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
});
page.on('request', request => {
  if (request.method() === 'POST') postRequests.push({ url: request.url(), body: request.postData() });
});

async function inspectRoute(route, width) {
  await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 });
  const response = await page.goto(base + route);
  assert.ok(response?.status() < 400, `${route} failed to load at ${width}px.`);
  await page.locator('h1').waitFor();
  const info = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1;
    };
    return {
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      robots: document.querySelector('meta[name="robots"]')?.content || '',
      links: [...document.querySelectorAll('a')].map(anchor => ({
        href: anchor.getAttribute('href'),
        target: anchor.getAttribute('target'),
        rel: anchor.getAttribute('rel'),
      })),
      images: [...document.images].map(image => ({ src: image.src, alt: image.getAttribute('alt') })),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: [...document.querySelectorAll('h1,h2,h3,a.button,button,.product-card-body,.contact-status')]
        .filter(element => visible(element) && element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1)
        .map(element => `${element.tagName.toLowerCase()}:${(element.textContent || '').trim().slice(0, 60)}`),
    };
  });

  assert.equal(info.h1, 1, `${route} must have one H1.`);
  assert.ok(info.description.length >= 50, `${route} needs a useful meta description.`);
  if (route === '/404.html') assert.equal(info.robots, 'noindex');
  else assert.equal(info.robots, '');
  if (info.overflow) layoutIssues.push({ route, width });
  if (info.clipped.length) elementOverflows.push({ route, width, elements: info.clipped });

  for (const link of info.links) {
    assert.ok(link.href && link.href !== '#', `Empty link at ${route}.`);
    if (link.target === '_blank') assert.ok(link.rel?.includes('noopener'), `Unsafe new-tab link at ${route}.`);
    if (link.href.startsWith('/')) links.add(link.href);
  }
  for (const image of info.images) {
    assert.notEqual(image.alt, null, `Missing alt attribute at ${route}.`);
    links.add(new URL(image.src).pathname);
  }

  if (width === 1440) {
    assert.ok(!titles.has(info.title) || titles.get(info.title) === route, `Duplicate title: ${info.title}`);
    titles.set(info.title, route);
    const product = products.find(item => route === `/products/${item.slug}/`);
    if (product) {
      assert.equal(await page.locator('h1').textContent(), product.name);
      assert.ok(await page.locator(`a[href="/contact/?product=${product.slug}"]`).count());
      assert.ok((await page.locator('.source-strip').textContent()).includes(product.source.file));
      assert.ok((await page.locator('.source-strip').textContent()).includes(`Page ${product.source.page}`));
    }
  }
}

for (const route of routes) await inspectRoute(route.route, 1440);
for (const route of routes) await inspectRoute(route.route, 390);
for (const link of links) {
  const response = await page.request.get(base + link);
  assert.equal(response.status(), 200, `${link} returned ${response.status()}.`);
}
checks.push(`${routes.length} routes audited at 1440px and 390px; one H1, unique titles, descriptions, source/page correspondence for 40 details and ${links.size} internal destinations returning 200.`);

async function loadImages() {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    await Promise.all([...document.images].map(async image => {
      if (!image.complete) {
        await new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }
      await image.decode().catch(() => {});
    }));
  });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(30);
  await page.evaluate(() => window.scrollTo(0, 0));
}

const screenshotRoutes = [
  ['home', '/'],
  ['catalogue', '/products/'],
  ['detail', '/products/t75/'],
  ['window-detail', '/products/at-70s/'],
  ['contact', '/contact/?product=t75'],
  ['technology', '/technology/'],
  ['faq', '/faq/'],
];
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
  for (const [name, route] of screenshotRoutes) {
    await page.goto(base + route);
    await loadImages();
    const broken = await page.evaluate(() => [...document.images].filter(image => !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, [], `Broken images at ${route}, ${width}px.`);
    assert.ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `Overflow at ${route}, ${width}px.`);
    const path = `${shots}/${name}-${width}.png`;
    await page.screenshot({ path, fullPage: true });
    const metadata = await stat(path);
    assert.ok(metadata.size > 10_000, `Suspiciously small screenshot: ${path}`);
    screenshots.push({ path: `docs/screenshots/${name}-${width}.png`, width, bytes: metadata.size });
  }
}
checks.push('Seven representative pages rendered at desktop and mobile widths; every image loaded, screenshots were non-trivial, and no horizontal overflow was detected. 14 screenshots refreshed.');

for (const width of [320, 768, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ['/', '/products/', '/products/tpu-matte-3d-gray/', '/products/at-titanium-40/', '/contact/', '/technology/', '/faq/']) {
    await page.goto(base + route);
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) layoutIssues.push({ route, width });
  }
}
checks.push('Additional 320px, 768px and 1920px representative checks passed.');

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base + '/products/');
await page.locator('#product-search').fill('T75');
assert.equal(await page.locator('.product-card:visible').count(), 2);
await page.locator('#product-search').fill('nonesuch-film');
assert.equal(await page.locator('.product-card:visible').count(), 0);
assert.ok(await page.locator('#empty-state').isVisible());
await page.locator('#empty-reset').click();
assert.equal(await page.locator('.product-card:visible').count(), 40);
await page.locator('#series-filter').selectOption('AE Series');
assert.equal(await page.locator('.product-card:visible').count(), 4);
await page.locator('#reset-filters').click();
await page.locator('#performance-filter').selectOption('thicker-film');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('thicker-film'));
await page.locator('#performance-filter').selectOption('high-vlt');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('high-vlt'));
await page.locator('#performance-filter').selectOption('high-tser');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('high-tser'));
await page.locator('#performance-filter').selectOption('hydrophobic-surface');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('hydrophobic-surface'));
await page.locator('#reset-filters').click();
assert.equal(await page.locator('#performance-filter').inputValue(), '');
await page.locator('#sort-filter').selectOption('thickness');
const thicknesses = await page.locator('.product-card').evaluateAll(cards => cards.map(card => Number(card.dataset.thickness)));
assert.deepEqual(thicknesses, [...thicknesses].sort((a, b) => a - b));
await page.locator('#sort-filter').selectOption('name');
const names = await page.locator('.product-card').evaluateAll(cards => cards.map(card => card.dataset.name));
assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
for (const [id, count] of [['paint-protection-film', 8], ['color-ppf', 11], ['window-film', 21]]) {
  await page.goto(base + `/products/${id}/`);
  assert.equal(await page.locator('.product-card').count(), count);
}
await page.goto(base + '/products/window-film/');
await page.locator('#performance-filter').selectOption('high-vlt');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('high-vlt', 'window-film'));
await page.goto(base + '/products/color-ppf/');
await page.locator('#performance-filter').selectOption('carbon-fiber-effect');
assert.equal(await page.locator('.product-card:visible').count(), countPerformance('carbon-fiber-effect', 'color-ppf'));
checks.push('Search, empty state, reset, series filter, all five performance/material filters, category counts, thickness sort and name sort passed.');

await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base + '/contact/?product=t75');
assert.equal(await page.locator('#product').inputValue(), 't75');
await page.locator('button[type=submit]').click();
assert.equal(await page.locator('[aria-invalid=true]').count(), 4);
assert.equal(await page.locator('#name-error').textContent(), 'Please complete this field.');
await page.locator('#name').fill('Local QA');
await page.locator('#email').fill('invalid');
await page.locator('#country').fill('Test region');
await page.locator('#message').fill('x');
await page.locator('button[type=submit]').click();
assert.equal(await page.locator('[aria-invalid=true]').count(), 2);
assert.equal(await page.locator('#email-error').textContent(), 'Enter a valid email address.');
assert.equal(await page.locator('#message-error').textContent(), 'Please enter at least 10 characters.');
assert.equal(postRequests.length, 0, 'Unsent draft must not issue a POST request.');
await page.locator('#email').fill('qa@example.test');
await page.locator('#message').fill('Local test draft, no delivery expected.');
const downloadPromise = page.waitForEvent('download');
await page.locator('button[type=submit]').click();
const download = await downloadPromise;
const draft = await readFile(await download.path(), 'utf8');
assert.ok(draft.includes('DRAFT ONLY - NOT SENT'));
assert.ok(draft.includes('productName: T75'));
assert.ok(draft.includes('Local test draft, no delivery expected.'));
assert.ok((await page.locator('#form-status').textContent()).includes('Nothing has been sent'));
assert.equal(postRequests.length, 0);
checks.push('Inquiry preselection, four required-field errors, invalid email, short-message validation, accessible error text and model-specific local draft download passed. No POST request occurred.');

await page.route('https://inquiry.invalid/qa', async route => {
  acceptedPayload = route.request().postDataJSON();
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
});
await page.locator('form').evaluate(form => { form.dataset.endpoint = 'https://inquiry.invalid/qa'; });
await page.locator('button[type=submit]').click();
await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('accepted by'));
assert.equal(acceptedPayload.product, 't75');
assert.equal(acceptedPayload.productName, 'T75');
assert.equal(postRequests.length, 1);
await page.unroute('https://inquiry.invalid/qa');

await page.route('https://inquiry.invalid/qa', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":false}' }));
await page.locator('button[type=submit]').click();
await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('could not be confirmed'));
await page.unroute('https://inquiry.invalid/qa');
await page.route('https://inquiry.invalid/qa', route => route.fulfill({ status: 200, contentType: 'application/json', body: 'not-json' }));
await page.locator('button[type=submit]').click();
await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('could not be confirmed'));
checks.push('Intercepted success, explicit rejection and invalid JSON states passed with request payload/product correspondence. These are UI simulations, not real mail delivery.');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + '/');
await page.locator('.menu-toggle').click();
assert.ok(await page.locator('#main-nav').isVisible());
assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
await page.keyboard.press('Escape');
assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
await page.goto(base + '/faq/');
await page.locator('summary').first().click();
assert.notEqual(await page.locator('details').first().getAttribute('open'), null);
checks.push('Mobile navigation, Escape closure and FAQ disclosure passed.');

const missing = await page.request.get(base + '/not-a-real-page/');
assert.equal(missing.status(), 404);
const missingBody = await missing.text();
assert.ok(missingBody.includes('This page is not in the collection.'));
assert.ok(missingBody.includes('<meta name="robots" content="noindex">'));
checks.push('Unknown routes return HTTP 404 with the branded noindex page.');

assert.deepEqual(errors, []);
assert.deepEqual(failedRequests, []);
assert.deepEqual(badResponses, []);
assert.deepEqual(layoutIssues, []);
assert.deepEqual(elementOverflows, []);

const result = {
  timestamp: new Date().toISOString(),
  browser: await browser.version(),
  baseUrl: base,
  routes: routes.length,
  products: products.length,
  internalDestinations: links.size,
  desktopRoutesAudited: routes.length,
  mobileRoutesAudited: routes.length,
  viewports: [320, 390, 768, 1440, 1920],
  screenshots: screenshots.length,
  screenshotFiles: screenshots,
  checks,
  simulatedChecks: [
    'The configured-endpoint success, rejection and invalid-JSON UI states were Playwright interceptions. No external message was sent or delivered.',
  ],
  notTested: [
    'Real email, CRM or WhatsApp delivery',
    'Production DNS, hosting, TLS and host-specific 404 behavior',
    'Real iOS Safari, Android browser and assistive-device testing',
  ],
  errors,
  failedRequests,
  badResponses,
  layoutIssues,
  elementOverflows,
};
await writeFile(`${root}/docs/qa-results.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
