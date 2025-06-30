// Siehe copilot-instructions.md für Migrationsregeln und Projektziele

import React, { useState, useRef } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';
import Visualization from './components/Visualization';
import Footer from './components/Footer';

// Optional: Einfaches Modal für Regionen
const RegionModal: React.FC<{ open: boolean; region: string | null; elements: string[]; onClose: () => void }> = ({ open, region, elements, onClose }) => {
  if (!open || !region) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300, maxHeight: '70vh', overflow: 'auto' }}>
        <h3>Region: {region}</h3>
        <p>Anzahl Elemente: {elements.length}</p>
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {elements.map((el, i) => <li key={i}>{el}</li>)}
        </ul>
        <button onClick={onClose} style={{ marginTop: '16px' }}>Schließen</button>
      </div>
    </div>
  );
};

function App() {
  // Beispiel-State für Sets und Farben
  const [sets, setSets] = useState<Record<string, string[]>>({ A: ['1', '2', '3'], B: ['2', '3', '4'], C: ['3', '4', '5'] });
  const [colors, setColors] = useState<Record<string, string>>({ A: '#ffcccc', B: '#ccccff', C: '#ccffcc' });
  const [opacity, setOpacity] = useState<number>(0.5);
  const [fontSize, setFontSize] = useState<number>(18);
  
  // Undo/Redo-Stack
  const [history, setHistory] = useState<{ sets: Record<string, string[]>; colors: Record<string, string>; opacity: number; fontSize: number }[]>([]);
  const [future, setFuture] = useState<{ sets: Record<string, string[]>; colors: Record<string, string>; opacity: number; fontSize: number }[]>([]);
  
  // Modal-State
  const [modalRegion, setModalRegion] = useState<string | null>(null);
  const [modalElements, setModalElements] = useState<string[]>([]);
  
  // Ref für SVG-Export
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Helper für History
  const pushHistory = () => setHistory(h => [...h, { sets: { ...sets }, colors: { ...colors }, opacity, fontSize }]);

  const handleAddSet = () => {
    pushHistory();
    const next = String.fromCharCode(65 + Object.keys(sets).length); // A, B, C, ...
    setSets(prev => ({ ...prev, [next]: [] }));
    setColors(prev => ({ ...prev, [next]: '#ccffcc' }));
    setFuture([]);
  };

  const handleRemoveSet = () => {
    if (Object.keys(sets).length <= 2) return;
    pushHistory();
    const keys = Object.keys(sets);
    const last = keys[keys.length - 1];
    setSets(prev => {
      const { [last]: _, ...rest } = prev;
      return rest;
    });
    setColors(prev => {
      const { [last]: _, ...rest } = prev;
      return rest;
    });
    setFuture([]);
  };

  const handleReset = () => {
    pushHistory();
    setSets({ A: ['1', '2', '3'], B: ['2', '3', '4'], C: ['3', '4', '5'] });
    setColors({ A: '#ffcccc', B: '#ccccff', C: '#ccffcc' });
    setOpacity(0.5);
    setFontSize(18);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setFuture(f => [{ sets: { ...sets }, colors: { ...colors }, opacity, fontSize }, ...f]);
    const prev = history[history.length - 1];
    setSets(prev.sets);
    setColors(prev.colors);
    setOpacity(prev.opacity);
    setFontSize(prev.fontSize);
    setHistory(h => h.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    setHistory(h => [...h, { sets: { ...sets }, colors: { ...colors }, opacity, fontSize }]);
    const next = future[0];
    setSets(next.sets);
    setColors(next.colors);
    setOpacity(next.opacity);
    setFontSize(next.fontSize);
    setFuture(f => f.slice(1));
  };

  const handleRegionClick = (region: string) => {
    // Berechne Schnittmengen-Elemente
    const setNames = Object.keys(sets);
    const regionKeys = region.split('').map(char => {
      const index = char.charCodeAt(0) - 97; // a=0, b=1, etc.
      return setNames[index];
    }).filter(Boolean);

    let elements: string[] = [];
    if (regionKeys.length > 0) {
      elements = sets[regionKeys[0]] ? [...sets[regionKeys[0]]] : [];
      for (let i = 1; i < regionKeys.length; i++) {
        elements = elements.filter(e => sets[regionKeys[i]]?.includes(e));
      }
    }
    
    setModalRegion(region);
    setModalElements(elements);
  };

  const handleColorChange = (set: string, color: string) => {
    pushHistory();
    setColors(prev => ({ ...prev, [set]: color }));
    setFuture([]);
  };

  const handleOpacityChange = (newOpacity: number) => {
    pushHistory();
    setOpacity(newOpacity);
    setFuture([]);
  };

  const handleFontSizeChange = (newFontSize: number) => {
    pushHistory();
    setFontSize(newFontSize);
    setFuture([]);
  };

  const handleFileLoaded = (content: string) => {
    pushHistory();
    const newSets: Record<string, string[]> = {};
    const newColors: Record<string, string> = {};
    content.split(';').forEach(entry => {
      const [label, values] = entry.split(':');
      if (label && values) {
        const setName = label.trim().charAt(0).toUpperCase();
        newSets[setName] = values.split(',').map(e => e.trim()).filter(Boolean);
        newColors[setName] = '#cccccc';
      }
    });
    setSets(newSets);
    setColors(newColors);
    setFuture([]);
  };

  const handleSetChange = (setName: string, values: string[]) => {
    pushHistory();
    setSets(prev => ({ ...prev, [setName]: values }));
    setFuture([]);
  };

  // Export-Handler
  const handleExportSVG = () => {
    const svgElement = visualizationRef.current?.querySelector('svg');
    if (!svgElement) {
      alert('Kein SVG zum Exportieren gefunden');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'venn-diagram.svg';
    downloadLink.click();
    URL.revokeObjectURL(svgUrl);
  };

  const handleExportPNG = () => {
    const svgElement = visualizationRef.current?.querySelector('svg');
    if (!svgElement) {
      alert('Kein SVG zum Exportieren gefunden');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'venn-diagram.png';
          downloadLink.click();
          URL.revokeObjectURL(pngUrl);
        }
      });
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const handleExportIVenn = () => {
    const content = Object.entries(sets)
      .map(([set, values]) => `${set}:${values.join(',')}`)
      .join(';');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.ivenn';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Header />
      <div style={{ display: 'flex', gap: '20px' }}>
        <InputPanel
          onSetChange={(index, elements) => handleSetChange(`Set ${String.fromCharCode(65 + index)}`, elements)}
          onColorChange={(index, color) => handleColorChange(`Set ${String.fromCharCode(65 + index)}`, color)}
          onLoadFile={handleFileLoaded}
        />
        <div style={{ flex: 1 }}>
          <VisualizationPanel
            onModeChange={(mode) => console.log('Mode changed:', mode)}
            onOpacityChange={handleOpacityChange}
            onFontSizeChange={handleFontSizeChange}
            onExport={(format) => {
              if (format === 'svg') handleExportSVG();
              else if (format === 'png') handleExportPNG();
            }}
          />
          <Visualization
            sets={sets}
            colors={colors}
            onRegionClick={handleRegionClick}
            opacity={opacity}
            fontSize={fontSize}
          />
        </div>
      </div>
      <RegionModal 
        open={!!modalRegion} 
        region={modalRegion} 
        elements={modalElements} 
        onClose={() => setModalRegion(null)} 
      />
      <Footer />
    </div>
  );
}

export default App;
