# jasonsebastian.netlify.app

My portfolio. Day is a fresco ceiling, night is a Dutch still life, and the Infrared button shows what's underneath.

## Running it

```
npm ci
npm run dev
```

## Changing things

All the words are in `src/data/site.ts`. New project, new job, new certificate, that's the only file to touch.

If the hero paintings change, run `npm run infrared` to remake the infrared layers.

The resume is `resume/resume.html`. Edit it, then `npm run resume` to rebuild the PDF.

## Before pushing

```
npm run verify
```

Type check, build, then the Playwright tests on a desktop and a phone, both themes, including an axe accessibility pass. First time on a machine: `npx playwright install chromium`.

`npm run links` checks every outside link in `dist`. It also runs by itself every Monday on GitHub Actions.

## Why it's built like this

Static files, no server, no CSS framework, two runtime packages. There's not much here that can break, which is the point. Nothing waits on JavaScript to show content, so if a script dies the page still reads fine.

Fonts are self hosted and the lockfile is committed, so a build today matches a build next year.
