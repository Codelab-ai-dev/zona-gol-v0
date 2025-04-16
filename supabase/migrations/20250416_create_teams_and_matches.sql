-- Create teams table
create table public.teams (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    tournament_id uuid not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    foreign key (tournament_id) references public.tournaments(id) on delete cascade
);

-- Add RLS policies for teams
alter table public.teams enable row level security;

create policy "Teams are viewable by everyone"
  on public.teams for select
  using ( true );

create policy "Teams are insertable by authenticated users with admin role"
  on public.teams for insert
  with check (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Teams are updatable by authenticated users with admin role"
  on public.teams for update
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Teams are deletable by authenticated users with admin role"
  on public.teams for delete
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

-- Create matches table
create table public.matches (
    id uuid default gen_random_uuid() primary key,
    tournament_id uuid not null,
    home_team_id uuid not null,
    away_team_id uuid not null,
    matchday integer not null,
    date date not null,
    time time not null,
    status text not null check (status in ('pending', 'completed', 'cancelled')),
    home_score integer,
    away_score integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    foreign key (tournament_id) references public.tournaments(id) on delete cascade,
    foreign key (home_team_id) references public.teams(id) on delete restrict,
    foreign key (away_team_id) references public.teams(id) on delete restrict
);

-- Add RLS policies for matches
alter table public.matches enable row level security;

create policy "Matches are viewable by everyone"
  on public.matches for select
  using ( true );

create policy "Matches are insertable by authenticated users with admin role"
  on public.matches for insert
  with check (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Matches are updatable by authenticated users with admin role"
  on public.matches for update
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Matches are deletable by authenticated users with admin role"
  on public.matches for delete
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

-- Add updated_at triggers
create trigger handle_updated_at
  before update on public.teams
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.matches
  for each row
  execute procedure public.handle_updated_at();

-- Insert some sample teams
insert into public.teams (name, tournament_id) 
select 
  'Equipo ' || i,
  id
from 
  public.tournaments,
  generate_series(1, 6) as i
where 
  status = 'active'
limit 12;
