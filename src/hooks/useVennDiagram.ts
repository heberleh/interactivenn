// React Hooks für InteractiVenn State Management
import { useState, useCallback, useMemo } from 'react';
import type { VennSet } from '../types';
import { cleanElementList, updateIntersections } from '../utils/setOperations';

const DEFAULT_SETS = ['A', 'B', 'C', 'D', 'E', 'F'];
const DEFAULT_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export function useVennDiagram() {
  const [nWay, setNWay] = useState(6);
  const [sets, setSets] = useState<Record<string, VennSet>>(() => {
    const initialSets: Record<string, VennSet> = {};
    DEFAULT_SETS.forEach((id, index) => {
      initialSets[id] = {
        id,
        name: `Set ${id}`,
        elements: [],
        color: DEFAULT_COLORS[index] || '#CCCCCC'
      };
    });
    return initialSets;
  });

  const [globalFontSize, setGlobalFontSize] = useState(20);
  const [globalOpacity, setGlobalOpacity] = useState(0.2);
  const [probability, setProbability] = useState(false);
  const [merging, setMerging] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);

  const activeSets = useMemo(() => {
    return DEFAULT_SETS.slice(0, nWay);
  }, [nWay]);

  const { intersections, intersectionsSet } = useMemo(() => {
    const activeSetsData: Record<string, string[]> = {};
    activeSets.forEach(setId => {
      activeSetsData[setId] = sets[setId]?.elements || [];
    });
    return updateIntersections(activeSets, activeSetsData);
  }, [sets, activeSets]);

  const updateSetElements = useCallback((setId: string, elements: string) => {
    const elementList = cleanElementList(elements.split('\n'));
    setSets(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        elements: elementList
      }
    }));
  }, []);

  const updateSetName = useCallback((setId: string, name: string) => {
    setSets(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        name: name.replace(/:/g, '-')
      }
    }));
  }, []);

  const updateSetColor = useCallback((setId: string, color: string) => {
    setSets(prev => ({
      ...prev,
      [setId]: {
        ...prev[setId],
        color
      }
    }));
  }, []);

  const clearAllSets = useCallback(() => {
    setSets(prev => {
      const newSets = { ...prev };
      activeSets.forEach(setId => {
        newSets[setId] = {
          ...newSets[setId],
          elements: []
        };
      });
      return newSets;
    });
  }, [activeSets]);

  const updateNWay = useCallback((newNWay: number) => {
    setNWay(newNWay);
    setMerging(false);
    setCurrentLevel(0);
  }, []);

  const increaseFontSize = useCallback(() => {
    setGlobalFontSize(prev => prev + 1);
  }, []);

  const decreaseFontSize = useCallback(() => {
    setGlobalFontSize(prev => Math.max(8, prev - 1));
  }, []);

  const increaseOpacity = useCallback(() => {
    setGlobalOpacity(prev => Math.min(0.7, prev + 0.03));
  }, []);

  const decreaseOpacity = useCallback(() => {
    setGlobalOpacity(prev => Math.max(0.03, prev - 0.03));
  }, []);

  const resetDiagram = useCallback(() => {
    setGlobalFontSize(20);
    setGlobalOpacity(0.2);
    setMerging(false);
    setCurrentLevel(0);
  }, []);

  const togglePercentage = useCallback(() => {
    setProbability(prev => !prev);
  }, []);

  return {
    // State
    nWay,
    sets,
    activeSets,
    intersections,
    intersectionsSet,
    globalFontSize,
    globalOpacity,
    probability,
    merging,
    currentLevel,
    
    // Actions
    updateSetElements,
    updateSetName,
    updateSetColor,
    clearAllSets,
    updateNWay,
    increaseFontSize,
    decreaseFontSize,
    increaseOpacity,
    decreaseOpacity,
    resetDiagram,
    togglePercentage,
    setMerging,
    setCurrentLevel
  };
}
