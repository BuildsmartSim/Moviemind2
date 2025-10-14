#!/usr/bin/env node
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const disallowed = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.psd',
  '.tif',
  '.tiff'
]);

const ignoreDirs = new Set(['.git', 'node_modules', 'dist', 'build']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const offenders = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      await walk(entryPath);
      continue;
    }

    if (entry.name === '.gitkeep') continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!ext) continue;
    if (!disallowed.has(ext)) continue;

    const relativePath = path.relative(repoRoot, entryPath);
    offenders.push(relativePath);
  }
}

try {
  await walk(repoRoot);
} catch (error) {
  console.error('Error while scanning for binary files:', error);
  process.exit(1);
}

if (offenders.length > 0) {
  console.error('Binary files are not allowed in this repository.');
  for (const file of offenders) {
    console.error(` - ${file}`);
  }
  console.error('\nPlease remove these files or replace them with data-URL placeholders before committing.');
  process.exit(1);
}

console.log('✅ No disallowed binary assets found.');
