import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { usePeriodContext } from '@/lib/context/Period/Period';

const PeriodSelector = () => {
  const { period, setPeriod, setRange } = usePeriodContext();

  const [customRange, setCustomRange] = useState({
    from: new Date(),
    to: new Date(),
    key: 'selection',
  });

  const additionalRanges = {
    yearToDate: 'Year to date',
    everything: 'Everything',
    customRange: 'Custom range',
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = dayjs().subtract(i, 'month');
    return {
      label: d.format('MMMM'),
      range: {
        from: d.startOf('month').format('YYYY-MM-DD'),
        to: d.endOf('month').format('YYYY-MM-DD'),
        key: 'selection',
      },
    };
  });

  const handleChange = (e: SelectChangeEvent) => {
    setPeriod(e.target.value);
    // for cases when month is selected
    // if (!Object.values(additionalRanges).includes(e.target.value)) {
    //   const selectedMonth = months.find((m) => m.label === e.target.value);
    //   if (selectedMonth) {
    //     const newRange = {
    //       from: selectedMonth.range.from,
    //       to: selectedMonth.range.to,
    //       key: 'selection',
    //     };
    //     setRange(newRange);
    //   }
    // }

    // for cases when additional range is selected
    if (e.target.value === 'yearToDate') {
      const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD');
      const endOfYear = dayjs().format('YYYY-MM-DD');
      setRange({
        from: startOfYear,
        to: endOfYear,
        key: 'selection',
      });
    }
    // TODO: handle everything case
    if (e.target.value === 'everything') {
      console.log('everything selected: todo pending');
      setRange({
        from: '2000-01-01',
        to: dayjs().format('YYYY-MM-DD'),
        key: 'selection',
      });
    }
    if (e.target.value === 'customRange') {
      setAnchorEl(document.body);
    } else {
      setAnchorEl(null);
    }
  };

  const handleRangeChange = (ranges: RangeKeyDict) => {
    setCustomRange({
      from: ranges.selection.startDate!,
      to: ranges.selection.endDate!,
      key: 'selection',
    });
    setRange({
      from: dayjs(ranges.selection.startDate).format('YYYY-MM-DD'),
      to: dayjs(ranges.selection.endDate).format('YYYY-MM-DD'),
      key: 'selection',
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="period-label">Period</InputLabel>
        <Select
          labelId="period-label"
          value={period}
          label="Period"
          onChange={handleChange}
        >
          {months.map((m) => (
            <MenuItem key={m.label} value={m.label}>
              {m.label}
            </MenuItem>
          ))}
          {Object.entries(additionalRanges).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Popover
        open={period === 'customRange' && Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 6,
          mr: 6,
        }}
      >
        <Box sx={{ p: 2 }}>
          <DateRange
            ranges={[customRange]}
            onChange={handleRangeChange}
            moveRangeOnFirstSelection={false}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setPeriod(months[0].label);
                setAnchorEl(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default PeriodSelector;
