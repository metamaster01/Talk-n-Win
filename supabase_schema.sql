
-- ==============================================
-- Supabase Course Platform - Base Schema & RLS
-- Compatible with Supabase Free tier
-- ==============================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'course_level') then
    create type course_level as enum ('beginner','intermediate','advanced');
  end if;
end $$;

-- ---------- HELPERS ----------
-- updated_at auto-update trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text check (role in ('student','instructor','admin')) default 'student',
  avatar_url text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_categories_updated_at
before update on public.categories
for each row execute procedure public.set_updated_at();

-- ---------- COURSES ----------
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  author_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  thumbnail_url text,
  language text,
  subtitle_languages text[], -- array of languages
  level course_level default 'beginner',
  duration_minutes integer default 0,
  price numeric(12,2) not null default 0,
  mrp numeric(12,2),
  is_published boolean not null default false,
  demo_lesson_id uuid,
  certificate_provided boolean not null default false,
  students_count integer not null default 0, -- cached
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fk_demo_lesson
    foreign key (demo_lesson_id) references public.lessons(id) deferrable initially deferred
);
-- Note: fk to lessons is created after lessons table exists; we'll defer it.

create trigger trg_courses_updated_at
before update on public.courses
for each row execute procedure public.set_updated_at();

-- ---------- MODULES ----------
create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null default 1,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_modules_course_pos on public.modules (course_id, position);
create trigger trg_modules_updated_at
before update on public.modules
for each row execute procedure public.set_updated_at();

-- ---------- LESSONS ----------
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  content_type text not null check (content_type in ('video','pdf','text','quiz')),
  cloudflare_video_id text,          -- for video lessons
  storage_file_path text,            -- for pdf/attachments
  duration_seconds integer default 0,
  position integer not null default 1,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_video_or_file check (
    (content_type <> 'video') or (cloudflare_video_id is not null)
  )
);
create index if not exists idx_lessons_module_pos on public.lessons (module_id, position);
create index if not exists idx_lessons_course on public.lessons (course_id);

create trigger trg_lessons_updated_at
before update on public.lessons
for each row execute procedure public.set_updated_at();

-- Now that lessons exists, add the FK from courses.demo_lesson_id
do $$ begin
  alter table public.courses
  drop constraint if exists fk_demo_lesson;
  alter table public.courses
  add constraint fk_demo_lesson foreign key (demo_lesson_id)
  references public.lessons(id) on delete set null;
exception when duplicate_object then null; end $$;

-- ---------- ATTACHMENTS (notes, files per lesson) ----------
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  file_path text not null,   -- Supabase Storage path
  file_type text,
  name text,
  created_at timestamptz not null default now()
);
create index if not exists idx_attachments_lesson on public.attachments (lesson_id);

-- ---------- PURCHASES (orders) ----------
create table if not exists public.purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  payment_provider text not null check (payment_provider in ('razorpay','stripe')),
  payment_provider_payment_id text not null, -- e.g., razorpay_payment_id
  status text not null check (status in ('pending','paid','failed','refunded')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payment_provider, payment_provider_payment_id)
);
create index if not exists idx_purchases_user on public.purchases (user_id);
create index if not exists idx_purchases_course on public.purchases (course_id);
create index if not exists idx_purchases_status on public.purchases (status);
create trigger trg_purchases_updated_at
before update on public.purchases
for each row execute procedure public.set_updated_at();

-- ---------- ENROLLMENTS ----------
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  access_expires_at timestamptz,
  is_active boolean not null default true,
  unique (user_id, course_id)
);
create index if not exists idx_enrollments_user on public.enrollments (user_id);
create index if not exists idx_enrollments_course on public.enrollments (course_id);

-- Maintain courses.students_count via triggers
create or replace function public.bump_students_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.courses set students_count = students_count + 1 where id = new.course_id;
  elsif tg_op = 'DELETE' then
    update public.courses set students_count = greatest(students_count - 1, 0) where id = old.course_id;
  end if;
  return null;
end $$;

drop trigger if exists trg_enrollments_bump on public.enrollments;
create trigger trg_enrollments_bump
after insert or delete on public.enrollments
for each row execute procedure public.bump_students_count();

-- ---------- PROGRESS ----------
create table if not exists public.progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  watched_seconds integer not null default 0,
  last_watched_at timestamptz not null default now(),
  is_completed boolean not null default false,
  unique (user_id, lesson_id)
);
create index if not exists idx_progress_user on public.progress (user_id);
create index if not exists idx_progress_course on public.progress (course_id);
create index if not exists idx_progress_lesson on public.progress (lesson_id);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists idx_reviews_course on public.reviews (course_id);
create trigger trg_reviews_updated_at
before update on public.reviews
for each row execute procedure public.set_updated_at();

-- ---------- AUDIT LOGS ----------
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  event text not null, -- 'video_token_issued','payment_webhook','login'
  ip text,
  user_agent text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_event on public.audit_logs (event);
create index if not exists idx_audit_user on public.audit_logs (user_id);

-- ---------- VIEWS ----------
-- Public catalog view; only published courses
create or replace view public.public_courses as
select c.*,
       p.full_name as author_name,
       cat.name as category_name
