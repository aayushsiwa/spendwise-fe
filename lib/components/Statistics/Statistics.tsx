import BalanceChart from './Charts/LineChart';
// import SimplePieChart from './Charts/PieChart';
// import SimpleRadarChart from './Charts/RadarChart';
import useStatistics from './Satistics.hooks';

const Statistics = () => {
  const { data, summary, isLoading, error } = useStatistics();

  console.log(data);
  return (
    <>
      {/* <SimplePieChart /> */}
      {/* <SimpleRadarChart /> */}
      <BalanceChart data={data} />
    </>
  );
};

export default Statistics;
