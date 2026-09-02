import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req) {
  const { userId, bankName, accountNumber, amount } = await req.json();

  // Check balance
  const { data: wallet } = await supabaseAdmin
    .from('wallets')
    .select('withdrawable_bb')
    .eq('user_id', userId)
    .single();

  if (!wallet || wallet.withdrawable_bb < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  const { data: existingBankAccount } = await supabaseAdmin
    .from('bank_accounts')
    .select('id')
    .eq('user_id', userId)
    .eq('account_number', accountNumber)
    .maybeSingle();

  let bankAccountId = existingBankAccount?.id;
  if (!bankAccountId) {
    const { data: bankAccount, error: bankAccountError } = await supabaseAdmin
      .from('bank_accounts')
      .insert({
        user_id: userId,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: bankName,
        bank_code: 'UNKNOWN',
      })
      .select('id')
      .single();
    if (bankAccountError) return NextResponse.json({ error: bankAccountError.message }, { status: 500 });
    bankAccountId = bankAccount.id;
  }

  const { error } = await supabaseAdmin.from('withdrawals').insert({
    user_id: userId,
    bank_account_id: bankAccountId,
    amount_bb: amount,
    amount_ngn: amount,
    fee_ngn: 0,
    net_ngn: amount,
    status: 'pending',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}