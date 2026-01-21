-- 1. gonggu_posts에 view_count 컬럼 추가
ALTER TABLE gonggu_posts ADD COLUMN view_count integer DEFAULT 0 NOT NULL;

-- 2. 조회 로그 테이블 (급상승 계산용)
CREATE TABLE post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES gonggu_posts(id) ON DELETE CASCADE NOT NULL,
  viewer_ip text, -- 익명 사용자 구분용
  user_id uuid, -- Phase 2: 로그인 유저용
  viewed_at timestamptz DEFAULT now() NOT NULL
);

-- 인덱스 (급상승 계산 최적화)
CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_viewed_at ON post_views(viewed_at);
CREATE INDEX idx_post_views_post_viewed ON post_views(post_id, viewed_at);

-- 3. Phase 2를 위한 favorites 테이블 (미리 생성)
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- auth.users 참조 (Phase 2)
  post_id uuid REFERENCES gonggu_posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_post_id ON favorites(post_id);

-- RLS 활성화
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 읽기 정책
CREATE POLICY "Anyone can read post_views" ON post_views FOR SELECT USING (true);
CREATE POLICY "Anyone can insert post_views" ON post_views FOR INSERT WITH CHECK (true);

-- favorites는 Phase 2에서 정책 추가 예정
CREATE POLICY "Users can read own favorites" ON favorites FOR SELECT USING (true);
