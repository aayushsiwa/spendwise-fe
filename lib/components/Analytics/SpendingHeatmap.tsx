import { Box, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import { useMemo } from 'react';

import { TRecord } from '@/types/Records';

type SpendingHeatmapProps = {
  records: TRecord[];
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = 8;

const SpendingHeatmap = ({ records }: SpendingHeatmapProps) => {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  const grid = useMemo(() => {
    const today = new Date();
    const dayMap: Record<string, number> = {};

    for (const r of records) {
      if (r.type !== 'expense') continue;
      dayMap[r.date] = (dayMap[r.date] ?? 0) + r.amount;
    }

    const cells: {
      date: string;
      dayIdx: number;
      weekIdx: number;
      amount: number;
    }[] = [];
    for (let w = WEEKS - 1; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];
        cells.push({
          date: dateStr,
          dayIdx: d,
          weekIdx: w,
          amount: dayMap[dateStr] ?? 0,
        });
      }
    }

    return cells;
  }, [records]);

  const maxAmount = Math.max(...grid.map((c) => c.amount), 1);

  const getColor = (amount: number) => {
    if (amount === 0) return alpha(theme.palette.grey[300], 0.3);
    const intensity = Math.min(amount / maxAmount, 1);
    return alpha(accent, 0.1 + intensity * 0.75);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mr: 0.5 }}
        >
          {DAYS.map((day) => (
            <Box
              key={day}
              sx={{
                height: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pr: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 10 }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {Array.from({ length: WEEKS }, (_, w) => (
            <Box
              key={w}
              sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
            >
              {Array.from({ length: 7 }, (_, d) => {
                const cell = grid.find(
                  (c) => c.dayIdx === d && c.weekIdx === w
                );
                const amount = cell?.amount ?? 0;
                return (
                  <Tooltip
                    key={`${w}-${d}`}
                    title={
                      cell
                        ? `${cell.date}: ₹${amount.toLocaleString('en-IN')}`
                        : ''
                    }
                    arrow
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '3px',
                        backgroundColor: getColor(amount),
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        '&:hover': {
                          transform: 'scale(1.5)',
                          outline: `2px solid ${theme.palette.secondary.main}`,
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 1.5,
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 10 }}
        >
          Less
        </Typography>
        {[0, 0.25, 0.5, 0.75, 1].map((level) => (
          <Box
            key={level}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '2px',
              backgroundColor:
                level === 0
                  ? alpha(theme.palette.grey[300], 0.3)
                  : alpha(accent, 0.1 + level * 0.75),
            }}
          />
        ))}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 10 }}
        >
          More
        </Typography>
      </Box>
    </Box>
  );
};

export default SpendingHeatmap;
