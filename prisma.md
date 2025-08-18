Database Migrations

Prisma Migrate and Introspection workflows are currently not supported when working with Turso — learn more.
First, generate a migration file using prisma migrate dev against a local SQLite database


pnpm dlx prisma migrate dev --name

turso db shell paylinks-wait-list < ./prisma/migrations/
20250818171752_rate_limit/migration.sql