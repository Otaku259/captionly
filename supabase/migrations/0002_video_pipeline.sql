-- Adds what's needed for the real upload -> transcribe pipeline.
-- Run this once in the Supabase SQL Editor: Dashboard -> SQL Editor -> New snippet -> paste -> Run.

-- =========================================================================
-- 1. New columns on video_jobs
-- =========================================================================
alter table public.video_jobs
  add column if not exists storage_path text,      -- where the uploaded original lives in Storage
  add column if not exists captions jsonb;          -- [{ start, end, text }, ...] once transcribed

-- =========================================================================
-- 2. Storage bucket for uploaded videos (private — not publicly readable)
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

-- Videos are stored under a path like "<user_id>/<job_id>/original.mp4" —
-- these policies mean a user can only ever touch objects inside their own
-- <user_id> folder, and nobody can browse another user's videos.
create policy "Users can upload to their own folder"
  on storage.objects for insert
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view their own videos"
  on storage.objects for select
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own videos"
  on storage.objects for delete
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Atomic increment so concurrent requests can't race into a wrong count.
create or replace function public.increment_free_jobs_used(p_user_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set free_jobs_used = free_jobs_used + 1 where id = p_user_id;
$$;

-- =========================================================================
-- 3. Give these two accounts lifetime access
--    (only takes effect once each email has actually signed up — the row
--    has to exist first)
-- =========================================================================
update public.profiles
set plan = 'lifetime'
where email in ('blakeisball2@gmail.com', 'adegbajudanp@gmail.com');
