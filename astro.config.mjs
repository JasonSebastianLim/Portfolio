import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jasonsebastian.netlify.app",
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
});
