-- Babybags RLS policies
-- Run after 001_schema.sql and the seed files.
-- These policies keep lesson content readable while isolating user data.

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read modules" ON modules;
CREATE POLICY "Public can read modules"
  ON modules FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read quiz questions" ON quiz_questions;
CREATE POLICY "Public can read quiz questions"
  ON quiz_questions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can read their module progress" ON module_progress;
CREATE POLICY "Users can read their module progress"
  ON module_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their module progress" ON module_progress;
CREATE POLICY "Users can create their module progress"
  ON module_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their module progress" ON module_progress;
CREATE POLICY "Users can update their module progress"
  ON module_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their wallet" ON wallets;
CREATE POLICY "Users can read their wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their streak" ON learning_streaks;
CREATE POLICY "Users can read their streak"
  ON learning_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read active challenges" ON challenges;
CREATE POLICY "Anyone can read active challenges"
  ON challenges FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can read their reward rules" ON reward_rules;
CREATE POLICY "Users can read their reward rules"
  ON reward_rules FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can read their reward claims" ON reward_claims;
CREATE POLICY "Users can read their reward claims"
  ON reward_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their transactions" ON token_transactions;
CREATE POLICY "Users can read their transactions"
  ON token_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their bank accounts" ON bank_accounts;
CREATE POLICY "Users can read their bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their bank accounts" ON bank_accounts;
CREATE POLICY "Users can create their bank accounts"
  ON bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their withdrawals" ON withdrawals;
CREATE POLICY "Users can read their withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their withdrawals" ON withdrawals;
CREATE POLICY "Users can create their withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Verify that RLS is enabled on the application tables.
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN (
  'modules', 'quiz_questions', 'module_progress', 'wallets',
  'learning_streaks', 'challenges', 'reward_rules', 'reward_claims',
  'token_transactions', 'bank_accounts', 'withdrawals'
)
ORDER BY relname;
