GRANT DELETE ON public.tournaments TO anon;

DROP POLICY IF EXISTS "Users can delete their own tournaments" ON public.tournaments;

CREATE POLICY "Owner or guest tournaments can be deleted"
ON public.tournaments
FOR DELETE
TO anon, authenticated
USING (user_id IS NULL OR auth.uid() = user_id);