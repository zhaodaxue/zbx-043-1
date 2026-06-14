import { Bus, Clock, Database } from 'lucide-react';

interface DashboardHeaderProps {
  totalStations: number;
  highRiskCount: number;
}

export function DashboardHeader({ totalStations, highRiskCount }: DashboardHeaderProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-slate-300">
            统计时段: <span className="text-cyan-400 font-medium">06:00 - 09:00</span>
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
  );
}
