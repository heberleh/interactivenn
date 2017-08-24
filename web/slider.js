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
//
//
// Those that have employed the tool InteractiVenn should mention:
//
// InteractiVenn: a web-based tool for the analysis of sets through Venn diagrams
// Henry Heberle, Gabriela Vaz Meirelles, Felipe R. da Silva, Guilherme P. Telles and Rosane Minghim

var importedNode;
var bigintersectionsset = ["a", "b", "c", "d", "e", "f", "ab", "ac", "ad", "ae", "af", "bc", "bd", "be", "bf", "cd", "ce", "cf", "de", "df", "ef", "abc", "abd", "abe", "abf", "acd", "ace", "acf", "ade", "adf", "aef", "bcd", "bce", "bcf", "bde", "bdf", "bef", "cde", "cdf", "cef", "def", "abcd", "abce", "abcf", "abde", "abdf", "abef", "acde", "acdf", "acef", "adef", "bcde", "bcdf", "bcef", "bdef", "cdef", "abcde", "abcdf", "abcef", "abdef", "acdef", "bcdef"];
var originalAllSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
var allSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
var sets = {};
var original_sets = {};
var setsLabel = {};
var diagramReady = false;
var activesets = {};
var slide = null;
var maxIndex = 0;
var currentIndex = maxIndex;
var exampletree = [];
exampletree["2"] = "ab";
exampletree["3"] = "ab;ca";
exampletree["4"] = "ca,db; ab";
exampletree["5"] = "ab; cd; be,ac";
exampletree["6"] = "ab; cd,ef; abc,de; abcd,ef";
var firstLoad = true;
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};

function Slide() {
    this.count = 0;
    this.getSize = function () {
        return this.count;
    };
    this.current = 0;
    this.frames = {};

    this.addFrame = function (frameCode) {                     //alert(frameCode);
        this.frames[this.count] = frameCode;
        this.count = this.count + 1;
        this.current = this.count;
    };

    this.setCurrentFrame = function (index) {
        this.current = index;
    };

    this.levelsSearch = function () {
    };

    this.getNameFromIndex = function (index) {
        return this.frames[index];
    };

    this.getNextFrame = function () {
        if (this.current == this.count) {
            return "";
        }
        this.current = this.current + 1;
        return this.frames[this.current];
    };

    this.getPreviousFrame = function () {
        if (this.current == 0) {
            return "";
        }
        this.current = this.current - 1;
        return this.frames[this.current];
    };
}

function decode(str) {
    str = str.toUpperCase();
    //var dict = [',',')','('].concat(originalAllSetsNames);
    slide = new Slide();
    // exemplo:                 // ab; cd,ef; abc,de; abcd,ef; ab,cd,ef

    str = str.replace(" ", "");
    str = str.replace("\n", "");
    token_list = str.split(";");
    //alert(token_list);

    listsize = token_list.length;
    var tokenL;
    var token;
    for (var i = 0; i < listsize; i++) {
        subtoken_list = token_list[i].split(",");
        subtokenlist_size = subtoken_list.length;
        for (var j = 0; j < subtokenlist_size; j++) {
            tokenL = subtoken_list[j].split("");
            tokenL.sort();
            subtoken_list[j] = tokenL.join("").replace(" ", "");
        }
        //alert(subtoken_list);
        subtoken_list.sort();
        //alert(subtoken_list);

        var code = subtoken_list.join("_").replace(" ", "");
        slide.addFrame(code);
    }
}

function updateSetLabel(setID) {
    var text = document.getElementById("name" + setID).value;
    d3.select("#label" + setID).text(text.replace(/:/g, '-'));
}

function updateSetsLabels() {
    for (var i = 0; i < nWay; i++) {
        updateSetLabel(allPossibleSetsNames[i]);
    }
}

function updateSetsNames() {
    for (var j = 0; j < allSetsNames.length; j++) {
        sets[allSetsNames[j]] = [];
        original_sets[allSetsNames[j]] = [];
    }
}

