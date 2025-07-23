import { Plus, Minus, Home, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GraphControls() {
  const handleZoomIn = () => {
    // TODO: Implement zoom functionality
    console.log("Zoom in");
  };

  const handleZoomOut = () => {
    // TODO: Implement zoom functionality
    console.log("Zoom out");
  };

  const handleResetView = () => {
    // TODO: Implement reset view functionality
    console.log("Reset view");
  };

  const handleToggleLayout = () => {
    // TODO: Implement layout toggle functionality
    console.log("Toggle layout");
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 z-40">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm hover:bg-white"
        title="ズームイン"
      >
        <Plus className="text-gray-600 group-hover:text-primary" size={16} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm hover:bg-white"
        title="ズームアウト"
      >
        <Minus className="text-gray-600 group-hover:text-primary" size={16} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleResetView}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm hover:bg-white"
        title="リセット"
      >
        <Home className="text-gray-600 group-hover:text-primary" size={16} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleLayout}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm hover:bg-white"
        title="レイアウト変更"
      >
        <Shuffle className="text-gray-600 group-hover:text-primary" size={16} />
      </Button>
    </div>
  );
}
