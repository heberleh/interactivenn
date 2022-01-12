import setService from "./SetService.js";
import { d3 } from "./d3/d3.v2.js";

/**
 * Sample input formats:
 *
 * sets: [
 *  { data: [], label: 'My Set Label'},
 *  { data: [], label: 'Another Set Label'},
 *  { data: [], label: 'Third Label'},
 *  { data: [], label: 'Fourth Label'},
 * ]
 *
 * config: {
 *   nWay: 6,
 *   fontSize: 12,
 *   fontOpacity: 1,
 *   opacity: 0.2,
 *   showPercentage: false,
 *   unions: ['ab', 'cd'],
 *   colors: [],
 * }
 *
 * */

// TODO: Bug fix - fix unions bugs and percentage calculations
// TODO: Carve out intersections popup as separate method with config options, improve UI, and consider migrating away from opening a new window
// TODO: Remove dependency on appending importedNode to document before manipulating it, eliminate dependence on D3
// TODO: Separate loadDiagram into create and render methods
// TODO: refactor Diagram to create an SVGElement at this.element and contain a render method
// TODO: Consolidate and simplify methods
// TODO: Improve algorithmic efficiency of intersectionsSet getter
// TODO: Migrate to TypeScript

export default class Diagram {

  constructor(sets, config) {
    this.config = {
      nWay: 6,
      fontSize: 20, 
      fontOpacity: 1, 
      opacity: 0.2,
      showPercentage: false, 
      unions: [],
      colors: [],
      ...config
    }
    this.sets = sets.map((setObject, index) => {
      setObject.id = this.setIDs[index];
      setObject.set = Array.from(new Set(setObject.data));
      return setObject;
    }) || [];
    this.labelsDiagram = [];
    this.importedNode = {};
    this.config.unions = config.unions.map(x => x.toUpperCase());
    
    this.mergeSets();

    console.log('Diagram loaded from data:');
    this.sets.forEach(x => console.log(x.set));
    return this.loadNewDiagram(this.path);
  }

  get setIDs() {
    return ['A','B','C','D','E','F'];
  }

  get path() {
    const { unions, nWay } = this.config;
    if (unions.length === 0) {
      return `../diagram/${nWay}/${nWay}waydiagram.svg`;
    } 
    return `../diagrams/${nWay}/${nWay}waydiagram_${unions.sort().join('_')}.svg`;
  }

  mergeSets() {
    const { sets, config: { unions }} = this;
    this.validateUnions();
    if (unions.length > 0) {
        unions.forEach(union => {
          const lastSetID = union.split('').sort().reverse()[0];
          const newSet = setService.getUnionOfAllSetsArray(sets.map(data => union.includes(data.id) ? data.set : []));
          const setToUpdate = sets.filter(set => set.id === lastSetID)[0];
          setToUpdate.set = newSet;
        })
    } 
  }

  validateUnions() {
    const { unions } = this.config;
    const validElements = unions.every(x => new Set(x.split('')).size === x.length);
    const allLetters = unions.join('').split('');
    const noRepeats = new Set(allLetters).size === allLetters.length;
    const validLetters = allLetters.every(x => this.setIDs.includes(x.toUpperCase()));

    // TODO: Determine alert/error behavior if an invalid unions array is provided e.g. [ab, cd, qrs]
    if (!validElements || !noRepeats || !validLetters) {
      this.config.unions = [];
    }
    return unions.length > 0 && validElements && noRepeats && validLetters;
  }

