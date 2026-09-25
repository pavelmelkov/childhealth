import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const forbiddenPaths = [
  'src/app/login', 'src/app/register', 'src/app/admin', 'src/app/cabinet', 'src/app/api',
  'src/auth', 'src/db', 'src/components/Auth', 'src/components/Admin', 'src/components/Cabinet',
  'src/sections/Support', 'src/styles/auth-dashboard.scss', 'src/types/next-auth.d.ts',
  'src/lib/features.ts', 'src/lib/push.ts', 'src/lib/schedule.ts',
  'src/lib/modules.ts', 'src/lib/module-settings.ts', 'src/lib/site-knowledge.ts', 'src/lib/vera-ai.ts',
  'middleware.ts', 'proxy.ts', 'drizzle', 'drizzle.config.ts', 'docker-compose.yml',
  'scripts/seed-admin.ts', 'scripts/smoke-db.ts', 'scripts/import-chat-knowledge.ts', 'scripts/import-site-knowledge.ts',
  'public/sw.js',
];
const privateDependencies = ['next-auth', '@auth/drizzle-adapter', 'drizzle-orm', 'drizzle-kit', 'postgres', 'web-push', 'bcryptjs'];

function filesUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(full) : [full];
  });
}

export function checkPublic({ exported = false } = {}) {
  const errors = forbiddenPaths.filter(relative => existsSync(path.join(root, relative)))
    .map(relative => 'Private feature present: ' + relative);
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  for (const name of privateDependencies) {
    if (manifest.dependencies?.[name] || manifest.devDependencies?.[name]) errors.push('Private dependency: ' + name);
  }
  for (const file of filesUnder(path.join(root, 'src'))) {
    if (!/\.(tsx?|scss)$/.test(file)) continue;
    const source = readFileSync(file, 'utf8');
    if (/next-auth|@\/auth\/|@\/db\/|SessionProvider|useSession|sections\/Support|auth-dashboard|href=["']\/(login|register|admin|cabinet)/.test(source)) {
      errors.push('Private reference: ' + path.relative(root, file));
    }
  }
  if (exported) {
    const output = path.join(root, 'out');
    for (const relative of ['index.html', 'docs/index.html', 'reviews/index.html', '404.html', 'CNAME', '.nojekyll']) {
      if (!existsSync(path.join(output, relative))) errors.push('Missing export: ' + relative);
    }
    if (existsSync(output)) {
      for (const file of filesUnder(output)) {
        const relative = path.relative(output, file).replaceAll('\\', '/');
        if (/(^|\/)(private|node_modules|\.git|\.env[^/]*)(\/|$)/.test(relative) ||
            /^(login|register|admin|cabinet|api)(\/|\.|$)/.test(relative)) {
          errors.push('Private file in export: ' + relative);
        }
        if (/\.html$/.test(file)) {
          const html = readFileSync(file, 'utf8');
          if (/href="[^"]*\/(login|register|admin|cabinet)([/"?#])|Планы для личного кабинета|Раздел в разработке|AI-помощник/.test(html)) {
            errors.push('Private UI in export: ' + relative);
          }
        }
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(exported ? 'Public export checked: no account routes, private files or development plans.' : 'Public sources checked: no account/backend features or dependencies.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkPublic({ exported: process.argv.includes('--export') });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
