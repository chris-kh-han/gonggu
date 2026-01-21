-- 공구 상태 enum
create type post_status as enum ('open', 'closed', 'upcoming');

-- 판매자 테이블
create table sellers (
  id uuid primary key default gen_random_uuid(),
  instagram_username text not null unique,
  profile_url text,
  category text,
  created_at timestamptz default now() not null
);

-- 공구 게시물 테이블
create table gonggu_posts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete cascade not null,
  instagram_url text not null,
  title text not null,
  price integer,
  deadline timestamptz,
  status post_status default 'open' not null,
  created_at timestamptz default now() not null
);

-- 인덱스
create index idx_gonggu_posts_seller_id on gonggu_posts(seller_id);
create index idx_gonggu_posts_status on gonggu_posts(status);
create index idx_gonggu_posts_deadline on gonggu_posts(deadline);
create index idx_sellers_category on sellers(category);

-- RLS 활성화
alter table sellers enable row level security;
alter table gonggu_posts enable row level security;

-- 읽기 정책 (모든 사용자)
create policy "Anyone can read sellers"
  on sellers for select
  using (true);

create policy "Anyone can read gonggu_posts"
  on gonggu_posts for select
  using (true);
