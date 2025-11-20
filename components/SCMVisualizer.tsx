
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { SCMVariables, VisNode, SCMCalculatedValues, Particle, CollapseZone } from '../types';
import { COLLAPSE_ZONE_THRESHOLDS } from '../constants';

interface SCMVisualizerProps {
  variables: SCMVariables;
  calculatedValues: SCMCalculatedValues;
}

const NODE_RADIUS = 18;
const PARTICLE_BASE_SIZE = 4;
const MAX_PARTICLES = 50;

const staticNodesConfig: VisNode[] = [
    { id: 'SystemInput', label: 'IN', x: 50, y: 150, color: '#6366F1' },
    { id: 'I', label: 'I', x: 150, y: 70, color: '#EC4899' },
    { id: 'S', label: 'S', x: 150, y: 150, color: '#F97316' },
    { id: 'P', label: 'P', x: 150, y: 230, color: '#EF4444' },
    { id: 'T', label: 'T', x: 280, y: 70, color: '#10B981' },
    { id: 'E', label: 'E', x: 280, y: 230, color: '#3B82F6' },
    { id: 'SystemOutput', label: 'OUT', x: 380, y: 150, color: '#A855F7' },
];

const particlePaths: Array<(keyof SCMVariables | 'SystemInput' | 'SystemOutput')[]> = [
  ['SystemInput', 'I', 'T', 'SystemOutput'],
  ['SystemInput', 'S', 'SystemOutput'],
  ['SystemInput', 'P', 'E', 'SystemOutput'],
  ['SystemInput', 'I', 'SystemOutput'],
  ['SystemInput', 'P', 'SystemOutput'],
];

