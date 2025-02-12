import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CardForm = ({ onSubmit, initialValues, isEditing = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues || {
      name: '',
      effect: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const onSubmitHandler = data => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditing ? 'カードを編集' : 'カードを作成'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate sx={{ mt: 2 }}>
          <TextField
            {...register('name', {
              required: 'カード名は必須です',
              maxLength: {
                value: 50,
                message: 'カード名は50文字以内で入力してください',
              },
            })}
            margin="normal"
            required
            fullWidth
            id="name"
            label="カード名"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register('effect', {
              required: 'カード効果は必須です',
              maxLength: {
                value: 200,
                message: 'カード効果は200文字以内で入力してください',
              },
            })}
            margin="normal"
            required
            fullWidth
            id="effect"
            label="カード効果"
            multiline
            rows={4}
            error={!!errors.effect}
            helperText={errors.effect?.message}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button type="button" variant="outlined" onClick={() => reset()}>
              リセット
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? '更新' : '作成'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CardForm;
