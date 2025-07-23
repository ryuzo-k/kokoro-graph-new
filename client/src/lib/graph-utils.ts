import type { Person, Connection, GraphNode, GraphEdge } from "@shared/schema";

export function createGraphData(
  people: Person[], 
  connections: Connection[], 
  searchQuery: string = ""
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  // Filter people based on search query
  const filteredPeople = searchQuery 
    ? people.filter(person => 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people;

  // Create nodes
  const nodes: GraphNode[] = filteredPeople.map((person, index) => ({
    key: person.id.toString(),
    label: person.name,
    x: Math.cos((index * 2 * Math.PI) / filteredPeople.length),
    y: Math.sin((index * 2 * Math.PI) / filteredPeople.length),
    size: Math.max(10, Math.min(25, 10 + (person.connectionCount || 0) * 2)),
    color: getTrustColor(person.averageRating || 0),
    person,
  }));

  // Create edges - only include edges where both nodes exist
  const nodeIds = new Set(nodes.map(node => node.key));
  const edges: GraphEdge[] = connections
    .filter(connection => 
      nodeIds.has(connection.fromPersonId.toString()) && 
      nodeIds.has(connection.toPersonId.toString())
    )
    .map(connection => ({
      key: `edge-${connection.id}`,
      source: connection.fromPersonId.toString(),
      target: connection.toPersonId.toString(),
      size: Math.max(1, Math.min(8, connection.trustRating)),
      color: getTrustColor(connection.trustRating),
      connection,
    }));

  return { nodes, edges };
}

export function getTrustColor(rating: number): string {
  if (rating >= 4.5) return "#10B981"; // success
  if (rating >= 3.5) return "#F59E0B"; // accent
  if (rating >= 2.5) return "#EC4899"; // secondary
  if (rating >= 1.5) return "#6366F1"; // primary
  return "#6B7280"; // gray
}

export function calculateNodeSize(connectionCount: number): number {
  return Math.max(10, Math.min(30, 12 + connectionCount * 2));
}

export function calculateEdgeSize(trustRating: number, meetingCount: number): number {
  const baseTrust = Math.max(1, trustRating);
  const meetingBonus = Math.min(3, Math.log(meetingCount + 1));
  return Math.max(1, Math.min(8, baseTrust + meetingBonus));
}

export function generateLayout(nodes: GraphNode[]): GraphNode[] {
  // Simple circular layout
  return nodes.map((node, index) => ({
    ...node,
    x: Math.cos((index * 2 * Math.PI) / nodes.length) * 2,
    y: Math.sin((index * 2 * Math.PI) / nodes.length) * 2,
  }));
}

export function filterGraphByLocation(
  graphData: { nodes: GraphNode[]; edges: GraphEdge[] },
  location: string
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (location === "all") return graphData;
  
  const filteredNodes = graphData.nodes.filter(node => 
    node.person.location === location
  );
  
  const nodeIds = new Set(filteredNodes.map(node => node.key));
  const filteredEdges = graphData.edges.filter(edge => 
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );
  
  return { nodes: filteredNodes, edges: filteredEdges };
}
