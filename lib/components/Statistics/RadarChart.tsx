import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import useStatistics from "./Satistics.hooks";
import { CircularProgress } from "@mui/material";
import Toast from "../Toasts/Toast";

const SimpleRadarChart = () => {
  const { filteredSummary, isLoading, error } = useStatistics();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!filteredSummary || filteredSummary.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
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
        data={filteredSummary}
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
