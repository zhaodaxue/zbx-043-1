import type { StationAggregate } from '@/types';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface RiskTableProps {
  stations: StationAggregate[];
  selectedStation: string | null;
  onStationClick: (stationName: string) => void;
}

const riskLevelConfig = {
  high: { label: '高风险', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400', borderColor: 'border-orange-500/30' },
  medium: { label: '中风险', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
  low: { label: '低风险', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/30' },
};

export function RiskTable({ stations, selectedStation, onStationClick }: RiskTableProps) {
  const highRiskStations = stations
    .filter((s) => s.maxHourlyNetFlow >= 80)
    .sort((a, b) => b.maxHourlyNetFlow - a.maxHourlyNetFlow);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        <h3 className="text-base font-semibold text-slate-100">早高峰超载风险站点</h3>
        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
          {highRiskStations.length} 个
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
            <tr className="text-slate-400 text-left">
              <th className="py-3 px-2 font-medium">排名</th>
              <th className="py-3 px-2 font-medium">站点名称</th>
              <th className="py-3 px-2 font-medium text-right">峰值净客流</th>
              <th className="py-3 px-2 font-medium text-right">风险等级</th>
            </tr>
          </thead>
          <tbody>
            {highRiskStations.map((station, index) => {
              const riskConfig = riskLevelConfig[station.riskLevel];
              const isSelected = selectedStation === station.stationName;

              return (
                <tr
                  key={station.stationName}
                  className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-slate-700/30'
                  }`}
                  onClick={() => onStationClick(station.stationName)}
                >
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                      index < 3
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-slate-100 font-medium">{station.stationName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-orange-400 font-mono font-semibold">
                      {station.maxHourlyNetFlow}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${riskConfig.bgColor} ${riskConfig.textColor} border ${riskConfig.borderColor}`}>
                      {riskConfig.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {highRiskStations.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  暂无高风险站点
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
        * 单小时净客流 ≥ 80 人判定为高风险站点
      </div>
    </div>
  );
}
