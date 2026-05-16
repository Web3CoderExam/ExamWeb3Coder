import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

function readDatabaseUrlFrom(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return undefined;

  const match = readFileSync(filePath, "utf8").match(/^DATABASE_URL=(.+)$/m);
  return match?.[1]?.trim();
}

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    readDatabaseUrlFrom(".env.local") ||
    readDatabaseUrlFrom(".env")
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getDatabaseUrl(),
  },
  migrations: {
    seed: "node prisma/seed.js",
  },
});
