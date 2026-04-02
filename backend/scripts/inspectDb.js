const { PrismaClient } = require('@prisma/client');
(async() => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  const tasks = await prisma.task.findMany();
  console.log('users', users);
  console.log('tasks', tasks);
  await prisma.$disconnect();
})();