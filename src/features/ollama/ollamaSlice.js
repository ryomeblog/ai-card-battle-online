import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiUrl: localStorage.getItem('ollamaApiUrl') || '',
  model: localStorage.getItem('ollamaModel') || 'llama2',
  systemPrompt:
    localStorage.getItem('ollamaSystemPrompt') ||
    `あなたはカードゲームの審判です。
2枚のカードの効果を比較し、どちらが勝利するかを判定してください。
判定は以下の点を考慮して行ってください：
1. カードの効果の強さ
2. 効果の発動条件と制約
3. 相性関係
4. 戦術的な優位性`,
};

export const ollamaSlice = createSlice({
  name: 'ollama',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const { apiUrl, model, systemPrompt } = action.payload;
      state.apiUrl = apiUrl;
      state.model = model;
      state.systemPrompt = systemPrompt;

      // ローカルストレージに保存
      localStorage.setItem('ollamaApiUrl', apiUrl);
      localStorage.setItem('ollamaModel', model);
      localStorage.setItem('ollamaSystemPrompt', systemPrompt);
    },
  },
});

export const { updateSettings } = ollamaSlice.actions;

// セレクター
export const selectOllamaSettings = state => state.ollama;

export default ollamaSlice.reducer;
