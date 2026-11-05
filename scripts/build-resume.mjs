// resume/resume.html -> public/jason-sebastian-resume.pdf
// edit the html, npm run resume. real text in one column so ATS parsers can read it.

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const OUT = "public/jason-sebastian-resume.pdf";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve("resume/resume.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const raw = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();

// chrome stamps itself on the file, recruiters see this in the doc properties
const pdf = await PDFDocument.load(raw);
pdf.setTitle("Jason Sebastian Resume");
pdf.setAuthor("Jason Sebastian");
pdf.setSubject("Resume");
pdf.setCreator("Jason Sebastian");
pdf.setProducer("Jason Sebastian");
pdf.setKeywords([]);

await writeFile(OUT, await pdf.save());
console.log(`${OUT}: ${pdf.getPageCount()} page(s)`);
