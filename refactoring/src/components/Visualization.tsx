import React from 'react';

interface VisualizationProps {
  sets: Record<string, string[]>;
  colors: Record<string, string>;
  onRegionClick: (region: string) => void;
}

const Visualization: React.FC<VisualizationProps> = ({ sets, colors, onRegionClick }) => {
  // Beispiel: 2er Venn-Diagramm (SVG)
  return (
    <svg width="400" height="300" viewBox="0 0 400 300">
      {/* Kreis A */}
      <ellipse cx="150" cy="150" rx="100" ry="70" fill={colors['A'] || '#ffcccc'} fillOpacity={0.5} onClick={() => onRegionClick('A')} />
      {/* Kreis B */}
      <ellipse cx="250" cy="150" rx="100" ry="70" fill={colors['B'] || '#ccccff'} fillOpacity={0.5} onClick={() => onRegionClick('B')} />
      {/* Schnittmenge */}
      <ellipse cx="200" cy="150" rx="100" ry="70" fill="#cccccc" fillOpacity={0.5} onClick={() => onRegionClick('AB')} />
      {/* Labels */}
      <text x="110" y="140" fontSize="20">A</text>
      <text x="270" y="140" fontSize="20">B</text>
    </svg>
  );
};

export default Visualization;
