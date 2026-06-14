import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import type { StationAggregate } from '@/types';
import { getLineChartOption } from '@/data/chartConfig';

interface LineChartProps {
  station: StationAggregate | null;
}

export function LineChart({ station }: LineChartProps) {
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

    const option = getLineChartOption(station);
    chartInstance.current.setOption(option, true);
  }, [station]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[280px]" />
    </div>
  );
}
