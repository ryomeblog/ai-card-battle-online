import axios from 'axios';
import { store } from '../features/store';

// リトライ用の遅延関数
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Ollamaクライアントのインスタンスを作成（変更なし）
const createOllamaClient = () => {
  try {
    const state = store.getState();
    if (!state || !state.ollama) {
      throw new Error('Ollamaの設定が見つかりません');
    }

    const { apiUrl } = state.ollama;
    if (!apiUrl) {
      throw new Error('Ollama API URLが設定されていません。設定画面から設定してください。');
    }

    if (!axios || typeof axios.create !== 'function') {
      throw new Error('axiosが正しく初期化されていません');
    }

    return axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  } catch (error) {
    console.error('Ollamaクライアントの作成に失敗:', error);
    throw error;
  }
};

// レスポンスの検証関数（変更なし）
const isValidBattleResponse = data => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.winCard === 'string' &&
    typeof data.reason === 'string' &&
    typeof data.scenario === 'string' &&
    data.winCard.length > 0 &&
    data.reason.length > 0 &&
    data.scenario.length > 0
  );
};

// リトライ可能なエラーかどうかを判定する関数
const isRetryableError = error => {
  if (axios.isAxiosError(error)) {
    // ネットワークエラーはリトライ可能
    if (!error.response) return true;

    // 500系エラーはリトライ可能
    if (error.response.status >= 500) return true;

    // レート制限（429）はリトライ可能
    if (error.response.status === 429) return true;
  }

  // パースエラーもリトライ可能
  if (error.message.includes('解析に失敗')) return true;

  // 特定のエラーメッセージもリトライ可能
  const retryableMessages = ['勝者のカードが特定できません', 'バトル結果のフォーマットが不正です'];
  if (retryableMessages.some(msg => error.message.includes(msg))) return true;

  return false;
};

// バトル実行の本体部分を分離
const executeBattleCore = async (ollamaClient, model, systemPrompt, card1, card2) => {
  const prompt = `
${systemPrompt}

カード1のカード名: ${card1.name}
カード1の効果: ${card1.effect}

カード2のカード名: ${card2.name}
カード2の効果: ${card2.effect}

以下のJSON形式でvalue側を書き換えて結果を出力してください：
{
  "winCard": "カード名",
  "reason": "勝利理由を説明",
  "scenario": "バトルの展開を詳細に説明（お互いの行動や戦った経緯、戦った場所、戦いの過程、戦い後に起こることなど）"
}`;

  const response = await ollamaClient.post('/api/generate', {
    model,
    prompt,
    format: 'json',
    stream: false,
    raw: true,
  });

  const rawData = response.data;
  let parsedData;

  if (typeof rawData === 'string') {
    parsedData = JSON.parse(rawData);
  } else if (rawData.response) {
    parsedData = JSON.parse(rawData.response);
  } else {
    parsedData = rawData;
  }

  if (!isValidBattleResponse(parsedData)) {
    throw new Error('バトル結果のフォーマットが不正です');
  }

  // 勝者の判定ロジックを修正
  let winningCard;
  if (parsedData.winCard === 'カード1' || parsedData.winCard === card1.name) {
    winningCard > card1;
  } else if (parsedData.winCard === 'カード2' || parsedData.winCard === card2.name) {
    winningCard = card2;
  }
  if (!winningCard) {
    throw new Error('勝者のカードが特定できません');
  }

  return {
    winCard: winningCard,
    reason: parsedData.reason,
    scenario: parsedData.scenario,
  };
};

export const ollamaAPI = {
  async executeBattle(card1, card2) {
    let ollamaClient;
    const MAX_RETRIES = 10;
    const INITIAL_RETRY_DELAY = 1000; // 1秒

    try {
      ollamaClient = createOllamaClient();
    } catch (error) {
      console.error('Ollamaクライアントの初期化エラー:', error);
      throw new Error(`Ollamaクライアントの初期化に失敗しました: ${error.message}`);
    }

    const state = store.getState();
    const { model, systemPrompt } = state.ollama;

    let lastError;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await executeBattleCore(ollamaClient, model, systemPrompt, card1, card2);
      } catch (error) {
        lastError = error;
        console.error(`試行 ${attempt + 1}/${MAX_RETRIES} が失敗:`, error);

        // リトライ可能なエラーでない場合は即座に中断
        if (!isRetryableError(error)) {
          console.error('リトライ不可能なエラーが発生しました');
          throw error;
        }

        // 最後の試行だった場合は中断
        if (attempt === MAX_RETRIES - 1) {
          console.error(`${MAX_RETRIES}回の試行全てが失敗しました`);
          throw new Error(`バトル実行に失敗しました（${MAX_RETRIES}回試行）: ${lastError.message}`);
        }

        // 指数バックオフによる待機
        const waitTime = INITIAL_RETRY_DELAY * Math.pow(1.1, attempt);
        console.log(`${waitTime}ms後に再試行します...`);
        await delay(waitTime);
      }
    }

    throw lastError;
  },
};
