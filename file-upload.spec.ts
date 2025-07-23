# Recommended for most uses
DATABASE_URL=postgres://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-little-cloud-adoh6urp.c-2.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_zpd0ohjSBsi7

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgres://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_zpd0ohjSBsi7
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgres://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgres://neondb_owner:npg_zpd0ohjSBsi7@ep-little-cloud-adoh6urp-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=157f5f6e-f272-456a-9dff-69fc036a7c6d
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_bz3j0npsp2wcvxbw5j968pqc4b621e2hc8vn0e1ssr4cg
STACK_SECRET_SERVER_KEY=ssk_9z22y68b1qebepsf64vajjs0t18enzmmwz4jf46thn740