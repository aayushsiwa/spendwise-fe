import { Balance, Payment, TrendingUp } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

import { SummaryMonth } from '@/types/Summary';

const currencyFormat = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);

const Summary = ({ summary }: { summary: SummaryMonth }) => {
  const theme = useTheme();

  const cards = [
    {
      label: 'In + Out',
      value: summary.total_income - summary.total_expense,
      color: '#003f83',
      icon: <Balance fontSize="large" />,
    },
    {
      label: 'Spent',
      value: summary.total_expense,
      color: '#E74C3C',
      icon: <Payment fontSize="large" />,
    },
    {
      label: 'Net Worth',
      value: summary.net + summary.opening,
      color: summary.net + summary.opening >= 0 ? '#2ECC71' : '#E74C3C',
      icon: <TrendingUp fontSize="large" />,
    },
  ];

  return (
    <Grid container spacing={2} justifyContent="center">
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              border: `2px solid ${alpha(card.color, 0.3)}`,
              bgcolor: alpha(card.color, 0.05),
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(card.color, 0.15),
                }}
              >
                {card.icon}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: card.color,
                    fontFamily: 'monospace',
                  }}
                >
                  {card.label.toUpperCase()}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
                  {currencyFormat(card.value)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Summary;
