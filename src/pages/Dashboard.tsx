import { useEffect, useCallback, useMemo } from 'react';
import { useDashboardStore, type SelectedHour } from '@/store/useDashboardStore';
import { getStationByName } from '@/data/dataAggregator';
import { DashboardHeader } from '@/components/DashboardHeader';
import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';
import { RiskTable } from '@/components/RiskTable';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const CSV_URL = '/data/bus_flow.csv';

export default function Dashboard() {
  const {
    stations,
    selectedStation,
    selectedHour,
    loading,
    error,
    loadData,
    setSelectedStation,
    setSelectedHour,
  } = useDashboardStore();

  useEffect(() => {
    loadData(CSV_URL);
  }, [loadData]);

  const handleStationClick = useCallback(
    (stationName: string) => {
      setSelectedStation(stationName);
    },
    [setSelectedStation],
  );

  const handleHourChange = useCallback(
    (hour: SelectedHour) => {
      setSelectedHour(hour);
    },
    [setSelectedHour],
  );

  const selectedStationData = useMemo(
    () => (selectedStation ? getStationByName(stations, selectedStation) || null : null),
    [stations, selectedStation],
  );

  const highRiskCount = useMemo(() => {
    if (selectedHour === 'all') {
      return stations.filter((s) => s.maxHourlyNetFlow >= 80).length;
    }
    return stations.filter((s) => {
      const hourly = s.hourlyData.find((h) => h.hour === selectedHour);
      return (hourly?.netFlow ?? 0) >= 80;
    }).length;
  }, [stations, selectedHour]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2 text-lg font-semibold">数据加载失败</p>
          <p className="text-slate-500 text-sm bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <DashboardHeader
          totalStations={stations.length}
          highRiskCount={highRiskCount}
          selectedHour={selectedHour}
          onHourChange={handleHourChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-7 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-slate-100">
                各站点
                {selectedHour === 'all' ? '累计' : `${selectedHour}点`}净客流排名
              </h2>
              <span className="text-xs text-slate-500 ml-2">
                点击站点查看时段走势
              </span>
            </div>
            <div className="h-[500px]">
              <BarChart
                stations={stations}
                selectedStation={selectedStation}
                selectedHour={selectedHour}
                onStationClick={handleStationClick}
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-slate-100">时段走势</h2>
                </div>
                {selectedStationData && (
                  <div className="text-sm">
                    <span className="text-slate-400">当前站点: </span>
                    <span className="text-cyan-400 font-medium">
                      {selectedStationData.stationName}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-[240px]">
                <LineChart
                  station={selectedStationData}
                  highlightHour={selectedHour}
                  onHourClick={handleHourChange}
                />
              </div>
              {selectedStationData && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">
                      {selectedStationData.totalBoarding}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">上车人数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 font-mono">
                      {selectedStationData.totalAlighting}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">下车人数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 font-mono">
                      {selectedHour === 'all'
                        ? selectedStationData.totalNetFlow
                        : (selectedStationData.hourlyData.find((h) => h.hour === selectedHour)
                            ?.netFlow ?? 0)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {selectedHour === 'all' ? '累计净客流' : `${selectedHour}点净客流`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 shadow-xl flex-1">
              <RiskTable
                stations={stations}
                selectedStation={selectedStation}
                selectedHour={selectedHour}
                onStationClick={handleStationClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
