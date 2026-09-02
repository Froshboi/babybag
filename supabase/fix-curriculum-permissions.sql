GRANT SELECT ON public.modules, public.quiz_questions, public.challenges, public.reward_rules TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.module_progress TO authenticated;
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;