import React, { useState } from 'react';
import { downloadFile, exportSvgAsPng, exportIntersectionsAsText } from '../utils/fileHandlers';
import type { Intersection } from '../types';

interface VisualizationPanelProps {
  onModeChange?: (mode: 'list' | 'tree') => void;
  onOpacityChange?: (opacity: number) => void;
  onFontSizeChange?: (fontSize: number) => void;
  onReset?: () => void;
  onPercentageToggle?: (showPercentages: boolean) => void;
  intersections?: Record<string, Intersection>;
  setNamesMapping?: Record<string, string>;
  showPercentages?: boolean;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  onModeChange,
  onOpacityChange,
  onFontSizeChange,
  onReset,
  onPercentageToggle,
  intersections = {},
  setNamesMapping = {},
  showPercentages: propShowPercentages = false
}) => {
  const [mode, setMode] = useState<'list' | 'tree'>('list');
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(14);
  const [exportFileName, setExportFileName] = useState('');
  const [showPercentages, setShowPercentages] = useState(propShowPercentages);

  const handleModeChange = (newMode: 'list' | 'tree') => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    onOpacityChange?.(value);
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    onFontSizeChange?.(value);
  };

  const handleReset = () => {
    onReset?.();
  };

  const handlePercentageToggle = (checked: boolean) => {
    setShowPercentages(checked);
    onPercentageToggle?.(checked);
  };

  const handleExport = (format: string) => {
    if (!exportFileName.trim()) {
      alert('Please enter a filename');
      return;
    }

    const diagramElement = document.querySelector('#diagramframe svg');
    
    switch (format) {
      case 'svg':
        if (diagramElement) {
          const svgData = new XMLSerializer().serializeToString(diagramElement);
          downloadFile(svgData, `${exportFileName}.svg`, 'image/svg+xml');
        }
        break;
      case 'png':
        if (diagramElement) {
          exportSvgAsPng(diagramElement as SVGElement, `${exportFileName}.png`);
        }
        break;
      case 'txt':
        // Convert intersections to the expected format
        const simplifiedIntersections: Record<string, string[]> = {};
        Object.entries(intersections).forEach(([key, intersection]) => {
          simplifiedIntersections[key] = intersection.elements;
        });
        const textContent = exportIntersectionsAsText(simplifiedIntersections, setNamesMapping);
        downloadFile(textContent, `${exportFileName}.txt`, 'text/plain');
        break;
    }
  };

  return (
    <div id="svg-options">
      <span>Export current diagram:</span>
      <label>
        <input 
          type="text" 
          className="filename" 
          id="svg-name" 
          size={23} 
          placeholder="Write file name here"
          value={exportFileName}
          onChange={(e) => setExportFileName(e.target.value)}
        />
        <select 
          id="figureformat" 
          name="format" 
          onChange={(e) => handleExport(e.target.value)}
        >
          <option value="">Choose format</option>
          <option value="svg">.svg</option>
          <option value="png">.png</option>
          <option value="txt">.txt</option>
        </select>
      </label>
      <button 
        className="success" 
        type="button" 
        onClick={() => {
          const select = document.querySelector('#figureformat') as HTMLSelectElement;
          if (select?.value) {
            handleExport(select.value);
          }
        }}
      >
        Export
      </button>
      <br />
      <p>
        Try opening the <b>.svg</b> diagram using{' '}
        <a href="https://inkscape.org/release/" target="_blank" rel="noopener noreferrer">
          Inkscape
        </a>{' '}
        to move shapes, resize, change font, colors and more.
      </p>

      <div id="displayOptions">
        <button onClick={() => handleFontSizeChange(fontSize - 1)}>-</button>
        Font-size
        <button onClick={() => handleFontSizeChange(fontSize + 1)}>+</button>
        <span className="separator">|</span>
        <button onClick={() => handleOpacityChange(Math.max(0, opacity - 0.1))}>-</button>
        Color-opacity
        <button onClick={() => handleOpacityChange(Math.min(1, opacity + 0.1))}>+</button>
        <span className="separator">|</span>
        <button type="button" className="danger" onClick={handleReset}>
          Reset diagram
        </button>
      </div>

      <div id="newFeatures">
        <span className="checkbox">
          <input
            className="checkbox"
            type="checkbox"
            checked={showPercentages}
            onChange={(e) => handlePercentageToggle(e.target.checked)}
          />
          <span className="text-sm">
            Show <b>percentages</b> instead of size{' '}
            <span className="text-highlight">new feature!</span>
          </span>
        </span>
        <span style={{ marginLeft: '21px', marginTop: '4px' }}>
          Mouse-over numbers highlights their sets{' '}
          <span className="text-highlight">new feature!</span>
        </span>
      </div>

      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="list"
            checked={mode === 'list'}
            onChange={() => handleModeChange('list')}
          />
          Unions by list
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="tree"
            checked={mode === 'tree'}
            onChange={() => handleModeChange('tree')}
          />
          Unions by tree
        </label>
      </div>
    </div>
  );
};

export default VisualizationPanel;
