-- Create Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('student', 'teacher', 'admin')) default 'student',
  xp integer default 0,
  streak integer default 0,
  avatar_url text,
  username text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, xp, streak, username)
  values (new.id, 'student', 0, 0, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Courses Table
create table courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  instructor_id uuid references profiles(id) not null,
  thumbnail_url text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Courses
alter table courses enable row level security;

-- Policies for Courses
create policy "Courses are viewable by everyone."
  on courses for select
  using ( true );

create policy "Teachers can insert courses."
  on courses for insert
  with check ( 
    auth.uid() in (
      select id from profiles where role = 'teacher' or role = 'admin'
    )
  );

create policy "Teachers can update their own courses."
  on courses for update
  using ( auth.uid() = instructor_id );

-- Create Enrollment/Progress Table
create table user_progress (
  user_id uuid references profiles(id) not null,
  course_id uuid references courses(id) not null,
  progress integer default 0,
  completed boolean default false,
  last_accessed timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, course_id)
);

alter table user_progress enable row level security;

create policy "Users can view their own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress update"
    on user_progress for update
    using (auth.uid() = user_id);
    
-- Chat Messages Table
create table chat_messages (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references profiles(id) not null,
    content text not null,
    room_id text default 'global',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table chat_messages enable row level security;

create policy "Everyone can read chat messages"
    on chat_messages for select
    using (true);

create policy "Authenticated users can post messages"
    on chat_messages for insert
    with check (auth.uid() = user_id);
