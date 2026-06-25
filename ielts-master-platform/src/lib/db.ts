// Lazy database seam for Supabase/PostgreSQL integration.
// Keep clients lazy so Next.js build can run without DATABASE_URL.

type DbConfig = {
  url: string;
};

let cachedConfig: DbConfig | null = null;

export function getDbConfig() {
  if (!cachedConfig) {
    cachedConfig = {
      url: process.env.DATABASE_URL ?? "",
    };
  }
  return cachedConfig;
}

export function isDatabaseConfigured() {
  return Boolean(getDbConfig().url);
}