  /**
   * @description Loads a diagram and process everything based on it.
   * @param {string} path The path of a .svg diagram
   */
  loadNewDiagram(path) {

    const handleAddLabel = (str) => this.labelsDiagram.push(str);
    const diagram = this;
    const { setIDs } = diagram;
    let { importedNode } = this;

    d3.xml(path, "image/svg+xml", function (xml) {
      try {
        importedNode = document.importNode(xml.documentElement, true);
      } catch (err) {
        alert(
          "\nDiagram not found: " +
            path +
            "\n\n Error: " +
            err.message +
            ". Please report it to henry at icmc.usp.br\n\n"
        );
      }

      var node = document.getElementById("diagram");

      if (node != null) {
        node.parentNode.removeChild(node);
      }

      d3.select("#diagramframe").node().appendChild(importedNode);

      d3.select(importedNode)
        .attr("viewBox", "0 0 700 700")
        .attr("align", "center")
        .attr("width", "600")
        .attr("height", "578");

      var vtemp = d3.selectAll("text")[0];

      for (var j = 0; j < vtemp.length; j++) {
        var str = vtemp[j].textContent;
        if (
          vtemp[j].id.substring(0, 5) != "label" &&
          vtemp[j].id.substring(0, 5) != "total" &&
          str != "(total)"
        ) {
          handleAddLabel(str);

          var el = document.getElementById(str);
          el.onclick = function (e) {
            var node = e.target;
            var id = node.id.toUpperCase();

            var textName = "<b>[";
            textName = textName + id[0];
            for (var i = 1; i < id.length; i++) {
              textName =
                textName +
                "] and [" +
                setIDs[i];
            }
            textName = textName + "]";
            textName = textName.replace(/:/g, "-");
            var strIntersection = textName + ":</b></br>";

            const length = diagram.intersectionsSet[id]?.length || 0;
            for (var t = 0; t < length; t++) {
              strIntersection =
                strIntersection + diagram.intersectionsSet[id][t] + "</br>";
            }

            var htmlp = "<p>" + strIntersection + "</p>";

            var newWindow = window.open(
              "",
              id,
              "scrollbars=yes,toolbar=no,menubar=no,status=no,directories=no,location=no,width=400,height=400"
            );
            newWindow.document.write(htmlp);
          };
        }
      }
      diagram.updateLabelsSizes();
      diagram.updateSetsLabels();
      diagram.updateDiagram();
      diagram.updateColors();
      diagram.updateOpacity();

      diagram.setMouseOverIntersectionsLabels();
    });
  }

  /**
   * @description Updates the label of a set in the diagram given the label typed by the user on the web interface.
   * @param {string} setID The set ID.
   */
  updateSetLabel(index) {
    var text = this.sets[index]?.label || `Set ${this.setIDs[index]}`;
    d3.select("#label" + this.setIDs[index]).text(text.replace(/:/g, "-"));
  }

  /**
   * @description Updates the label of all sets in the diagram given the labels typed by the user on the web interface.
   */
  updateSetsLabels() {
    for (var i = 0; i < this.config.nWay; i++) {
      this.updateSetLabel(i);
    }
  }

  setMouseOverIntersectionsLabels() {
    const allSetsNames = this.setIDs;
    const globalOpacity = this.config.opacity;

    for (var i = 0; i < this.labelsDiagram.length; i++) {
      const label = this.labelsDiagram[i];
      const selected = d3.select("#" + label);

      selected
        .on("mouseover", function (d) {
          allSetsNames.forEach((setName) => {
            d3.select("#elipse" + setName.toUpperCase())
              .style({ "fill-opacity": 0 })
              .style({ padding: "5px" });
            d3.select("#label" + setName.toUpperCase()).style({
              "fill-opacity": 0.2,
            });
            d3.select("#total" + setName.toUpperCase()).style({
              "fill-opacity": 0.2,
            });
          });

          label.split("").forEach((setName) => {
            d3.select("#elipse" + setName.toUpperCase()).style({
              "fill-opacity": globalOpacity + 0.2,
            });
            d3.select("#label" + setName.toUpperCase()).style({
              "fill-opacity": 1,
            });
            d3.select("#total" + setName.toUpperCase()).style({
              "fill-opacity": 1,
            });
          });
        })
        .attr("title", label);

      selected.on("mouseout", function (d) {
        allSetsNames.forEach((setName) => {
          d3.select("#elipse" + setName.toUpperCase()).style({
            "fill-opacity": globalOpacity,
          });
          d3.select("#label" + setName.toUpperCase()).style({
            "fill-opacity": 1,
          });
          d3.select("#total" + setName.toUpperCase()).style({
            "fill-opacity": 1,
          });
        });
      });
    }
  }

  /**
   * @description Applies the global opacity on ellipses and texts.
   */
  updateOpacity() {
    const { nWay, opacity: globalOpacity, fontOpacity: globalFontOpacity } = this.config;
    for (var i = 0; i < nWay; i++) {
      var setname = this.setIDs[i];
      d3.select("#elipse" + setname).style("fill-opacity", globalOpacity);
      d3.select("#label" + setname).style("fill-opacity", globalFontOpacity);
      d3.select("#total" + setname).style("fill-opacity", globalFontOpacity);
    }
  }

