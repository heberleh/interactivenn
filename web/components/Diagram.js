import { MergeMenu } from './DiagramMergeMenu.js';
import { DisplayMenu } from './DiagramDisplayMenu.js';
import { SetsImage } from './DiagramSetsImage.js';
import { Export } from './Export.js';
import { DataMenu } from './DiagramDataMenu.js';
import { Slide } from '../utils/Slide.js';
import { Tree } from '../utils/Tree.js';

export function Diagram({ type }) {
  // Constants and initial state objects
  if (typeof type === undefined) { type = "list"; }
  const element = React.createElement;
  const allSetsIDs = ['A', 'B', 'C', 'D', 'E', 'F']; //currently selected!! depends on nWays 
  const initialDatasetsState = {};
  allSetsIDs.forEach(name => {
    initialDatasetsState[name] = { data: [], mergedData: [], active: true, label: `Set ${name}` };
  })
  const defaultDiagramConfig = {
    opacity: 0.2,
    fontOpacity: 1,
    fontSize: 20,
    darker: 0.3,
    isMerging: false,
    nWay: 6,
    showPercentage: false,
    path: '../diagrams/6/6waydiagram.svg',
  };
  const defaultColors = {
    A: '#ffa76d',
    B: '#ffff8e',
    C: '#a0a0a4',
    D: '#8Bff8b',
    E: '#7f93f6',
    F: '#2fe606',
  }
  let current = { level: 0, index: 6, started: false };

  // State management
  const [ dataSets, setDataSets ] = React.useState(initialDatasetsState);
  const handleDatasetUpdate = (newData) => {
    const tempSets = { ...dataSets };
    Object.keys(newData).forEach(key => {
      if (newData[key].delete) {
        delete newData[key];
      }
      else {
        const dataset = newData[key];
        Object.keys(dataset).forEach(property => {
          tempSets[key][property] = dataset[property];
        })
      }
    });
    setDataSets(tempSets);
  }

  const [ diagramConfig, setDiagramConfig ] = React.useState(defaultDiagramConfig);
  const handleSetDiagramConfig = (values) => {
    const tempOptions = { ...diagramConfig, ...values };
    setDiagramConfig(tempOptions);
  }
  const handleReset = () => {
    setDiagramConfig(defaultDiagramConfig);
  }

  const [ colors, setColors ] = React.useState(defaultColors);
  const changeColor = (setName, color) => {
    const tempColors = { ...colors};
    tempColors[setName] = color;
    setColors(tempColors);
  }

  const [slide, setSlide] = React.useState(new Slide());
  const [tree, setTree] = React.useState(new Tree());
  const [dendrogramtree, setDendrogramtree] = React.useState(new Tree());

  const colorBoxRefs = [];
  for (let i = 0; i < Object.keys(dataSets).length; i++) {
    const tempRef = React.useRef(null);
    colorBoxRefs.push(tempRef);
  }

  // Housekeeping
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert('The File APIs are not fully supported in this browser.');
  }

  // Subcomponents
  const graphic = element(
    'div',
    { style: { padding: '0px', height: '641px', width: '70%' }},
    element(SetsImage, { allSetsIDs, colorBoxRefs, colors, current, dataSets, diagramConfig }),
    Export(),
    DisplayMenu({ diagramConfig, handleReset, handleSetDiagramConfig }),
  )

  return (
    element(
      'div',
      { type, id: 'diagramDiv', style: { padding: '5px' }},
      MergeMenu({ allSetsIDs, current, dataSets, diagramConfig, type , handleSetDiagramConfig, slide, tree, dendrogramtree, setDendrogramtree }),
      element(
        'div',
        { style: { display: 'flex', height: '100%' }},
        graphic,
        DataMenu({ allSetsIDs, changeColor, colorBoxRefs, colors, dataSets, diagramConfig, handleDatasetUpdate, handleSetDiagramConfig }),
      )
    )
  )
}