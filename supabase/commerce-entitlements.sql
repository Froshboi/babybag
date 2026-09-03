-- Run after schema.sql. This keeps premium JSON lessons private by entitlement.
CREATE TABLE IF NOT EXISTS lesson_entitlements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,
  awarded_by UUID REFERENCES auth.users ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'purchase' CHECK (source IN ('purchase', 'admin', 'promo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_slug)
);
ALTER TABLE lesson_entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own lesson entitlements" ON lesson_entitlements;
CREATE POLICY "Users read own lesson entitlements" ON lesson_entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage lesson entitlements" ON lesson_entitlements;
CREATE POLICY "Admins manage lesson entitlements" ON lesson_entitlements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  max_uses INT,
  uses INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage promo codes" ON promo_codes;
CREATE POLICY "Admins manage promo codes" ON promo_codes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Replace this email only if the admin account is different.
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'chidom59@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Example admin actions:
-- INSERT INTO promo_codes (code, discount_percent, max_uses) VALUES ('WELCOME20', 20, 100);
-- INSERT INTO lesson_entitlements (user_id, lesson_slug, awarded_by, source)
-- VALUES ('USER_UUID', 'chart-types', 'ADMIN_UUID', 'admin');
