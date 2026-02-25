const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const DOCS_ROOT = path.join(ROOT, 'docs');
const DOCS_DIR = path.join(DOCS_ROOT, 'generated');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listFiles(dirPath) {
  const out = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    if (item.name.startsWith('.')) continue;
    const full = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      if (full === path.join(SRC_DIR, 'repository')) continue;
      out.push(...listFiles(full));
    } else if (item.isFile() && item.name.endsWith('.ts')) {
      out.push(full);
    }
  }
  return out;
}

function getRelativePosix(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function getDocsPath(relSourcePath) {
  const rel = relSourcePath.replace(/^src\//, '').replace(/\.ts$/, '.md');
  return path.join(DOCS_DIR, rel);
}

function extractImports(content) {
  const imports = new Set();
  const importRegex = /^\s*import\s+[^;]*\s+from\s+['"]([^'"]+)['"]/gm;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  return Array.from(imports).sort();
}

function extractExports(content) {
  const exports = new Set();
  const exportDecl = /\bexport\s+(?:declare\s+)?(class|interface|type|function|const|enum)\s+([A-Za-z0-9_]+)/g;
  let match;
  while ((match = exportDecl.exec(content)) !== null) {
    exports.add(`${match[1]} ${match[2]}`);
  }

  const exportDefault = /\bexport\s+default\s+(class|function)?\s*([A-Za-z0-9_]+)?/g;
  while ((match = exportDefault.exec(content)) !== null) {
    const kind = match[1] ? `${match[1]} ` : '';
    const name = match[2] ? match[2] : '(anonymous)';
    exports.add(`default ${kind}${name}`.trim());
  }

  const exportList = /\bexport\s*{([^}]+)}/g;
  while ((match = exportList.exec(content)) !== null) {
    const entries = match[1].split(',').map((s) => s.trim()).filter(Boolean);
    for (const entry of entries) {
      exports.add(`re-export ${entry}`);
    }
  }

  const exportStar = /\bexport\s+\*\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = exportStar.exec(content)) !== null) {
    exports.add(`re-export * from ${match[1]}`);
  }

  return Array.from(exports).sort();
}

