-- Babybags Full Schema Migration
-- Run this in your Supabase SQL Editor

-- =====================================================
-- CLEANUP: Drop existing objects in reverse dependency order
-- =====================================================

-- Disable RLS on all tables first
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS challenge_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS token_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reward_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reward_claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bank_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS withdrawals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS learning_streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificates DISABLE ROW LEVEL SECURITY;

-- Drop triggers first
DROP TRIGGER IF EXISTS on_wallet_change ON wallets;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions with CASCADE to remove dependent policies
DROP FUNCTION IF EXISTS public.record_token_tx() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_streak(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.credit_wallet(UUID, INT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, TEXT) CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS learning_streaks CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS withdrawals CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS reward_claims CASCADE;
DROP TABLE IF EXISTS reward_rules CASCADE;
DROP TABLE IF EXISTS token_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS challenge_attempts CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS module_progress CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES & ROLES
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  country TEXT DEFAULT 'NG',
  kyc_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('learner', 'admin', 'instructor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- =====================================================
-- COURSE: MODULES, LESSONS, QUIZZES
-- =====================================================
CREATE TABLE modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  phase TEXT NOT NULL,
  phase_order INT NOT NULL,
  module_order INT NOT NULL,
  duration_minutes INT DEFAULT 5,
  is_free BOOLEAN DEFAULT FALSE,
  cost_bb INT DEFAULT 350,
  content TEXT NOT NULL,
  key_takeaways TEXT[] DEFAULT '{}',
  has_quiz BOOLEAN DEFAULT TRUE,
  has_simulation BOOLEAN DEFAULT FALSE,
  simulation_config JSONB DEFAULT '{}',
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES modules ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INT NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation TEXT,
  question_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE module_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  percent_complete INT DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules ON DELETE CASCADE NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SIMULATION CHALLENGES
-- =====================================================
CREATE TABLE challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL,
  phase_order INT NOT NULL,
  scenario_config JSONB NOT NULL DEFAULT '{}',
  pass_criteria JSONB NOT NULL DEFAULT '{}',
  reward_bb INT DEFAULT 125,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE challenge_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'passed', 'failed')),
  pnl_percent DECIMAL(10,2),
  max_drawdown_percent DECIMAL(10,2),
  trades JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  passed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENROLLMENTS
-- =====================================================
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules ON DELETE CASCADE,
  bundle_purchase BOOLEAN DEFAULT FALSE,
  cost_bb INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- =====================================================
