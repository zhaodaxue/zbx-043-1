import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
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

    const option = getLineChartOption(station, highlightHour);
    chartInstance.current.setOption(option, true);

    chartInstance.current.off('click');
    chartInstance.current.on('click', (params) => {
      if (params.componentType === 'series' && typeof params.dataIndex === 'number') {
        const hour = PEAK_HOURS[params.dataIndex];
        if (hour !== undefined) {
          onHourClick(hour);
        }
      }
    });
  }, [station, highlightHour, onHourClick]);

  return (
    <div className="h-full w-full">
      <div ref={chartRef} className="h-full w-full min-h-[280px]" />
    </div>
  );
}
