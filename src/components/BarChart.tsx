import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import type { StationAggregate } from '@/types';
import { getBarChartOption } from '@/data/chartConfig';

interface BarChartProps {
  stations: StationAggregate[];
  selectedStation: string | null;
  onStationClick: (stationName: string) => void;
}

export function BarChart({ stations, selectedStation, onStationClick }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

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

    const option = getBarChartOption(stations, selectedStation);
    chartInstance.current.setOption(option, true);

    chartInstance.current.off('click');
    chartInstance.current.on('click', (params) => {
      if (params.name && typeof params.name === 'string') {
        onStationClick(params.name);
      }
    });
  }, [stations, selectedStation, onStationClick]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[400px]" />
    </div>
  );
}
