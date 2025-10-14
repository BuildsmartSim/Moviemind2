import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const MAX_BYTES = 300 * 1024;
const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '../public/assets');

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function main() {
  try {
    const offenders = [];
    for await (const filePath of walk(ROOT)) {
      const info = await stat(filePath);
      if (info.size > MAX_BYTES) {
        offenders.push({ filePath, size: info.size });
      }
    }

    if (offenders.length > 0) {
      console.error('\n⚠️  Asset size check failed. The following files exceed 300 KB:\n');
      for (const offender of offenders) {
        const relativePath = path.relative(process.cwd(), offender.filePath);
        const sizeKb = (offender.size / 1024).toFixed(1);
        console.error(` - ${relativePath} (${sizeKb} KB)`);
      }
      console.error('\nPlease compress these assets before committing.');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Unable to complete asset size check:', error);
    process.exitCode = 1;
  }
}

await main();
