'use client';

import { deleteEmployee } from './actions';

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  async function handleDelete() {
    if (!confirm(`Hapus karyawan "${name}"?`)) return;
    await deleteEmployee(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-medium px-3 py-1 rounded-lg transition-colors"
    >
      🗑️ Hapus
    </button>
  );
}
