import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const THEMES = ["day", "night"] as const;

for (const theme of THEMES) {
  test.describe(theme, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
    });

    test("no accessibility violations", async ({ page }) => {
      await page.goto("/");
      // open everything so axe also checks what's folded away
      await page.evaluate(() => {
        document.querySelectorAll("details").forEach((d) => {
          d.removeAttribute("name");
          d.open = true;
        });
      });
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target}`))).toEqual([]);
    });

    test("page never scrolls sideways", async ({ page }) => {
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}

test("no console errors or failed requests", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(e.message));
  page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));

  await page.goto("/", { waitUntil: "networkidle" });
  expect(problems).toEqual([]);
});

// preview doesnt send netlify's headers, so a bad CSP would only show up in production
test("csp from netlify.toml doesnt block anything", async ({ page }) => {
  const toml = readFileSync("netlify.toml", "utf8");
  const csp = toml.match(/Content-Security-Policy = "(.+)"/)![1];

  await page.route("**/*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": csp } });
  });

  const blocked: string[] = [];
  page.on("console", (m) => /content security policy/i.test(m.text()) && blocked.push(m.text()));

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("[data-theme-switch]").click();
  await page.getByRole("button", { name: "Infrared" }).click();

  expect(blocked).toEqual([]);
  await expect(page.locator("[data-infrared]")).toHaveAttribute("data-state", "full");
});

test("every image actually loads", async ({ page }) => {
  await page.goto("/");
  const images = page.locator("main img");
  const count = await images.count();
  expect(count).toBeGreaterThan(5);

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("hero painting follows the theme", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "day"));
  await page.goto("/");

  const painting = () => page.locator(".painted").evaluate((el) => getComputedStyle(el).backgroundImage);
  const day = await painting();
  expect(day).toContain("ceiling");

  await page.getByRole("button", { name: "Switch to night" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  expect(await painting()).toContain("still-life");
});

test("theme survives a reload", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator("html").getAttribute("data-theme");
  await page.locator("[data-theme-switch]").click();
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", before!);
});

test("works when storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await page.locator("[data-theme-switch]").click();
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toEqual([]);
});

test("infrared button uncovers the whole painting and back", async ({ page }) => {
  await page.goto("/");
  const layer = page.locator("[data-infrared]");
  const button = page.getByRole("button", { name: "Infrared" });

  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(layer).toHaveAttribute("data-state", "full");

  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect(layer).toHaveAttribute("data-state", "off");
});

test("infrared button is on screen with the painting, no scrolling", async ({ page }) => {
  await page.goto("/");
  const box = await page.getByRole("button", { name: "Infrared" }).boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
});

test("lens follows the mouse", async ({ page, isMobile }) => {
  test.skip(isMobile, "no mouse on a phone");
  await page.goto("/");
  await page.mouse.move(1000, 300);
  const layer = page.locator("[data-infrared]");
  await expect(layer).toHaveAttribute("data-state", "lens");
  expect(await layer.evaluate((el) => el.style.getPropertyValue("--lx"))).not.toBe("");
});

test("tap drops the lens without blocking scroll", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch only");
  await page.goto("/");
  await page.touchscreen.tap(195, 240);
  await expect(page.locator("[data-infrared]")).toHaveAttribute("data-state", "lens");
});

test("readable with javascript off", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/");

  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#work h3").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "jasonsebastianwork@gmail.com" })).toBeVisible();
  await context.close();
});

test("nav goes where it says", async ({ page }) => {
  await page.goto("/");
  for (const id of ["work", "underpainting", "about", "contact"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.locator(`nav a[href="/#${id}"]`)).toHaveCount(1);
  }
});

test("only one infrastructure layer open at a time", async ({ page }) => {
  await page.goto("/");
  const layers = page.locator(".stack details");
  await expect(layers).toHaveCount(7);

  await layers.nth(3).locator("summary").click();
  await expect(layers.nth(3)).toHaveAttribute("open", "");
  await expect(page.locator(".stack details[open]")).toHaveCount(1);
});

test("resume is there", async ({ request }) => {
  const res = await request.get("/jason-sebastian-resume.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("unknown page gets the 404", async ({ page }) => {
  await page.goto("/404");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("on loan");
  await expect(page.getByRole("link", { name: "Back to the gallery" })).toBeVisible();
});

// the repo is public so the list cant live here. .private-words is gitignored, one word per line
test("nothing private in the html", async ({ page }) => {
  test.skip(!existsSync(".private-words"), "only runs on my machine");

  const words = readFileSync(".private-words", "utf8").split(/\r?\n/).filter(Boolean);
  await page.goto("/");
  const html = (await page.content()).toLowerCase();

  for (const word of words) expect(html).not.toContain(word.toLowerCase());
});
