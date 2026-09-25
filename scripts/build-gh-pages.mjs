import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { checkPublic } from './check-public.mjs';
import { projectRoot, runNext } from './next.mjs';

function getBasePath() {
  // An explicitly empty value is valid for a custom domain.
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) return process.env.NEXT_PUBLIC_BASE_PATH;
  if (existsSync(path.join(projectRoot, 'public', 'CNAME'))) return '';
  const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1);
  return !repository || repository.endsWith('.github.io') ? '' : '/' + repository;
}

try {
  checkPublic();
  const basePath = getBasePath();
  console.log('Building public GitHub Pages export: ' + (basePath || '/'));
  await runNext(['build'], { GITHUB_PAGES: 'true', NEXT_PUBLIC_BASE_PATH: basePath });
  await writeFile(path.join(projectRoot, 'out', '.nojekyll'), '');
  checkPublic({ exported: true });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
