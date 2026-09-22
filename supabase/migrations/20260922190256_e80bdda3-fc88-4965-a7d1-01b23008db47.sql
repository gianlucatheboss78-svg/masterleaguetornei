ALTER TABLE public.tournaments
  ALTER COLUMN id TYPE text USING id::text,
  ALTER COLUMN name SET DEFAULT '',
  ALTER COLUMN data SET DEFAULT '{}'::jsonb;

GRANT SELECT, INSERT, UPDATE ON public.tournaments TO anon, authenticated;
GRANT ALL ON public.tournaments TO service_role;

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Anyone can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Owner or guest tournaments can be updated" ON public.tournaments;
DROP POLICY IF EXISTS "Public tournaments can be selected" ON public.tournaments;
DROP POLICY IF EXISTS "Public tournaments can be inserted" ON public.tournaments;
DROP POLICY IF EXISTS "Public tournaments can be updated" ON public.tournaments;

CREATE POLICY "Public tournaments can be selected"
ON public.tournaments FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public tournaments can be inserted"
ON public.tournaments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public tournaments can be updated"
ON public.tournaments FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);