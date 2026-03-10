const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE_URL = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const SITEMAP_PATH =
  process.env.AUDIT_SITEMAP_PATH ||
  path.join(process.cwd(), "output", "playwright", "sitemap.xml");
const OUTPUT_DIR =
  process.env.AUDIT_OUTPUT_DIR ||
  path.join(process.cwd(), "output", "site-audit");
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, "screenshots");
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || "4");
const TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT_MS || "45000");
const VIEWPORT_WIDTH = Number(process.env.AUDIT_VIEWPORT_WIDTH || "1440");
const VIEWPORT_HEIGHT = Number(process.env.AUDIT_VIEWPORT_HEIGHT || "1200");

const IGNORE_CONSOLE_PATTERNS = [
  /preloaded using link preload/i,
  /allowedDevOrigins/i,
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readRoutesFromSitemap(filePath) {
  const xml = fs.readFileSync(filePath, "utf8");
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1])
    .filter(Boolean);
}

function toPathname(url) {
  const parsed = new URL(url);
  return parsed.pathname === "" ? "/" : parsed.pathname;
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
}

function classifyTemplate(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/planning") return "planning";
  if (pathname === "/products") return "products-index";
  if (/^\/products\/[^/]+\/[^/]+$/.test(pathname)) return "product-detail";
  if (/^\/products\/[^/]+$/.test(pathname)) return "product-category";
  if (pathname === "/solutions") return "solutions-index";
  if (/^\/solutions\/[^/]+$/.test(pathname)) return "solution-detail";
  if (pathname === "/projects") return "projects-index";
  const first = pathname.split("/").filter(Boolean)[0];
  return first ? `page-${first}` : "page";
}

