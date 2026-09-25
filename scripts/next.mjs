import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function runNext(args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(projectRoot, 'node_modules/next/dist/bin/next'), ...args], {
      cwd: projectRoot,
      env: { ...process.env, ...env },
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error('Next.js ended with ' + (signal || code)));
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await runNext(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
