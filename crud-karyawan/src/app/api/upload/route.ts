import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Upload handled via Server Actions in actions.ts' });
}
