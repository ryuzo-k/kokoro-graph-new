import { Network, Search, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileBottomNav() {
  return (
    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-2">
      <div className="flex items-center justify-around">
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-primary"
        >
          <Network size={20} className="mb-1" />
          <span className="text-xs font-noto-jp">グラフ</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-400"
        >
          <Search size={20} className="mb-1" />
          <span className="text-xs font-noto-jp">検索</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-400"
        >
          <Users size={20} className="mb-1" />
          <span className="text-xs font-noto-jp">地域</span>
        </Button>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center py-2 px-3 text-gray-400"
        >
          <User size={20} className="mb-1" />
          <span className="text-xs font-noto-jp">プロフ</span>
        </Button>
      </div>
    </div>
  );
}
