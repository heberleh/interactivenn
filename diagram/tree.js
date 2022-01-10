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

var tree = null;
var maxLevel = 0;
var currentLevel = maxLevel;
var exampletree = [];
var currentCode = "";
exampletree["2"] = "(A,B)";
exampletree["3"] = "((A,B),C)";
exampletree["4"] = "((A,(B,C)),D)";
exampletree["5"] = "((A,((D,E),C)),B)";
exampletree["6"] = "((A,((D,(F,E)),C)),B)";


var dendrogramtree = null;

/**
 * @description Navigates in the possible unions identifiers. For instance a list of [ab, abc, ad...] that represents all unions that will be showed to the user when he navigate through diagrams of unions.
 */
function Tree() {
    this.count = 0;
    this.increment = function () {
        this.count++;
    };
    this.getCurrentNode = function () {
        return this.current;
    };
    this.getRoot = function () {
        return this.root;
    };
    this.setCurrentNode = function (node) {
        this.current = node;
    };
    this.getSize = function () {
        return this.count;
    };
    this.maxLevel = 0;
    this.getMaxLevel = function () {
        return this.maxLevel;
    };
    this.root = new Node(this);
    this.current = this.root;
    this.levelNames = {};
    this.levelsSearch = function () {
        C = [this.getRoot()];
        var count = 0;
        var level = 0;
        var F = C;
        //enquanto nao leu todos os nos
        while (count < this.getSize()) {
            C = F;
            F = [];
            var labels = [];
            for (var i = 0; i < C.length; i++) {
                if (C[i].getRight() != null) {
                    F.push(C[i].getRight());
                }
                if (C[i].getLeft() != null) {
                    F.push(C[i].getLeft());
                }

                labels.push(C[i].getLabel());
                count++;
            }

            this.levelNames[level] = labels;
            level++;
            this.maxLevel = level;
        }
        this.maxLevel--;
    };

    this.getNameFromLevel = function (level) {

        //originalmente level ia ser pego diretamente, com a árvore, então, começando pela raiz e terminando nas folhas
        // com a modificação proposta pelo guilherme, a árvore no site vai primeiro mostrar as folhas, e por último a raiz.
        // portanto, o level aqui será inverso. No level 0, será N-0, no level 1, será N-1, e no level N será zero.        
        level = this.maxLevel - level;
        //a única diferença da versão anterior é a adição desta linha acima.



        if (level == this.maxLevel) {
            return "";
        }

        var list = [];
        var name;
        for (var i = 0; i < this.levelNames[level].length; i++) {
            name = this.levelNames[level][i];
            if (name.length > 1) {
                var listname = name.split("");
                listname.sort();
                list.push(listname.join(""));
            }
        }
        list.sort();
        return "_" + list.join("_");
    };
}

var jsonTree = {};

function printTreeJSON(node) {
    var str = '{\"name\": \"' + node.name + '\"';
    //se há filhos nesse nó
    if (node.children != null && node.children.length > 0) {
        str = str + ", \"children\": [";
        for (var i = 0; i < node.children.length; i++) {
            str += printTreeJSON(node.children[i]);
            if (i < (node.children.length - 1)) {
                str += ",";
            }
        }
        str = str + "]";
    }
    str = str + "}";
    return str;
}

/**
 * @description Decodes the string str and identifies the unions. If the web interface is related to "Slider/List" version, the code is similar to this: "ab; cd,ef; abc,de; abcd,ef; ab,cd,ef". If the web interface is related to "Tree" version, the code is similar to this: "((A,((D,(F,E)),C)),B)".
 * @param {string} str The string given by the user.
 */
function decodeTree(str) {
    str = str.toUpperCase();
    var strsize = str.length;
    var dict = [',', ')', '('].concat(originalAllSetsNames);
    tree = new Tree();

    var current = {name: 'root', children: []};
    jsonTree = current;

    for (var i = 0; i < strsize; i++) {
        var token = str[i];
        if (!(dict.contains(token))) {
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
                current.name = token;
                break;
        }
    }
    var treeJsonStr = printTreeJSON(jsonTree);
    //console.log(treeJsonStr);
    dendrogramtree = JSON.parse(treeJsonStr);
//    console.log(jsonTree);
//    console.log(printTreeJSON(jsonTree, treeJsonStr));
}



function showHideDendrogram() {
    if (d3.select("#dendrogram").html() == "") {
        if (dendrogramtree != null) {
            dendrogram(dendrogramtree);
            d3.select("#exportDendrogram").html("<label style=\"font-family: Sans-serif; font-size: 12px;\">\n\
<input style=\"font-family: Sans-serif; font-size: 12px;\" type=\"text\" class=\"filename\" id=\"dendrogram_name\" size=\"23\" \n\
placeholder=\"Write file name here\"/>\n\
<select id=\"dendrogramformat\" name=\"format\" form=\"format\" style=\"font-size: 12px;\">\n\
<option value=\".svg\">.svg</option>\n\
<option value=\".png\">.png</option>\n\
</select>\n\
</label>    \n\
<button style=\"font-family: Sans-serif; font-size: 12px;\"  value=\"Save\" type=\"button\" onclick=\"exportDendrogram()\">Export</button></br>");
        }
    } else {
        d3.select("#dendrogram").html("");
        d3.select("#exportDendrogram").html("");
    }
}

