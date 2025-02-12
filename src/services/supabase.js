import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// カードに関連するAPI関数
export const cardAPI = {
  // カード一覧の取得
  async fetchCards() {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // カードの作成
  async createCard({ name, effect, createdBy }) {
    const { data, error } = await supabase
      .from('cards')
      .insert([{ name, effect, created_by: createdBy }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // カードの更新
  async updateCard({ id, name, effect }) {
    const { data, error } = await supabase
      .from('cards')
      .update({ name, effect })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // カードの削除
  async deleteCard(id) {
    const { error } = await supabase.from('cards').delete().eq('id', id);

    if (error) throw error;
  },
};
