DROP POLICY IF EXISTS "Public tournaments can be updated" ON public.tournaments;
DROP POLICY IF EXISTS "Public tournaments can be inserted" ON public.tournaments;

CREATE POLICY "Owner or guest tournaments can be inserted"
ON public.tournaments FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Owner or guest tournaments can be updated"
ON public.tournaments FOR UPDATE TO anon, authenticated
USING (user_id IS NULL OR auth.uid() = user_id)
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);