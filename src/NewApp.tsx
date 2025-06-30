import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';
import Visualization from './components/Visualization';
import HelpPage from './pages/Help';
import ContactPage from './pages/Contact';
import CitationPage from './pages/Citation';
import './App.css';

// Modal for showing region elements
const RegionModal: React.FC<{ 
  open: boolean; 
  region: string | null; 
  elements: string[]; 
  onClose: () => void;
}> = ({ open, region, elements, onClose }) => {
  if (!open || !region) return null;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.3)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        background: '#fff', 
        padding: 24, 
        borderRadius: 8, 
        minWidth: 300, 
        maxHeight: '70vh', 
        overflow: 'auto' 
      }}>
        <h3>Region: {region}</h3>
        <p>Number of elements: {elements.length}</p>
        <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
          {elements.map((el, i) => <li key={i}>{el}</li>)}
        </ul>
        <button onClick={onClose} style={{ marginTop: '16px' }}>Close</button>
      </div>
    </div>
  );
};

const MainPage = () => {
  const [sets, setSets] = useState<Record<string, string[]>>({
    'Set A': [],
    'Set B': [],
    'Set C': []
  });
  const [colors, setColors] = useState<Record<string, string>>({
    'Set A': '#1f77b4',
    'Set B': '#ff7f0e', 
    'Set C': '#2ca02c'
  });
  const [modalRegion, setModalRegion] = useState<string | null>(null);
  const [modalElements, setModalElements] = useState<string[]>([]);

  const handleSetChange = (setIndex: number, elements: string[]) => {
    const setNames = Object.keys(sets);
    if (setIndex < setNames.length) {
      const setName = setNames[setIndex];
      setSets(prev => ({
        ...prev,
        [setName]: elements
      }));
    }
  };

  const handleColorChange = (setIndex: number, color: string) => {
    const setNames = Object.keys(colors);
    if (setIndex < setNames.length) {
      const setName = setNames[setIndex];
      setColors(prev => ({
        ...prev,
        [setName]: color
      }));
    }
  };

  const handleLoadFile = (fileContent: string) => {
    // TODO: Implement .ivenn file parsing
    console.log('Loading file:', fileContent);
  };

  const handleModeChange = (newMode: 'list' | 'tree') => {
    console.log('Mode changed:', newMode);
  };

  const handleOpacityChange = (opacity: number) => {
    console.log('Opacity changed:', opacity);
  };

  const handleFontSizeChange = (fontSize: number) => {
    console.log('Font size changed:', fontSize);
  };

  const handleExport = (format: 'svg' | 'png' | 'txt') => {
    console.log('Export format:', format);
  };

  const handleRegionClick = (region: string) => {
    // TODO: Calculate actual elements for the region
    setModalRegion(region);
    setModalElements(['element1', 'element2', 'element3']);
  };

  return (
    <main>
      <InputPanel
        onSetChange={handleSetChange}
        onColorChange={handleColorChange}
        onLoadFile={handleLoadFile}
      />
      <div>
        <VisualizationPanel
          onModeChange={handleModeChange}
          onOpacityChange={handleOpacityChange}
          onFontSizeChange={handleFontSizeChange}
          onExport={handleExport}
        />
        <Visualization
          sets={sets}
          colors={colors}
          onRegionClick={handleRegionClick}
        />
      </div>
      <RegionModal 
        open={!!modalRegion} 
        region={modalRegion} 
        elements={modalElements} 
        onClose={() => setModalRegion(null)} 
      />
    </main>
  );
};

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/citation" element={<CitationPage />} />
        <Route path="/tree" element={<MainPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
