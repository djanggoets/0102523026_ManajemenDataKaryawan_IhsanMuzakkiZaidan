import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

// Prisma v7: For seeding, we use a workaround by setting env var before importing
const prisma = new PrismaClient();

async function main() {
  // Seed Departments
  const engineering = await prisma.department.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Engineering' },
  });

  const marketing = await prisma.department.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Marketing' },
  });

  const hr = await prisma.department.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Human Resources' },
  });

  const finance = await prisma.department.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Finance' },
  });

  // Seed Positions
  await Promise.all([
    prisma.position.upsert({ where: { id: 1 }, update: {}, create: { name: 'Frontend Developer', departmentId: engineering.id } }),
    prisma.position.upsert({ where: { id: 2 }, update: {}, create: { name: 'Backend Developer', departmentId: engineering.id } }),
    prisma.position.upsert({ where: { id: 3 }, update: {}, create: { name: 'DevOps Engineer', departmentId: engineering.id } }),
    prisma.position.upsert({ where: { id: 4 }, update: {}, create: { name: 'Digital Marketing', departmentId: marketing.id } }),
    prisma.position.upsert({ where: { id: 5 }, update: {}, create: { name: 'Content Creator', departmentId: marketing.id } }),
    prisma.position.upsert({ where: { id: 6 }, update: {}, create: { name: 'HR Manager', departmentId: hr.id } }),
    prisma.position.upsert({ where: { id: 7 }, update: {}, create: { name: 'Recruiter', departmentId: hr.id } }),
    prisma.position.upsert({ where: { id: 8 }, update: {}, create: { name: 'Accountant', departmentId: finance.id } }),
    prisma.position.upsert({ where: { id: 9 }, update: {}, create: { name: 'Financial Analyst', departmentId: finance.id } }),
  ]);

  // Seed Skills
  await Promise.all([
    prisma.skill.upsert({ where: { id: 1 }, update: {}, create: { name: 'JavaScript' } }),
    prisma.skill.upsert({ where: { id: 2 }, update: {}, create: { name: 'TypeScript' } }),
    prisma.skill.upsert({ where: { id: 3 }, update: {}, create: { name: 'React' } }),
    prisma.skill.upsert({ where: { id: 4 }, update: {}, create: { name: 'Node.js' } }),
    prisma.skill.upsert({ where: { id: 5 }, update: {}, create: { name: 'Python' } }),
    prisma.skill.upsert({ where: { id: 6 }, update: {}, create: { name: 'MySQL' } }),
    prisma.skill.upsert({ where: { id: 7 }, update: {}, create: { name: 'Docker' } }),
    prisma.skill.upsert({ where: { id: 8 }, update: {}, create: { name: 'SEO' } }),
    prisma.skill.upsert({ where: { id: 9 }, update: {}, create: { name: 'Excel' } }),
    prisma.skill.upsert({ where: { id: 10 }, update: {}, create: { name: 'Communication' } }),
  ]);

  console.log('Seed selesai!');
  console.log(`   Departments : ${await prisma.department.count()}`);
  console.log(`   Positions   : ${await prisma.position.count()}`);
  console.log(`   Skills      : ${await prisma.skill.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
