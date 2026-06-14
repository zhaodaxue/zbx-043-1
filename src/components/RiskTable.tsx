import type { StationAggregate } from '@/types';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { SelectedHour } from '@/store/useDashboardStore';

interface RiskTableProps {
  stations: StationAggregate[];
  selectedStation: string | null;
  selectedHour: SelectedHour;
  onStationClick: (stationName: string) => void;
}

const riskLevelConfig = {
  high: { label: '高风险', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400', borderColor: 'border-orange-500/30' },
  medium: { label: '中风险', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
  low: { label: '低风险', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/30' },
};

export function RiskTable({
  stations,
  selectedStation,
  selectedHour,
  onStationClick,
}: RiskTableProps) {
  const riskInfo = stations.map((s) => {
    if (selectedHour === 'all') {
      return {
        station: s,
        riskValue: s.maxHourlyNetFlow,
        isHighRisk: s.maxHourlyNetFlow >= 80,
        riskLevel: s.riskLevel,
      };
    }
    const hourlyItem = s.hourlyData.find((h) => h.hour === selectedHour);
    const hourlyNetFlow = hourlyItem?.netFlow ?? 0;
    const derivedLevel: 'high' | 'medium' | 'low' =
      hourlyNetFlow >= 80 ? 'high' : hourlyNetFlow >= 50 ? 'medium' : 'low';
    return {
      station: s,
      riskValue: hourlyNetFlow,
      isHighRisk: hourlyNetFlow >= 80,
      riskLevel: derivedLevel,
    };
  });

  const highRiskItems = riskInfo
    .filter((r) => r.isHighRisk)
    .sort((a, b) => b.riskValue - a.riskValue);

  const valueColumnLabel =
    selectedHour === 'all' ? '峰值净客流' : `${selectedHour}点净客流`;

  const noteText =
    selectedHour === 'all'
      ? '任一单小时净客流 ≥ 80 判定为高风险站点'
      : `${selectedHour}点净客流 ≥ 80 判定为高风险站点`;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-400" />
        <h3 className="text-base font-semibold text-slate-100">
          {selectedHour === 'all' ? '早高峰' : `${selectedHour}点`}超载风险站点
        </h3>
        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
          {highRiskItems.length} 个
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
            <tr className="text-slate-400 text-left">
              <th className="py-3 px-2 font-medium">排名</th>
              <th className="py-3 px-2 font-medium">站点名称</th>
              <th className="py-3 px-2 font-medium text-right">{valueColumnLabel}</th>
              <th className="py-3 px-2 font-medium text-right">风险等级</th>
            </tr>
          </thead>
          <tbody>
            {highRiskItems.map((item, index) => {
              const riskConfig = riskLevelConfig[item.riskLevel];
              const isSelected = selectedStation === item.station.stationName;

              return (
                <tr
                  key={item.station.stationName}
                  className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-slate-700/30'
                  }`}
                  onClick={() => onStationClick(item.station.stationName)}
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
                      <span className="text-slate-100 font-medium">
                        {item.station.stationName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-orange-400 font-mono font-semibold">
                      {item.riskValue}
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
            {highRiskItems.length === 0 && (
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
        * {noteText}
      </div>
    </div>
  );
}
