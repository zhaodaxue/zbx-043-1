import type { BusFlowRecord, StationAggregate, HourlyNetFlow } from '@/types';
import { RISK_THRESHOLD_HIGH, RISK_THRESHOLD_MEDIUM, PEAK_HOURS } from '@/types';

const calculateRiskLevel = (totalNetFlow: number): 'high' | 'medium' | 'low' => {
  if (totalNetFlow >= RISK_THRESHOLD_HIGH) return 'high';
  if (totalNetFlow >= RISK_THRESHOLD_MEDIUM) return 'medium';
  return 'low';
};

export const aggregateByStation = (records: BusFlowRecord[]): StationAggregate[] => {
  const stationMap = new Map<string, StationAggregate>();

  records.forEach((record) => {
    const existing = stationMap.get(record.stationName);

    if (existing) {
      existing.totalBoarding += record.boarding;
      existing.totalAlighting += record.alighting;
      existing.totalNetFlow += record.netFlow;
      existing.hourlyData.push({ hour: record.hour, netFlow: record.netFlow });
    } else {
      stationMap.set(record.stationName, {
        stationName: record.stationName,
        totalBoarding: record.boarding,
        totalAlighting: record.alighting,
        totalNetFlow: record.netFlow,
        hourlyData: [{ hour: record.hour, netFlow: record.netFlow }],
        riskLevel: 'low',
      });
    }
  });

  const stations = Array.from(stationMap.values());

  stations.forEach((station) => {
    station.hourlyData.sort((a, b) => a.hour - b.hour);

    const allHours: HourlyNetFlow[] = PEAK_HOURS.map((hour) => {
      const found = station.hourlyData.find((h) => h.hour === hour);
      return found || { hour, netFlow: 0 };
    });
    station.hourlyData = allHours;

    station.riskLevel = calculateRiskLevel(station.totalNetFlow);
  });

  return stations.sort((a, b) => b.totalNetFlow - a.totalNetFlow);
};

export const getHighRiskStations = (stations: StationAggregate[]): StationAggregate[] => {
  return stations.filter((s) => s.totalNetFlow >= RISK_THRESHOLD_HIGH);
};

export const getStationByName = (
  stations: StationAggregate[],
  stationName: string,
): StationAggregate | undefined => {
  return stations.find((s) => s.stationName === stationName);
};
