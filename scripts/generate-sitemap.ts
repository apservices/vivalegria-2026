// Runs before `vite dev` and `vite build` via predev/prebuild; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://vivalegria.com.br";
const today = new Date().toISOString().slice(0, 10);

interface Entry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/pacotes", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/oficinas", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/corporativo", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/quem-somos", changefreq: "yearly", priority: "0.7", lastmod: today },
  { path: "/contato", changefreq: "yearly", priority: "0.7", lastmod: today },
  { path: "/contratar", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/guia-para-pais", changefreq: "monthly", priority: "0.6", lastmod: today },
  { path: "/trabalhe-conosco", changefreq: "monthly", priority: "0.6", lastmod: today },
  { path: "/festa-infantil", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/recreacao-infantil-sp", changefreq: "monthly", priority: "0.9", lastmod: today },
  { path: "/eventos-corporativos-infantis", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/orcamento", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/termos", changefreq: "yearly", priority: "0.3", lastmod: today },
  { path: "/privacidade", changefreq: "yearly", priority: "0.3", lastmod: today },
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
