// InteractiVenn Types - Portiert aus Legacy-Code

export interface VennSet {
  id: string;
  name: string;
  elements: string[];
  color: string;
}

export interface Intersection {
  id: string;
  sets: string[];
  elements: string[];
  size: number;
}

export interface DiagramState {
  nWay: number;
  sets: Record<string, VennSet>;
  intersections: Record<string, Intersection>;
  merging: boolean;
  currentLevel: number;
  maxLevel: number;
  globalFontSize: number;
  globalOpacity: number;
  probability: boolean;
}

export interface SlideFrame {
  index: number;
  code: string;
}

export interface TreeNode {
  label: string;
  left: TreeNode | null;
  right: TreeNode | null;
  root: TreeNode | null;
}

export type VisualizationMode = 'slider' | 'tree';
export type ExportFormat = '.svg' | '.png' | '.txt';

export interface AppState {
  numberOfSets: number;
  sets: VennSet[];
  mode: 'list' | 'tree';
  opacity: number;
  fontSize: number;
  showPercentages: boolean;
}

export interface IntersectionData {
  id: string;
  elements: string[];
  size: number;
  percentage: number;
}
