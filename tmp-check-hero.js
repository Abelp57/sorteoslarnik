const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();
(async () => {
  console.table(await prisma.homeHero.findMany({ select:{ id:true, title:true, isActive:true, sortOrder:true } }));
  await prisma.$disconnect();
})();