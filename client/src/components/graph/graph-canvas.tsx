import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createGraphData, getTrustColor } from "@/lib/graph-utils";
import { Network } from "lucide-react";
import type { Person, Connection, GraphNode } from "@shared/schema";

interface GraphCanvasProps {
  selectedLocation: string;
  searchQuery: string;
  onNodeClick: (personId: number) => void;
}

function getTrustColorClasses(rating: number): string {
  if (rating >= 4) return 'from-success to-accent';
  if (rating >= 3) return 'from-accent to-secondary';
  if (rating >= 2) return 'from-secondary to-primary';
  return 'from-gray-400 to-gray-600';
}

export default function GraphCanvas({ selectedLocation, searchQuery, onNodeClick }: GraphCanvasProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ["/api/people", selectedLocation === "all" ? "" : `?location=${selectedLocation}`],
  });

  const { data: connections = [] } = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
  });

  useEffect(() => {
    if (people.length > 0) {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [people]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse-slow">
              <Network size={32} />
            </div>
            <p className="font-noto-jp">グラフを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  const graphData = createGraphData(people, connections, searchQuery);
  const visibleNodes = graphData.nodes.slice(0, 6);

  const positions = [
    { top: '20%', left: '35%' },
    { top: '30%', right: '20%' },
    { bottom: '25%', left: '25%' },
    { bottom: '30%', right: '30%' },
    { top: '50%', left: '15%' },
    { top: '50%', right: '15%' }
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center relative animate-float">
            <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-full"></div>
            
            {visibleNodes.map((node, index) => {
              const pos = positions[index] || positions[0];
              const sizeClass = node.key === '1' ? 'w-10 h-10' : 'w-6 h-6';
              
              return (
                <div
                  key={node.key}
                  className={`${sizeClass} bg-gradient-to-br ${getTrustColorClasses(node.person?.averageRating || 0)} rounded-full absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-pulse`}
                  style={{
                    ...pos,
                    animationDelay: `${index * 0.5}s`
                  }}
                  onClick={() => onNodeClick(node.person.id)}
                >
                  <span className="text-white font-bold text-xs">{node.person?.initials}</span>
                </div>
              );
            })}
            
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center z-10">
              <span className="text-white font-bold">自</span>
            </div>
          </div>
          <p className="text-gray-600 font-noto-jp">インタラクティブなネットワークグラフ</p>
          <p className="text-sm text-gray-400 font-noto-jp">ノードをクリックしてプロフィールを表示</p>
        </div>
      </div>
    </div>
  );
}
