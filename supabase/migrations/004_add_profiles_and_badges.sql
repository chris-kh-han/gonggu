-- 1. 프로필 테이블
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nickname text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. 사용자 통계 테이블
CREATE TABLE user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  posts_created integer DEFAULT 0 NOT NULL,
  posts_viewed integer DEFAULT 0 NOT NULL,
  bookmarks_count integer DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. 사용자 뱃지 테이블
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- 인덱스
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- user_stats 정책
CREATE POLICY "Users can read all stats"
  ON user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_badges 정책
CREATE POLICY "Users can read all badges"
  ON user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 트리거: 새 사용자 가입 시 프로필과 통계 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 프로필 생성
  INSERT INTO profiles (id, email, nickname)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nickname');

  -- 통계 초기화
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
