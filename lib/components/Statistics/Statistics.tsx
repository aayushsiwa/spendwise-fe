import { Grid } from '@mui/material';

import { TRecord } from '@/types/Records';
import { SummaryMonth } from '@/types/Summary';

import BalanceChart from './Charts/LineChart';
import useStatistics from './Statistics.hooks';

const Statistics = ({
  summary,
  records,
}: {
  summary: SummaryMonth;
  records: TRecord[];
}) => {
  const { data } = useStatistics(summary, records);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <BalanceChart data={data} />
      </Grid>
    </Grid>
  );
};

export default Statistics;
