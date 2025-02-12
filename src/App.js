import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { store } from './features/store';
import theme from './theme';

// ページコンポーネントのインポート
const Home = React.lazy(() => import('./pages/Home'));
const CardEditor = React.lazy(() => import('./pages/CardEditor'));
const Battle = React.lazy(() => import('./pages/Battle'));
const BattleResult = React.lazy(() => import('./pages/BattleResult'));
const OllamaSettings = React.lazy(() => import('./pages/Settings/OllamaSettings'));

// GitHub Pagesのベースパスを設定
const basename = process.env.NODE_ENV === 'production' ? '/ai-card-battle-online' : '';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename={basename}>
          <React.Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                読み込み中...
              </div>
            }
          >
            <Routes>
              <Route path="/ai-card-battle-online" element={<Home />} />
              <Route path="/ai-card-battle-online/card-editor" element={<CardEditor />} />
              <Route path="/ai-card-battle-online/battle" element={<Battle />} />
              <Route path="/ai-card-battle-online/battle-result" element={<BattleResult />} />
              <Route path="/ai-card-battle-online/settings/ollama" element={<OllamaSettings />} />
            </Routes>
          </React.Suspense>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
