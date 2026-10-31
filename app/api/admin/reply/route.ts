import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-server';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Sends an email reply to a contact-form message via Resend and records it.
 * Responds 501 when email sending is not configured so the UI can fall back to mailto.
 */
export async function POST(req: Request) {
  const sb = await requireAdmin(req);
  if (!sb) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return NextResponse.json({ error: 'not_configured' }, { status: 501 });
  }

  const { messageId, body } = (await req.json().catch(() => ({}))) as { messageId?: string; body?: string };
  const text = body?.trim();
  if (!messageId || !text || text.length > 10000) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { data: msg, error: msgError } = await sb
    .from('messages')
    .select('id, name, email, message, created_at')
    .eq('id', messageId)
    .maybeSingle();
  if (msgError || !msg) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const quoted = msg.message
    .split('\n')
    .map((l: string) => `> ${l}`)
    .join('\n');
  const sentDate = new Date(msg.created_at).toUTCString();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [msg.email],
      reply_to: process.env.REPLY_TO_EMAIL || site.email,
      subject: `Re: Your message to ${site.name}`,
      text: `Hi ${msg.name},\n\n${text}\n\n— ${site.name}\n\nOn ${sentDate}, you wrote:\n${quoted}`,
      html: `<p>Hi ${escapeHtml(msg.name)},</p>${escapeHtml(text)
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('')}<p>— ${escapeHtml(site.name)}</p><hr><p style="color:#666">On ${escapeHtml(
        sentDate
      )}, you wrote:</p><blockquote style="color:#666;border-left:3px solid #ccc;margin:0;padding-left:12px">${escapeHtml(
        msg.message
      ).replace(/\n/g, '<br>')}</blockquote>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return NextResponse.json({ error: 'send_failed', detail: detail.slice(0, 300) }, { status: 502 });
  }

  const { data: reply } = await sb
    .from('message_replies')
    .insert({ message_id: msg.id, body: text })
    .select('id, body, sent_at')
    .single();
  await sb.from('messages').update({ read: true }).eq('id', msg.id);

  return NextResponse.json({ ok: true, reply });
}
