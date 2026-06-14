import { create } from 'zustand';
import type { StationAggregate, BusFlowRecord } from '@/types';
import { parseBusFlowCSV } from '@/data/csvParser';
import { aggregateByStation } from '@/data/dataAggregator';

interface DashboardState {
  records: BusFlowRecord[];
  stations: StationAggregate[];
  selectedStation: string | null;
  loading: boolean;
  error: string | null;
  loadData: (csvUrl: string) => Promise<void>;
  setSelectedStation: (stationName: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  records: [],
  stations: [],
  selectedStation: null,
  loading: false,
  error: null,

  loadData: async (csvUrl: string) => {
    set({ loading: true, error: null });
    try {
      const records = await parseBusFlowCSV(csvUrl);
      const stations = aggregateByStation(records);
      set({
        records,
        stations,
        selectedStation: stations.length > 0 ? stations[0].stationName : null,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '数据加载失败',
        loading: false,
      });
    }
  },

  setSelectedStation: (stationName: string | null) => {
    set({ selectedStation: stationName });
  },
}));
