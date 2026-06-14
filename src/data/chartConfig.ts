import type { EChartsOption } from 'echarts';
import type { StationAggregate } from '@/types';
import type { StationViewItem } from '@/data/dashboardView';
import type { SelectedHour } from '@/store/useDashboardStore';

const COLORS = {
  primary: '#06b6d4',
  warning: '#f97316',
  warningYellow: '#eab308',
  lightBlue: '#38bdf8',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  splitLine: '#334155',
};

export const getBarChartOption = (
  rankedStations: StationViewItem[],
  selectedStation: string | null,
  selectedHour: SelectedHour,
): EChartsOption => {
  const reversed = [...rankedStations].reverse();
  const stationNames = reversed.map((s) => s.stationName);
  const values = reversed.map((s) => s.rankingValue);

  const barColors = reversed.map((s) => {
    if (selectedStation && s.stationName === selectedStation) {
      return COLORS.primary;
    }
    return s.barColor;
  });

  const valueLabel = selectedHour === 'all' ? '累计净客流' : '净客流';

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
        const item = reversed[dataIndex];
        if (!item) return '';
        const riskTag = item.isHighRisk
          ? '<span style="color: #f97316; font-weight: 600;">⚠ 高风险</span>'
          : '';
        return `
          <div style="padding: 4px 0; min-width: 160px;">
            <div style="font-weight: 600; margin-bottom: 6px;">${item.stationName} ${riskTag}</div>
            <div>${valueLabel}: <span style="color: ${item.isHighRisk ? '#f97316' : '#06b6d4'}; font-weight: 600;">${item.rankingValue}</span> 人</div>
            <div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">
              累计: 上${item.totalBoarding} / 下${item.totalAlighting} / 净${item.totalNetFlow}
            </div>
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
        data: values.map((value, index) => ({
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

export const getLineChartOption = (
  station: StationAggregate | null,
  highlightHour: SelectedHour,
): EChartsOption => {
  const hoursLabels = ['6:00', '7:00', '8:00', '9:00'];
  const netFlowData = station?.hourlyData.map((h) => h.netFlow) || [];
  const peakHours = [6, 7, 8, 9];

  const highlightIndex =
    highlightHour === 'all'
      ? -1
      : peakHours.findIndex((h) => h === highlightHour);

  const symbolSizes = netFlowData.map((_, i) =>
    i === highlightIndex ? 16 : 8,
  );
  const itemStyles = netFlowData.map((_, i) => ({
    color: i === highlightIndex ? '#f97316' : '#06b6d4',
    borderColor: i === highlightIndex ? '#fef3c7' : '#0f172a',
    borderWidth: i === highlightIndex ? 4 : 2,
    shadowColor: i === highlightIndex ? 'rgba(249, 115, 22, 0.6)' : 'transparent',
    shadowBlur: i === highlightIndex ? 16 : 0,
  }));

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
        const hourIdx = p.dataIndex;
        const isHighRisk = value >= 80;
        const isSelected = hourIdx === highlightIndex;
        return `
          <div style="padding: 4px 0;">
            <div style="margin-bottom: 4px;">
              ${p.name} ${isSelected ? '<span style="color:#f97316">(当前选中)</span>' : ''}
            </div>
            <div>净客流: <span style="color: ${isHighRisk ? '#f97316' : '#06b6d4'}; font-weight: 600;">${value}</span> 人</div>
            ${isHighRisk ? '<div style="color:#f97316; font-size:11px; margin-top:2px;">⚠ 本时段高风险</div>' : ''}
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
      data: hoursLabels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: COLORS.splitLine } },
      axisTick: { show: false },
      axisLabel: {
        color: (idx: number) =>
          idx === highlightIndex ? '#f97316' : COLORS.textSecondary,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.textSecondary },
      splitLine: { lineStyle: { color: COLORS.splitLine, type: 'dashed' } },
    },
    series: station
      ? [
          {
            type: 'line',
            data: netFlowData.map((val, idx) => ({
              value: val,
              symbolSize: symbolSizes[idx],
              itemStyle: itemStyles[idx],
            })),
            smooth: true,
            symbol: 'circle',
            lineStyle: {
              width: 3,
              color: '#06b6d4',
              shadowColor: 'rgba(6, 182, 212, 0.4)',
              shadowBlur: 10,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
                  { offset: 1, color: 'rgba(6, 182, 212, 0)' },
                ],
              },
            },
            animationDuration: 1500,
            animationEasing: 'cubicOut',
          },
          ...(highlightIndex !== -1
            ? [
                {
                  type: 'line',
                  data: netFlowData.map((_, idx) =>
                    idx === highlightIndex ? netFlowData[idx] : null,
                  ),
                  smooth: false,
                  symbol: 'circle',
                  symbolSize: 20,
                  itemStyle: {
                    color: 'transparent',
                    borderColor: '#f97316',
                    borderWidth: 2,
                  },
                  lineStyle: { opacity: 0 },
                  tooltip: { show: false },
                  silent: true,
                  z: 10,
                } as const,
              ]
            : []),
        ]
      : [],
  };
};

export const chartColors = COLORS;
