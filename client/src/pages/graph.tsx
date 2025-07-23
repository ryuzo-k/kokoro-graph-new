import { useState } from "react";
import TopNavigation from "@/components/ui/top-navigation";
import GraphCanvas from "@/components/graph/graph-canvas";
import GraphControls from "@/components/graph/graph-controls";
import QuickEntryForm from "@/components/graph/quick-entry-form";
import PersonProfilePanel from "@/components/graph/person-profile-panel";
import StatsOverlay from "@/components/graph/stats-overlay";
import MobileBottomNav from "@/components/graph/mobile-bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";

export default function GraphPage() {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleNodeClick = (personId: number) => {
    setSelectedPersonId(personId);
    setIsProfilePanelOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfilePanelOpen(false);
    setSelectedPersonId(null);
  };

  return (
    <div className="h-screen flex flex-col relative bg-soft-white overflow-hidden">
      <TopNavigation 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 relative">
        <GraphCanvas 
          selectedLocation={selectedLocation}
          searchQuery={searchQuery}
          onNodeClick={handleNodeClick}
        />
        
        <GraphControls />
        
        <QuickEntryForm />
        
        {!isMobile && <StatsOverlay />}
        
        <PersonProfilePanel
          personId={selectedPersonId}
          isOpen={isProfilePanelOpen}
          onClose={handleCloseProfile}
        />
      </div>
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
