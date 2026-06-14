import { Bus, Database, Clock as ClockIcon } from 'lucide-react';
import type { SelectedHour } from '@/store/useDashboardStore';
import { PEAK_HOURS } from '@/types';

interface DashboardHeaderProps {
  totalStations: number;
  highRiskCount: number;
  selectedHour: SelectedHour;
  onHourChange: (hour: SelectedHour) => void;
}

const HOUR_OPTIONS: { value: SelectedHour; label: string }[] = [
  { value: 'all', label: '全部' },
  ...PEAK_HOURS.map((h) => ({ value: h as SelectedHour, label: `${h}点` })),
];

export function DashboardHeader({
  totalStations,
  highRiskCount,
  selectedHour,
  onHourChange,
}: DashboardHeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const periodLabel =
    selectedHour === 'all'
      ? '06:00 - 09:00'
      : `${selectedHour}:00 - ${selectedHour + 1}:00`;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              早高峰客流不均衡分析看板
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              公交运营调度中心 · 实时数据监控
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-700/50">
            <ClockIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">
              统计时段: <span className="text-cyan-400 font-medium">{periodLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-700/50">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">
              站点: <span className="text-green-400 font-medium">{totalStations}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-sm text-slate-300">
              高风险: <span className="text-orange-400 font-medium">{highRiskCount}</span>
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {dateStr}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-800/40 rounded-xl border border-slate-700/50 w-fit">
        {HOUR_OPTIONS.map((opt) => {
          const isActive = selectedHour === opt.value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onHourChange(opt.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
