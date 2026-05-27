const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe("INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT DO NOTHING;");
  
  await prisma.$executeRawUnsafe("CREATE POLICY \"Allow public uploads\" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'uploads');").catch(()=>console.log('Policy exists'));
  
  await prisma.$executeRawUnsafe("CREATE POLICY \"Allow public read\" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');").catch(()=>console.log('Policy exists'));
  
  console.log('Done!');
}

main().finally(() => prisma.$disconnect());
