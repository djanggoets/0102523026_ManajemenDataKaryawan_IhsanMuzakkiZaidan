import { prisma } from '@/lib/prisma';
import EmployeeForm from './EmployeeForm';
import DeleteButton from './DeleteButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
  // Ambil semua data master untuk form
  const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
  const positions   = await prisma.position.findMany({ orderBy: { name: 'asc' } });
  const skills      = await prisma.skill.findMany({ orderBy: { name: 'asc' } });

  // Ambil semua karyawan + relasi bertingkat
  const employees = await prisma.employee.findMany({
    include: {
      skills: true,
      position: {
        include: {
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Manajemen Karyawan</h1>
          <p className="text-gray-500 text-sm mt-1">CRUD Lengkap dengan Next.js, Prisma ORM &amp; MySQL</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          {employees.length} Karyawan
        </span>
      </div>

      {/* ── FORM ── */}
      <EmployeeForm
        departments={departments}
        positions={positions}
        skills={skills}
      />

      {/* ── TABEL DATA ── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Data Karyawan
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Foto</th>
                <th className="px-4 py-3 text-left">Nama &amp; Email</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Jabatan &amp; Dept.</th>
                <th className="px-4 py-3 text-left">Skill</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <span>Belum ada data. Tambahkan karyawan pertama!</span>
                    </div>
                  </td>
                </tr>
              )}
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  {/* Foto */}
                  <td className="px-4 py-3">
                    {emp.photoPath ? (
                      <Image
                        src={emp.photoPath}
                        alt={emp.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>

                  {/* Nama & Email */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-gray-400 text-xs">{emp.email}</p>
                  </td>

                  {/* Gender */}
                  <td className="px-4 py-3 text-gray-600">
                    {emp.gender === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}
                  </td>

                  {/* Jabatan & Departemen */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{emp.position.name}</p>
                    <p className="text-gray-400 text-xs">{emp.position.department.name}</p>
                  </td>

                  {/* Skill */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.length === 0 && (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                      {emp.skills.map((s) => (
                        <span
                          key={s.id}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        emp.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : emp.status === 'probation'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {emp.status === 'active'
                        ? '✅ Aktif'
                        : emp.status === 'probation'
                        ? '🕐 Percobaan'
                        : '❌ Tidak Aktif'}
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <DeleteButton id={emp.id} name={emp.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
