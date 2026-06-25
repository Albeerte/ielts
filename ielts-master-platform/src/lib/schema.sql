-- IELTS Master Platform PostgreSQL / Supabase schema starter
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('student', 'teacher', 'admin')),
  access_status text default 'active',
  created_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key references users(id) on delete cascade,
  target_band numeric(3,1),
  current_level text,
  study_plan jsonb default '{}',
  teacher_notes text
);

create table if not exists teachers (
  id uuid primary key references users(id) on delete cascade,
  specialization text,
  bio text
);

create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skill text not null,
  section_type text not null,
  html_content text,
  audio_url text,
  answer_key jsonb default '{}',
  explanations jsonb default '{}',
  difficulty text,
  estimated_band text,
  tags text[] default '{}',
  created_by uuid references users(id),
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  question_number int not null,
  question_type text not null,
  prompt text not null,
  options jsonb default '[]'
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id),
  test_id uuid references tests(id),
  answers jsonb default '{}',
  score numeric(4,1),
  mistakes jsonb default '{}',
  submitted_at timestamptz default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  teacher_id uuid references users(id),
  skill text,
  band_score numeric(3,1),
  criteria jsonb default '{}',
  comment text,
  created_at timestamptz default now()
);

create table if not exists vocabulary (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  word text not null,
  pronunciation text,
  meaning text,
  uzbek text,
  example_sentence text,
  synonyms text[] default '{}',
  collocations text[] default '{}'
);

create table if not exists saved_words (
  student_id uuid references users(id) on delete cascade,
  vocabulary_id uuid references vocabulary(id) on delete cascade,
  next_review_at timestamptz,
  strength int default 0,
  primary key (student_id, vocabulary_id)
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  html_content text not null,
  audio_url text,
  vocabulary jsonb default '{}',
  reading_time_minutes int,
  is_published boolean default false
);

create table if not exists podcasts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audio_url text not null,
  transcript text,
  vocabulary jsonb default '{}',
  questions jsonb default '[]',
  is_published boolean default false
);

create table if not exists dictations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  audio_url text not null,
  transcript text not null,
  difficulty text
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references users(id),
  student_id uuid references users(id),
  group_name text,
  test_id uuid references tests(id),
  due_at timestamptz,
  private_note text
);

create table if not exists individual_lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id),
  teacher_id uuid references users(id),
  title text not null,
  content_html text,
  homework text,
  weak_areas text[] default '{}',
  recommendations jsonb default '{}'
);

create table if not exists progress_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id),
  skill text,
  band_score numeric(3,1),
  activity text,
  created_at timestamptz default now()
);
