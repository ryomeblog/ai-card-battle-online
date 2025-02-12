import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Button, Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardItem from '../../components/Card/CardItem';
import {
  selectBattleCard1,
  selectBattleCard2,
  selectBattleResult,
} from '../../features/cards/cardsSlice';

const BattleResult = () => {
  const navigate = useNavigate();
  const battleResult = useSelector(selectBattleResult);
  const card1 = useSelector(selectBattleCard1);
  const card2 = useSelector(selectBattleCard2);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username || !battleResult) {
      navigate('/ai-card-battle-online');
    }
  }, [username, battleResult, navigate]);

  const handleShare = async () => {
    const shareText = `
AIカードバトル - 対戦結果!
${card1.name} vs ${card2.name}
勝者: ${battleResult.winCard.name}
理由: ${battleResult.reason}
#AIカードバトル
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AIカードバトル - 対戦結果',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('結果をクリップボードにコピーしました！');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (!battleResult || !card1 || !card2) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/ai-card-battle-online')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          バトル結果
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          勝者: {battleResult.winCard.name}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            勝利理由:
          </Typography>
          <Typography variant="body1" paragraph>
            {battleResult.reason}
          </Typography>

          <Typography variant="h6" gutterBottom>
            バトルの展開:
          </Typography>
          <Typography variant="body1" paragraph>
            {battleResult.scenario}
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            カード1
          </Typography>
          <CardItem
            card={card1}
            showActions={false}
            isSelected={battleResult.winCard.id === card1.id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom align="center">
            カード2
          </Typography>
          <CardItem
            card={card2}
            showActions={false}
            isSelected={battleResult.winCard.id === card2.id}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 8 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={() => navigate('/ai-card-battle-online/battle')}
        >
          もう一度対戦する
        </Button>
        <Button variant="outlined" color="primary" startIcon={<ShareIcon />} onClick={handleShare}>
          結果を共有
        </Button>
      </Box>
    </Container>
  );
};

export default BattleResult;
