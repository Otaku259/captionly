-- Captionly initial schema
-- Run this once in the Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run.

-- =========================================================================
-- 1. PROFILES
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'lifetime')),
  free_jobs_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Deliberately no insert/update/delete policy for the authenticated role:
-- plan, payment status and free usage are only ever changed by trusted
-- server-side code (using the service_role key), never directly by the
-- browser. This is what stops a user editing their own plan from devtools.

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 2. VIDEO JOBS
-- =========================================================================
create table if not exists public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  original_filename text,
  status text not null default 'uploaded'
    check (status in (
      'uploaded', 'processing_audio', 'transcribing',
      'generating_captions', 'rendering', 'complete', 'failed'
    )),
  output_path text,
  duration_seconds integer,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.video_jobs enable row level security;

create policy "Users can view their own video jobs"
  on public.video_jobs for select
  using (auth.uid() = user_id);

-- No client insert/update policy: jobs are created and updated only by
-- server-side code — that's what enforces the free-video limit server-side
-- instead of trusting the browser.

-- =========================================================================
-- 3. PAYMENTS
-- =========================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null default 'paypal',
  provider_transaction_id text unique,
  amount numeric(10, 2) not null,
  currency text not null default 'GBP',
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- No client insert/update policy: payments are only ever recorded by
-- server-side code, after independently verifying the transaction with PayPal.
