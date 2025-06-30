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
}

const Controls: React.FC<ControlsProps> = ({ onAddSet, onRemoveSet, onReset, colors, onColorChange, onFileLoaded, sets, onSetChange }) => (
  <section>
    <button onClick={onAddSet}>Set hinzufügen</button>
    <button onClick={onRemoveSet}>Set entfernen</button>
    <button onClick={onReset}>Diagramm zurücksetzen</button>
    <div style={{ marginTop: 12 }}>
      {Object.entries(sets).map(([set, values]) => (
        <SetInput key={set} setName={set} values={values} onChange={onSetChange} />
      ))}
      {Object.entries(colors).map(([set, color]) => (
        <ColorPicker key={set} color={color} label={set} onChange={c => onColorChange(set, c)} />
      ))}
      <FileUpload onFileLoaded={onFileLoaded} />
    </div>
    {/* Weitere Controls: File-Upload, etc. */}
  </section>
);

export default Controls;
