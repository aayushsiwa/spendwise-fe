import { SummaryMonth } from '@/types/Summary';

import BalanceChart from './Charts/LineChart';
// import SimplePieChart from './Charts/PieChart';
// import SimpleRadarChart from './Charts/RadarChart';
import useStatistics from './Statistics.hooks';

const Statistics = ({ summary }: { summary: SummaryMonth }) => {
  const { data } = useStatistics(summary);

  // console.log(data);
  return (
    <>
      {/* <SimplePieChart /> */}
      {/* <SimpleRadarChart /> */}
      <BalanceChart data={data} />
    </>
  );
};

export default Statistics;
