import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const globalForPg = global as unknown as { pool: Pool };

export const dbPool = globalForPg.pool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== 'production') globalForPg.pool = dbPool;