-- WALLET & TOKEN SYSTEM
-- =====================================================
CREATE TABLE wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  spendable_bb INT DEFAULT 0 CHECK (spendable_bb >= 0),
  withdrawable_bb INT DEFAULT 0 CHECK (withdrawable_bb >= 0),
  total_earned_bb INT DEFAULT 0 CHECK (total_earned_bb >= 0),
  total_purchased_bb INT DEFAULT 0,
  total_spent_bb INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE token_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'reward', 'spend', 'withdrawal', 'refund', 'bonus')),
  amount_bb INT NOT NULL,
  balance_type TEXT NOT NULL CHECK (balance_type IN ('spendable', 'withdrawable')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reward_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action_type TEXT NOT NULL UNIQUE CHECK (action_type IN ('module_complete', 'quiz_pass', 'challenge_pass', 'certification_pass', 'streak_7day')),
  reward_bb INT NOT NULL,
  description TEXT,
  max_claims_per_user INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reward_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rule_id UUID REFERENCES reward_rules ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES modules ON DELETE SET NULL,
  challenge_id UUID REFERENCES challenges ON DELETE SET NULL,
  amount_bb INT NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_reward_claims_unique ON reward_claims(user_id, rule_id, COALESCE(module_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(challenge_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- =====================================================
-- BANKING & WITHDRAWALS
-- =====================================================
CREATE TABLE bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE withdrawals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bank_account_id UUID REFERENCES bank_accounts ON DELETE RESTRICT NOT NULL,
  amount_bb INT NOT NULL CHECK (amount_bb >= 5000),
  amount_ngn INT NOT NULL,
  fee_percent DECIMAL(5,2) DEFAULT 5.00,
  fee_ngn INT NOT NULL,
  net_ngn INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'failed')),
  admin_note TEXT,
  paystack_transfer_ref TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYMENTS (PAYSTACK)
-- =====================================================
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  paystack_ref TEXT UNIQUE,
  paystack_transaction_id TEXT,
  amount_ngn INT NOT NULL,
  bb_credited INT NOT NULL,
  pack_type TEXT NOT NULL CHECK (pack_type IN ('1000', '3500', '10000', 'custom', 'bundle')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STREAKS & CERTIFICATES
-- =====================================================
CREATE TABLE learning_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_learning_date DATE,
  total_learning_days INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_number TEXT UNIQUE NOT NULL,
  score_percent INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid AND role = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.wallets (user_id, spendable_bb, withdrawable_bb)
  VALUES (NEW.id, 0, 0);
  INSERT INTO public.learning_streaks (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Wallet update trigger (append-only ledger enforcement)
CREATE OR REPLACE FUNCTION public.record_token_tx()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.spendable_bb != OLD.spendable_bb THEN
      INSERT INTO public.token_transactions (user_id, type, amount_bb, balance_type, description)
      VALUES (
        NEW.user_id,
        CASE WHEN NEW.spendable_bb > OLD.spendable_bb THEN 'purchase' ELSE 'spend' END,
        ABS(NEW.spendable_bb - OLD.spendable_bb),
        'spendable',
        'Wallet balance update'
      );
    END IF;
    IF NEW.withdrawable_bb != OLD.withdrawable_bb THEN
      INSERT INTO public.token_transactions (user_id, type, amount_bb, balance_type, description)
      VALUES (
        NEW.user_id,
        CASE WHEN NEW.withdrawable_bb > OLD.withdrawable_bb THEN 'reward' ELSE 'withdrawal' END,
        ABS(NEW.withdrawable_bb - OLD.withdrawable_bb),
        'withdrawable',
        'Wallet balance update'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_wallet_change
  AFTER UPDATE ON public.wallets
  FOR EACH ROW EXECUTE PROCEDURE public.record_token_tx();

-- Streak update function
CREATE OR REPLACE FUNCTION public.update_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  last_date DATE;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT last_learning_date INTO last_date
  FROM public.learning_streaks
  WHERE user_id = user_uuid;
  IF last_date IS NULL OR last_date < today - INTERVAL '1 day' THEN
    UPDATE public.learning_streaks
    SET current_streak = 1, last_learning_date = today, total_learning_days = total_learning_days + 1
    WHERE user_id = user_uuid;
  ELSIF last_date = today - INTERVAL '1 day' THEN
    UPDATE public.learning_streaks
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_learning_date = today,
        total_learning_days = total_learning_days + 1
    WHERE user_id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Credit wallet RPC (for Paystack webhook)
CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_user_id UUID,
  p_amount INT,
  p_type TEXT,
  p_description TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.wallets 
  SET spendable_bb = spendable_bb + p_amount,
      total_purchased_bb = total_purchased_bb + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  INSERT INTO public.token_transactions (user_id, type, amount_bb, balance_type, description)
  VALUES (p_user_id, p_type, p_amount, 'spendable', p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Modules public read" ON modules FOR SELECT USING (true);
CREATE POLICY "Quiz questions public read" ON quiz_questions FOR SELECT USING (true);

CREATE POLICY "Users CRUD own progress" ON module_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read all progress" ON module_progress FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all attempts" ON quiz_attempts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Challenges public read" ON challenges FOR SELECT USING (true);

CREATE POLICY "Users CRUD own attempts" ON challenge_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read all attempts" ON challenge_attempts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all enrollments" ON enrollments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server update wallets" ON wallets FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Users read own tx" ON token_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server insert tx" ON token_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Reward rules public read" ON reward_rules FOR SELECT USING (true);

CREATE POLICY "Users read own claims" ON reward_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own claims" ON reward_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all claims" ON reward_claims FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users CRUD own accounts" ON bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read all accounts" ON bank_accounts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own withdrawals" ON withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own withdrawals" ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage withdrawals" ON withdrawals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read all payments" ON payments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users read own streak" ON learning_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server update streaks" ON learning_streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users read own certs" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all certs" ON certificates FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.modules, public.quiz_questions, public.challenges, public.reward_rules TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.module_progress TO authenticated;
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_modules_phase ON modules(phase, phase_order);
CREATE INDEX idx_modules_slug ON modules(slug);
CREATE INDEX idx_quiz_module ON quiz_questions(module_id, question_order);
CREATE INDEX idx_progress_user ON module_progress(user_id, status);
CREATE INDEX idx_progress_module ON module_progress(module_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id, module_id);
CREATE INDEX idx_challenge_attempts_user ON challenge_attempts(user_id, challenge_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_token_tx_user ON token_transactions(user_id, created_at DESC);
CREATE INDEX idx_reward_claims_user ON reward_claims(user_id);
CREATE INDEX idx_withdrawals_user ON withdrawals(user_id, created_at DESC);
CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);
CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
