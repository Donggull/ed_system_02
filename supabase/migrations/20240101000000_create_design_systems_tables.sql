-- ================================
-- Design System Tables Migration
-- ================================
-- 이 파일은 Supabase 데이터베이스에 디자인 시스템 관련 테이블을 생성합니다.
-- Supabase Dashboard > SQL Editor에서 실행하거나
-- Supabase CLI를 사용하여 적용할 수 있습니다.

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 디자인 시스템 테이블
CREATE TABLE IF NOT EXISTS design_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    thumbnail_url TEXT,
    tags TEXT[],
    category TEXT,
    favorite_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 컴포넌트 테이블
CREATE TABLE IF NOT EXISTS components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_system_id UUID NOT NULL REFERENCES design_systems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    props JSONB DEFAULT '{}',
    styles JSONB DEFAULT '{}',
    code TEXT,
    preview_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 테마 테이블
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_system_id UUID NOT NULL REFERENCES design_systems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    colors JSONB NOT NULL,
    typography JSONB,
    spacing JSONB,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 사용자 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    design_system_id UUID NOT NULL REFERENCES design_systems(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, design_system_id)
);

-- 5. 평점 테이블
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    design_system_id UUID NOT NULL REFERENCES design_systems(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, design_system_id)
);

-- 6. 디자인 시스템 버전 히스토리 테이블
CREATE TABLE IF NOT EXISTS design_system_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_system_id UUID NOT NULL REFERENCES design_systems(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    data JSONB NOT NULL,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(design_system_id, version)
);

-- ================================
-- 인덱스 생성
-- ================================

