import Papa from 'papaparse';
import type { BusFlowRecord } from '@/types';

export const parseBusFlowCSV = async (csvUrl: string): Promise<BusFlowRecord[]> => {
  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error(`数据加载失败: HTTP ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const records: BusFlowRecord[] = results.data
          .map((row) => {
            const stationName = row.stationName?.trim() || '';
            const hour = parseInt(row.hour || '0', 10);
            const boarding = parseInt(row.boarding || '0', 10);
            const alighting = parseInt(row.alighting || '0', 10);
            const netFlow = boarding - alighting;

            if (!stationName || isNaN(hour) || isNaN(boarding) || isNaN(alighting)) {
              return null;
            }

            return {
              stationName,
              hour,
              boarding,
              alighting,
              netFlow,
            };
          })
          .filter((record): record is BusFlowRecord => record !== null);

        if (records.length === 0) {
          reject(new Error('数据解析失败: 未找到有效的客流数据记录'));
          return;
        }

        resolve(records);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
