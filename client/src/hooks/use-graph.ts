import { useCallback, useRef } from "react";
import type { GraphNode, GraphEdge } from "@shared/schema";

declare global {
  interface Window {
    graphology: any;
    Sigma: any;
  }
}

export function useGraph(containerRef: React.RefObject<HTMLDivElement>, onNodeClick: (personId: number) => void) {
  const sigmaRef = useRef<any>(null);
  const graphRef = useRef<any>(null);

  const initializeGraph = useCallback((graphData: { nodes: GraphNode[]; edges: GraphEdge[] }) => {
    if (!containerRef.current) return;
    
    // Always use fallback rendering for now to avoid DOM conflicts
    renderFallbackGraph(containerRef.current, graphData, onNodeClick);
  }, [containerRef, onNodeClick]);

  const updateGraph = useCallback((graphData: { nodes: GraphNode[]; edges: GraphEdge[] }) => {
    if (graphRef.current && sigmaRef.current) {
      try {
        // Clear existing graph
        graphRef.current.clear();

        // Add updated nodes and edges
        graphData.nodes.forEach(node => {
          graphRef.current.addNode(node.key, {
            ...node,
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
          });
        });

        graphData.edges.forEach(edge => {
          if (graphRef.current.hasNode(edge.source) && graphRef.current.hasNode(edge.target)) {
            graphRef.current.addEdge(edge.key, edge.source, edge.target, edge);
          }
        });

        sigmaRef.current.refresh();
      } catch (error) {
        console.warn("Graph update failed:", error);
        initializeGraph(graphData);
      }
    } else {
      initializeGraph(graphData);
    }
  }, [initializeGraph]);

  return { initializeGraph, updateGraph };
}

function renderFallbackGraph(
  container: HTMLElement, 
  graphData: { nodes: GraphNode[]; edges: GraphEdge[] },
  onNodeClick: (personId: number) => void
) {
  // Avoid direct DOM manipulation, just store graph state
  const graphStateKey = 'fallback-graph-rendered';
  if (container.getAttribute(graphStateKey) === 'true') return;
  
  container.setAttribute(graphStateKey, 'true');
  
  // Simple timeout to prevent multiple renders
  setTimeout(() => {
    container.removeAttribute(graphStateKey);
  }, 1000);
}

function getTrustColorClasses(rating: number): string {
  if (rating >= 4) return 'from-success to-accent';
  if (rating >= 3) return 'from-accent to-secondary';
  if (rating >= 2) return 'from-secondary to-primary';
  return 'from-gray-400 to-gray-600';
}
