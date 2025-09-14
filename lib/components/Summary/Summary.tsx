import { Card, CardContent, Grid, Typography, alpha } from '@mui/material';

import { SummaryMonth } from '@/types/Summary';

const Summary = ({ summary }: { summary: SummaryMonth }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            border: `10px solid ${alpha(
              summary.net + summary.opening >= 0 ? '#2ECC71' : '#E74C3C',
              0.2
            )}`,
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Net Balance
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {summary.net + summary.opening}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            border: `10px solid ${alpha('#2ECC71', 0.2)}`,
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#2ECC71' }}
            >
              Total Income
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#2ECC71',
              }}
            >
              {summary.total_income}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          sx={{
            border: `10px solid ${alpha('#E74C3C', 0.2)}`,
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Typography
              variant="subtitle2"
              color="#E74C3C"
              sx={{ fontWeight: 600 }}
            >
              Total Expenses
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#E74C3C' }}>
              {summary.total_expenses}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Summary;
