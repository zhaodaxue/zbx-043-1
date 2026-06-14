import { useEffect } from 'react';
import { useECharts } from '@/hooks/useECharts';
import type { StationViewItem } from '@/data/dashboardView';
import type { SelectedHour } from '@/store/useDashboardStore';
import { getBarChartOption } from '@/data/chartConfig';

interface BarChartProps {
  rankedStations: StationViewItem[];
  selectedStation: string | null;
  selectedHour: SelectedHour;
  onStationClick: (stationName: string) => void;
}

export function BarChart({
  rankedStations,
  selectedStation,
  selectedHour,
  onStationClick,
}: BarChartProps) {
  const handleClick = (params: unknown) => {
    const p = params as { name?: unknown };
    if (p.name && typeof p.name === 'string') {
      onStationClick(p.name);
    }
  };

  const { chartRef, setOption } = useECharts({
    minHeight: '400px',
    onClick: handleClick,
  });

  useEffect(() => {
    const option = getBarChartOption(rankedStations, selectedStation, selectedHour);
    setOption(option);
  }, [rankedStations, selectedStation, selectedHour, setOption]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[400px]" />
    </div>
  );
}
