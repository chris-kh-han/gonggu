-- view_count 원자적 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE gonggu_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 급상승 점수 계산 함수
-- 최근 24시간 조회수에 시간 가중치를 적용
CREATE OR REPLACE FUNCTION get_trending_posts(limit_count integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  seller_id uuid,
  instagram_url text,
  title text,
  price integer,
  deadline timestamptz,
  status post_status,
  view_count integer,
  created_at timestamptz,
  trending_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.seller_id,
    p.instagram_url,
    p.title,
    p.price,
    p.deadline,
    p.status,
    p.view_count,
    p.created_at,
    COALESCE(
      SUM(
        CASE
          -- 1시간 이내: 가중치 1.0
          WHEN pv.viewed_at > NOW() - INTERVAL '1 hour' THEN 1.0
          -- 6시간 이내: 가중치 0.7
          WHEN pv.viewed_at > NOW() - INTERVAL '6 hours' THEN 0.7
          -- 12시간 이내: 가중치 0.4
          WHEN pv.viewed_at > NOW() - INTERVAL '12 hours' THEN 0.4
          -- 24시간 이내: 가중치 0.2
          WHEN pv.viewed_at > NOW() - INTERVAL '24 hours' THEN 0.2
          ELSE 0
        END
      ),
      0
    ) AS trending_score
  FROM gonggu_posts p
  LEFT JOIN post_views pv ON p.id = pv.post_id
    AND pv.viewed_at > NOW() - INTERVAL '24 hours'
  WHERE p.status = 'open'
  GROUP BY p.id
  ORDER BY trending_score DESC, p.view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;
