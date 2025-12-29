# Current Console Commands
npx prisma generate
npm run build
npx prisma migrate dev --name init
npm run dev

# To switch Databases
1. Supabase requires both direct_url and database_url in .env, prisma.config.ts and schema.prisma
2. Local db just requires database_url