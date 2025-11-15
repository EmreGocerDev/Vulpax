-- Kayıtlı kartlar tablosu
CREATE TABLE IF NOT EXISTS saved_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_alias VARCHAR(100) NOT NULL,
  card_last4 VARCHAR(4) NOT NULL,
  card_type VARCHAR(20) NOT NULL,
  card_token TEXT, -- iyzico kart token'ı
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_saved_cards_user_id ON saved_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_cards_is_default ON saved_cards(is_default);

-- RLS (Row Level Security) aktif et
ALTER TABLE saved_cards ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi kartlarını görebilir
CREATE POLICY "Users can view own cards"
  ON saved_cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını ekleyebilir
CREATE POLICY "Users can insert own cards"
  ON saved_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını güncelleyebilir
CREATE POLICY "Users can update own cards"
  ON saved_cards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi kartlarını silebilir
CREATE POLICY "Users can delete own cards"
  ON saved_cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- Güncelleme zamanını otomatik ayarla
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saved_cards_updated_at
  BEFORE UPDATE ON saved_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