export const SCMVisualizer: React.FC<SCMVisualizerProps> = ({ variables, calculatedValues }) => {
  const { zone } = calculatedValues;
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = useMemo(() => {
    return staticNodesConfig.map(node => ({
      ...node,
      value: node.id in variables ? variables[node.id as keyof SCMVariables] : undefined,
      color: node.id === 'SystemOutput'
             ? COLLAPSE_ZONE_THRESHOLDS[zone].color.replace('bg-','bg-opacity-70 border border-2 border-')
             : node.color
    }));
  }, [variables, zone]);

  const getNodeById = useCallback((id: keyof SCMVariables | 'SystemInput' | 'SystemOutput') => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  const getParticleAppearance = useCallback(() => {
    let color = 'rgba(200, 200, 255, 0.8)';
    let opacity = 0.8;

    switch (zone) {
      case CollapseZone.Low:
        color = 'rgba(150, 255, 150, 0.9)'; opacity = 0.9; break;
      case CollapseZone.Moderate:
        color = 'rgba(255, 220, 100, 0.8)'; opacity = 0.8; break;
      case CollapseZone.High:
        color = 'rgba(255, 150, 80, 0.7)'; opacity = 0.7; break;
      case CollapseZone.Critical:
        color = 'rgba(255, 80, 80, 0.6)'; opacity = 0.6; break;
    }
    return { color, opacity };
  }, [zone]);

  useEffect(() => {
    const desiredParticleCount = Math.max(1, Math.min(MAX_PARTICLES, Math.round(variables.I * 50)));
    
    setParticles(prevParticles => {
      const newParticles = [...prevParticles];
      while (newParticles.length < desiredParticleCount) {
        const startNode = getNodeById('SystemInput');
        if (!startNode) break;

        const pathDefinition = particlePaths[Math.floor(Math.random() * particlePaths.length)];
        const pathNodes = pathDefinition.map(id => getNodeById(id)).filter(n => n !== undefined) as VisNode[];
        
        if (pathNodes.length < 2) continue;

        const { color, opacity } = getParticleAppearance();
        const baseSpeed = Math.max(0.002, Math.min(0.02, variables.T / 50));

        newParticles.push({
          id: `particle-${Date.now()}-${Math.random()}`,
          x: startNode.x + (Math.random() - 0.5) * 10,
          y: startNode.y + (Math.random() - 0.5) * 10,
          targetX: pathNodes[1].x,
          targetY: pathNodes[1].y,
          path: pathNodes,
          currentPathIndex: 1,
          progress: 0,
          speed: baseSpeed + (Math.random() - 0.5) * (baseSpeed * 0.3),
          color,
          opacity,
          size: PARTICLE_BASE_SIZE + (Math.random() - 0.5) * 2,
        });
      }
      return newParticles.slice(0, desiredParticleCount);
    });
  }, [variables.I, variables.T, getNodeById, getParticleAppearance]);

  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x;
          let newY = p.y;
          let newProgress = p.progress + p.speed;
          let newPathIndex = p.currentPathIndex;
          let newTargetX = p.targetX;
          let newTargetY = p.targetY;

          const startNodeOfSegment = p.path[newPathIndex -1];
          const endNodeOfSegment = p.path[newPathIndex];

          if (newProgress >= 1) {
            newX = endNodeOfSegment.x;
            newY = endNodeOfSegment.y;
            newProgress = 0;
            newPathIndex++;

            if (newPathIndex >= p.path.length) {
              const startNode = getNodeById('SystemInput');
              const pathDefinition = particlePaths[Math.floor(Math.random() * particlePaths.length)];
              const newPathNodes = pathDefinition.map(id => getNodeById(id)).filter(n => n !== undefined) as VisNode[];

              if (startNode && newPathNodes.length >=2) {
                newX = startNode.x + (Math.random() - 0.5) * 10;
                newY = startNode.y + (Math.random() - 0.5) * 10;
                newPathIndex = 1;
                newTargetX = newPathNodes[1].x;
                newTargetY = newPathNodes[1].y;
                 const { color, opacity } = getParticleAppearance();
                return { ...p, x: newX, y: newY, progress: newProgress, currentPathIndex: newPathIndex, targetX: newTargetX, targetY: newTargetY, path: newPathNodes, color, opacity };
              } else {
                 return { ...p, x: newX, y: newY, progress: 1 };
              }
            } else {
              newTargetX = p.path[newPathIndex].x;
              newTargetY = p.path[newPathIndex].y;
            }
          } else {
            newX = startNodeOfSegment.x + (endNodeOfSegment.x - startNodeOfSegment.x) * newProgress;
            newY = startNodeOfSegment.y + (endNodeOfSegment.y - startNodeOfSegment.y) * newProgress;
          }
          
           const { color, opacity } = getParticleAppearance();

          return { ...p, x: newX, y: newY, progress: newProgress, currentPathIndex: newPathIndex, targetX: newTargetX, targetY: newTargetY, color, opacity };
        }).filter(p => p.path.length > 0)
      );
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [getNodeById, getParticleAppearance]);

  const lineStyle = { stroke: "rgba(107, 114, 128, 0.2)", strokeWidth: 1.5 };

  return (
    <div className={`mt-4 p-2 bg-gray-700 bg-opacity-30 rounded-lg border border-gray-600`}>
      <h4 className="text-md font-semibold text-purple-200 mb-2 text-center">SCM Visualizer</h4>
      <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-auto rounded">
        {particlePaths.map((pathSeg, idx) =>
          pathSeg.slice(0, -1).map((nodeId, i) => {
            const startN = getNodeById(nodeId);
            const endN = getNodeById(pathSeg[i+1]);
            if (!startN || !endN) return null;
            return <line key={`path-${idx}-seg-${i}`} x1={startN.x} y1={startN.y} x2={endN.x} y2={endN.y} {...lineStyle} />;
          })
        )}

        {particles.map(p => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.color}
            opacity={p.opacity}
          />
        ))}

        {nodes.map(node => {
          const nodeValue = node.id in variables ? variables[node.id as keyof SCMVariables] : undefined;
          let nodeDisplayColor = node.color || '#9CA3AF';
          if (node.id === 'SystemOutput') {
             const zoneColor = COLLAPSE_ZONE_THRESHOLDS[zone].color;
             if(zoneColor.startsWith('bg-')) {
                const colorName = zoneColor.split('-')[1];
                if(colorName === "green") nodeDisplayColor = '#22C55E';
                else if(colorName === "yellow") nodeDisplayColor = '#EAB308';
                else if(colorName === "orange") nodeDisplayColor = '#F97316';
                else if(colorName === "red") nodeDisplayColor = '#EF4444';
             }
          }

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS + (node.id === 'SystemOutput' ? Math.min(calculatedValues.collapse_pressure * 10, 8) : (nodeValue ? nodeValue * 10 : 0) )}
                fill={nodeDisplayColor}
                stroke={"#A5B4FC"}
                strokeWidth="1.5"
                opacity={0.8}
              />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" className="pointer-events-none select-none">
                {node.label}
              </text>
              {nodeValue !== undefined && (
                  <text x={node.x} y={node.y + NODE_RADIUS + 10} textAnchor="middle" fill="#E0E7FF" fontSize="9" className="pointer-events-none select-none">
                  {nodeValue.toFixed(1)}
                  </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Animated particles represent information flow. Their appearance and count reflect SCM conditions.
        Output node color hints at collapse pressure (CP: {calculatedValues.collapse_pressure.toFixed(2)}, Zone: {COLLAPSE_ZONE_THRESHOLDS[zone].label}).
      </p>
    </div>
  );
};
