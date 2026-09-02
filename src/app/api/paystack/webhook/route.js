import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req) {
  const body = await req.json();
  const { event, data } = body;

  if (event === 'charge.success') {
    const ref = data.reference;
    const { data: tx } = await supabaseAdmin
      .from('paystack_transactions')
      .select('user_id, amount')
      .eq('reference', ref)
      .single();

    if (tx) {
      await supabaseAdmin.rpc('add_wallet_balance', {
        p_user_id: tx.user_id,
        p_amount: tx.amount,
      });
      await supabaseAdmin
        .from('paystack_transactions')
        .update({ status: 'completed' })
        .eq('reference', ref);
    }
  }
  return NextResponse.json({ received: true });
}