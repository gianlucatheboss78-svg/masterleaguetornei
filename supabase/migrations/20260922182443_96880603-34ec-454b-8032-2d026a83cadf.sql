ALTER TABLE public.tournaments ALTER COLUMN user_id DROP NOT NULL;

GRANT INSERT, UPDATE ON public.tournaments TO anon;

DROP POLICY IF EXISTS "Users can create their own tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can update their own tournaments" ON public.tournaments;

CREATE POLICY "Anyone can create tournaments"
ON public.tournaments
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Owner or guest tournaments can be updated"
ON public.tournaments
FOR UPDATE
TO anon, authenticated
USING (user_id IS NULL OR auth.uid() = user_id)
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);