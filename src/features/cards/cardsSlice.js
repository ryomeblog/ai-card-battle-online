import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userCards: [], // ユーザーが作成したカード
  selectedCard: null, // 現在選択されているカード
  battleCard1: null, // 戦闘用カード1
  battleCard2: null, // 戦闘用カード2
  battleResult: null, // 戦闘結果
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    // カードを追加
    addCard: (state, action) => {
      state.userCards.push(action.payload);
    },
    // カードを更新
    updateCard: (state, action) => {
      const index = state.userCards.findIndex(card => card.id === action.payload.id);
      if (index !== -1) {
        state.userCards[index] = action.payload;
      }
    },
    // カードを削除
    deleteCard: (state, action) => {
      state.userCards = state.userCards.filter(card => card.id !== action.payload);
    },
    // カードを選択
    selectCard: (state, action) => {
      state.selectedCard = action.payload;
    },
    // 戦闘用カード1を設定
    setBattleCard1: (state, action) => {
      state.battleCard1 = action.payload;
    },
    // 戦闘用カード2を設定
    setBattleCard2: (state, action) => {
      state.battleCard2 = action.payload;
    },
    // 戦闘結果を設定
    setBattleResult: (state, action) => {
      state.battleResult = action.payload;
    },
    // 戦闘状態をリセット
    resetBattle: state => {
      state.battleCard1 = null;
      state.battleCard2 = null;
      state.battleResult = null;
    },
  },
});

export const {
  addCard,
  updateCard,
  deleteCard,
  selectCard,
  setBattleCard1,
  setBattleCard2,
  setBattleResult,
  resetBattle,
} = cardsSlice.actions;

// セレクター
export const selectUserCards = state => state.cards.userCards;
export const selectSelectedCard = state => state.cards.selectedCard;
export const selectBattleCard1 = state => state.cards.battleCard1;
export const selectBattleCard2 = state => state.cards.battleCard2;
export const selectBattleResult = state => state.cards.battleResult;

export default cardsSlice.reducer;
