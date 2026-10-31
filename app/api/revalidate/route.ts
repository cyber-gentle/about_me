import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-server';

export const dynamic = 'force-dynamic';

/** Called by the admin console after every save so the public page updates immediately. */
export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