from public.courses c
left join public.profiles p on p.id = c.author_id
left join public.categories cat on cat.id = c.category_id
where c.is_published = true;

-- My courses view (filter by caller at query time; use RLS)
create or replace view public.my_courses as
select e.user_id, c.*
from public.enrollments e
join public.courses c on c.id = e.course_id
where e.is_active = true;

-- ---------- RLS POLICIES ----------
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.attachments enable row level security;
alter table public.purchases enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.reviews enable row level security;
alter table public.audit_logs enable row level security;

-- Helper: check if caller is admin
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

-- profiles: users can read/update self; admins all
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
for select using ( auth.uid() = id or public.is_admin(auth.uid()) );

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
for update using ( auth.uid() = id or public.is_admin(auth.uid()) );

-- categories: everyone can read; only admins write
drop policy if exists "categories_read_all" on public.categories;
create policy "categories_read_all" on public.categories
for select using ( true );

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
for all using ( public.is_admin(auth.uid()) );

-- courses/modules/lessons:
-- anon/auth can SELECT published courses and their modules/lessons (but lessons only preview content is actually playable via token)
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
for select using ( is_published = true or public.is_admin(auth.uid()) );

drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write" on public.courses
for all using ( public.is_admin(auth.uid()) );

drop policy if exists "modules_public_read" on public.modules;
create policy "modules_public_read" on public.modules
for select using ( exists (select 1 from public.courses c where c.id = course_id and (c.is_published = true or public.is_admin(auth.uid()))) );

drop policy if exists "modules_admin_write" on public.modules;
create policy "modules_admin_write" on public.modules
for all using ( public.is_admin(auth.uid()) );

drop policy if exists "lessons_public_read" on public.lessons;
create policy "lessons_public_read" on public.lessons
for select using ( exists (select 1 from public.courses c where c.id = course_id and (c.is_published = true or public.is_admin(auth.uid()))) );

drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_admin_write" on public.lessons
for all using ( public.is_admin(auth.uid()) );

-- attachments: read only when lesson belongs to a published course; writes by admin
drop policy if exists "attachments_public_read" on public.attachments;
create policy "attachments_public_read" on public.attachments
for select using (
  exists (
    select 1 from public.lessons l
    join public.courses c on c.id = l.course_id
    where l.id = lesson_id and (c.is_published = true or public.is_admin(auth.uid()))
  )
);
drop policy if exists "attachments_admin_write" on public.attachments;
create policy "attachments_admin_write" on public.attachments
for all using ( public.is_admin(auth.uid()) );

-- purchases: users can read their own purchases; inserts/updates are handled by Service Role (webhooks) bypassing RLS
drop policy if exists "purchases_read_own" on public.purchases;
create policy "purchases_read_own" on public.purchases
for select using ( auth.uid() = user_id or public.is_admin(auth.uid()) );

-- enrollments: users can read their own; inserts via service role (webhook) bypass RLS
drop policy if exists "enrollments_read_own" on public.enrollments;
create policy "enrollments_read_own" on public.enrollments
for select using ( auth.uid() = user_id or public.is_admin(auth.uid()) );

-- progress: users manage their own
drop policy if exists "progress_read_own" on public.progress;
create policy "progress_read_own" on public.progress
for select using ( auth.uid() = user_id or public.is_admin(auth.uid()) );

drop policy if exists "progress_write_own" on public.progress;
create policy "progress_write_own" on public.progress
for insert with check ( auth.uid() = user_id )
;

create policy "progress_update_own" on public.progress
for update using ( auth.uid() = user_id );

-- reviews: everyone can read; users can upsert their own; admin can moderate
drop policy if exists "reviews_read_all" on public.reviews;
create policy "reviews_read_all" on public.reviews
for select using ( true );

drop policy if exists "reviews_write_own" on public.reviews;
create policy "reviews_write_own" on public.reviews
for insert with check ( auth.uid() = user_id );

create policy "reviews_update_own" on public.reviews
for update using ( auth.uid() = user_id or public.is_admin(auth.uid()) );

-- audit_logs: admin read; inserts via service role
drop policy if exists "audit_admin_read" on public.audit_logs;
create policy "audit_admin_read" on public.audit_logs
for select using ( public.is_admin(auth.uid()) );

-- ---------- STORAGE BUCKETS (run manually if needed) ----------
-- In Supabase dashboard create buckets:
-- 1) public-thumbnails (public) for course thumbnails
-- 2) private-attachments (private) for lesson PDFs/notes
-- Then set storage policies accordingly (example below).

-- Example Storage Policies (uncomment and run in Storage Policies section)
-- NOTE: Replace <bucket_id> with your bucket name.

-- allow read on public-thumbnails for all
-- create policy "thumbs public read" on storage.objects for select
-- using ( bucket_id = 'public-thumbnails' );

-- allow owners to manage their own files (by folder prefix)
-- create policy "attachments read own course" on storage.objects for select
-- using (
--   bucket_id = 'private-attachments'
-- );
-- create policy "attachments admin write" on storage.objects for all
-- using ( public.is_admin(auth.uid()) );

-- ---------- END ----------