updateSetsNames();
var intersections = {}; //[a:0,b:0,c:0...]  
var intersectionsSet = {}; //{ab:[gene1,gene2],bc:[gene3,gene4]}
var labelsDiagram = new Array();
var nWay = 6;
var maxNSets = 6;
var allPossibleSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
var merging = false;
function updateAllSetsNamesVector() {
    switch (nWay) {
        case 1:
            originalAllSetsNames = allSetsNames = ['A'];
            break;
        case 2:
            originalAllSetsNames = allSetsNames = ['A', 'B'];
            break;
        case 3:
            originalAllSetsNames = allSetsNames = ['A', 'B', 'C'];
            break;
        case 4:
            originalAllSetsNames = allSetsNames = ['A', 'B', 'C', 'D'];
            break;
        case 5:
            originalAllSetsNames = allSetsNames = ['A', 'B', 'C', 'D', 'E'];
            break;
        case 6:
            originalAllSetsNames = allSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
            break;
    }
}

function updateActiveSets() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        updateSets(originalAllSetsNames[i]);
        updateSetLabel(originalAllSetsNames[i]);
    }
}

function clearForms() {
    var alltextarea = d3.selectAll("textarea");
    for (var i in alltextarea) {
        alltextarea[i].value = "";
    }
    var allElementsN = d3.selectAll("elementsN");
    for (var i in allElementsN) {
        allElementsN[i].textContent = "size: 0";
    }
}


function updateNWay(newvalue) {
    merging = false;
    d3.select("#updateDiagrambutton").style("display", 'none');
    var old_nWay = nWay;
    nWay = newvalue;
    updateAllSetsNamesVector();
    updateSetsNames();
    for (var i = 0; i < nWay; i++) {
        showInput(originalAllSetsNames[i]);
    }
    for (var i = nWay; i < maxNSets; i++) {
        hideInput(allPossibleSetsNames[i]);
    }
    loadNewDiagram("./diagrams/" + nWay + "/" + nWay + "waydiagram.svg");
    document.getElementById("nway" + nWay).checked = true;

    if (old_nWay != newvalue || firstLoad) {
        document.getElementById("mergeCode").value = exampletree[newvalue];
        firstLoad = false;
    }
    if (old_nWay != newvalue) {
        firstLoad = true;
    }
}

function updateDiagram() {
    var fontsize = globalfontsize;
    if (nWay == 5) {
        fontsize = globalfontsize - 5;
    }
    if (nWay == 6) {
        fontsize = globalfontsize - 10;
    }
    for (var i = 0; i < labelsDiagram.length; i++) {
        var id = "#" + labelsDiagram[i];
        var str = getIntersection(labelsDiagram[i]);
        selected = d3.select(id);
//        if (selected.node().textContent != str) {
        //.style("font-size","4").transition().delay(function(){i*5}).duration(50)
        selected.text(" " + str + " ").style("font-size", fontsize.toString() + "px");

//        }
    }
}

function updateIntersections() {
    var totalSet = [];
    var hashtotal = {};
    //UNION of sets
    for (var i = 0; i < allSetsNames.length; i++) {
        for (var j = 0; j < sets[allSetsNames[i]].length; j++) {
            if (hashtotal[sets[allSetsNames[i]][j]] != true) {
                hashtotal[sets[allSetsNames[i]][j]] = true;
                totalSet.push(sets[allSetsNames[i]][j]);
            }
        }
    }

    //Hash of sets; easy way to know if an element is in a set or not
    var hash = {};
    for (var i = 0; i < allSetsNames.length; i++) {
        hash[allSetsNames[i]] = {};
    }

    for (var i = 0; i < allSetsNames.length; i++) {
        for (var j = 0; j < sets[allSetsNames[i]].length; j++) {
            hash[allSetsNames[i]][sets[allSetsNames[i]][j]] = true;
        }
    }

    intersections = {};
    intersectionsSet = {};
    //computes all possible intersections
    for (var j = 0; j < totalSet.length; j++) {
        var intersectionID = "";
        var currentElement = totalSet[j];
        for (var k = 0; k < allSetsNames.length; k++) {
            if (hash[allSetsNames[k]][currentElement] == true) {
                intersectionID = intersectionID + allSetsNames[k];
            }
        }

        if (intersectionsSet[intersectionID] == null) {
            intersectionsSet[intersectionID] = [];
        }
        intersectionsSet[intersectionID].push(currentElement);
        if (intersections[intersectionID] == null) {
            intersections[intersectionID] = 1;
        } else {
            intersections[intersectionID]++;
        }
    }
}

