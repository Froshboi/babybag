import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'node:crypto';

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  if (!process.env.PAYSTACK_SECRET_KEY || !signature) return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 401 });
  const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }
  const { event, data } = JSON.parse(rawBody);
  if (event === 'charge.success' && data?.reference) {
    const { data: tx } = await supabaseAdmin.from('payments').select('id, user_id, bb_credited, status, metadata').eq('paystack_ref', data.reference).single();
    if (tx && tx.status !== 'success') {
      const { error: creditError } = await supabaseAdmin.rpc('credit_wallet', { p_user_id: tx.user_id, p_amount: tx.bb_credited, p_type: 'purchase', p_description: `Paystack payment ${data.reference}` });
      if (creditError) return NextResponse.json({ error: 'Wallet credit failed' }, { status: 500 });
      await supabaseAdmin.from('payments').update({ status: 'success', paystack_transaction_id: String(data.id), metadata: { ...tx.metadata, gateway_status: data.status } }).eq('id', tx.id);
    }
  }
  return NextResponse.json({ received: true });
}
