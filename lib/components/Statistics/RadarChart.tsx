import { CircularProgress } from '@mui/material';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import Toast from '../Toasts/Toast';
import useStatistics from './Satistics.hooks';

const SimpleRadarChart = () => {
  const { summary, isLoading, error } = useStatistics();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>No data available</p>
      </div>
    );
  }

  if (error) {
    return <Toast message={error.message} variant="error" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        //   cx="50%"
        //   cy="50%"
        //   outerRadius="80%"
        data={summary.expenses}
        layout="centric"
      >
        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey="category" />
        <PolarRadiusAxis />
        <Tooltip />
        <Radar dataKey="amount" stroke="red" fill="red" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SimpleRadarChart;
