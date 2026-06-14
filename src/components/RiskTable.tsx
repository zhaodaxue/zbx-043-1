import type { StationViewItem } from '@/data/dashboardView';
import type { SelectedHour } from '@/store/useDashboardStore';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface RiskTableProps {
  highRiskStations: StationViewItem[];
  selectedStation: string | null;
  selectedHour: SelectedHour;
  onStationClick: (stationName: string) => void;
}

export function RiskTable({
  highRiskStations,
  selectedStation,
  selectedHour,
  onStationClick,
}: RiskTableProps) {
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
          {highRiskStations.length} 个
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
            {highRiskStations.map((item, index) => {
              const isSelected = selectedStation === item.stationName;

              return (
                <tr
                  key={item.stationName}
                  className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-slate-700/30'
                  }`}
                  onClick={() => onStationClick(item.stationName)}
                >
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                        index < 3
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-slate-100 font-medium">
                        {item.stationName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-orange-400 font-mono font-semibold">
                      {item.riskLevel === 'high'
                        ? selectedHour === 'all'
                          ? item.maxHourlyNetFlow
                          : item.rankingValue
                        : item.rankingValue}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item.riskLevelConfig.bgColor} ${item.riskLevelConfig.textColor} border ${item.riskLevelConfig.borderColor}`}
                    >
                      {item.riskLevelLabel}
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
        * {noteText}
      </div>
    </div>
  );
}
