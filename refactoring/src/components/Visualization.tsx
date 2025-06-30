import React, { useState, useEffect } from 'react';
import { loadSVGTemplate, customizeSVGTemplate, getActiveCombinations } from '../utils/svgTemplates';

interface VisualizationProps {
  sets: Record<string, string[]>;
  colors: Record<string, string>;
  onRegionClick: (region: string) => void;
  opacity?: number;
  fontSize?: number;
}

const Visualization: React.FC<VisualizationProps> = ({ 
  sets, 
  colors, 
  onRegionClick, 
  opacity = 0.5, 
  fontSize = 18 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAndCustomizeSVG = async () => {
      try {
        setLoading(true);
        setError(null);

        const setNames = Object.keys(sets);
        const n = setNames.length;
        
        if (n < 2 || n > 6) {
          setError('Bitte 2–6 Mengen eingeben.');
          setLoading(false);
          return;
        }

        // Bestimme aktive Kombinationen basierend auf den Set-Daten
        const activeCombinations = getActiveCombinations(sets);
        
        // Lade das passende SVG-Template
        const templateSVG = await loadSVGTemplate(n, activeCombinations);
        
        // Erstelle Set-Labels-Mapping (a -> Set A, b -> Set B, etc.)
        const setLabels: Record<string, string> = {};
        setNames.forEach((name, index) => {
          const key = String.fromCharCode(97 + index); // a, b, c, ...
          setLabels[key] = name;
        });

        // Konvertiere Farben für Template-Keys
        const templateColors: Record<string, string> = {};
        setNames.forEach((name, index) => {
          const key = String.fromCharCode(97 + index);
          templateColors[key] = colors[name] || '#cccccc';
        });

        // Passe das SVG-Template an
        const customizedSVG = customizeSVGTemplate(
          templateSVG,
          setLabels,
          templateColors,
          opacity,
          fontSize
        );

        setSvgContent(customizedSVG);
      } catch (err) {
        console.error('Fehler beim Laden des SVG-Templates:', err);
        setError('Fehler beim Laden des Diagramms.');
      } finally {
        setLoading(false);
      }
    };

    loadAndCustomizeSVG();
  }, [sets, colors, opacity, fontSize]);

  // Handle SVG-Klicks
  const handleSVGClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement;
    
    // Suche nach klickbaren Elementen mit IDs
    if (target.id && target.tagName) {
      onRegionClick(target.id);
    }
  };

  if (loading) {
    return <div>Diagramm wird geladen...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div 
      onClick={handleSVGClick}
      style={{ cursor: 'pointer' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default Visualization;
