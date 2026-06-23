-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE complexity_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE content_format AS ENUM ('video', 'text_card', 'audio');

-- ============================================================
-- CORE CONTENT TABLES
-- ============================================================

CREATE TABLE topics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon_name       TEXT NOT NULL,
  color_primary   TEXT NOT NULL,
  color_secondary TEXT NOT NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sub_topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id    UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (topic_id, slug)
);

CREATE TABLE content_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_topic_id     UUID NOT NULL REFERENCES sub_topics(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  body_text        TEXT,
  complexity_level complexity_level NOT NULL,
  format           content_format NOT NULL DEFAULT 'video',
  video_url        TEXT,
  audio_url        TEXT,
  thumbnail_url    TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 60,
  tags             TEXT[] DEFAULT '{}',
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id      UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  prompt_text          TEXT NOT NULL,
  choices              TEXT[] NOT NULL,
  correct_answer_index INTEGER NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation          TEXT,
  trigger_at_second    INTEGER DEFAULT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (content_item_id)
);

-- ============================================================
-- USER TABLES
-- ============================================================

CREATE TABLE user_profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  onboarded    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INTEREST & PERSONALIZATION TABLES
-- ============================================================

CREATE TABLE user_topic_interests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id       UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  interest_score FLOAT NOT NULL DEFAULT 0.5 CHECK (interest_score BETWEEN 0 AND 1),
  explicit_score FLOAT NOT NULL DEFAULT 0.0,
  implicit_score FLOAT NOT NULL DEFAULT 0.0,
  last_updated   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, topic_id)
);

-- ============================================================
-- PROGRESS TRACKING TABLES
-- ============================================================

CREATE TABLE user_progress (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id         UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  watched                 BOOLEAN NOT NULL DEFAULT FALSE,
  watch_percent           FLOAT NOT NULL DEFAULT 0 CHECK (watch_percent BETWEEN 0 AND 100),
  quiz_answered           BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_answered_correctly BOOLEAN,
  time_spent_seconds      INTEGER NOT NULL DEFAULT 0,
  viewed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at            TIMESTAMPTZ,
  UNIQUE (user_id, content_item_id)
);

CREATE TABLE user_streaks (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak    INTEGER NOT NULL DEFAULT 0,
  last_activity_at  TIMESTAMPTZ,
  streak_started_at TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_sub_topics_topic_id        ON sub_topics(topic_id);
CREATE INDEX idx_content_items_sub_topic_id ON content_items(sub_topic_id);
CREATE INDEX idx_content_items_complexity   ON content_items(complexity_level);
CREATE INDEX idx_content_items_published    ON content_items(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_user_progress_user_id      ON user_progress(user_id);
CREATE INDEX idx_user_progress_content_id   ON user_progress(content_item_id);
CREATE INDEX idx_user_topic_interests_user  ON user_topic_interests(user_id);
CREATE INDEX idx_user_topic_interests_score ON user_topic_interests(user_id, interest_score DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE topics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_topics           ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks         ENABLE ROW LEVEL SECURITY;

-- Public read for content
CREATE POLICY "topics_public_read"
  ON topics FOR SELECT USING (is_active = TRUE);

CREATE POLICY "sub_topics_public_read"
  ON sub_topics FOR SELECT USING (is_active = TRUE);

CREATE POLICY "content_items_public_read"
  ON content_items FOR SELECT USING (is_published = TRUE);

CREATE POLICY "quiz_questions_public_read"
  ON quiz_questions FOR SELECT USING (TRUE);

-- User-scoped policies
CREATE POLICY "user_profiles_own"
  ON user_profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "user_topic_interests_own"
  ON user_topic_interests FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "user_progress_own"
  ON user_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "user_streaks_own"
  ON user_streaks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id);
  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
