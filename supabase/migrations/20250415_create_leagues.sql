-- Create leagues table
create table public.leagues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.leagues enable row level security;

create policy "Leagues are viewable by everyone"
  on public.leagues for select
  using ( true );

create policy "Leagues are insertable by authenticated users with admin role"
  on public.leagues for insert
  with check (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Leagues are updatable by authenticated users with admin role"
  on public.leagues for update
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Leagues are deletable by authenticated users with admin role"
  on public.leagues for delete
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

-- Create tournaments table with league reference
create table public.tournaments (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    league_id uuid not null,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    status text not null check (status in ('upcoming', 'active', 'completed')),
    teams integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    foreign key (league_id) references public.leagues(id) on delete cascade
);

-- Add RLS policies for tournaments
alter table public.tournaments enable row level security;

create policy "Tournaments are viewable by everyone"
  on public.tournaments for select
  using ( true );

create policy "Tournaments are insertable by authenticated users with admin role"
  on public.tournaments for insert
  with check (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Tournaments are updatable by authenticated users with admin role"
  on public.tournaments for update
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Tournaments are deletable by authenticated users with admin role"
  on public.tournaments for delete
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

-- Insert some initial leagues
insert into public.leagues (name, slug, description) values
  ('Liga Municipal San José', 'liga-municipal-san-jose', 'Liga principal de fútbol municipal de San José'),
  ('Liga Empresarial', 'liga-empresarial', 'Liga para equipos de empresas locales'),
  ('Liga Recreativa', 'liga-recreativa', 'Liga recreativa para equipos amateur'),
  ('Copa Regional', 'copa-regional', 'Torneo regional de fútbol');

-- Add updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Add updated_at triggers
create trigger handle_updated_at
  before update on public.leagues
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.tournaments
  for each row
  execute procedure public.handle_updated_at();
