import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  minDomain?: number; // Optional fixed min for y-axis
  maxDomain?: number; // Optional fixed max for y-axis
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 70, // Adjusted for potentially better fit
  height = 20, // Adjusted
  color = '#818cf8', // Default to Tailwind's indigo-400
  minDomain,
  maxDomain,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length < 2 || !svgRef.current) {
      if (svgRef.current) { // Clear previous drawing or draw placeholder
        d3.select(svgRef.current).selectAll("*").remove();
        // Optional: draw a placeholder line for very short data
        if (data && data.length === 1) {
            d3.select(svgRef.current)
              .append('line')
              .attr('x1', 0)
              .attr('y1', height / 2)
              .attr('x2', width)
              .attr('y2', height / 2)
              .attr('stroke', color)
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '2,2');
        }
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous contents

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    let yDomainCalculated = d3.extent(data) as [number, number];
    
    // If fixed domains are provided, use them
    const finalYDomain: [number, number] = [
        minDomain !== undefined ? minDomain : yDomainCalculated[0],
        maxDomain !== undefined ? maxDomain : yDomainCalculated[1]
    ];

    // Handle cases where all data points are the same or domain is otherwise invalid
    if (finalYDomain[0] === finalYDomain[1]) {
      finalYDomain[0] = finalYDomain[0] - 1; // Create a small range
      finalYDomain[1] = finalYDomain[1] + 1;
    }
    // Ensure domain is valid
    if (finalYDomain[0] === undefined || finalYDomain[1] === undefined || finalYDomain[0] > finalYDomain[1]) {
        finalYDomain[0] = 0;
        finalYDomain[1] = 1;
    }


    const y = d3.scaleLinear()
      .domain(finalYDomain)
      .range([height, 0]); // Inverted for SVG y-axis (0 at top)

    const line = d3.line<number>()
      .x((_d, i) => x(i))
      .y(d => y(d))
      .defined(d => typeof d === 'number' && !isNaN(d));

    const pathData = line(data);

    if (pathData) {
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.5)
        .attr('d', pathData);
    }

  }, [data, width, height, color, minDomain, maxDomain]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible">
      {/* D3 will render here */}
    </svg>
  );
};