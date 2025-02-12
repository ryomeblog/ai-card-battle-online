import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
}));

const CardItem = ({
  card,
  onDelete,
  onSelect,
  onEdit,
  onPublish,
  showActions = true,
  isSelected = false,
}) => {
  return (
    <StyledCard
      sx={{
        border: isSelected ? 2 : 0,
        borderColor: 'primary.main',
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {card.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: '60px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {card.effect}
        </Typography>
        <Box mt={1}>
          <Typography variant="caption" color="text.secondary">
            作成者: {card.createdBy}
          </Typography>
        </Box>
      </CardContent>
      {showActions && (
        <CardActions>
          {onSelect && !onEdit && (
            <Button size="small" color="primary" onClick={() => onSelect(card)}>
              選択
            </Button>
          )}
          {onEdit && (
            <Button size="small" color="secondary" onClick={() => onEdit(card)}>
              編集
            </Button>
          )}
          {onPublish && (
            <Button size="small" color="success" onClick={() => onPublish(card)}>
              投稿
            </Button>
          )}
          {onDelete && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(card)}
            >
              削除
            </Button>
          )}
        </CardActions>
      )}
    </StyledCard>
  );
};

export default CardItem;
