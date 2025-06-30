import React, { useState } from 'react';
import { parseIvennFile, serializeToIvenn, downloadFile } from '../utils/fileHandlers';
import type { VennSet } from '../types';

interface InputPanelProps {
  numberOfSets: number;
  setNames: string[];
  sets: Record<string, string[]>;
  colors: Record<string, string>;
  onSetChange: (setIndex: number, elements: string[]) => void;
  onColorChange: (setIndex: number, color: string) => void;
  onNameChange: (setIndex: number, name: string) => void;
  onNumberOfSetsChange: (numberOfSets: number) => void;
  onLoadSets: (sets: VennSet[]) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ 
  numberOfSets,
  setNames,
  sets,
  colors,
  onSetChange, 
  onColorChange,
  onNameChange,
  onNumberOfSetsChange,
  onLoadSets
}) => {
  const [saveFileName, setSaveFileName] = useState<string>('');

  const handleSetInputChange = (setIndex: number, value: string) => {
    const elements = value.split('\n').filter(element => element.trim() !== '');
    onSetChange(setIndex, elements);
  };

  const handleColorChange = (setIndex: number, color: string) => {
    onColorChange(setIndex, color);
  };

  const handleNameChange = (setIndex: number, name: string) => {
    onNameChange(setIndex, name);
  };

  const handleNumberOfSetsChange = (newNumber: number) => {
    onNumberOfSetsChange(newNumber);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const parsedSets = parseIvennFile(content);
          
          // Update number of sets first
          onNumberOfSetsChange(parsedSets.length);
          
          // Update individual sets
          parsedSets.forEach((set, index) => {
            if (index < 6) {
              onSetChange(index, set.elements);
              onNameChange(index, set.name);
              onColorChange(index, set.color);
            }
          });
          
          // Notify parent with full data
          onLoadSets(parsedSets);
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

    // Convert current sets to VennSet format
    const setsToSave: VennSet[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      const setName = setNames[i] || `Set ${String.fromCharCode(65 + i)}`;
      const setKey = setName;
      setsToSave.push({
        id: `set_${i}`,
        name: setName,
        elements: sets[setKey] || [],
        color: colors[setKey] || '#cccccc'
      });
    }

    const content = serializeToIvenn(setsToSave);
    downloadFile(content, `${saveFileName}.ivenn`, 'text/plain');
  };

  const handleClearSets = () => {
    for (let i = 0; i < 6; i++) {
      onSetChange(i, []);
    }
  };

  // Get current set data for display
  const getCurrentSetElements = (setIndex: number): string => {
    const setName = setNames[setIndex];
    const elements = sets[setName] || [];
    return elements.join('\n');
  };

  const getCurrentSetColor = (setIndex: number): string => {
    const setName = setNames[setIndex];
    return colors[setName] || '#cccccc';
  };

  return (
    <div id="inputPanel">
      <div id="newFeatures">   
        <span className="checkbox">
          <input className="checkbox" type="checkbox" onChange={() => {}} />
          <span className="text-sm">Show <b>percentages</b> instead of size <span className="text-highlight">new feature!</span></span>
        </span>                             
        <span style={{ marginLeft: '21px', marginTop: '4px' }}>Mouse-over numbers highlights their sets </span>
        <span className="text-highlight">new feature!</span>
      </div>
      
      <div id="nWayMenu"> 
        <div className="rightColMargin"><strong>Number of Sets: </strong></div>
        <form>
          {[2, 3, 4, 5, 6].map(n => (
            <span key={n}>
              <input 
                type="radio" 
                name="nway" 
                value={n}
                checked={numberOfSets === n}
                onChange={() => handleNumberOfSetsChange(n)}
              />
              {n}&nbsp;&nbsp;
            </span>
          ))}
        </form>
      </div>

      <div id="dataInput">
        <h2>Data Input</h2>
        
        {Array.from({ length: numberOfSets }, (_, index) => (
          <div key={index} className="setInput">
            <div className="setHeader">
              <input
                type="text"
                value={setNames[index] || `Set ${String.fromCharCode(65 + index)}`}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Set ${String.fromCharCode(65 + index)}`}
              />
              <input
                type="color"
                value={getCurrentSetColor(index)}
                onChange={(e) => handleColorChange(index, e.target.value)}
              />
            </div>
            <textarea
              placeholder={`Enter elements for ${setNames[index] || `Set ${String.fromCharCode(65 + index)}`}, one per line`}
              value={getCurrentSetElements(index)}
              onChange={(e) => handleSetInputChange(index, e.target.value)}
              rows={6}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div className="setSize">
              size: {sets[setNames[index]]?.length || 0}
            </div>
          </div>
        ))}
      </div>

      <div id="fileOperations">
        <h3>File Operations</h3>
        
        <div className="fileOp">
          <label><strong>Load Sets:</strong></label>
          <input
            type="file"
            accept=".ivenn"
            onChange={handleFileUpload}
          />
        </div>

        <div className="fileOp">
          <input
            type="text"
            placeholder="Write dataset name here"
            value={saveFileName}
            onChange={(e) => setSaveFileName(e.target.value)}
          />
          <button onClick={handleSaveDataset}>Save</button>
        </div>

        <button 
          className="danger" 
          onClick={handleClearSets}
        >
          Clear sets
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
