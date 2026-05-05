import { defineConfig } from 'drizzle-kit';
import { existsSync, readFileSync } from 'node:fs';

function getLocalEnvValue(key: string) {
  if (process.env[key]) {
    return process.env[key];
  }

  const envPath = '.env.local';

  if (!existsSync(envPath)) {
    return undefined;
  }

  const line = readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find((envLine) => envLine.startsWith(`${key}=`));

  return line?.split('=').slice(1).join('=').replace(/^"|"$/g, '');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: getLocalEnvValue('DATABASE_URL') ?? '',
  },
});
