-- Balochistan Property Portal — Supabase schema
-- Run this in the Supabase SQL editor. The site falls back to bundled seed
-- data whenever a table is empty, so you can populate rows gradually.

-- ---------- agents ----------
create table if not exists public.agents (
  id        bigint primary key,
  name      text not null,
  type      text not null default '',
  rating    numeric not null default 5,
  reviews   text not null default '0',
  location  text not null default '',
  verified  boolean not null default true,
  phone     text not null default '',
  email     text not null default '',
  avatar    text not null default ''
);

-- ---------- properties ----------
create table if not exists public.properties (
  id          bigint primary key,
  title       text not null,
  price       bigint not null default 0,
  "priceText" text not null default '',
  purpose     text not null default 'For Sale',  -- 'For Sale' | 'For Rent'
  type        text not null default 'Houses',
  beds        int not null default 0,
  baths       int not null default 0,
  area        text not null default '',
  district    text not null default '',
  address     text not null default '',
  agent       text not null default '',
  "agentAvatar" text not null default '',
  verified    boolean not null default false,
  featured    boolean not null default false,
  img         text not null default '',
  images      text[] not null default '{}',
  "desc"      text not null default '',
  features    text[] not null default '{}',
  "agentId"   bigint references public.agents (id) on delete set null
);

create index if not exists properties_district_idx on public.properties (district);
create index if not exists properties_purpose_idx on public.properties (purpose);
create index if not exists properties_type_idx on public.properties (type);

-- ---------- guides / articles ----------
create table if not exists public.articles (
  id        bigint primary key,
  title     text not null,
  cat       text not null default 'Guide',
  "tagColor" text not null default '#1a8754',
  date      text not null default '',
  read      text not null default '5 min read',
  img       text not null default ''
);

-- ---------- new projects ----------
create table if not exists public.projects (
  name        text primary key,
  location    text not null default '',
  status      text not null default 'Under Development',
  "plotSizes" text not null default '',
  timeline    text not null default '',
  "priceFrom" text not null default '',
  img         text not null default ''
);

-- ---------- QDA approved schemes ----------
create table if not exists public.qda_schemes (
  name       text primary key,
  district   text not null default '',
  noc        text not null default '',
  developer  text not null default '',
  "totalArea" text not null default '',
  "resPlots"  text not null default '',
  "comPlots"  text not null default '',
  img        text not null default '',
  status     text not null default 'QDA Approved'
);

-- ---------- districts & areas ----------
create table if not exists public.districts (
  name  text primary key,
  count text not null default '0',
  cover text not null default ''
);

create table if not exists public.areas (
  name     text not null,
  district text not null,
  count    int not null default 0,
  primary key (name, district)
);

-- ---------- public read access (anonymous) ----------
alter table public.agents      enable row level security;
alter table public.properties  enable row level security;
alter table public.articles    enable row level security;
alter table public.projects    enable row level security;
alter table public.qda_schemes enable row level security;
alter table public.districts   enable row level security;
alter table public.areas       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['agents','properties','articles','projects','qda_schemes','districts','areas']
  loop
    execute format(
      'drop policy if exists "public read" on public.%I;
       create policy "public read" on public.%I for select to anon using (true);',
      t, t);
  end loop;
end $$;
