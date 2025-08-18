-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "ts" DATETIME NOT NULL,

    PRIMARY KEY ("key", "ts")
);

-- CreateIndex
CREATE INDEX "RateLimit_key_ts_idx" ON "RateLimit"("key", "ts");
