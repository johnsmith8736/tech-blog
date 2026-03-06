import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const defaultSiteUrl = "https://johnsmith8736.github.io/tech-blog";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts");
const outputFile = path.join(rootDir, "public", "sitemap.xml");

function toDateString(value) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return new Date().toISOString().split("T")[0];
  }
  return new Date(parsed).toISOString().split("T")[0];
}

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlEntry(url, lastmod, changefreq, priority) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(url)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function loadPostEntries() {
  const fileNames = fs.existsSync(postsDir)
    ? fs.readdirSync(postsDir).filter((fileName) => fileName.endsWith(".md"))
    : [];

  return fileNames
    .map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDir, fileName);
    const content = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(content);
    const lastmod = toDateString(String(data.date || ""));

    return {
      url: `${siteUrl}/posts/${slug}/`,
      lastmod,
      changefreq: "weekly",
      priority: "0.8",
    };
  })
    .sort((a, b) => Date.parse(b.lastmod) - Date.parse(a.lastmod));
}

function main() {
  const postEntries = loadPostEntries();
  const latestLastmod = postEntries[0]?.lastmod || new Date().toISOString().split("T")[0];

  const staticEntries = [
    {
      url: `${siteUrl}/`,
      lastmod: latestLastmod,
      changefreq: "daily",
      priority: "1.0",
    },
    {
      url: `${siteUrl}/about/`,
      lastmod: latestLastmod,
      changefreq: "monthly",
      priority: "0.6",
    },
  ];

  const allEntries = [...staticEntries, ...postEntries];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allEntries.map((entry) =>
      buildUrlEntry(entry.url, entry.lastmod, entry.changefreq, entry.priority)
    ),
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(outputFile, xml, "utf8");
  console.log(`Generated sitemap with ${allEntries.length} URLs at ${outputFile}`);
}

main();
