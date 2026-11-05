// everything you read on the site lives here.
// new project, new job, new cert: change this file, leave the components alone.

export const person = {
  name: "Jason Sebastian",
  role: "Designer & developer",
  city: "Jakarta",
  email: "jasonsebastianwork@gmail.com",
  github: "https://github.com/JasonSebastianLim",
  linkedin: "https://www.linkedin.com/in/jason-sebastian88/",
  resume: "/jason-sebastian-resume.pdf",
};

export const meta = {
  title: "Jason Sebastian | Designer & developer",
  description:
    "I design interfaces, build them, and put them on the internet myself. Currently working on Paramita, a Buddhist practice app.",
};

type Link = { label: string; href: string };

export type Project = {
  title: string;
  year?: string;
  medium: string;
  note: string;
  wet?: boolean;
  links: Link[];
};

export const paramita: Project & { did: string[]; how: string } = {
  title: "Paramita",
  year: "2026",
  medium: "Flutter, Go, PostgreSQL, Redis, Astro",
  wet: true,
  note: "A practice app for Indonesian Buddhists. Paritta with Pali and meaning side by side, meditation, the uposatha calendar, and vihara communities. Free, no ads, and it keeps working without internet. It's also my thesis.",
  did: [
    "UI, UX and brand, from the first Figma frame",
    "System architecture: offline-first sync, SQLite on the phone, a queue back to a Go server",
    "Part of the code, and the call on every dependency",
    "Staging, production and the release flow",
  ],
  how: "Not vibecoded. I make the design and architecture calls and write part of the code. AI coding agents do much of the implementation, and I cross-check what they write and test on my own phone before it ships.",
  links: [
    { label: "paramita.app", href: "https://paramita.app" },
    { label: "Join the test", href: "https://paramita.app/ikut" },
  ],
};

export const terminal: Project & { commands: [string, string][] } = {
  title: "terminal.ai.id",
  year: "2026",
  medium: "TypeScript, Next.js, Express, SQLite, Docker, Caddy",
  wet: true,
  note: "A market terminal for the Indonesian stock exchange. It started as a fork of OpenTerminal, an open source project built for US markets. I added everything IDX: broker summaries, a conviction score, macro data, a Telegram bot, and passkey sign-in.",
  commands: [
    ["/q BBCA", "price, signals, broker flow"],
    ["/macro", "Bank Indonesia, IMF, World Bank"],
    ["/portfolio", "holdings, with signals on each"],
    ["/watch", "price alerts"],
    ["/invite", "one-time link for a subscriber"],
  ],
  links: [
    { label: "terminal.ai.id", href: "https://terminal.ai.id" },
    { label: "OpenTerminal", href: "https://github.com/ErTasselli/OpenTerminal" },
  ],
};

export const hung: Project[] = [
  {
    title: "IDPlay",
    medium: "Figma",
    note: "Customer-facing website for an internet service provider, designed as the project's UI/UX designer.",
    links: [{ label: "Live site", href: "https://idplay-josesdio30s-projects.vercel.app/" }],
  },
  {
    title: "Studium",
    medium: "React, Next.js, Figma",
    note: "A quiet web app for studying and focused work.",
    links: [{ label: "GitHub", href: "https://github.com/JasonSebastianLim/studium" }],
  },
];

export const catalogue: { title: string; note: string; medium: string; href?: string }[] = [
  {
    title: "XSJ Billiard",
    note: "Billiard cue shop with a headless CMS",
    medium: "Astro, Decap CMS",
    href: "https://github.com/JasonSebastianLim/xsj-billiard-shop",
  },
  {
    title: "BinusMaya sentiment",
    note: "Sentiment analysis of user feedback on the BinusMaya app",
    medium: "Python",
  },
  {
    title: "Superstore dashboard",
    note: "Cohort analysis with LOD expressions",
    medium: "Tableau",
    href: "https://docs.google.com/document/d/1uYY--x6tAyujqO3Oj2H3IN4VYbWsTgpv9TKZOQyoU50/edit?usp=sharing",
  },
  {
    title: "TUMBAS",
    note: "Health info and consultations against stunting",
    medium: "Figma",
    href: "https://www.canva.com/design/DAGF1i_j5zo/Iw2vbr2GzYDXpOt-P13Xaw/edit",
  },
  {
    title: "Perpustakaan",
    note: "Library database with a fully mapped ERD",
    medium: "Next.js, MongoDB",
    href: "https://docs.google.com/document/d/1ixqau-BE0UX0_OkB_IzxhlVErJ1_Mz8X/edit",
  },
  {
    title: "Social media app",
    note: "Desktop GUI on a local database",
    medium: "Java, XAMPP",
    href: "https://github.com/JasonSebastianLim/SocialMediaApp/tree/master/main/SocialMediaApp",
  },
];

