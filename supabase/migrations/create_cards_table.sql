-- カードテーブルの作成
CREATE TABLE cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    effect TEXT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- カード名の一意制約
ALTER TABLE cards ADD CONSTRAINT cards_name_unique UNIQUE (name);

-- 作成者インデックス
CREATE INDEX idx_cards_created_by ON cards(created_by);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLSポリシーの設定
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- 誰でも閲覧可能
CREATE POLICY "カードの閲覧は誰でも可能" ON cards
    FOR SELECT
    USING (true);

-- 作成は誰でも可能
CREATE POLICY "カードの作成は誰でも可能" ON cards
    FOR INSERT
    WITH CHECK (true);

-- 更新は作成者のみ可能
CREATE POLICY "カードの更新は作成者のみ可能" ON cards
    FOR UPDATE
    USING (auth.uid()::text = created_by);

-- 削除は作成者のみ可能
CREATE POLICY "カードの削除は作成者のみ可能" ON cards
    FOR DELETE
    USING (auth.uid()::text = created_by);

-- コメント
COMMENT ON TABLE cards IS 'AIカードバトルで使用されるカード情報';
COMMENT ON COLUMN cards.id IS 'カードの一意識別子';
COMMENT ON COLUMN cards.name IS 'カード名（一意）';
COMMENT ON COLUMN cards.effect IS 'カードの効果説明';
COMMENT ON COLUMN cards.created_by IS 'カードの作成者';
COMMENT ON COLUMN cards.created_at IS 'カードの作成日時';
COMMENT ON COLUMN cards.updated_at IS 'カードの更新日時';