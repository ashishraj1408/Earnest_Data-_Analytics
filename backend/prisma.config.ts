import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasourceOverrides: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});