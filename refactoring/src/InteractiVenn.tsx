// Siehe copilot-instructions.md für Migrationsregeln und Projektziele

import React, { useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Visualization from './components/Visualization';
import Footer from './components/Footer';

function App() {
  // Beispiel-State für Sets und Farben
  const [sets, setSets] = useState<Record<string, string[]>>({ A: ['1', '2'], B: ['2', '3'] });
  const [colors, setColors] = useState<Record<string, string>>({ A: '#ffcccc', B: '#ccccff' });

  const handleAddSet = () => {
    // Platzhalter: Set C hinzufügen
    setSets(prev => ({ ...prev, C: [] }));
    setColors(prev => ({ ...prev, C: '#ccffcc' }));
  };
  const handleRemoveSet = () => {
    // Platzhalter: Set C entfernen
    setSets(({ C, ...rest }) => rest);
    setColors(({ C, ...rest }) => rest);
  };
  const handleReset = () => {
    setSets({ A: ['1', '2'], B: ['2', '3'] });
    setColors({ A: '#ffcccc', B: '#ccccff' });
  };
  const handleRegionClick = (region: string) => {
    alert(`Region geklickt: ${region}`);
  };
  const handleColorChange = (set: string, color: string) => {
    setColors(prev => ({ ...prev, [set]: color }));
  };
  const handleFileLoaded = (content: string) => {
    // .ivenn-Parsing: nameA:e1,e2...; nameB:e1,e2...;
    const sets: Record<string, string[]> = {};
    const colors: Record<string, string> = {};
    content.split(';').forEach(entry => {
      const [label, values] = entry.split(':');
      if (label && values) {
        const setName = label.trim().charAt(0).toUpperCase();
        sets[setName] = values.split(',').map(e => e.trim()).filter(Boolean);
        colors[setName] = '#cccccc'; // Defaultfarbe, kann angepasst werden
      }
    });
    setSets(sets);
    setColors(colors);
  };
  const handleSetChange = (setName: string, values: string[]) => {
    setSets(prev => ({ ...prev, [setName]: values }));
  };

  return (
    <div>
      <Header />
      <Controls
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
        onReset={handleReset}
        colors={colors}
        onColorChange={handleColorChange}
        onFileLoaded={handleFileLoaded}
        sets={sets}
        onSetChange={handleSetChange}
      />
      <Visualization sets={sets} colors={colors} onRegionClick={handleRegionClick} />
      <Footer />
    </div>
  );
}

export default App;
