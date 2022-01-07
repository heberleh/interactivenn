import { d3 } from "../d3/d3.v2.js";
import InteractiVenn from "../javascript.js";
import { intersections, intersectionsSet, SetService } from '../utils/SetService.js';

// Author Henry Heberle, 2015
// henry at icmc . usp . br
//
// This file is part of InteractiVenn.
//
// InteractiVenn is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// InteractiVenn is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with InteractiVenn. If not, see <http://www.gnu.org/licenses/>.



// Those that have employed the tool InteractiVenn should mention:
//
// Heberle, H.; Meirelles, G. V.; da Silva, F. R.; Telles, G. P.; Minghim, R. InteractiVenn: a web-based tool for the analysis of sets through Venn diagrams. BMC Bioinformatics 16:169 (2015).
// 
// http://doi.org/10.1186/s12859-015-0611-3
// https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-015-0611-3
// http://www.interactivenn.net/

export class SetsImage extends React.Component {

    constructor(props) {
        super(props);
        this.diagramRef = React.createRef();
    }

    render() {
        const element = React.createElement;

        return (
        element('div', { id: "diagramFrame", ref: this.diagramRef })
        )
    }

    componentDidMount() {
        const { allSetsIDs, colors, dataSets, diagramConfig, type } = this.props;
        createDiagram({ allSetsIDs, colors, dataSets, diagramConfig, type });
    }

    componentDidUpdate() {
        const { allSetsIDs, colors, dataSets, diagramConfig, type } = this.props;
        createDiagram({ allSetsIDs, colors, dataSets, diagramConfig, type });
    }

}

/**
 * @description Updates all colorPickers' colors.
 */
function createDiagram({ allSetsIDs, colors, dataSets, diagramConfig, type }) {

    const { nWay, isMerging, path } = diagramConfig;

    d3.xml(path, "image/svg+xml", function (xml) {

        let importedNode;

        try {
            importedNode = document.importNode(xml.documentElement, true);
        } catch (err) {
            alert("\nDiagram not found: " + path + "\n\n Error: " + err.message + ". Please report it to henry at icmc.usp.br\n\n");
        }

        const node = d3.select("#diagramFrame").node();
        if (node && node.firstChild) {
            node.removeChild(node.firstChild);
        }

        d3.select("#diagramFrame").node().appendChild(importedNode);

        d3.select(importedNode)
            .attr("viewBox", "0 0 700 700")
            .attr("align", "center")
            .attr("width", "600")
            .attr("height", "578");

        var vtemp = d3.selectAll("text")[0];

        const labelsDiagram = [];
        for (var j = 0; j < vtemp.length; j++) {
            var str = vtemp[j].textContent;
            var tempId = vtemp[j].id;

            if (!tempId.includes("label") && !tempId.includes("total") && str != "(total)") {

                labelsDiagram.push(tempId);

                var el = document.getElementById(tempId);
                el.onclick = function (e) {
                    var node = e.currentTarget;
                    var id = node.id.toUpperCase();

                    var textName = "<b>[";
                    textName = textName + document.getElementById("name" + id[0]).value;
                    for (var i = 1; i < id.length; i++) {
                        textName = textName + "] and [" + document.getElementById("name" + id[i]).value;
                    }
                    textName = textName + "]";
                    textName = textName.replace(/:/g, '-');
                    var strIntersection = textName + ":</b></br>";

                    const length = intersectionsSet.hasOwnProperty(id) ? intersectionsSet[id].length : 0;
                    
                    for (var t = 0; t < length; t++)
                    {
                        strIntersection = strIntersection + intersectionsSet[id][t] + "</br>";
                    }
                    if (length === 0) {strIntersection += "There are no intersections among these Sets."};

                    var htmlp = "<p>" + strIntersection + "</p>";

                    var newWindow = window.open("", id, 'scrollbars=yes,toolbar=no,menubar=no,status=no,directories=no,location=no,width=400,height=400');
                    newWindow.document.write(htmlp);
                }
            };
        }

        d3.select("#updateDiagrambutton").transition().delay(0).style("display", 'inline');

        updateLabelsSizes({ allSetsIDs, dataSets });
        updateSetsLabels({ allSetsIDs, type, dataSets });

        $(document).ready(updateDiagram({ diagramConfig, allSetsIDs, dataSets, labelsDiagram }));

        $(document).ready(updateColors({ allSetsIDs, diagramConfig, colors }));
        $(document).ready(updateOpacity({ allSetsIDs, diagramConfig} ));

        setMouseOverIntersectionsLabels({ labelsDiagram, allSetsIDs, diagramConfig });
        
    });
}

