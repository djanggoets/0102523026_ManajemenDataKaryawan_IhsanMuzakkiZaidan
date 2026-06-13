const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

function parseMysqlUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port || '3306'),
    user: u.username,
    password: u.password,
    database: u.pathname.replace('/', ''),
    connectionLimit: 5,
  };
}

const config  = parseMysqlUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(config);
const prisma  = new PrismaClient({ adapter });

async function main() {
  const engineering = await prisma.department.upsert({ where: { id: 1 }, update: {}, create: { name: 'Engineering' } });
  const marketing   = await prisma.department.upsert({ where: { id: 2 }, update: {}, create: { name: 'Marketing' } });
  const hr          = await prisma.department.upsert({ where: { id: 3 }, update: {}, create: { name: 'Human Resources' } });
  const finance     = await prisma.department.upsert({ where: { id: 4 }, update: {}, create: { name: 'Finance' } });

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
  console.log('Departments :', await prisma.department.count());
  console.log('Positions   :', await prisma.position.count());
  console.log('Skills      :', await prisma.skill.count());
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
