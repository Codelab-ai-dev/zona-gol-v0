-- Create match_results table
create table public.match_results (
    id uuid default gen_random_uuid() primary key,
    match_id uuid not null,
    home_score integer not null,
    away_score integer not null,
    recorded_by uuid not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    foreign key (match_id) references public.matches(id) on delete cascade,
    foreign key (recorded_by) references auth.users(id) on delete restrict
);

-- Add RLS policies for match_results
alter table public.match_results enable row level security;

create policy "Match results are viewable by everyone"
  on public.match_results for select
  using ( true );

create policy "Match results are insertable by authenticated users with admin role"
  on public.match_results for insert
  with check (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Match results are updatable by authenticated users with admin role"
  on public.match_results for update
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

create policy "Match results are deletable by authenticated users with admin role"
  on public.match_results for delete
  using (
    auth.role() = 'authenticated' and 
    auth.jwt() ->> 'role' in ('admin', 'super')
  );

-- Add updated_at trigger
create trigger handle_updated_at
  before update on public.match_results
  for each row
  execute procedure public.handle_updated_at();
