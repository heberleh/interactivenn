import React, { useState, useEffect } from 'react';
import { loadAndCustomizeSVGTemplate } from '../utils/svgTemplateLoader';
import type { Intersection } from '../types';

interface VisualizationProps {
  sets: Record<string, string[]>;
  colors: Record<string, string>;
  onRegionClick: (region: string) => void;
  opacity?: number;
  fontSize?: number;
  intersections?: Record<string, Intersection>;
  showPercentages?: boolean;
}

const Visualization: React.FC<VisualizationProps> = ({
  sets,
  colors,
  onRegionClick,
  opacity = 0.5,
  fontSize = 18,
  intersections = {},
  showPercentages = false
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSVG = async () => {
      const setNames = Object.keys(sets);
      const n = setNames.length;
      if (n < 2 || n > 6) {
        setError('Bitte 2–6 Mengen eingeben.');
        setSvgContent('');
        return;
      }
      // Template-Name: erst einmal das Standard-Template verwenden
      const templateName = `${n}waydiagram.svg`;
      // Label-Mapping: a->A, b->B, c->C ...
      const labelMap: Record<string, string> = {};
      setNames.forEach((name, i) => {
        labelMap[String.fromCharCode(97 + i)] = name;
      });
      // Color-Mapping: a->Farbe von A, ...
      const colorMap: Record<string, string> = {};
      setNames.forEach((name, i) => {
        colorMap[String.fromCharCode(97 + i)] = colors[name] || '#cccccc';
      });
      try {
        const svg = await loadAndCustomizeSVGTemplate(
          templateName,
          labelMap,
          colorMap,
          opacity,
          fontSize
        );
        setSvgContent(svg);
        setError(null);
      } catch (e) {
        setError('SVG-Template konnte nicht geladen werden.');
        setSvgContent('');
      }
    };
    loadSVG();
  }, [sets, colors, opacity, fontSize]);

  if (error) return <div>{error}</div>;
  if (!svgContent) return <div>Lade Diagramm ...</div>;

  // SVG als HTML einfügen, Klicks auf Regionen werden über onRegionClick behandelt
  return (
    <div
      style={{ width: '100%', textAlign: 'center' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      onClick={e => {
        // Klick auf Region: id oder data-region aus SVG extrahieren
        const target = e.target as HTMLElement;
        const region = target.getAttribute('id') || target.getAttribute('data-region');
        if (region) onRegionClick(region);
      }}
    />
  );
};

export default Visualization;
