import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req) {
  const { amount, userId } = await req.json();
  const reference = `bb_${Date.now()}`;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100, // kobo
      email: 'user@example.com', // fetch from DB
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/webhook`,
    }),
  });

  const data = await response.json();
  if (data.status) {
    // Save reference to DB for verification
    await supabaseAdmin.from('paystack_transactions').insert({
      user_id: userId,
      reference,
      amount,
      status: 'pending',
    });
    return NextResponse.json({ url: data.data.authorization_url });
  }
  return NextResponse.json({ error: 'Payment init failed' }, { status: 400 });
}