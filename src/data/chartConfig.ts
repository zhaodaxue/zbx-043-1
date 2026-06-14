import type { EChartsOption } from 'echarts';
import type { StationAggregate } from '@/types';
import { PEAK_HOURS } from '@/types';

const COLORS = {
  primary: '#06b6d4',
  warning: '#f97316',
  danger: '#ef4444',
  success: '#22c55e',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  bgCard: '#1e293b',
  splitLine: '#334155',
};

export const getBarChartOption = (
  stations: StationAggregate[],
  selectedStation: string | null,
): EChartsOption => {
  const stationNames = stations.map((s) => s.stationName).reverse();
  const netFlowValues = stations.map((s) => s.totalNetFlow).reverse();

  const barColors = stations.map((s) => {
    if (selectedStation && s.stationName === selectedStation) {
      return '#06b6d4';
    }
    if (s.maxHourlyNetFlow >= 80) return '#f97316';
    if (s.maxHourlyNetFlow >= 50) return '#eab308';
    return '#38bdf8';
  }).reverse();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9' },
      formatter: (params: unknown) => {
        const p = Array.isArray(params) ? params[0] : params;
        const dataIndex = p?.dataIndex;
        const station = stations[stations.length - 1 - dataIndex];
        if (!station) return '';
        return `
          <div style="padding: 4px 0;">
            <div style="font-weight: 600; margin-bottom: 4px;">${station.stationName}</div>
            <div>净客流: <span style="color: ${station.maxHourlyNetFlow >= 80 ? '#f97316' : '#06b6d4'}; font-weight: 600;">${station.totalNetFlow}</span> 人</div>
            <div style="color: #94a3b8; font-size: 12px;">上车 ${station.totalBoarding} / 下车 ${station.totalAlighting}</div>
          </div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      top: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.textSecondary },
      splitLine: { lineStyle: { color: COLORS.splitLine, type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      data: stationNames,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: 500,
      },
    },
    series: [
      {
        type: 'bar',
        data: netFlowValues.map((value, index) => ({
        value,
        itemStyle: {
          color: barColors[index],
          borderRadius: [0, 4, 4, 0],
        },
      })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          color: COLORS.textPrimary,
          fontSize: 12,
          fontWeight: 600,
          formatter: '{c}',
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };
};

export const getLineChartOption = (station: StationAggregate | null): EChartsOption => {
  const hours = PEAK_HOURS.map((h) => `${h}:00`);
  const netFlowData = station?.hourlyData.map((h) => h.netFlow) || [];

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9' },
      formatter: (params: unknown) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p) return '';
        const value = p.value;
        return `
          <div style="padding: 4px 0;">
            <div style="margin-bottom: 4px;">${p.name}</div>
            <div>净客流: <span style="color: #06b6d4; font-weight: 600;">${value}</span> 人</div>
          </div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '10%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLine: { lineStyle: { color: COLORS.splitLine } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.textSecondary },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.textSecondary },
      splitLine: { lineStyle: { color: COLORS.splitLine, type: 'dashed' } },
    },
    series: station ? [
      {
        type: 'line',
        data: netFlowData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#06b6d4',
          shadowColor: 'rgba(6, 182, 212, 0.4)',
          shadowBlur: 10,
        },
        itemStyle: {
          color: '#06b6d4',
          borderColor: '#0f172a',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0)' },
            ],
          },
        },
        animationDuration: 1500,
        animationEasing: 'cubicOut',
      },
    ] : [],
  };
};

export const chartColors = COLORS;
