import React from 'react';
import ColorPicker from './ColorPicker';
import FileUpload from './FileUpload';
import SetInput from './SetInput';

interface ControlsProps {
  onAddSet: () => void;
  onRemoveSet: () => void;
  onReset: () => void;
  colors: Record<string, string>;
  onColorChange: (set: string, color: string) => void;
  onFileLoaded: (content: string) => void;
  sets: Record<string, string[]>;
  onSetChange: (setName: string, values: string[]) => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  onExportIVenn: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  fontSize: number;
  onFontSizeChange: (fontSize: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onAddSet,
  onRemoveSet,
  onReset,
  colors,
  onColorChange,
  onFileLoaded,
  sets,
  onSetChange,
  onExportSVG,
  onExportPNG,
  onExportIVenn,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  opacity,
  onOpacityChange,
  fontSize,
  onFontSizeChange
}) => (
  <section style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', margin: '16px 0' }}>
    <div style={{ marginBottom: '16px' }}>
      <h3>Diagramm-Steuerung</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={onAddSet}>Set hinzufügen</button>
        <button onClick={onRemoveSet}>Set entfernen</button>
        <button onClick={onReset}>Zurücksetzen</button>
        <button onClick={onUndo} disabled={!canUndo}>Undo</button>
        <button onClick={onRedo} disabled={!canRedo}>Redo</button>
      </div>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <h3>Export</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={onExportSVG}>Export SVG</button>
        <button onClick={onExportPNG}>Export PNG</button>
        <button onClick={onExportIVenn}>Export .ivenn</button>
      </div>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <h3>Darstellung</h3>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Opazität:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            style={{ width: '100px' }}
          />
          <span>{opacity.toFixed(1)}</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Schriftgröße:
          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            style={{ width: '100px' }}
          />
          <span>{fontSize}px</span>
        </label>
      </div>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <h3>Sets</h3>
      <div style={{ display: 'grid', gap: '8px' }}>
        {Object.entries(sets).map(([set, values]) => (
          <SetInput key={set} setName={set} values={values} onChange={onSetChange} />
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <h3>Farben</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([set, color]) => (
          <ColorPicker key={set} color={color} label={set} onChange={c => onColorChange(set, c)} />
        ))}
      </div>
    </div>

    <div>
      <h3>Datei</h3>
      <FileUpload onFileLoaded={onFileLoaded} />
    </div>
  </section>
);

export default Controls;
