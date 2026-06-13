'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function createEmployee(formData: FormData) {
  const name       = formData.get('name') as string;
  const email      = formData.get('email') as string;
  const gender     = formData.get('gender') as string;
  const status     = formData.get('status') as string;
  const positionId = parseInt(formData.get('positionId') as string);
  const skillIds   = formData.getAll('skills') as string[];
  const photo      = formData.get('photo') as File | null;

  // Validasi dasar
  if (!name || !email || !gender || !status || !positionId) {
    throw new Error('Semua field wajib diisi.');
  }

  // Upload foto jika ada
  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const bytes  = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext    = path.extname(photo.name) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    photoPath = `/uploads/${fileName}`;
  }

  // Simpan ke database
  await prisma.employee.create({
    data: {
      name,
      email,
      gender,
      status,
      positionId,
      photoPath,
      skills: {
        connect: skillIds.map((id) => ({ id: parseInt(id) })),
      },
    },
  });

  revalidatePath('/employees');
}

export async function deleteEmployee(id: number) {
  // Hapus relasi many-to-many dulu (skills), lalu hapus employee
  await prisma.employee.update({
    where: { id },
    data: { skills: { set: [] } },
  });
  await prisma.employee.delete({ where: { id } });

  revalidatePath('/employees');
}
