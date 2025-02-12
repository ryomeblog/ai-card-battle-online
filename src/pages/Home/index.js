import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [error, setError] = useState('');

  const handleUsernameSubmit = e => {
    e.preventDefault();
    if (!username.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    // ユーザー名をローカルストレージに保存
    localStorage.setItem('username', username.trim());
    setError('');
  };

  const handleNavigation = path => {
    if (!username.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }
    localStorage.setItem('username', username.trim());
    navigate(path);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton
            color="primary"
            onClick={() => navigate('/ai-card-battle-online/settings/ollama')}
            size="large"
            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          AIカードバトル
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          AIを使ったカードゲームで対戦を楽しもう！
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            handleUsernameSubmit(e);
          }}
          noValidate
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="ユーザー名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
            autoFocus
          />
        </Box>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => handleNavigation('/ai-card-battle-online/card-editor')}
              size="large"
              type="button"
            >
              カード作成・編集
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<SportsEsportsIcon />}
              onClick={() => handleNavigation('/ai-card-battle-online/battle')}
              size="large"
              type="button"
            >
              カード対戦
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