function updateDendrogram() {
    if (d3.select("#dendrogram").html() != "") {
        if (this.props.dendrogramtree != null) {
            dendrogram(this.props.dendrogramtree);
        }
    }
  }
  
  
  function dendrogram(data) {
  
    var width = 600;
    var height = 400;
    var cluster = d3.layout.cluster()
            .size([height, width - 300]);
    var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });
  
    d3.select("#dendrogram").html("");
    var svg2 = d3.select("#dendrogram").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "dendrogram_diagram")
            .append("g")
            .attr("transform", "translate(100,0)");
  
    var nodes = cluster.nodes(data);
    var links = cluster.links(nodes);
    var link = svg2.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", "1.5px")
            .attr("d", diagonal);
    var node = svg2.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
    node.append("circle")
            .style("fill", "#fff")
            .style("stroke", "#B8B8B8")
            .style("stroke-width", "1.5px")
            .attr("r", 4.5);
    node.append("text")
            .attr("dx", function (d) {
                return d.children ? -8 : 8;
            })
            .attr("dy", 3)
            .attr("class", "dendrogram")
            .style("text-anchor", function (d) {
                return d.children ? "end" : "start";
            })
            .text(function (d) {
                if (d.name.length == 1) {
                    return d.name + ": " + d3.select("#label" + d.name).text();
                }
                return d.name;
            }).attr("fill", function (d) {
        if (d.name.length == 1) {
            //var myPicker = new jscolor.color(document.getElementById("color" + d.name), {});
            //return d3.rgb("#" + myPicker.toString()).darker(state.globalDarker);
        } else {
            return d3.rgb("#818181");
        }
    }).style("font-size", function (d) {
        if (d.name.length != 1) {
            return "15px"
        } else {
            return "20px";
        }
    });
  }
  
/**
 * @description Updates all colorPickers' colors.
 */
 function setColor(datasetID, diagramConfig, color) {
    d3.select("#elipse" + datasetID).style("fill", d3.rgb(color)).style("fill-opacity", diagramConfig.opacity);
    var darker = d3.rgb(color).darker(diagramConfig.darker);
    d3.select("#label" + datasetID).style("fill", darker).style("fill-opacity", diagramConfig.fontOpacity);
    d3.select("#total" + datasetID).style("fill", darker).style("fill-opacity", diagramConfig.fontOpacity);

  }

/**
 * @description Applies the function changeColor(setname) to all shapes of the diagram.
 */
function updateColors({ allSetsIDs, diagramConfig, colors }) {
    for (var i = 0; i < allSetsIDs.length; i++) {
        var datasetID = allSetsIDs[i];
        var ellipse = d3.select("#elipse" + datasetID);
        if (ellipse) {
          const color = colors[datasetID];
          setColor(datasetID, diagramConfig, color);
        }
    }
  }

/**
* @description Updates the values (numbers) that are shown in the diagram. Identifies all the possible intersections and set a new numeric text to it.
*/
function updateDiagram({ diagramConfig, allSetsIDs, dataSets, labelsDiagram }) {
    let { fontSize } = diagramConfig;
    const { nWay, showPercentage } = diagramConfig;
  
    if (nWay == 5) {
        fontSize -= 5;
    }
    if (nWay == 6) {
        fontSize -= 10;
    }
    const setService = new SetService(allSetsIDs, dataSets);
    const setsVector = allSetsIDs.map(name => dataSets[name].data);
    const totalSetSize = setService.getUnionOfAllSets(setsVector).size;

    for (var i = 0; i < labelsDiagram.length; i++) {
        var id = "#" + labelsDiagram[i];
        var size = getIntersection(labelsDiagram[i]);
        const selected = d3.select(id);
        let translateX = 7;
        if(nWay===5) translateX += 3;
        let newText = showPercentage && !isNaN(new Number(size)) ? setService.getPercentageString(size, totalSetSize) : size;
        
        const hasTspan = selected?.select("tspan").length > 0;

        if (hasTspan) {
            selected.select("tspan").text(" " + newText + " ");
            selected.attr("transform",`translate(${translateX},0)`)
                .style("font-size", fontSize + "px")
                .style("font-family", 'Sans-serif')
                .style("text-anchor","middle");
        } else {
            selected?.text(" " + newText + " ")
            .attr("transform",`translate(${translateX},0)`)
            .style("font-size", fontSize.toString() + "px")
            .style("font-family", 'Sans-serif')
            .style("text-anchor","middle");
        }
    }
}

