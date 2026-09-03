import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req) {
  const { amount = 1000, packType = 'custom', siteId = process.env.PAYSTACK_SITE_ID || 'babybags' } = await req.json();
  const parsedAmount = Number(amount);
  if (!Number.isInteger(parsedAmount) || parsedAmount < 100) {
    return NextResponse.json({ error: 'Amount must be at least ₦100' }, { status: 400 });
  }
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment service is not configured' }, { status: 500 });
  }
  const { data: { user } } = await createServerSupabase().auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'Sign in before paying' }, { status: 401 });
  const reference = `bb_${siteId}_${crypto.randomUUID()}`;
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: parsedAmount * 100,
      email: user.email,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet?payment=complete`,
      metadata: { site_id: siteId, user_id: user.id, pack_type: packType, bb_amount: parsedAmount },
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.status) return NextResponse.json({ error: data.message || 'Payment init failed' }, { status: 400 });
  const { error } = await supabaseAdmin.from('payments').insert({
    user_id: user.id,
    paystack_ref: reference,
    amount_ngn: parsedAmount,
    bb_credited: parsedAmount,
    pack_type: ['1000', '3500', '10000', 'custom', 'bundle'].includes(String(packType)) ? String(packType) : 'custom',
    status: 'pending',
    metadata: { site_id: siteId },
  });
  if (error) return NextResponse.json({ error: 'Could not record payment' }, { status: 500 });
  return NextResponse.json({ url: data.data.authorization_url });
}
