// goes through every outside link in the built site and yells if one died.
// xsjbilliard.com lapsed and nobody noticed for months, this is so that doesnt happen again.
// runs weekly in CI. needs a build first.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const TIMEOUT = 15_000;

// these block bots or need a login, a 403 from them means nothing
const SKIP = ["linkedin.com", "docs.google.com", "canva.com"];

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const path = join(dir, e.name);
      if (e.isDirectory()) return htmlFiles(path);
      return e.name.endsWith(".html") ? [path] : [];
    }),
  );
  return nested.flat();
}

async function check(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { "user-agent": "portfolio-link-check" },
    });
    return res.status;
  } catch (err) {
    return err.cause?.code ?? err.name;
  }
}

const urls = new Set();
for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, "utf8");
  for (const [, url] of html.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"/g)) urls.add(url);
}

const targets = [...urls].filter((u) => !SKIP.some((s) => u.includes(s)));
const results = await Promise.all(targets.map(async (url) => [url, await check(url)]));
const dead = results.filter(([, status]) => !(typeof status === "number" && status < 400));

console.log(`checked ${targets.length}, skipped ${urls.size - targets.length}`);
for (const [url, status] of dead) console.error(`dead  ${status}  ${url}`);
process.exit(dead.length ? 1 : 0);
