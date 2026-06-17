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

  return <BalanceChart data={data} />;
};

export default Statistics;
