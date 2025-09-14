import { CircularProgress, Grid } from '@mui/material';
import { Cell, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { useCategoriesContext } from '@/lib/context/Categories/Categories';

import Toast from '../Toasts/Toast';
import useStatistics from './Satistics.hooks';

const SimplePieChart = () => {
  const { summary, isLoading, error } = useStatistics();
  console.log(summary);
  const { getCategoryColor } = useCategoriesContext();
  const currency = '₹';

  const handlePieClick = (data: PieSectorDataItem) => {
    console.log('Clicked category:', data.payload.category);
  };

  const renderActiveShape = (props: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const {
      cx = 0,
      cy = 0,
      midAngle = 0,
      innerRadius,
      outerRadius = 0,
      startAngle,
      endAngle,
      fill,
      payload,
      percent = 0,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={20}
          fontWeight={'bold'}
        >
          {payload.category}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ cursor: 'pointer' }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="red"
        >{`${currency}${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="red"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Toast message={error.message} variant="error" />;
  }

  if (!summary?.expenses || summary.expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    // <ResponsiveContainer width="100%" height="100%" maxHeight={200}>
    <Grid
      container
      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
      sx={{ margin: 'auto', '&:focus': { outline: 'none' } }}
    >
      <PieChart width={400} height={400}>
        <Pie
          activeShape={renderActiveShape}
          data={summary.expenses}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          onClick={handlePieClick}
        >
          {summary.expenses.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getCategoryColor(entry.category) || '#8884d8'} // default color if not in map
            />
          ))}
        </Pie>
        {/* <Tooltip /> */}
      </PieChart>
    </Grid>
    // </ResponsiveContainer>
  );
};

export default SimplePieChart;