function updateDendrogram() {
    if (d3.select("#dendrogram").length > 0 && d3.select("#dendrogram").html() != "") {
        if (dendrogramtree != null) {
            dendrogram(dendrogramtree);
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
            var myPicker = new jscolor.color(document.getElementById("color" + d.name), {});
            return d3.rgb("#" + myPicker.toString()).darker(globalDarker);
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


function exportDendrogram() {
    var serializer = new XMLSerializer();
    var svg = document.getElementById("dendrogram_diagram");

//    d3.select("diagram").attr("width", x).attr("height", y);

    var chooser = document.getElementById("dendrogramformat");
    var choosen_type = chooser.options[chooser.selectedIndex].value;
    var serialized = serializer.serializeToString(svg);
    var new_blob = new Blob([serialized], {type: "image/svg+xml;charset=" + document.characterSet});
    var document_name = document.getElementById("dendrogram_name").value + choosen_type;
    if (choosen_type == ".svg") {
        //alert("Saving diagram as "+document_name+". It may take some seconds.");        
        saveAs(new_blob, document_name);
        return false;
    } else {
        if (choosen_type == ".png") {

            var image = new Image();
            image.src = 'data:image/svg+xml;base64,' + window.btoa(serialized);
            image.onload = function () {
                var scale = 2;
                var canvas = document.createElement('canvas');
                canvas.width = image.width * scale;
                canvas.height = image.height * scale;


                var context = canvas.getContext('2d');
                context.scale(scale, scale);
                context.drawImage(image, 0, 0);
                // set to draw behind current content
                context.globalCompositeOperation = "destination-over";

                // set background color
                context.fillStyle = '#FFFFFF'; // <- background color

                // draw background / rect on entire canvas
                context.fillRect(0, 0, canvas.width, canvas.height);

                var a = document.createElement('a');
                a.download = document_name;
                a.href = canvas.toDataURL('image/png');
                document.body.appendChild(a);
                a.click();
            }
            return false;
        }
    }
}






function Node(tree, root) {
    this.left = null;
    this.right = null;
    this.label = "";
    this.tree = tree;
    this.tree.setCurrentNode(this);
    this.root = root;
    this.getRoot = function () {
        return this.root;
    };
    this.setRight = function (node) {
        this.right = node;
    };
    this.setLeft = function (node) {
        this.left = node;
    };
    this.getRight = function () {
        return this.right;
    };
    this.getLeft = function () {
        return this.left;
    };
    this.setLabel = function (label) {
        this.label = label;
    };
    this.getLabel = function () {
        return this.label;
    };
}


/**
 * @description Updates the label of a set in the diagram given the label typed by the user on the web interface.
 * @param {string} setID The set ID.
 */
function updateSetLabelTree(setID) {
    var text = document.getElementById("name" + setID).value;
    d3.select("#label" + setID).text(text.replace(/:/g, '-'));
    updateDendrogram();
}

/**
 * @description Updates the label of all sets in the diagram given the labels typed by the user on the web interface.
 */
function updateSetsLabelsTree() {
    for (var i = 0; i < nWay; i++) {
        updateSetLabel(allPossibleSetsNames[i]);
    }
}


/**
 * @description Updates the sets and sets' labels given the texts inputs in the web interface.
 */
function updateActiveSetsTree() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        modified = true;
        updateSets(originalAllSetsNames[i]);
        updateSetLabel(originalAllSetsNames[i]);
    }

}
/**
 * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
 */
function mergeSetsDownTree() {
    //document.getElementById("updateMerge").disabled = true;
    //document.getElementById("updateMerge").text("Stop");
    //started=true;

    document.getElementById("downMerge").disabled = true;
    document.getElementById("upMerge").disabled = true;
    if (currentLevel < tree.getMaxLevel()) {
        currentLevel++;
        mergeSetsTree(currentLevel);
    }
}

/**
 * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
 */
function mergeSetsUpTree() {
    //document.getElementById("updateMerge").disabled = true;

    //document.getElementById("updateMerge").text("Stop");
    //started=true;
    document.getElementById("downMerge").disabled = true;
    document.getElementById("upMerge").disabled = true;
    if (currentLevel > 0) {
        currentLevel--;
        mergeSetsTree(currentLevel);
    }
}

/**
 * @description Loads a diagram and process everything based on it. 
 * @param {string} path The path of a .svg diagram
 */
function loadNewDiagramTree(path) {

    d3.xml(path, "image/svg+xml", function (xml) {


        try {
            importedNode = document.importNode(xml.documentElement, true);
        } catch (err) {
            alert("\nDiagram not found: " + path + "\n\n Error: " + err.message + ". Please report it to henry at icmc.usp.br\n\n");
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
            console.log(vtemp[j].class);
            if (vtemp[j].id != null && vtemp[j].id != "" && vtemp[j].id.substring(0, 5) != "label" && vtemp[j].id.substring(0, 5) != "total" && str != "(total)") {

                labelsDiagram.push(str);

                var el = document.getElementById(str);
                el.onclick = function (e) {
                    var node = e.target;
                    var id = node.id.toUpperCase();

                    var textName = "<b>[";
                    textName = textName + document.getElementById("name" + id[0]).value;
                    for (var i = 1; i < id.length; i++) {
                        textName = textName + "] and [" + document.getElementById("name" + id[i]).value;
                    }
                    textName = textName + "]";
                    textName = textName.replace(/:/g, '-');
                    var strIntersection = textName + ":</b></br>";

                    for (var t = 0; t < intersectionsSet[id].length; t++)
                    {
                        strIntersection = strIntersection + intersectionsSet[id][t] + "</br>";
                    }

                    var htmlp = "<p>" + strIntersection + "</p>";


                    var newWindow = window.open("", id, 'scrollbars=yes,toolbar=no,menubar=no,status=no,directories=no,location=no,width=400,height=400');
                    newWindow.document.write(htmlp);
                };

            }
            ;
        }

        updateActiveSetsTree();
        if (merging) {
            updateDiagram();
        } else {
            d3.selectAll(".elipse").attr("visibility", "hidden");
            d3.selectAll("text").attr("visibility", "hidden");
        }
        var delay = 0;
        var duration = 0;

        d3.selectAll(".elipse").transition().delay(delay).duration(duration).attr("visibility", "visible");
        d3.selectAll("text").transition().delay(delay).attr("visibility", "visible").style("font-family", "Arial");

        d3.select("#updateDiagrambutton").transition().delay(delay).style("display", 'inline');

        //document.getElementById("updateMerge").disabled = false;

        if (merging) {
            if (currentLevel >= tree.getMaxLevel()) {
                document.getElementById("downMerge").disabled = true;
            } else {
                document.getElementById("downMerge").disabled = false;
            }
            if (currentLevel <= 0) {
                document.getElementById("upMerge").disabled = true;
            } else {
                document.getElementById("upMerge").disabled = false;
            }
        } else {
            document.getElementById("upMerge").disabled = true;
            document.getElementById("downMerge").disabled = true;
        }
        updateLabelsSizes();
        updateSetsLabels();
        $(document).ready(updateDiagram());
        if (!merging) {
            $(document).ready(updateColorBox());
        }
        $(document).ready(updateColors());
        $(document).ready(updateOpacity());


        // d3.selectAll("path").on('mouseover', function (d) {
        //     d3.select(this).style({"fill-opacity": globalOpacity + 0.2});
        // })
        // d3.selectAll("path").on('mouseout', function (d) {
        //     d3.select(this).style({"fill-opacity": globalOpacity});
        // })
        setMouseOverIntersectionsLabels();
    });

}


/**
 * @description Merges the sets of a given union code. Argument is actually a index of a union code in the union codes list.
 * @param {numeric} index The index of a union in the list of unions. For instance, if the list is [ab, abc, ad] the index 0 gives you the union code "ab".
 */
function mergeSetsTree(level) {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        var s = originalAllSetsNames[i];
        var list = document.getElementById("input" + s).value.split("\n");

        for (var t = 0; t < list.length; t++)
        {
            list[t] = list[t].replace(/^\s+/g, "");
            list[t] = list[t].replace(/\s+$/g, "");
        }
        list = list.subtract(["", "\n", " ", "  ", "   "]);
        sets[s] = list;
    }

    if (!merging) {
        var code = getCode();
        decodeTree(code);
        maxLevel = tree.getMaxLevel();
        tree.levelsSearch();
        merging = true;
    }

    decoded = tree.getNameFromLevel(level);

    var totalSet = [];
    var hashtotal = {};
    d3.select("#updateDiagrambutton").style("display", 'none');

    for (var i = 0; i < originalAllSetsNames.length; i++) {
        document.getElementById("input" + originalAllSetsNames[i]).disabled = true;
    }

    //UNION of sets                        
    var part = decoded.toUpperCase().split("_");
    for (var i = 0; i < part.length; i++) {
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

    var path = "./diagrams/" + nWay + "/" + nWay + "waydiagram" + decoded.toLowerCase() + ".svg";

    //document.getElementById("downMerge").disabled = false;
    //document.getElementById("upMerge").disabled = false;

    loadNewDiagramTree(path);

}