-- 성능 최적화를 위한 인덱스들
CREATE INDEX IF NOT EXISTS idx_design_systems_user_id ON design_systems(user_id);
CREATE INDEX IF NOT EXISTS idx_design_systems_public ON design_systems(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_design_systems_share_token ON design_systems(share_token);
CREATE INDEX IF NOT EXISTS idx_design_systems_category ON design_systems(category);
CREATE INDEX IF NOT EXISTS idx_design_systems_tags ON design_systems USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_design_systems_created_at ON design_systems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_design_systems_updated_at ON design_systems(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_design_systems_rating ON design_systems(rating_average DESC);

CREATE INDEX IF NOT EXISTS idx_components_design_system_id ON components(design_system_id);
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_order ON components(design_system_id, order_index);

CREATE INDEX IF NOT EXISTS idx_themes_design_system_id ON themes(design_system_id);
CREATE INDEX IF NOT EXISTS idx_themes_default ON themes(design_system_id, is_default);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_design_system_id ON user_favorites(design_system_id);

CREATE INDEX IF NOT EXISTS idx_ratings_design_system_id ON ratings(design_system_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);

CREATE INDEX IF NOT EXISTS idx_versions_design_system_id ON design_system_versions(design_system_id);
CREATE INDEX IF NOT EXISTS idx_versions_version ON design_system_versions(design_system_id, version DESC);

-- ================================
-- 함수 및 트리거
-- ================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_design_systems_updated_at 
    BEFORE UPDATE ON design_systems 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at 
    BEFORE UPDATE ON components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at 
    BEFORE UPDATE ON themes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at 
    BEFORE UPDATE ON ratings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_design_system_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE design_systems
    SET 
        rating_average = COALESCE((
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM ratings 
            WHERE design_system_id = COALESCE(NEW.design_system_id, OLD.design_system_id)
        ), 0.0),
        rating_count = COALESCE((
            SELECT COUNT(*)
            FROM ratings 
            WHERE design_system_id = COALESCE(NEW.design_system_id, OLD.design_system_id)
        ), 0)
    WHERE id = COALESCE(NEW.design_system_id, OLD.design_system_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 평점 변경 시 자동 업데이트 트리거
CREATE TRIGGER update_rating_after_insert 
    AFTER INSERT ON ratings 
    FOR EACH ROW EXECUTE FUNCTION update_design_system_rating();

CREATE TRIGGER update_rating_after_update 
    AFTER UPDATE ON ratings 
    FOR EACH ROW EXECUTE FUNCTION update_design_system_rating();

CREATE TRIGGER update_rating_after_delete 
    AFTER DELETE ON ratings 
    FOR EACH ROW EXECUTE FUNCTION update_design_system_rating();

-- 즐겨찾기 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE design_systems
    SET favorite_count = (
        SELECT COUNT(*)
        FROM user_favorites 
        WHERE design_system_id = COALESCE(NEW.design_system_id, OLD.design_system_id)
    )
    WHERE id = COALESCE(NEW.design_system_id, OLD.design_system_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 즐겨찾기 변경 시 자동 업데이트 트리거
CREATE TRIGGER update_favorite_after_insert 
    AFTER INSERT ON user_favorites 
    FOR EACH ROW EXECUTE FUNCTION update_favorite_count();

CREATE TRIGGER update_favorite_after_delete 
    AFTER DELETE ON user_favorites 
    FOR EACH ROW EXECUTE FUNCTION update_favorite_count();

-- ================================
-- Row Level Security (RLS) 정책
-- ================================

-- RLS 활성화
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_system_versions ENABLE ROW LEVEL SECURITY;

-- 디자인 시스템 정책
CREATE POLICY "Public design systems are viewable by everyone" 
    ON design_systems FOR SELECT 
    USING (is_public = true);

CREATE POLICY "Users can view their own design systems" 
    ON design_systems FOR SELECT 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own design systems" 
    ON design_systems FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own design systems" 
    ON design_systems FOR UPDATE 
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own design systems" 
    ON design_systems FOR DELETE 
    USING (auth.uid()::text = user_id);

-- 컴포넌트 정책
CREATE POLICY "Components are viewable if design system is accessible" 
    ON components FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = components.design_system_id 
            AND (ds.is_public = true OR ds.user_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage components of their own design systems" 
    ON components FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = components.design_system_id 
            AND ds.user_id = auth.uid()::text
        )
    );

-- 테마 정책
CREATE POLICY "Themes are viewable if design system is accessible" 
    ON themes FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = themes.design_system_id 
            AND (ds.is_public = true OR ds.user_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage themes of their own design systems" 
    ON themes FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = themes.design_system_id 
            AND ds.user_id = auth.uid()::text
        )
    );

-- 즐겨찾기 정책
CREATE POLICY "Users can view all favorites" 
    ON user_favorites FOR SELECT 
    USING (true);

CREATE POLICY "Users can manage their own favorites" 
    ON user_favorites FOR ALL 
    USING (auth.uid()::text = user_id);

-- 평점 정책
CREATE POLICY "Ratings are viewable by everyone" 
    ON ratings FOR SELECT 
    USING (true);

CREATE POLICY "Users can manage their own ratings" 
    ON ratings FOR ALL 
    USING (auth.uid()::text = user_id);

-- 버전 히스토리 정책
CREATE POLICY "Versions are viewable if design system is accessible" 
    ON design_system_versions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = design_system_versions.design_system_id 
            AND (ds.is_public = true OR ds.user_id = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage versions of their own design systems" 
    ON design_system_versions FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM design_systems ds 
            WHERE ds.id = design_system_versions.design_system_id 
            AND ds.user_id = auth.uid()::text
        )
    );

-- ================================
-- 샘플 데이터 (선택사항)
-- ================================

-- 개발용 샘플 데이터 삽입 (필요 시 주석 해제)
/*
INSERT INTO design_systems (
    user_id, name, description, is_public, tags, category
) VALUES (
    'sample-user-id',
    'Modern Web Components',
    'A collection of modern and accessible web components',
    true,
    ARRAY['modern', 'accessible', 'components'],
    'Web App'
);
*/

-- 마이그레이션 완료 확인
SELECT 'Design Systems tables created successfully!' as status;