import { useMemo } from 'react';
import type { StationAggregate, HourlyNetFlow } from '@/types';
import { RISK_THRESHOLD_HIGH, RISK_THRESHOLD_MEDIUM } from '@/types';
import type { SelectedHour } from '@/store/useDashboardStore';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface StationViewItem {
  stationName: string;
  totalBoarding: number;
  totalAlighting: number;
  totalNetFlow: number;
  maxHourlyNetFlow: number;
  hourlyData: HourlyNetFlow[];
  rankingValue: number;
  isHighRisk: boolean;
  riskLevel: RiskLevel;
  riskLevelLabel: string;
  riskLevelConfig: {
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  barColor: string;
}

export interface DashboardViewData {
  stationViews: StationViewItem[];
  rankedStations: StationViewItem[];
  highRiskStations: StationViewItem[];
  highRiskCount: number;
  getStationView: (name: string) => StationViewItem | undefined;
  getHourlyNetFlow: (station: StationViewItem, hour: SelectedHour) => number;
}

const RISK_LEVEL_CONFIG: Record<
  RiskLevel,
  { label: string; bgColor: string; textColor: string; borderColor: string; barColor: string }
> = {
  high: {
    label: '高风险',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    barColor: '#f97316',
  },
  medium: {
    label: '中风险',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    barColor: '#eab308',
  },
  low: {
    label: '低风险',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    barColor: '#38bdf8',
  },
};

const calculateRiskLevel = (value: number): RiskLevel => {
  if (value >= RISK_THRESHOLD_HIGH) return 'high';
  if (value >= RISK_THRESHOLD_MEDIUM) return 'medium';
  return 'low';
};

const getRiskBasisValue = (
  station: StationAggregate,
  selectedHour: SelectedHour,
): number => {
  if (selectedHour === 'all') {
    return station.maxHourlyNetFlow;
  }
  const hourly = station.hourlyData.find((h) => h.hour === selectedHour);
  return hourly?.netFlow ?? 0;
};

const getRankingValue = (station: StationAggregate, selectedHour: SelectedHour): number => {
  if (selectedHour === 'all') {
    return station.totalNetFlow;
  }
  const hourly = station.hourlyData.find((h) => h.hour === selectedHour);
  return hourly?.netFlow ?? 0;
};

const createStationView = (
  station: StationAggregate,
  selectedHour: SelectedHour,
): StationViewItem => {
  const riskBasisValue = getRiskBasisValue(station, selectedHour);
  const riskLevel = calculateRiskLevel(riskBasisValue);
  const levelConfig = RISK_LEVEL_CONFIG[riskLevel];
  const rankingValue = getRankingValue(station, selectedHour);

  return {
    stationName: station.stationName,
    totalBoarding: station.totalBoarding,
    totalAlighting: station.totalAlighting,
    totalNetFlow: station.totalNetFlow,
    maxHourlyNetFlow: station.maxHourlyNetFlow,
    hourlyData: station.hourlyData,
    rankingValue,
    isHighRisk: riskBasisValue >= RISK_THRESHOLD_HIGH,
    riskLevel,
    riskLevelLabel: levelConfig.label,
    riskLevelConfig: {
      bgColor: levelConfig.bgColor,
      textColor: levelConfig.textColor,
      borderColor: levelConfig.borderColor,
    },
    barColor: levelConfig.barColor,
  };
};

export const useDashboardView = (
  stations: StationAggregate[],
  selectedHour: SelectedHour,
): DashboardViewData => {
  return useMemo(() => {
    const stationViews = stations.map((s) => createStationView(s, selectedHour));

    const rankedStations = [...stationViews].sort(
      (a, b) => b.rankingValue - a.rankingValue,
    );

    const highRiskStations = stationViews
      .filter((s) => s.isHighRisk)
      .sort((a, b) => b.rankingValue - a.rankingValue);

    const highRiskCount = highRiskStations.length;

    const getStationView = (name: string) =>
      stationViews.find((s) => s.stationName === name);

    const getHourlyNetFlow = (station: StationViewItem, hour: SelectedHour) => {
      if (hour === 'all') return station.totalNetFlow;
      const hourly = station.hourlyData.find((h) => h.hour === hour);
      return hourly?.netFlow ?? 0;
    };

    return {
      stationViews,
      rankedStations,
      highRiskStations,
      highRiskCount,
      getStationView,
      getHourlyNetFlow,
    };
  }, [stations, selectedHour]);
};

export const getRiskLevelConfig = (level: RiskLevel) => RISK_LEVEL_CONFIG[level];