/**
* @description Gets the intersection elements.
* @param {string} intersectionID The intersection id, for instance "ab"
*/
function getIntersection(intersectionID) {
    var intersectionsize = intersections[intersectionID.toUpperCase()];
    if (intersectionsize == null) {
        intersectionsize = 0;
    }
  
    return intersectionsize;
  }
  
/**
* @description Updates the texts that indicates the size of each set.
*/
function updateLabelsSizes({ allSetsIDs, dataSets }) {
    for (var i = 0; i < allSetsIDs.length; i++) {
        var datasetID = allSetsIDs[i];
        var size = dataSets[datasetID].data.length;
        d3.select("#total" + datasetID).text("(" + size + ")")
            .style("font-family", "Sans-serif")
            .style("margin-top", "3px");
    }
  }

/**
* @description Applies the global opacity on ellipses and texts.
*/
function updateOpacity({ allSetsIDs, diagramConfig }) {
    for (var i = 0; i < allSetsIDs.length; i++) {
        var setname = allSetsIDs[i];
        const elipse = d3.select("#elipse" + setname)
        if (elipse) elipse.style("fill-opacity", diagramConfig.opacity);
        const label = d3.select("#label" + setname);
        if (label) label.style("fill-opacity", diagramConfig.fontOpacity);
        const total = d3.select("#total" + setname);
        if (total) total.style("fill-opacity", diagramConfig.fontOpacity);
    }
}
  
/**
 * @description Updates the label of all sets in the diagram given the labels typed by the user on the web interface.
 */
function updateSetsLabels({ allSetsIDs, type, dataSets }) {
    for (let i = 0; i < allSetsIDs.length; i++) {
        const datasetID = allSetsIDs[i];
        const text = dataSets[datasetID].label;

        d3.select("#label" + datasetID).text(text.replace(/:/g, '-'))
            .style("font-family", 'Sans-serif')
        ;
        if (type === 'tree') updateDendrogram();
    }
}

function setMouseOverIntersectionsLabels({ labelsDiagram, allSetsIDs, diagramConfig }){
    for (var i = 0; i < labelsDiagram.length; i++) {        
        const label =  labelsDiagram[i];  
        const selected = d3.select("#"+label);
        
        selected.on('mouseover', function (d) {
          allSetsIDs.forEach(datasetID=>{
                d3.select("#elipse"+datasetID.toUpperCase())
                    .style({"fill-opacity": 0})
                    .style({"padding": "5px"})
                d3.select("#label"+datasetID.toUpperCase())
                    .style({"fill-opacity": 0.2}); 
                d3.select("#total"+datasetID.toUpperCase())
                    .style({"fill-opacity": 0.2});   
            });      
            
            label.split("").forEach(datasetID=>{
                d3.select("#elipse"+datasetID.toUpperCase()).style({"fill-opacity": diagramConfig.opacity + 0.2});
                d3.select("#label"+datasetID.toUpperCase())
                    .style({"fill-opacity": 1}); 
                d3.select("#total"+datasetID.toUpperCase())
                    .style({"fill-opacity": 1});   
  
            })                  
        }).attr("title",label);
        
        selected.on('mouseout', function (d) { 
          allSetsIDs.forEach(datasetID=>{
                d3.select("#elipse"+datasetID.toUpperCase()).style({"fill-opacity": diagramConfig.opacity })
                d3.select("#label"+datasetID.toUpperCase())
                    .style({"fill-opacity": 1}); 
                d3.select("#total"+datasetID.toUpperCase())
                    .style({"fill-opacity": 1});   
            });         
        })
  
    }
  }