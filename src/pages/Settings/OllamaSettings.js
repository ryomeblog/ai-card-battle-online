import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, IconButton, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectOllamaSettings, updateSettings } from '../../features/ollama/ollamaSlice';

const OllamaSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = useSelector(selectOllamaSettings);
  const [formData, setFormData] = React.useState(settings);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateSettings(formData));
    alert('設定を保存しました');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/ai-card-battle-online')} size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Ollama設定
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="apiUrl"
            label="Ollama API URL"
            name="apiUrl"
            value={formData.apiUrl}
            onChange={handleChange}
            placeholder="http://localhost:11434"
            helperText="OllamaのAPIエンドポイントを入力してください"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="model"
            label="モデル名"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="llama2"
            helperText="使用するモデル名を入力してください"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="systemPrompt"
            label="システムプロンプト"
            name="systemPrompt"
            value={formData.systemPrompt}
            onChange={handleChange}
            multiline
            rows={6}
            helperText="カード対戦の判定に使用するシステムプロンプトを入力してください"
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/ai-card-battle-online')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="contained" color="primary">
              保存
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OllamaSettings;