// top to bottom is the order a request actually travels
export const layers: { name: string; record: string; body: string; note?: string }[] = [
  {
    name: "Domain and nameservers",
    record: "paramita.app  NS  dewaweb",
    body: "Where a domain gets its answers from. I kept paramita.app's nameservers on Dewaweb cPanel because the mail is simple there, and pointed only the web records out to the VPS.",
  },
  {
    name: "DNS records",
    record: "api  A  vps   ·   @  MX  cpanel",
    body: "A, CNAME, MX, TXT, and how long a change really takes to reach everyone. One domain can send web, API and mail to three different places.",
  },
  {
    name: "SSL",
    record: "443  tls  auto-renew",
    body: "Certificates on cPanel hosting and on my own servers, and working out why a browser says a site isn't secure.",
  },
  {
    name: "Reverse proxy",
    record: "caddy  →  web:3000  api:4000",
    body: "Caddy sits in front, handles HTTPS and decides what goes where.",
    note: "Every visitor on terminal.ai.id showed up as 172.17.0.1. Docker's userland proxy owned ports 80 and 443 and hid the real address. Moving Caddy to host networking brought it back.",
  },
  {
    name: "Containers and environments",
    record: "docker compose up -d --build",
    body: "On Dewacloud I build environments around what each client needs. One example: a 3,000-outlet F&B chain that needed an ERP system, where I led the migration. My own terminal.ai.id is three containers on one node, run with Docker Compose.",
    note: "Paramita has staging and production, plus one server left frozen. It holds the database my thesis was evaluated on, so a bad migration can't reach it.",
  },
  {
    name: "Load balancing",
    record: "lb  →  node1  node2",
    body: "I know how it works on Dewacloud, spreading traffic across nodes. I haven't needed one for real traffic yet, nothing I run is that big.",
  },
  {
    name: "Releases",
    record: "releases/20261015  ←  current",
    body: "Every Paramita deploy is its own folder behind a symlink. Database dump before any migration, then 23 smoke tests. If they fail it switches back on its own.",
    note: "It's been needed. On staging, a binary uploaded from Git Bash lost its execute bit, systemd refused it with 203/EXEC, and the switch back caught it.",
  },
];

export const stages: { name: string; body: string; filter: string }[] = [
  { name: "Sketch", body: "Talk first. What it's for, who it's for, what can be cut.", filter: "sketch" },
  { name: "Underpainting", body: "Flows and structure. Where the data lives and where it'll be hosted.", filter: "grisaille" },
  { name: "Colour", body: "Figma, then real code, with AI agents in the loop and me checking their work.", filter: "colour" },
  { name: "Varnish", body: "Domain, SSL, deploy, test on a real phone, keep watching.", filter: "varnish" },
];

export const provenance: { when: string; what: string; where: string }[] = [
  { when: "Feb 2026 to now", what: "L1 Tech Support for hosting, domains, DNS and SSL. IT Architect on Dewacloud, building client environments. Ninja of the Month in May and June 2026.", where: "Dewaweb" },
  { when: "2024 to now", what: "UI/UX design and front-end for clients, 10+ projects.", where: "Freelance" },
  { when: "Until Feb 2027", what: "Business Analytics, GPA 3.83.", where: "BINUS University" },
  { when: "2020 to now", what: "Head of Events, youth staff.", where: "Vihara Delapan Jalan Mulia" },
];

export const tools: { group: string; items: string }[] = [
  { group: "Design", items: "Figma, UX research, design systems, prototyping" },
  { group: "Front end", items: "Astro, React, Next.js, Flutter, TypeScript" },
  { group: "Back end", items: "Go, Node, PostgreSQL, Redis, Java" },
  { group: "Infrastructure", items: "Linux, Docker, Caddy, systemd, DNS, cPanel, Dewacloud" },
  { group: "Workflow", items: "Git, GitHub, Playwright, AI coding agents" },
  { group: "Data", items: "Python, SQL, Tableau" },
  { group: "Languages", items: "Indonesian, English, some Mandarin" },
];

export const featuredCertificate = {
  title: "IBM Full Stack Software Developer",
  issuer: "IBM, on Coursera",
  date: "February 2026",
  note: "15 courses, from React and Node.js to Django, Docker, Kubernetes and microservices, ending in a capstone project.",
  href: "https://coursera.org/share/4e3e26c34f7aba1d1dcf13f27338e092",
};

export const certificates: { title: string; issuer: string; year: string }[] = [
  { title: "Data Analyst Associate", issuer: "DataCamp", year: "2025" },
  { title: "AI Fundamentals", issuer: "Dicoding", year: "2024" },
  { title: "Back-End Development with JavaScript", issuer: "Dicoding", year: "2024" },
  { title: "Cloud & Generative AI with AWS", issuer: "Dicoding", year: "2024" },
  { title: "JavaScript Fundamentals", issuer: "Dicoding", year: "2024" },
  { title: "Dart Fundamentals", issuer: "Dicoding", year: "2023" },
  { title: "SQL Fundamentals", issuer: "Dicoding", year: "2023" },
  { title: "Data Science Fundamental", issuer: "Dicoding", year: "2023" },
  { title: "Project Management", issuer: "Dicoding", year: "2023" },
  { title: "Web Development Fundamental", issuer: "Dicoding", year: "2023" },
];

export const credits: { work: string; detail: string; photo: string; href: string }[] = [
  {
    work: "François Lemoyne, Apotheosis of Hercules",
    detail: "1733–36, Salon d'Hercule, Versailles",
    photo: "Adrianna Geo",
    href: "https://unsplash.com/photos/1rBg5YSi00c",
  },
  {
    work: "Abraham Mignon, Flowers in a Metal Vase",
    detail: "c. 1670, Mauritshuis, The Hague",
    photo: "Europeana",
    href: "https://unsplash.com/photos/5TK1F5VfdIk",
  },
  {
    work: "Pietro da Cortona, Allegory of Divine Providence",
    detail: "1633–39, Palazzo Barberini, Rome",
    photo: "Francesco Bianco",
    href: "https://unsplash.com/photos/TVsgRyKJDc0",
  },
];
