import { useQuery } from "@tanstack/react-query";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Person, Connection } from "@shared/schema";

interface PersonProfilePanelProps {
  personId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonProfilePanel({ personId, isOpen, onClose }: PersonProfilePanelProps) {
  const { data: person } = useQuery<Person>({
    queryKey: ["/api/people", personId],
    enabled: !!personId,
  });

  const { data: connections = [] } = useQuery<Connection[]>({
    queryKey: ["/api/people", personId, "connections"],
    enabled: !!personId,
  });

  const { data: allPeople = [] } = useQuery<Person[]>({
    queryKey: ["/api/people"],
  });

  if (!personId || !person) {
    return null;
  }

  // Get recent connections with person details
  const recentConnections = connections
    .map((conn: Connection) => {
      const otherPersonId = conn.fromPersonId === personId ? conn.toPersonId : conn.fromPersonId;
      const otherPerson = allPeople.find((p: Person) => p.id === otherPersonId);
      return { connection: conn, person: otherPerson };
    })
    .filter((item): item is { connection: Connection; person: Person } => item.person !== undefined)
    .sort((a, b) => new Date(b.connection.lastMeeting || 0).getTime() - new Date(a.connection.lastMeeting || 0).getTime())
    .slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rating ? "text-amber-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1日前";
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}週間前`;
    return `${Math.ceil(diffDays / 30)}ヶ月前`;
  };

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl border-l border-gray-100 transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-noto-jp">プロフィール</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <X className="text-gray-600" size={16} />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{person.initials}</span>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-1">{person.name}</h4>
          <p className="text-gray-500 text-sm">{person.location}</p>
          
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{person.connectionCount}</div>
              <div className="text-xs text-gray-500 font-noto-jp">つながり</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {person.averageRating ? person.averageRating.toFixed(1) : "0.0"}
              </div>
              <div className="text-xs text-gray-500 font-noto-jp">平均評価</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {connections.reduce((sum: number, conn: Connection) => sum + (conn.meetingCount || 0), 0)}
              </div>
              <div className="text-xs text-gray-500 font-noto-jp">会った回数</div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-3 font-noto-jp">最近の交流</h5>
          <div className="space-y-3">
            {recentConnections.length > 0 ? (
              recentConnections.map(({ connection, person: otherPerson }) => (
                <div key={connection.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{otherPerson.initials}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{otherPerson.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(connection.lastMeeting || new Date())} • {connection.location}
                    </p>
                  </div>
                  <div className="flex">
                    {renderStars(connection.trustRating)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm font-noto-jp">まだ交流がありません</p>
            )}
          </div>
        </div>
        
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 font-noto-jp">共通のつながり</h5>
          <div className="grid grid-cols-3 gap-2">
            {recentConnections.slice(0, 3).map(({ person: otherPerson }) => (
              <div key={otherPerson.id} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-accent rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{otherPerson.initials}</span>
                </div>
                <p className="text-xs text-gray-600">{otherPerson.name.split(' ')[0]}</p>
              </div>
            ))}
            {recentConnections.length === 0 && (
              <div className="col-span-3 text-center text-gray-500 text-sm font-noto-jp">
                共通のつながりがありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
