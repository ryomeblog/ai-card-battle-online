import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './cards/cardsSlice';
import ollamaReducer from './ollama/ollamaSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    ollama: ollamaReducer,
  },
});
