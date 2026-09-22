GRANT SELECT ON public.tournaments TO anon;

DROP POLICY IF EXISTS "Users can view their own tournaments" ON public.tournaments;

CREATE POLICY "Anyone can view tournaments"
ON public.tournaments
FOR SELECT
TO anon, authenticated
USING (true);