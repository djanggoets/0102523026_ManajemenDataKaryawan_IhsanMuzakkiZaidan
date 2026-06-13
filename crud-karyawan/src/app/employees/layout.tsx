import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Karyawan',
  description: 'Aplikasi CRUD Manajemen Data Karyawan dengan Next.js, Prisma ORM, dan MySQL',
};

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
