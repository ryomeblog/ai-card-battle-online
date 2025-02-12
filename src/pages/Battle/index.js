import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardItem from '../../components/Card/CardItem';
import {
  selectUserCards,
  setBattleCard1,
  setBattleCard2,
  setBattleResult,
} from '../../features/cards/cardsSlice';
import { ollamaAPI } from '../../services/ollama';
import { cardAPI } from '../../services/supabase';

const Battle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCards = useSelector(selectUserCards);
  const [publishedCards, setPublishedCards] = useState([]);
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [selectedCard2, setSelectedCard2] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/ai-card-battle-online');
      return;
    }
    fetchPublishedCards();
  }, [username, navigate]);

  const convertSnakeToCamel = obj => {
    if (Array.isArray(obj)) {
      return obj.map(item => convertSnakeToCamel(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = convertSnakeToCamel(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  };

  const fetchPublishedCards = async () => {
    try {
      const cards = await cardAPI.fetchCards();
      const formattedCards = convertSnakeToCamel(cards);
      setPublishedCards(formattedCards);
    } catch (err) {
      setError('カードの取得に失敗しました');
      console.error('Fetch cards error:', err);
    }
  };

  const handleCardSelect = (card, isFirstCard = true) => {
    if (isFirstCard) {
      setSelectedCard1(card);
      dispatch(setBattleCard1(card));
    } else {
      setSelectedCard2(card);
      dispatch(setBattleCard2(card));
    }
  };

  const handleShowDetail = card => {
    setShowCardDetail(card);
  };

  const handleStartBattle = async () => {
    if (!selectedCard1 || !selectedCard2) {
      setError('2枚のカードを選択してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await ollamaAPI.executeBattle(selectedCard1, selectedCard2);
      dispatch(setBattleResult(result));
      navigate('/ai-card-battle-online/battle-result');
    } catch (err) {
      setError('バトルの実行に失敗しました');
      console.error('Battle execution error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/ai-card-battle-online')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          カード対戦
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2" gutterBottom>
            あなたのカード
          </Typography>
          <Grid container spacing={2}>
            {userCards.map(card => (
              <Grid item xs={12} sm={6} key={card.id}>
                <CardItem
                  card={card}
                  onSelect={() => handleCardSelect(card, true)}
                  isSelected={selectedCard1?.id === card.id}
                  showActions={true}
                  onPublish={() => handleShowDetail(card)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2" gutterBottom>
            対戦相手のカード
          </Typography>
          <Grid container spacing={2}>
            {publishedCards.map(card => (
              <Grid item xs={12} sm={6} key={card.id}>
                <CardItem
                  card={card}
                  onSelect={() => handleCardSelect(card, false)}
                  isSelected={selectedCard2?.id === card.id}
                  showActions={true}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartBattle}
          disabled={!selectedCard1 || !selectedCard2 || loading}
        >
          {loading ? '対戦中...' : '対戦開始'}
        </Button>
      </Box>

      <Dialog open={!!showCardDetail} onClose={() => setShowCardDetail(null)}>
        <DialogTitle>カード詳細</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6" gutterBottom>
              {showCardDetail?.name}
            </Typography>
            <Typography variant="body1" paragraph>
              効果: {showCardDetail?.effect}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              作成者: {showCardDetail?.createdBy}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCardDetail(null)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Battle;
