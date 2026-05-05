import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const worktree = path.join(os.tmpdir(), `landing-gh-pages-${process.pid}`);

const ignoredPaths = [
  '.git',
  '.github',
  '.next',
  'dist',
  'node_modules',
  'out',
  'middleware.ts',
  path.join('src', 'app', 'api'),
  path.join('src', 'app', 'admin', 'page.tsx'),
  path.join('src', 'app', 'admin', 'bookings', 'page.tsx'),
  path.join('src', 'app', 'admin', 'calendar', 'page.tsx'),
  path.join('src', 'app', 'admin', 'parents', 'page.tsx'),
  path.join('src', 'app', 'cabinet', 'page.tsx'),
  path.join('src', 'app', 'login', 'page.tsx'),
];

const normalizedIgnoredPaths = ignoredPaths.map((ignoredPath) => path.normalize(ignoredPath));

function shouldCopy(source) {
  const relativePath = path.relative(projectRoot, source);

  if (!relativePath || relativePath.startsWith('..')) {
    return true;
  }

  const normalizedPath = path.normalize(relativePath);
  return !normalizedIgnoredPaths.some(
    (ignoredPath) => normalizedPath === ignoredPath || normalizedPath.startsWith(`${ignoredPath}${path.sep}`),
  );
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        GITHUB_PAGES: 'true',
      },
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

try {
  await rm(worktree, { recursive: true, force: true });
  await cp(projectRoot, worktree, {
    recursive: true,
    filter: shouldCopy,
  });
  const npmCli = process.env.npm_execpath;
  if (npmCli) {
    await run(process.execPath, [npmCli, 'ci'], worktree);
  } else {
    await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci'], worktree);
  }

  const nextBin = path.join(worktree, 'node_modules', 'next', 'dist', 'bin', 'next');
  const command = existsSync(nextBin) ? process.execPath : process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const args = existsSync(nextBin) ? [nextBin, 'build'] : ['next', 'build'];
  await run(command, args, worktree);

  await rm(path.join(projectRoot, 'out'), { recursive: true, force: true });
  await cp(path.join(worktree, 'out'), path.join(projectRoot, 'out'), { recursive: true });
  await mkdir(path.join(projectRoot, 'out'), { recursive: true });
  await writeFile(path.join(projectRoot, 'out', '.nojekyll'), '');
} finally {
  await rm(worktree, { recursive: true, force: true });
}
