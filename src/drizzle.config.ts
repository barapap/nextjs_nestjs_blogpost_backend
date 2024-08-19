import type { Config } from 'drizzle-kit';

export default {
  schema: './src/drizzle-db/schema.ts', 
  out: './src/drizzle-db/migrations', 
  dialect: 'postgresql', 
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;