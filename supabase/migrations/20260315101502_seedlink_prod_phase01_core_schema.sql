create extension if not exists pgcrypto;

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text default 'farmer',
  created_at timestamptz default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade,
  farm_name text not null,
  location text,
  hectares numeric,
  created_at timestamptz default now()
);

create table public.crops (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  crop_type text not null,
  variety text,
  planting_date date,
  expected_harvest date,
  created_at timestamptz default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  price numeric,
  description text,
  created_at timestamptz default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  total_amount numeric,
  status text default 'pending',
  created_at timestamptz default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric,
  created_at timestamptz default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  progress integer default 0,
  created_at timestamptz default now()
);
