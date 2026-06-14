import { useRef, useEffect, useCallback } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

type EChartsClickHandler = (params: echarts.ECElementEvent) => void;

interface UseEChartsOptions {
  minHeight?: string;
  onClick?: EChartsClickHandler;
}

interface UseEChartsReturn {
  chartRef: React.RefObject<HTMLDivElement>;
  setOption: (option: EChartsOption) => void;
  getInstance: () => echarts.ECharts | null;
}

export function useECharts({
  minHeight = '280px',
  onClick,
}: UseEChartsOptions = {}): UseEChartsReturn {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const clickHandlerRef = useRef<EChartsClickHandler | undefined>(onClick);

  clickHandlerRef.current = onClick;

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

  const setOption = useCallback((option: EChartsOption) => {
    if (!chartInstance.current) return;

    chartInstance.current.setOption(option, true);

    chartInstance.current.off('click');
    if (clickHandlerRef.current) {
      chartInstance.current.on('click', clickHandlerRef.current);
    }
  }, []);

  const getInstance = useCallback(() => {
    return chartInstance.current;
  }, []);

  return { chartRef, setOption, getInstance };
}
