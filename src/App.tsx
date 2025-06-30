import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';
import Visualization from './components/Visualization';
import HelpPage from './pages/Help';
import ContactPage from './pages/Contact';
import CitationPage from './pages/Citation';
import { SetService } from './SetService';
import type { VennSet, Intersection } from './types';
import './App.css';

const MainPage = () => {
  const [numberOfSets, setNumberOfSets] = useState(3);
  const [sets, setSets] = useState<Record<string, string[]>>({
    'Set A': [],
    'Set B': [],
    'Set C': [],
    'Set D': [],
    'Set E': [],
    'Set F': []
  });
  const [setNames, setSetNames] = useState<string[]>(['Set A', 'Set B', 'Set C', 'Set D', 'Set E', 'Set F']);
  const [colors, setColors] = useState<Record<string, string>>({
    'Set A': '#1f77b4',
    'Set B': '#ff7f0e', 
    'Set C': '#2ca02c',
    'Set D': '#d62728',
    'Set E': '#9467bd',
    'Set F': '#8c564b'
  });
  const [intersections, setIntersections] = useState<Record<string, Intersection>>({});
  const [showPercentages, setShowPercentages] = useState(false);
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(18);

  const setService = useMemo(() => new SetService(), []);

  useEffect(() => {
    const activeSets: Record<string, string[]> = {};
    for (let i = 0; i < numberOfSets; i++) {
        const setName = setNames[i];
        if(sets[setName]) {
            activeSets[setName] = sets[setName];
        }
    }
    const calculatedIntersections = setService.calculateIntersections(activeSets);
    setIntersections(calculatedIntersections);
  }, [sets, numberOfSets, setNames, setService]);

  const handleSetChange = (setIndex: number, elements: string[]) => {
    if (setIndex < setNames.length) {
      const setName = setNames[setIndex];
      setSets(prev => ({
        ...prev,
        [setName]: elements
      }));
    }
  };

  const handleColorChange = (setIndex: number, color: string) => {
    if (setIndex < setNames.length) {
      const setName = setNames[setIndex];
      setColors(prev => ({
        ...prev,
        [setName]: color
      }));
    }
  };

  const handleNameChange = (setIndex: number, name: string) => {
    if (setIndex < setNames.length) {
      const oldName = setNames[setIndex];
      const newNames = [...setNames];
      newNames[setIndex] = name;
      setSetNames(newNames);
      
      // Update sets and colors with new name
      setSets(prev => {
        const newSets = { ...prev };
        newSets[name] = newSets[oldName] || [];
        if (name !== oldName) {
          delete newSets[oldName];
        }
        return newSets;
      });
      
      setColors(prev => {
        const newColors = { ...prev };
        newColors[name] = newColors[oldName] || '#1f77b4';
        if (name !== oldName) {
          delete newColors[oldName];
        }
        return newColors;
      });
    }
  };

  const handleNumberOfSetsChange = (newNumber: number) => {
    setNumberOfSets(newNumber);
  };

  const handleLoadSets = (loadedSets: VennSet[]) => {
    setNumberOfSets(loadedSets.length);
    
    const newNames = loadedSets.map(s => s.name);
    const newSets: Record<string, string[]> = {};
    const newColors: Record<string, string> = {};

    loadedSets.forEach(set => {
      newSets[set.name] = set.elements;
      newColors[set.name] = set.color;
    });

    const originalNames = ['Set A', 'Set B', 'Set C', 'Set D', 'Set E', 'Set F'];
    const originalColors = {
        'Set A': '#1f77b4',
        'Set B': '#ff7f0e',
        'Set C': '#2ca02c',
        'Set D': '#d62728',
        'Set E': '#9467bd',
        'Set F': '#8c564b'
    };

    for (let i = loadedSets.length; i < 6; i++) {
        const name = originalNames[i];
        newNames.push(name);
        if (!newSets[name]) newSets[name] = [];
        if (!newColors[name]) newColors[name] = originalColors[name];
    }

    setSetNames(newNames);
    setSets(newSets);
    setColors(newColors);
  };

  const handleModeChange = (newMode: 'list' | 'tree') => {
    console.log('Mode changed:', newMode);
  };

  const handleOpacityChange = (opacity: number) => {
    setOpacity(opacity);
  };

  const handleFontSizeChange = (fontSize: number) => {
    setFontSize(fontSize);
  };

  const handleReset = () => {
    // Reset all sets
    const resetSets: Record<string, string[]> = {};
    setNames.forEach(name => {
      resetSets[name] = [];
    });
    setSets(resetSets);
  };

  const handlePercentageToggle = (show: boolean) => {
    setShowPercentages(show);
  };

  const handleRegionClick = (region: string) => {
    // TODO: Show modal with elements
    console.log('Region clicked:', region, intersections[region]?.elements);
  };

  const getSetNamesMapping = (): Record<string, string> => {
    const mapping: Record<string, string> = {};
    setNames.slice(0, numberOfSets).forEach((name, index) => {
      const key = String.fromCharCode(97 + index); // a, b, c, etc.
      mapping[key] = name;
    });
    return mapping;
  };

  const getActiveSets = () => {
      const activeSets: Record<string, string[]> = {};
      for (let i = 0; i < numberOfSets; i++) {
          const setName = setNames[i];
          activeSets[setName] = sets[setName] || [];
      }
      return activeSets;
  }

  return (
    <section id="content" className="body">
      <div id="diagramDiv">
        <div id="contentContainer">
          <div id="leftColumn">
            <div id="mergeMenu">
              <span>
                <input
                  type="radio"
                  name="mergeMode"
                  value="list"
                  defaultChecked
                  onChange={() => handleModeChange('list')}
                />
                Unions by list&nbsp;&nbsp;
                <input
                  type="radio"
                  name="mergeMode"
                  value="tree"
                  onChange={() => handleModeChange('tree')}
                />
                Unions by tree
              </span>
            </div>
            <div id="imageContainer">
              <div id="diagramframe">
                <Visualization
                  sets={getActiveSets()}
                  colors={colors}
                  onRegionClick={handleRegionClick}
                  opacity={opacity}
                  fontSize={fontSize}
                  intersections={intersections}
                  showPercentages={showPercentages}
                />
              </div>
            </div>
            <VisualizationPanel
              onModeChange={handleModeChange}
              onOpacityChange={handleOpacityChange}
              onFontSizeChange={handleFontSizeChange}
              onReset={handleReset}
              onPercentageToggle={handlePercentageToggle}
              intersections={intersections}
              setNamesMapping={getSetNamesMapping()}
              showPercentages={showPercentages}
            />
          </div>
          <div id="rightColumn">
            <InputPanel
              numberOfSets={numberOfSets}
              setNames={setNames}
              sets={sets}
              colors={colors}
              onSetChange={handleSetChange}
              onColorChange={handleColorChange}
              onNameChange={handleNameChange}
              onNumberOfSetsChange={handleNumberOfSetsChange}
              onLoadSets={handleLoadSets}
            />
          </div>
        </div>
      </div>
    </section>
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
