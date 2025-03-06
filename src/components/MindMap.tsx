import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '../store';

export function MindMap() {
  const chapters = useStore(state => state.chapters);
  
  const graphData = React.useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Add root node
    nodes.push({ id: 'root', name: 'Notebook', val: 20 });
    
    // Add chapter nodes and links
    chapters.forEach(chapter => {
      nodes.push({ id: chapter.id, name: chapter.title, val: 15 });
      links.push({ source: 'root', target: chapter.id });
      
      // Add subchapter nodes and links
      chapter.subchapters.forEach(subchapter => {
        nodes.push({ id: subchapter.id, name: subchapter.title, val: 10 });
        links.push({ source: chapter.id, target: subchapter.id });
      });
    });
    
    return { nodes, links };
  }, [chapters]);

  return (
    <div className="h-[400px] w-full border border-gray-200 rounded-lg">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 16/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#1a1a1a';
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
}