function countLines(content) {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function toTitle(relSourcePath) {
  return `Module: ${relSourcePath.replace(/^src\//, '')}`;
}

function writeModuleDoc(relSourcePath, content) {
  const imports = extractImports(content);
  const exports = extractExports(content);
  const lineCount = countLines(content);
  const docPath = getDocsPath(relSourcePath);
  ensureDir(path.dirname(docPath));

  const lines = [];
  lines.push(`# ${toTitle(relSourcePath)}`);
  lines.push('');
  lines.push(`Source: \`${relSourcePath}\``);
  lines.push('');
  lines.push(`Lines: ${lineCount}`);
  lines.push('');
  lines.push('## Exports');
  if (exports.length === 0) {
    lines.push('');
    lines.push('- (none)');
  } else {
    lines.push('');
    for (const e of exports) lines.push(`- ${e}`);
  }
  lines.push('');
  lines.push('## Imports');
  if (imports.length === 0) {
    lines.push('');
    lines.push('- (none)');
  } else {
    lines.push('');
    for (const i of imports) lines.push(`- ${i}`);
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('This document is generated from source. Update the generator if you want richer summaries.');
  lines.push('');

  fs.writeFileSync(docPath, lines.join('\n'), 'utf8');

  return {
    relSourcePath,
    docPath,
    title: toTitle(relSourcePath),
    lineCount,
    exportCount: exports.length,
    importCount: imports.length,
  };
}

function writeSummary(pages) {
  const summaryPath = path.join(DOCS_DIR, 'SUMMARY.md');
  const lines = [];
  lines.push('# Documentation Summary');
  lines.push('');
  lines.push('- [Overview](README.md)');
  for (const page of pages) {
    const relDoc = path.relative(DOCS_DIR, page.docPath).split(path.sep).join('/');
    lines.push(`- [${page.title}](./${relDoc})`);
  }
  lines.push('');
  fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8');
}

function writeOverview(pages) {
  const readmePath = path.join(DOCS_DIR, 'README.md');
  const lines = [];
  lines.push('# Tool Custom SDK Documentation');
  lines.push('');
  lines.push('Generated docs for all source files in `src/`.');
  lines.push('');
  lines.push('## Contents');
  lines.push('');
  for (const page of pages) {
    const relDoc = path.relative(DOCS_DIR, page.docPath).split(path.sep).join('/');
    lines.push(`- [${page.title}](./${relDoc})`);
  }
  lines.push('');
  fs.writeFileSync(readmePath, lines.join('\n'), 'utf8');
}

function writeSitemapJson(pages) {
  const sitemapPath = path.join(DOCS_DIR, 'sitemap.json');
  const payload = {
    generatedAt: new Date().toISOString(),
    pages: pages.map((p) => ({
      title: p.title,
      source: p.relSourcePath,
      doc: path.relative(DOCS_DIR, p.docPath).split(path.sep).join('/'),
      lines: p.lineCount,
      exports: p.exportCount,
      imports: p.importCount,
    })),
  };
  fs.writeFileSync(sitemapPath, JSON.stringify(payload, null, 2), 'utf8');
}

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function writeSitemapXml(pages) {
  const sitemapPath = path.join(DOCS_DIR, 'sitemap.xml');
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const page of pages) {
    const relDoc = path.relative(DOCS_DIR, page.docPath).split(path.sep).join('/');
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(relDoc)}</loc>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  lines.push('');
  fs.writeFileSync(sitemapPath, lines.join('\n'), 'utf8');
}

function readLinesIfExists(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  return countLines(content);
}

function writeRootSitemap(pages) {
  const manualPages = [];
  const archPath = path.join(DOCS_ROOT, 'ARCHITECTURE.md');
  if (fs.existsSync(archPath)) {
    manualPages.push({
      title: 'Tổng quan kiến trúc',
      source: 'docs/ARCHITECTURE.md',
      doc: 'ARCHITECTURE.md',
      lines: readLinesIfExists(archPath),
      exports: 0,
      imports: 0,
    });
  }

  const generatedPages = pages.map((p) => ({
    title: p.title,
    source: p.relSourcePath,
    doc: `generated/${path.relative(DOCS_DIR, p.docPath).split(path.sep).join('/')}`,
    lines: p.lineCount,
    exports: p.exportCount,
    imports: p.importCount,
  }));

  const allPages = [...manualPages, ...generatedPages];

  const sitemapJsonPath = path.join(DOCS_ROOT, 'sitemap.json');
  const payload = {
    generatedAt: new Date().toISOString(),
    pages: allPages,
  };
  fs.writeFileSync(sitemapJsonPath, JSON.stringify(payload, null, 2), 'utf8');

  const sitemapXmlPath = path.join(DOCS_ROOT, 'sitemap.xml');
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const page of allPages) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(page.doc)}</loc>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  lines.push('');
  fs.writeFileSync(sitemapXmlPath, lines.join('\n'), 'utf8');
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Missing src directory: ${SRC_DIR}`);
    process.exit(1);
  }

  fs.rmSync(DOCS_DIR, { recursive: true, force: true });
  ensureDir(DOCS_DIR);

  const files = listFiles(SRC_DIR);
  const pages = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const rel = getRelativePosix(filePath);
    pages.push(writeModuleDoc(rel, content));
  }

  pages.sort((a, b) => a.relSourcePath.localeCompare(b.relSourcePath));
  writeOverview(pages);
  writeSummary(pages);
  writeSitemapJson(pages);
  writeSitemapXml(pages);
  writeRootSitemap(pages);

  const indexPath = path.join(DOCS_DIR, 'index.md');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, '# Documentation Index\n\nSee README.md for the overview.\n', 'utf8');
  }

  console.log(`Generated ${pages.length} docs into ${DOCS_DIR}`);
}

main();
