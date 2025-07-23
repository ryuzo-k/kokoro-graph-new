import { Heart, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { NetworkStats } from "@shared/schema";

interface TopNavigationProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TopNavigation({ 
  selectedLocation, 
  onLocationChange, 
  searchQuery, 
  onSearchChange 
}: TopNavigationProps) {
  const { data: locations = [] } = useQuery<string[]>({
    queryKey: ["/api/locations"],
  });

  const { data: stats } = useQuery<NetworkStats>({
    queryKey: ["/api/stats"],
  });

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <Heart className="text-white" size={16} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 font-noto-jp">Kokoro Graph</h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-noto-jp">コミュニティ:</span>
          <select 
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">すべて</option>
            {locations.map((location: string) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="人を検索..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {stats?.totalConnections || 0}
            </div>
            <div className="text-gray-500 font-noto-jp">つながり</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-success">
              {stats?.averageTrust || 0}
            </div>
            <div className="text-gray-500 font-noto-jp">信頼度</div>
          </div>
        </div>
        
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">自</span>
        </div>
      </div>
    </nav>
  );
}
