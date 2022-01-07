import { d3 } from '../d3/d3.v2.js';
import { Node, jsonTree, printTreeJSON } from '../utils/Tree.js';

export function MergeMenu({ allSetsIDs, dataSets, diagramConfig, type, handleSetDiagramConfig, slide, tree, setDendrogramtree }) {
  
  const element = React.createElement;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentLevel, setCurrentLevel] = React.useState( getCode() ? getCode().match(/\(/g)?.length - 1 : examples.tree[diagramConfig.nWay]);

  const defaultValue = type === "list" ?  examples.list[diagramConfig.nWay] : examples.tree[diagramConfig.nWay];
  const noData = allSetsIDs.map(setID => dataSets[setID].data.length).every(x => x === 0);
  const validSets = allSetsIDs.map(setID => dataSets[setID].data.length > 0).filter(x => x).length;

  React.useEffect(() => {
    const input = document.getElementById("mergeCode");
    input.value = defaultValue;
  })

  // Methods

  /**
* @description Decodes the string str and identifies the unions. If the web interface is related to "Slider/List" version, the code is similar to this: "ab; cd,ef; abc,de; abcd,ef; ab,cd,ef". If the web interface is related to "Tree" version, the code is similar to this: "((A,((D,(F,E)),C)),B)".
* @param {string} str The string given by the user.
* @param {string} type The type of code (Tree vs List).
*/
function decode(str) {
  const decoded = type === 'list' ? decodeList(str) : decodeTree(str);
  return decoded;
}

  /**
* @description Decodes the string str and identifies the unions. If the web interface is related to "Slider/List" version, the code is similar to this: "ab; cd,ef; abc,de; abcd,ef; ab,cd,ef". If the web interface is related to "Tree" version, the code is similar to this: "((A,((D,(F,E)),C)),B)".
* @param {string} str The string given by the user.
*/
function decodeList(str) {
  str = str.toUpperCase();
  // exemplo:                 // ab; cd,ef; abc,de; abcd,ef; ab,cd,ef

  str = str.replace(" ", "");
  str = str.replace("\n", "");
  const token_list = str.split(";");
  //alert(token_list);

  const listsize = token_list.length;
  for (var i = 0; i < listsize; i++) {
      const subtokens = token_list[i].split(",");
      for (var j = 0; j < subtokens.length; j++) {
          const tokenL = subtokens[j].split("");
          tokenL.sort();
          subtokens[j] = tokenL.join("").replace(" ", "");
      }
      //alert(subtoken_list);
      subtokens.sort();
      //alert(subtoken_list);

      var code = subtokens.join("_").replace(" ", "");
      slide.addFrame(code);
  }
}

/**
* @description Decodes the string str and identifies the unions. If the web interface is related to "Slider/List" version, the code is similar to this: "ab; cd,ef; abc,de; abcd,ef; ab,cd,ef". If the web interface is related to "Tree" version, the code is similar to this: "((A,((D,(F,E)),C)),B)".
* @param {string} str The string given by the user.
*/
function decodeTree(str) {
  str = str.toUpperCase();
  var strsize = str.length;
  var dict = [',', ')', '(', ...allSetsIDs];

  var current = {name: 'root', children: []};
  const jsonTree = current;

  for (var i = 0; i < strsize; i++) {
      var token = str[i];
      if (!(dict.includes(token))) {
          alert("Invalid: " + token);
          break;
      }
      var lastNode = tree.getCurrentNode();
      switch (token) {
          case '(':
            tree.getCurrentNode().setLeft(new Node(tree, lastNode)); //Node() seta na Tree ele mesmo como current.
              tree.count++;

              var newnode = {name: '', parent: current};
              if (current.children == null) {
                  current.children = [];
              }
              ;
              current.children.push(newnode);
              current = newnode;
              break;
          case ')':
            tree.setCurrentNode(tree.getCurrentNode().getRoot());
              var name = tree.getCurrentNode().getLeft().getLabel() + tree.getCurrentNode().getRight().getLabel();
              tree.getCurrentNode().setLabel(name);

              current = current.parent;
              current.name = name;
              break;
          case ',':
              var root = tree.getCurrentNode().getRoot();
              tree.setCurrentNode(root);
              root.setRight(new Node(tree, root));
              tree.count++;

              current = current.parent;
              var newnode = {name: '', parent: current};
              if (current.children == null) {
                  current.children = [];
              }
              current.children.push(newnode);
              current = newnode;

              break;
          default:
              tree.getCurrentNode().setLabel(token);
              current.name = tree;
              break;
      }
  }
  var treeJsonStr = printTreeJSON(jsonTree);
  //console.log(treeJsonStr);
  setDendrogramtree(JSON.parse(treeJsonStr));
//    console.log(jsonTree);
//    console.log(printTreeJSON(jsonTree, treeJsonStr));
}

function getCode() {
  const element = document.getElementById("mergeCode");
  if (element) return element.value;
  return false;
}

  /**
* @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
*/
function mergeSetsDownList() {
  //    document.getElementById("updateMerge").disabled = true;
  //    document.getElementById("downMerge").disabled = true;
  //    document.getElementById("upMerge").disabled = true;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      mergeSets({ index: newIndex });
    }
  }
  
  /**
   * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
   */
  function mergeSetsDownTree() {
    document.getElementById("downMerge").disabled = true;
    document.getElementById("upMerge").disabled = true;
    if (currentLevel < tree.getMaxLevel()) {
        const newLevel = currentLevel + 1;
        setCurrentLevel(newLevel);
        mergeSets({ index: newLevel });
    }
  }
  /**
  * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
  */
  function mergeSetsUpList() {
    if (currentIndex < slide.getSize() - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        mergeSets({ index: newIndex });
    }
  }
  
  /**
   * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
   */
  function mergeSetsUpTree() {
    document.getElementById("downMerge").disabled = true;
    document.getElementById("upMerge").disabled = true;
    if (currentLevel > 0) {
        const newLevel = currentLevel - 1;
        setCurrentLevel(newLevel);
        mergeSets({ index: newLevel });
    }
  }

  /**
* @description Merges the sets of a given union code. Argument is actually a index of a union code in the union codes list.
* @param {numeric} index The index of a union in the list of unions. For instance, if the list is [ab, abc, ad] the index 0 gives you the union code "ab".
*/
function mergeSets({ index }) {

  const { nWay } = diagramConfig;
  const sets = {};

  for (var i = 0; i < allSetsIDs.length; i++) {
      var s = allSetsIDs[i];
      var list = document.getElementById("input" + s).value.split("\n");

      for (var t = 0; t < list.length; t++)
      {
          list[t] = list[t].replace(/^\s+/g, "");
          list[t] = list[t].replace(/\s+$/g, "");
      }
      const remove = ["", "\n", " ", "  ", "   "];
      list = list.filter(x => remove.includes(x) === false);
      sets[s] = list;
  }

  if (diagramConfig.isMerging === false) {
      var code = getCode();
      decode(code);
      if (type === 'tree') {
        // maxLevel = tree.getMaxLevel();
        tree.levelsSearch();
      }
  }

  let decoded = type === "list" ? slide.getNameFromIndex(index) : tree.getNameFromLevel(index);

  var totalSet = [];
  var hashtotal = {};
  d3.select("#updateDiagrambutton").style("display", 'none');

  for (var i = 0; i < allSetsIDs.length; i++) {
      document.getElementById("input" + allSetsIDs[i]).disabled = true;
  }

  //UNION of sets                        
  let length = 0;
  if (index > 0) {
    var part = decoded.toUpperCase().split("_");
    length = part.length;
  }
  for (var i = 0; i < length; i++) {
      hashtotal = {};
      totalSet = [];

      for (var j = 0; j < part[i].length; j++) {
          for (var k = 0; k < sets[part[i][j]].length; k++) {
              if (hashtotal[sets[part[i][j]][k]] != true) {
                  hashtotal[sets[part[i][j]][k]] = true;
                  totalSet.push(sets[part[i][j]][k]);
              }
          }
      }
      for (var j = 0; j < part[i].length; j++) {
          sets[part[i][j]] = totalSet;
      }

  }
  if (decoded != "") {
      decoded = "_" + decoded;
  }

  var path = "../diagrams/" + nWay + "/" + nWay + "waydiagram" + decoded.toLowerCase() + ".svg";

  handleSetDiagramConfig({ isMerging: true, path });

}
  
  function startstop() {

    let newIndex;
    
    if (type === 'list') { 
      newIndex = getCode().match(/;/g)?.length;
      setCurrentIndex(newIndex); 
    }
    else if (type === 'tree') {
      newIndex = 0;
      setCurrentLevel(newIndex); 
    }

    if (diagramConfig.isMerging === false) {
        //troca o botão start por stop
        handleSetDiagramConfig({ isMerging: true });
        mergeSets({ index: type === 'list' ? newIndex : currentLevel });
    } else {
        // merging será falso e tudo será reiniciado...

        if (type === "tree") {
          d3.select("#dendrogram").html("");
          setDendrogramtree(null);
        }
        handleSetDiagramConfig({ isMerging: false });
    }
  }


  // Subcomponents
  const codeInput = element(
    'input',
    { id: 'mergeCode', size: '45', maxLength: '200', disabled: diagramConfig.isMerging },
  )

  const percent = element(
    'div',
    null,
    element('input', { id: 'togglePercentage', type: 'checkbox', style: { marginRight: '5px' }, onChange: (e) => { handleSetDiagramConfig({ showPercentage: e.target.checked ? true : false })} }),
    element('span', { style: { fontSize: '12px!important' }}, 'Show Percentages instead'),
    element('span', { style: {color: 'red', fontWeight: 'bold' }}, ' (new feature!)')
  )

  const mouseOver = element(
    'div',
    null,
    element('span', { style: { fontSize: '12px!important', marginLeft: '22px' }}, 'Mouse-over numbers highlight their sets'),
    element('span', { style: { color: 'red', fontWeight: 'bold' }}, ' (new feature!)')
  )

  const newFeatures = element(
    'div',
    null,
    percent,
    mouseOver,
  )

  const disableMergeDown = () =>  diagramConfig.isMerging === false
                            || (type === 'list' && currentIndex <= 0)
                            || (type === 'tree' && currentLevel >= getCode()?.match(/\(/g)?.length - 1);
  const disableMergeUp = () => diagramConfig.isMerging === false
                          || (type === 'list' && currentIndex >= getCode()?.match(/;/g)?.length)
                          || (type === 'tree' && currentLevel <= 0);

  const codeBlock = element(
    'div',
    { style: { textAlign: 'left', padding: '0px', margin: '0px' }},
    type === 'list' ? 'List code: ' : 'Tree code: ',
    codeInput,
    element(
      'button', 
      { type: 'button', 
        disabled: (noData || validSets < 3), 
        id: 'updateMerge', 
        onClick: () => startstop() 
      }, 
      diagramConfig.isMerging ? 'Stop' : 'Start'),
    element('button', 
      { type: 'button', 
        disabled: disableMergeDown(), 
        id: 'upMerge', 
        onClick: type === 'list' ? mergeSetsDownList : mergeSetsDownTree }, '<'),
    element(
      'button', 
      { type: 'button', 
        disabled: disableMergeUp(), 
        id: 'downMerge', 
        onClick: type === 'list' ? mergeSetsUpList : mergeSetsUpTree }, '>'),
  )

  return (
    element(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between' }},
      codeBlock,
      newFeatures,
    )
  )
}

const examples = {
  list: {
      "2": "ab",
      "3": "ab;ca",
      "4": "ca,db; ab",
      "5": "ab; cd; be,ac",
      "6": "ab; cd,ef; abc,de; abcd,ef",
  }, 
  tree: {
      "2": "(A,B)",
      "3": "((A,B),C)",
      "4": "((A,(B,C)),D)",
      "5": "((A,((D,E),C)),B)",
      "6": "((A,((D,(F,E)),C)),B)",
  }
};


