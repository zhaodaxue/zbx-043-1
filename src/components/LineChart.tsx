import { useEffect } from 'react';
import { useECharts } from '@/hooks/useECharts';
import type { StationAggregate } from '@/types';
import { PEAK_HOURS } from '@/types';
import { getLineChartOption } from '@/data/chartConfig';
import type { SelectedHour } from '@/store/useDashboardStore';

interface LineChartProps {
  station: StationAggregate | null;
  highlightHour: SelectedHour;
  onHourClick: (hour: SelectedHour) => void;
}

export function LineChart({ station, highlightHour, onHourClick }: LineChartProps) {
  const handleClick = (params: unknown) => {
    const p = params as { componentType?: unknown; dataIndex?: unknown };
    if (p.componentType === 'series' && typeof p.dataIndex === 'number') {
      const hour = PEAK_HOURS[p.dataIndex];
      if (hour !== undefined) {
        onHourClick(hour);
      }
    }
  };

  const { chartRef, setOption } = useECharts({
    minHeight: '280px',
    onClick: handleClick,
  });

  useEffect(() => {
    const option = getLineChartOption(station, highlightHour);
    setOption(option);
  }, [station, highlightHour, setOption]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[280px]" />
    </div>
  );
}