function routeSlug(pathname) {
  if (pathname === "/") return "home";
  return pathname
    .replace(/^\//, "")
    .replace(/[^\w/-]+/g, "-")
    .replace(/\//g, "__");
}

function shouldIgnoreConsole(text) {
  return IGNORE_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

function shouldIgnoreRequestFailure(url, errorText, method) {
  if (/ERR_ABORTED/i.test(errorText)) {
    if (/[?&]_rsc=/i.test(url)) return true;
    if (method === "HEAD" && /\.(glb|gltf|webp|png|jpg|jpeg|svg)(\?|$)/i.test(url)) return true;
  }
  return false;
}

function summarizeResults(results) {
  return {
    total: results.length,
    failed: results.filter((item) => item.failed).length,
    pagesWithConsoleErrors: results.filter((item) => item.consoleErrors.length > 0).length,
    pagesWithPageErrors: results.filter((item) => item.pageErrors.length > 0).length,
    pagesWithRequestFailures: results.filter((item) => item.requestFailures.length > 0).length,
    pagesWithHttpErrors: results.filter((item) => item.httpErrors.length > 0).length,
    pagesWithOverflow: results.filter((item) => item.metrics.hasHorizontalOverflow).length,
    pagesWithBrokenImages: results.filter((item) => item.metrics.brokenImages > 0).length,
  };
}

function markdownSummary(results, summary) {
  const issueRoutes = results.filter(
    (item) =>
      item.failed ||
      item.consoleErrors.length > 0 ||
      item.pageErrors.length > 0 ||
      item.requestFailures.length > 0 ||
      item.httpErrors.length > 0 ||
      item.metrics.hasHorizontalOverflow ||
      item.metrics.brokenImages > 0,
  );

  const topIssues = issueRoutes
    .sort((a, b) => {
      const aScore =
        Number(a.failed) * 10 +
        a.pageErrors.length * 5 +
        a.consoleErrors.length * 3 +
        a.requestFailures.length * 2 +
        a.httpErrors.length * 2 +
        Number(a.metrics.hasHorizontalOverflow);
      const bScore =
        Number(b.failed) * 10 +
        b.pageErrors.length * 5 +
        b.consoleErrors.length * 3 +
        b.requestFailures.length * 2 +
        b.httpErrors.length * 2 +
        Number(b.metrics.hasHorizontalOverflow);
      return bScore - aScore;
    })
    .slice(0, 40);

  const lines = [
    "# Site Audit",
    "",
    `- Routes checked: ${summary.total}`,
    `- Failed navigations: ${summary.failed}`,
    `- Pages with console errors: ${summary.pagesWithConsoleErrors}`,
    `- Pages with page errors: ${summary.pagesWithPageErrors}`,
    `- Pages with request failures: ${summary.pagesWithRequestFailures}`,
    `- Pages with HTTP errors: ${summary.pagesWithHttpErrors}`,
    `- Pages with horizontal overflow: ${summary.pagesWithOverflow}`,
    `- Pages with broken images: ${summary.pagesWithBrokenImages}`,
    "",
    "## Top Issues",
    "",
  ];

  if (topIssues.length === 0) {
    lines.push("- No major route-level issues detected.");
  } else {
    for (const item of topIssues) {
      lines.push(`### ${item.path}`);
      lines.push(`- Template: ${item.template}`);
      lines.push(`- Screenshot: \`output/site-audit/screenshots/${item.screenshotName}\``);
      if (item.failed) lines.push(`- Failed: ${item.failed}`);
      if (item.pageErrors.length > 0) lines.push(`- Page errors: ${item.pageErrors.join(" | ")}`);
      if (item.consoleErrors.length > 0)
        lines.push(`- Console errors: ${item.consoleErrors.slice(0, 3).join(" | ")}`);
      if (item.httpErrors.length > 0)
        lines.push(`- HTTP errors: ${item.httpErrors.slice(0, 3).join(" | ")}`);
      if (item.requestFailures.length > 0)
        lines.push(`- Request failures: ${item.requestFailures.slice(0, 3).join(" | ")}`);
      if (item.metrics.hasHorizontalOverflow)
        lines.push(`- Overflow: scrollWidth ${item.metrics.scrollWidth} > viewport ${item.metrics.viewportWidth}`);
      if (item.metrics.brokenImages > 0)
        lines.push(`- Broken images: ${item.metrics.brokenImages}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

async function auditRoute(browser, url) {
  const page = await browser.newPage({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const normalizedUrl = normalizeUrl(url);
  const pathname = toPathname(normalizedUrl);
  const template = classifyTemplate(pathname);
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const httpErrors = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (shouldIgnoreConsole(text)) return;
    if (msg.type() === "error") consoleErrors.push(text);
  });

  page.on("pageerror", (error) => {
    pageErrors.push(String(error.message || error));
  });

  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText || "failed";
    if (shouldIgnoreRequestFailure(request.url(), errorText, request.method())) return;
    requestFailures.push(`${request.method()} ${request.url()} :: ${errorText}`);
  });

  page.on("response", (response) => {
    if (response.status() >= 400) {
      const req = response.request();
      const resourceType = req.resourceType();
      httpErrors.push(`${response.status()} ${resourceType} ${response.url()}`);
    }
  });

  let failed = "";
  let finalUrl = normalizedUrl;
  try {
    await page.goto(normalizedUrl, { waitUntil: "networkidle", timeout: TIMEOUT_MS });
    finalUrl = page.url();
  } catch (error) {
    failed = error instanceof Error ? error.message : String(error);
  }

  const metrics = failed
    ? {
        hasHorizontalOverflow: false,
        scrollWidth: 0,
        viewportWidth: 0,
        brokenImages: 0,
        title: "",
        headingCount: 0,
        bodyTextLength: 0,
      }
    : await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const headings = document.querySelectorAll("h1, h2, h3");
        const brokenImages = Array.from(document.images).filter(
          (img) => img.complete && img.naturalWidth === 0,
        ).length;
        return {
          hasHorizontalOverflow: docEl.scrollWidth > window.innerWidth + 2,
          scrollWidth: docEl.scrollWidth,
          viewportWidth: window.innerWidth,
          brokenImages,
          title: document.title,
          headingCount: headings.length,
          bodyTextLength: body?.innerText?.trim().length || 0,
        };
      });

  const screenshotName = `${routeSlug(pathname || "/")}.png`;
  const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
  try {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  } catch (error) {
    if (!failed) {
      failed = `Screenshot failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  await page.close();

  return {
    url: normalizedUrl,
    path: pathname,
    finalUrl,
    template,
    failed,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 10),
    pageErrors: [...new Set(pageErrors)].slice(0, 10),
    requestFailures: [...new Set(requestFailures)].slice(0, 10),
    httpErrors: [...new Set(httpErrors)].slice(0, 10),
    metrics,
    screenshotName,
  };
}

async function runPool(items, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;
      const result = await worker(item);
      results.push(result);
      process.stdout.write(`Audited ${results.length}/${items.length}\r`);
    }
  });
  await Promise.all(runners);
  process.stdout.write("\n");
  return results;
}

async function main() {
  ensureDir(OUTPUT_DIR);
  ensureDir(SCREENSHOT_DIR);

  const urls = readRoutesFromSitemap(SITEMAP_PATH)
    .map((url) => url.replace("http://localhost:3000", BASE_URL))
    .filter(Boolean);

  const browser = await chromium.launch({ headless: true });
  try {
    const results = await runPool(urls, (url) => auditRoute(browser, url));
    const sorted = results.sort((a, b) => a.path.localeCompare(b.path));
    const summary = summarizeResults(sorted);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, "audit-results.json"),
      JSON.stringify({ summary, results: sorted }, null, 2),
      "utf8",
    );
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "audit-summary.md"),
      markdownSummary(sorted, summary),
      "utf8",
    );

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
