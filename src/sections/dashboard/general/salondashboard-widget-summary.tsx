import { type ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card, { type CardProps } from '@mui/material/Card';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  count: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function SalonDashBoardWidgetSummary({
  title,
  count,
  total,
  chart,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });

  const renderTrending = (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Typography variant="subtitle2" component="div" noWrap>
        {count > 0 && '#'}

        {count}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {' Sales'}
        </Box>
      </Typography>
    </Stack>
  );

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Typography variant="h3" gutterBottom>
          {fCurrency(total)}
        </Typography>

        {renderTrending}
      </Box>

      <Chart
        dir="ltr"
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width={96}
        height={64}
      />
    </Card>
  );
}
