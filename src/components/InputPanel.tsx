import React, { useState } from 'react';
import { parseIvennFile, serializeToIvenn, downloadFile } from '../utils/fileHandlers';
import type { VennSet } from '../utils/fileHandlers';

interface InputPanelProps {
  onSetChange?: (setIndex: number, elements: string[]) => void;
  onColorChange?: (setIndex: number, color: string) => void;
  onNameChange?: (setIndex: number, name: string) => void;
  onNumberOfSetsChange?: (numberOfSets: number) => void;
  onLoadSets?: (sets: VennSet[]) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ 
  onSetChange, 
  onColorChange,
  onNameChange,
  onNumberOfSetsChange,
  onLoadSets
}) => {
  const [numberOfSets, setNumberOfSets] = useState(3);
  const [sets, setSets] = useState<string[][]>(Array(6).fill(null).map(() => []));
  const [setNames, setSetNames] = useState<string[]>(['Set A', 'Set B', 'Set C', 'Set D', 'Set E', 'Set F']);
  const [colors, setColors] = useState<string[]>(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']);
  const [saveFileName, setSaveFileName] = useState<string>('');

  const handleSetInputChange = (setIndex: number, value: string) => {
    const elements = value.split('\n').filter(element => element.trim() !== '');
    const newSets = [...sets];
    newSets[setIndex] = elements;
    setSets(newSets);
    onSetChange?.(setIndex, elements);
  };

  const handleColorChange = (setIndex: number, color: string) => {
    const newColors = [...colors];
    newColors[setIndex] = color;
    setColors(newColors);
    onColorChange?.(setIndex, color);
  };

  const handleNameChange = (setIndex: number, name: string) => {
    const newNames = [...setNames];
    newNames[setIndex] = name;
    setSetNames(newNames);
    onNameChange?.(setIndex, name);
  };

  const handleNumberOfSetsChange = (newNumber: number) => {
    setNumberOfSets(newNumber);
    onNumberOfSetsChange?.(newNumber);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsedSets = parseIvennFile(content);
          
          // Update state
          handleNumberOfSetsChange(parsedSets.length);
          const newSets: string[][] = Array(6).fill(null).map(() => []);
          const newNames = [...setNames];
          const newColors = [...colors];
          
          parsedSets.forEach((set, index) => {
            if (index < 6) {
              newSets[index] = set.elements;
              newNames[index] = set.name;
              newColors[index] = set.color;
            }
          });
          
          setSets(newSets);
          setSetNames(newNames);
          setColors(newColors);
          
          // Notify parent
          onLoadSets?.(parsedSets);
          
          // Update individual sets
          parsedSets.forEach((set, index) => {
            if (index < 6) {
              onSetChange?.(index, set.elements);
              onNameChange?.(index, set.name);
              onColorChange?.(index, set.color);
            }
          });
        } catch (error) {
          console.error('Error parsing file:', error);
          alert('Error parsing file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveDataset = () => {
    if (!saveFileName.trim()) {
      alert('Please enter a filename');
      return;
    }

    const vennSets: VennSet[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      vennSets.push({
        name: setNames[i],
        elements: sets[i],
        color: colors[i]
      });
    }

    const content = serializeToIvenn(vennSets);
    const filename = saveFileName.endsWith('.ivenn') ? saveFileName : `${saveFileName}.ivenn`;
    downloadFile(content, filename, 'text/plain');
  };

  return (
    <aside id="input-panel">
      <h2>Data Input</h2>
      
      <div>
        <label>Number of sets: </label>
        <select 
          value={numberOfSets} 
          onChange={(e) => handleNumberOfSetsChange(parseInt(e.target.value))}
        >
          {[2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {Array.from({ length: numberOfSets }, (_, i) => (
        <div key={i} style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              value={setNames[i]}
              onChange={(e) => handleNameChange(i, e.target.value)}
              style={{ width: '100px' }}
            />
            <input
              type="color"
              value={colors[i]}
              onChange={(e) => handleColorChange(i, e.target.value)}
              style={{ width: '40px', height: '30px' }}
            />
          </div>
          <textarea
            placeholder={`Enter elements for ${setNames[i]}, one per line`}
            value={sets[i].join('\n')}
            onChange={(e) => handleSetInputChange(i, e.target.value)}
            rows={8}
            style={{ 
              width: '100%', 
              marginTop: '5px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            size: {sets[i].length}
          </div>
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <h3>File Operations</h3>
        <div>
          <label>Load Sets: </label>
          <input
            type="file"
            accept=".ivenn"
            onChange={handleFileUpload}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Write dataset name here"
            value={saveFileName}
            onChange={(e) => setSaveFileName(e.target.value)}
            style={{ width: '150px' }}
          />
          <button style={{ marginLeft: '5px' }} onClick={handleSaveDataset}>Save</button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={() => {
              // Clear all sets
              setSets(Array(6).fill(null).map(() => []));
              setSetNames(['Set A', 'Set B', 'Set C', 'Set D', 'Set E', 'Set F']);
              setColors(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']);
              // Notify parent
              for (let i = 0; i < 6; i++) {
                onSetChange?.(i, []);
                onNameChange?.(i, ['Set A', 'Set B', 'Set C', 'Set D', 'Set E', 'Set F'][i]);
                onColorChange?.(i, ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'][i]);
              }
            }}
            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px' }}
          >
            Clear sets
          </button>
        </div>
      </div>
    </aside>
  );
};

export default InputPanel;
