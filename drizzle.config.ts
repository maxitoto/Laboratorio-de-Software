import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shared/models/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./local.db',
  },
});