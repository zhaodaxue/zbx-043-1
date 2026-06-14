import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import type { SelectedHour } from '@/store/useDashboardStore';
import {
  getBarChartOption,
  buildBarChartDisplayData,
  type BarChartDisplayItem,
} from '@/data/chartConfig';
import type { StationAggregate } from '@/types';

interface BarChartProps {
  stations: StationAggregate[];
  selectedStation: string | null;
  selectedHour: SelectedHour;
  onStationClick: (stationName: string) => void;
}

export function BarChart({
  stations,
  selectedStation,
  selectedHour,
  onStationClick,
}: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const displayDataRef = useRef<BarChartDisplayItem[]>([]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const displayData = buildBarChartDisplayData(stations, selectedHour);
    displayDataRef.current = displayData;

    const option = getBarChartOption(displayData, selectedStation, selectedHour);
    chartInstance.current.setOption(option, true);

    chartInstance.current.off('click');
    chartInstance.current.on('click', (params) => {
      if (params.name && typeof params.name === 'string') {
        onStationClick(params.name);
      }
    });
  }, [stations, selectedStation, selectedHour, onStationClick]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[400px]" />
    </div>
  );
}
