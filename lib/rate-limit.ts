import prisma from "./prisma";

// Create a simple rate limiter table on demand
async function ensureRateLimitTable() {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "RateLimit" (
    "key" TEXT NOT NULL,
    "ts" DATETIME NOT NULL,
    PRIMARY KEY ("key", "ts")
  )`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "RateLimit_key_ts_idx" ON "RateLimit" ("key", "ts")`;
}

export type RateLimitOptions = {
  key: string; // typically ip:endpoint
  windowMs: number; // e.g. 60000
  max: number; // e.g. 5
};

export async function isRateLimited({ key, windowMs, max }: RateLimitOptions) {
  await ensureRateLimitTable();
  const now = new Date();
  const since = new Date(Date.now() - windowMs);

  await prisma.rateLimit.deleteMany({ where: { ts: { lt: since } } });

  const cnt = await prisma.rateLimit.count({
    where: { key, ts: { gte: since } },
  });
  if (cnt >= max) return true;

  await prisma.rateLimit.create({ data: { key, ts: now } });
  return false;
}
