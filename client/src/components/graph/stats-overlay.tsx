import { useQuery } from "@tanstack/react-query";
import type { NetworkStats } from "@shared/schema";

export default function StatsOverlay() {
  const { data: stats } = useQuery<NetworkStats>({
    queryKey: ["/api/stats"],
  });

  if (!stats) {
    return null;
  }

  return (
    <div className="hidden lg:block absolute top-4 left-4 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 w-64">
        <h4 className="font-semibold text-gray-900 mb-3 font-noto-jp">ネットワーク統計</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-noto-jp">総人数</span>
            <span className="font-semibold text-gray-900">{stats.totalPeople}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-noto-jp">つながり数</span>
            <span className="font-semibold text-gray-900">{stats.totalConnections}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-noto-jp">平均信頼度</span>
            <span className="font-semibold text-success">{stats.averageTrust}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-noto-jp">アクティブ地域</span>
            <span className="font-semibold text-primary">{stats.activeCommunities}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2 font-noto-jp">信頼度分布</p>
          <div className="flex space-x-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-warning via-accent to-success rounded-full"
                style={{ width: `${stats.trustDistribution}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>低</span>
            <span>高</span>
          </div>
        </div>
      </div>
    </div>
  );
}
