import setService from "./SetService.js";

// TODO: refactor to an exportable class
// TODO: refactor so that only svg elements are manipulated by loadDiagram and javascript .js manipulates the dom elements
// TODO: remove merging logic and migrate to javascript.js
// TODO: separate out dendrogram maintenance/creation - this should be a separate function
/**
 * TODO: refactor Diagram constructor to accept three input objects, sets: Array, unions: Array, and config: Object, and remove dependencies on global variables and merging
 *
 * Sample input formats:
 *
 * sets: [
 *  'A': { id: 'A', data: [], label: 'My Set Label'},
 *  'B': { id: 'B', data: [], label: 'Another Set Label'},
 *  'C': { id: 'C', data: [], label: 'Third Label'},
 *  'D': { id: 'D', data: [], label: 'Fourth Label'},
 * ]
 *
 * unions: [ ca, db ]
 *
 * config: {
 *   nWay: 6,
 *   fontSize: 12,
 *   fontOpacity: 1,
 *   opacity: 0.2,
 *   showPercentage: false,
 *
 * }
 *
 * */
// TODO: build path parser to parse unions
// TODO: refactor Diagram to export an SVGElement
// TODO: consolidate list and tree methods

export default class Diagram {

  /**
   * @description Loads a diagram and process everything based on it.
   * @param {string} path The path of a .svg diagram
   */
  loadNewDiagram(path) {
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

      diagramReady = false;

      var node = document.getElementById("diagram");

      if (node != null) {
        node.parentNode.removeChild(node);
      }

      d3.select("#diagramframe").node().appendChild(importedNode);
      diagramReady = true;

      d3.select(importedNode)
        .attr("viewBox", "0 0 700 700")
        .attr("align", "center")
        .attr("width", "600")
        .attr("height", "578");

      var vtemp = d3.selectAll("text")[0];

      labelsDiagram = [];
      for (var j = 0; j < vtemp.length; j++) {
        var str = vtemp[j].textContent;
        if (
          vtemp[j].id.substring(0, 5) != "label" &&
          vtemp[j].id.substring(0, 5) != "total" &&
          str != "(total)"
        ) {
          labelsDiagram.push(str);

          var el = document.getElementById(str);
          el.onclick = function (e) {
            var node = e.target;
            var id = node.id.toUpperCase();

            var textName = "<b>[";
            textName = textName + document.getElementById("name" + id[0]).value;
            for (var i = 1; i < id.length; i++) {
              textName =
                textName +
                "] and [" +
                document.getElementById("name" + id[i]).value;
            }
            textName = textName + "]";
            textName = textName.replace(/:/g, "-");
            var strIntersection = textName + ":</b></br>";

            for (var t = 0; t < intersectionsSet[id].length; t++) {
              strIntersection =
                strIntersection + intersectionsSet[id][t] + "</br>";
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

      updateActiveSetsList();

      updateLabelsSizes();
      updateSetsLabelsList();
      $(document).ready(updateDiagram());
      if (!merging) {
        $(document).ready(updateColorBox());
      }

      $(document).ready(updateColors());
      $(document).ready(updateOpacity());

      setMouseOverIntersectionsLabels();
    });
  }

  /**
   * @description Updates the sets and sets' labels given the texts inputs in the web interface.
   */
  updateActiveSets() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
      modified = true;
      updateSets(originalAllSetsNames[i]);
      updateSetLabelList(originalAllSetsNames[i]);
    }
  }

  /**
   * @description Updates the label of a set in the diagram given the label typed by the user on the web interface.
   * @param {string} setID The set ID.
   */
  updateSetLabel(setID) {
    var text = document.getElementById("name" + setID).value;
    d3.select("#label" + setID).text(text.replace(/:/g, "-"));
    //console.log(updateDendrogram, typeof updateDendrogram);
    //if (typeof updateDendrogram !== undefined) { updateDendrogram();}
  }

  /**
   * @description Updates the label of all sets in the diagram given the labels typed by the user on the web interface.
   */
  updateSetsLabels() {
    for (var i = 0; i < nWay; i++) {
      updateSetLabelList(allPossibleSetsNames[i]);
    }
  }

  setMouseOverIntersectionsLabels() {
    for (var i = 0; i < labelsDiagram.length; i++) {
      const label = labelsDiagram[i];
      selected = d3.select("#" + label);

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
    for (var i = 0; i < nWay; i++) {
      var setname = originalAllSetsNames[i];
      d3.select("#elipse" + setname).style("fill-opacity", globalOpacity);
      d3.select("#label" + setname).style("fill-opacity", globalFontOpacity);
      d3.select("#total" + setname).style("fill-opacity", globalFontOpacity);
    }
  }

  /**
   * @description Updates all colorPickers' colors.
   */
  updateColorBox() {
    for (var i = 0; i < nWay; i++) {
      var setname = originalAllSetsNames[i];
      var boxname = "color" + setname;
      var myPicker = new jscolor.color(document.getElementById(boxname), {});
      var color = d3.rgb(d3.select("#elipse" + setname).style("fill")).toString();
      myPicker.fromString(color);
    }
  }

  /**
   * @description Applies the function changeColor(setname) to all shapes of the diagram.
   */
  updateColors() {
    for (var i = 0; i < nWay; i++) {
      var setname = originalAllSetsNames[i];
      var ellipse = d3.select("#elipse" + setname);
      if (ellipse != null) {
        changeColor(setname);
      }
    }
  }

  /**
   * @description Changes the color of a shape, that represents "setname", based on the color selected by the user in the website (color picker).
   * @param {string} setname The name (id) of a set.
   */
  changeColor(setname) {
    var myPicker = new jscolor.color(
      document.getElementById("color" + setname),
      {}
    );
    d3.select("#elipse" + setname)
      .style("fill", d3.rgb("#" + myPicker.toString()))
      .style("fill-opacity", globalOpacity);
    var darker = d3.rgb("#" + myPicker.toString()).darker(globalDarker);
    var black = d3.rgb(0, 0, 0);
    d3.select("#label" + setname)
      .style("fill", darker)
      .style("fill-opacity", globalFontOpacity);
    d3.select("#total" + setname)
      .style("fill", darker)
      .style("fill-opacity", globalFontOpacity);
  }

  /**
   * @description Updates the values (numbers) that are shown in the diagram. Identifies all the possible intersections and set a new numeric text to it.
   */
  updateDiagram() {
    var fontsize = globalfontsize;
    if (nWay == 5) {
      fontsize = globalfontsize - 5;
    }
    if (nWay == 6) {
      fontsize = globalfontsize - 10;
    }
    const setsVector = allSetsNames.map((name) => sets[name]);
    const totalSetSize = setService.getUnionOfAllSets(setsVector).size;

    for (var i = 0; i < labelsDiagram.length; i++) {
      var id = "#" + labelsDiagram[i];
      var size = getIntersection(labelsDiagram[i]);
      selected = d3.select(id);
      //        if (selected.node().textContent != str) {
      //.style("font-size","4").transition().delay(function(){i*5}).duration(50)
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
    for (var i = 0; i < originalAllSetsNames.length; i++) {
      var s = originalAllSetsNames[i];
      var size = sets[s].length;
      d3.select("#total" + s).text("(" + size + ")");
    }
  }

}