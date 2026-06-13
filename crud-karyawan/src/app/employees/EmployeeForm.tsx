'use client';

import { useState } from 'react';
import { createEmployee } from './actions';
import { useRouter } from 'next/navigation';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };

interface EmployeeFormProps {
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
}

export default function EmployeeForm({ departments, positions, skills }: EmployeeFormProps) {
  const router = useRouter();
  const [deptId,    setDeptId]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [preview,   setPreview]   = useState<string | null>(null);

  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(deptId)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      await createEmployee(formData);
      (e.target as HTMLFormElement).reset();
      setDeptId('');
      setPreview(null);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 space-y-6"
      encType="multipart/form-data"
    >
      <h2 className="text-lg font-semibold text-gray-800">Tambah Karyawan Baru</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── NAMA & EMAIL ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Nama lengkap karyawan"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="email@perusahaan.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ── GENDER (Radio Button) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Kelamin <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              required
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">👨 Laki-laki</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">👩 Perempuan</span>
          </label>
        </div>
      </div>

      {/* ── STATUS (Dropdown biasa) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          required
          defaultValue=""
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>-- Pilih Status --</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* ── CASCADING DROPDOWN: Departemen → Jabatan ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departemen <span className="text-red-500">*</span>
          </label>
          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Departemen --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jabatan <span className="text-red-500">*</span>
          </label>
          <select
            name="positionId"
            required
            defaultValue=""
            disabled={!deptId}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{deptId ? '-- Pilih Jabatan --' : '-- Pilih Departemen dulu --'}</option>
            {filteredPositions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── SKILLS (Checkbox / Multi-select) ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill (boleh pilih lebih dari satu)
        </label>
        <div className="flex flex-wrap gap-3">
          {skills.map((s) => (
            <label key={s.id} className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="skills"
                value={s.id}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── UPLOAD FOTO ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto Profil
        </label>
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
            />
          )}
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, WEBP. Maks 2MB.</p>
      </div>

      {/* ── TOMBOL SUBMIT ── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Menyimpan...' : '💾 Simpan Karyawan'}
      </button>
    </form>
  );
}
