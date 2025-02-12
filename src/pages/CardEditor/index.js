import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Container, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardForm from '../../components/Card/CardForm';
import CardItem from '../../components/Card/CardItem';
import { addCard, deleteCard, selectUserCards, updateCard } from '../../features/cards/cardsSlice';
import { cardAPI } from '../../services/supabase';

const CardEditor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCards = useSelector(selectUserCards);
  const [editingCard, setEditingCard] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/ai-card-battle-online');
    }
  }, [username, navigate]);

  const handleSubmit = data => {
    try {
      if (editingCard) {
        // カードの更新
        dispatch(
          updateCard({
            ...editingCard,
            ...data,
          })
        );
        setEditingCard(null);
        setSuccessMessage('カードを更新しました');
      } else {
        // 新規カード作成
        const newCard = {
          id: Date.now().toString(),
          ...data,
          createdBy: username,
          createdAt: new Date().toISOString(),
        };
        dispatch(addCard(newCard));
        setSuccessMessage('カードを作成しました');
      }
      setError('');
    } catch (err) {
      setError('カードの保存に失敗しました');
      console.error('Card save error:', err);
    }
  };

  const handlePublish = async card => {
    try {
      await cardAPI.createCard({
        name: card.name,
        effect: card.effect,
        createdBy: username,
      });
      setSuccessMessage('カードを投稿しました');
      setError('');
    } catch (err) {
      setError('カードの投稿に失敗しました');
      console.error('Card publish error:', err);
    }
  };

  const handleEdit = card => {
    setEditingCard(card);
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = card => {
    dispatch(deleteCard(card.id));
    setSuccessMessage('カードを削除しました');
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/ai-card-battle-online')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          カード作成・編集
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CardForm onSubmit={handleSubmit} initialValues={editingCard} isEditing={!!editingCard} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h2" gutterBottom>
            作成したカード一覧
          </Typography>
          <Grid container spacing={2}>
            {userCards.map(card => (
              <Grid item xs={12} sm={6} key={card.id}>
                <CardItem
                  card={card}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  isSelected={editingCard?.id === card.id}
                />
              </Grid>
            ))}
            {userCards.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">まだカードが作成されていません</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CardEditor;