//update sets elements/values/intersections/diagram
//atualiza a variavel sets a partir dos campos de input
function updateSets(s) {
    if (!merging) {
        var list = document.getElementById("input" + s).value.split("\n");
        for (var t = 0; t < list.length; t++)
        {
            list[t] = list[t].replace(/^\s+/g, "");
            list[t] = list[t].replace(/\s+$/g, "");
        }
        list = list.subtract(["", "\n", " ", "  ", "   "]);
        list = list.filter(function (x) {
            if (x !== "")
                return true;
        });

        if (modified) {
            //remove duplicated elements
            var temp = [];
            $.each(list, function (i, el) {
                if ($.inArray(el, temp) === -1)
                    temp.push(el);
            });
            list = temp;
            modified = false;
        }

        sets[s] = list;
        original_sets[s] = list;
        var size = list.length;
        d3.select("#elements" + s).text("size: " + size);
        d3.select("#total" + s).text("(" + size + ")");

    }
    updateIntersections();
    updateDiagram();
}

//atualiza os campos de texto a partir da variavel sets                
function updateInputTextSet(s) {
    sets[s] = sets[s].filter(function (x) {
        if (x !== "")
            return true;
    });
    var size = sets[s].length;
    var str_set = "";
    for (var i = 0; i < size; i++) {
        str_set = str_set + sets[s][i] + "\n";
    }
    document.getElementById("input" + s).value = str_set;
    document.getElementById("name" + s).value = setsLabel[s];
}

function updateLabelsSizes() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        var s = originalAllSetsNames[i];
        var size = sets[s].length;
        d3.select("#total" + s).text("(" + size + ")");
    }
}

function mergeSetsDown() {
//    document.getElementById("updateMerge").disabled = true;
//    document.getElementById("downMerge").disabled = true;
//    document.getElementById("upMerge").disabled = true;
    if (currentIndex > 0) {
        currentIndex--;
        mergeSets(currentIndex);
    }
}

function mergeSetsUp() {
//    document.getElementById("updateMerge").disabled = true;
//    document.getElementById("downMerge").disabled = true;
//    document.getElementById("upMerge").disabled = true;
    if (currentIndex < slide.getSize() - 1) {
        currentIndex++;
        mergeSets(currentIndex);
    }
}

function getIntersection(intersectionID) {

    var intersectionsize = intersections[intersectionID.toUpperCase()];
    if (intersectionsize == null) {
        intersectionsize = 0;
    }

    return intersectionsize;
}

function loadNewDiagram(path) {

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
            if (vtemp[j].id.substring(0, 5) != "label" && vtemp[j].id.substring(0, 5) != "total" && str != "(total)") {

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

        updateActiveSets();

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
            //alert("merging");
            if (currentIndex >= slide.getSize() - 1) {
                document.getElementById("upMerge").disabled = true;
            } else {
                document.getElementById("upMerge").disabled = false;
            }
            if (currentIndex <= 0) {
                document.getElementById("downMerge").disabled = true;
            } else {
                document.getElementById("downMerge").disabled = false;
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
        
        d3.selectAll("path").on('mouseover', function (d) {
            d3.select(this).style({"fill-opacity": globalOpacity + 0.2});
        })
        d3.selectAll("path").on('mouseout', function (d) {
            d3.select(this).style({"fill-opacity": globalOpacity});
        })
    });
}


function getCode() {
    var code = document.getElementById("mergeCode").value;
    return code;
}


function mergeSets(index) {
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
        decode(code);
        maxIndex = slide.getSize();
        merging = true;
    }

    decoded = slide.getNameFromIndex(index);

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
    if (decoded != "") {
        decoded = "_" + decoded;
    }

    var path = "./diagrams/" + nWay + "/" + nWay + "waydiagram" + decoded.toLowerCase() + ".svg";

    //document.getElementById("downMerge").disabled = false;
    //document.getElementById("upMerge").disabled = false;

    loadNewDiagram(path);

}

updateNWay(nWay);

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

