ALTER TABLE public.tournaments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;