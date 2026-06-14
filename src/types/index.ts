export interface BusFlowRecord {
  stationName: string;
  hour: number;
  boarding: number;
  alighting: number;
  netFlow: number;
}

export interface HourlyNetFlow {
  hour: number;
  netFlow: number;
}

export interface StationAggregate {
  stationName: string;
  totalBoarding: number;
  totalAlighting: number;
  totalNetFlow: number;
  hourlyData: HourlyNetFlow[];
  riskLevel: 'high' | 'medium' | 'low';
}

export const RISK_THRESHOLD_HIGH = 80;
export const RISK_THRESHOLD_MEDIUM = 50;
export const PEAK_HOURS = [6, 7, 8, 9];
