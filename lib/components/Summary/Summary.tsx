import {
  ArrowDownward,
  ArrowUpward,
  Balance,
  Savings,
} from '@mui/icons-material';
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
    maximumFractionDigits: 0,
  }).format(value);

const Summary = ({ summary }: { summary: SummaryMonth }) => {
  const theme = useTheme();

  const cards = [
    {
      label: 'Income',
      value: summary.totalIncome,
      color: theme.palette.success.main,
      icon: <ArrowUpward fontSize="large" />,
    },
    {
      label: 'Expenses',
      value: summary.totalExpense,
      color: theme.palette.error.main,
      icon: <ArrowDownward fontSize="large" />,
    },
    {
      label: 'Net',
      value: summary.net,
      color:
        summary.net >= 0
          ? theme.palette.success.main
          : theme.palette.error.main,
      icon: <Savings fontSize="large" />,
    },
    {
      label: 'Balance',
      value: summary.opening + summary.net,
      color: theme.palette.primary.main,
      icon: <Balance fontSize="large" />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 6, md: 3 }}>
          <Card
            sx={{
              borderLeft: `4px solid ${card.color}`,
              bgcolor: alpha(card.color, 0.03),
              height: '100%',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: { xs: 1, md: 2 },
                '&:last-child': {
                  pb: { xs: 1, md: 2 },
                },
              }}
            >
              <Box
                sx={{
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: alpha(card.color, 0.1),
                  flexShrink: 0,
                  border: `1px solid ${card.color}`,
                }}
              >
                {card.icon}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 800 }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: theme.typography.h6.fontSize,
                    color: card.color,
                    m: 0,
                    p: 0,
                  }}
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