  /**
   * @description Applies the function changeColor(setname) to all shapes of the diagram.
   */
  updateColors() {
    for (var i = 0; i < this.config.nWay; i++) {
      var setname = this.setIDs[i];
      var ellipse = d3.select("#elipse" + setname);
      if (ellipse != null) {
        this.changeColor(setname);
      }
    }
  }

  /**
   * @description Changes the color of a shape, that represents "setname", based on the color selected by the user in the website (color picker).
   * @param {string} setname The name (id) of a set.
   */
  changeColor(setname) {
    const { colors, fontOpacity: globalFontOpacity, opacity: globalOpacity} = this.config;

    let color = colors.length > 0 ? d3.rgb('#' + colors[this.setIDs.findIndex(x => x === setname)]) : false;

    if (this.config.unions.length > 0) {
      const union = this.config.unions.find(x => x.includes(setname));
      union?.split('').forEach((setID, i) => {
        if (!colors[i] && d3.select(('#elipse' + setID))[0][0]) {
          color = d3.select(('#elipse' + setID)).style("fill");
        }
      })
    }

    let darker = d3.rgb(color)?.darker(0.3);

    if (color) {
      d3.select("#elipse" + setname)
      .style("fill", color.toString())
      .style("fill-opacity", globalOpacity);

      d3.select("#label" + setname)
      .style("fill", darker.toString())
      .style("fill-opacity", globalFontOpacity);

      d3.select("#total" + setname)
        .style("fill", darker.toString())
        .style("fill-opacity", globalFontOpacity);
    }

  }

  /**
   * @description Updates the values (numbers) that are shown in the diagram. Identifies all the possible intersections and set a new numeric text to it.
   */
  updateDiagram() {
    const { fontSize: globalfontsize, nWay, showPercentage: probability } = this.config
    var fontsize = globalfontsize;
    if (nWay == 5) {
      fontsize = globalfontsize - 5;
    }
    if (nWay == 6) {
      fontsize = globalfontsize - 10;
    }
    const setsVector = this.sets.map(obj => obj.set);
    const totalSetSize = setService.getUnionOfAllSets(setsVector).size;

    for (var i = 0; i < this.labelsDiagram.length; i++) {
      var id = "#" + this.labelsDiagram[i];
      var size = this.intersectionsSet[this.labelsDiagram[i].toUpperCase()]?.length || 0;
      const selected = d3.select(id);

      let translateX = 7;
      if (nWay === 5) translateX += 3;
      if (probability && !isNaN(new Number(size))) {
        translateX += 3;
        selected
          .text(" " + setService.getPercentageString(size, totalSetSize) + " ")
          .attr("transform", `translate(${translateX},0)`)
          .style("font-size", fontsize.toString() + "px")
          .style("text-anchor", "middle");
      } else {
        selected
          .text(" " + size + " ")
          .attr("transform", `translate(${translateX},0)`)
          .style("font-size", fontsize.toString() + "px")
          .style("text-anchor", "middle");
      }

      //        }
    }
  }

  /**
   * @description Updates the texts that indicates the size of each set.
   */
  updateLabelsSizes() {
    for (var i = 0; i < this.config.nWay; i++) {
      var s = this.setIDs[i];
      var size = this.sets[i]?.set.length || 0;
      d3.select("#total" + s).text("(" + size + ")");
    }
  }

  get intersectionsSet() {

    const intersectionsSet = {};
    //Union of all sets
    const sets = [];
    this.sets.forEach(x => sets.push(...x.set));
    var totalSet = Array.from(new Set(sets));

    //Hash of sets; easy way to know if an element is in a set or not
    var hash = {};
    for (var i = 0; i < this.config.nWay; i++) {
      const id = this.setIDs[i];
      hash[id] = {};
    }

    for (var i = 0; i < this.sets.length; i++) {
        for (var j = 0; j < this.sets[i].set.length; j++) {
            hash[this.sets[i].id][this.sets[i].set[j]] = true;
        }
    }

    //computes all possible intersections
    for (var j = 0; j < totalSet.length; j++) {
        var intersectionID = "";
        var currentElement = totalSet[j];
        for (var k = 0; k < this.sets.length; k++) {
            if (hash[this.sets[k].id][currentElement] == true) {
                intersectionID = intersectionID + this.sets[k].id;
            }
        }
        if (intersectionsSet[intersectionID] == null) {
            intersectionsSet[intersectionID] = [];
        }
        intersectionsSet[intersectionID].push(currentElement);
    }
    return intersectionsSet;

  }

}