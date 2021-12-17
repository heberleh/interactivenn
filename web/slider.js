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


//TODO migrate all code to Typescript
//TODO migrate UI to React...
class SetService{

    getUnionOfAllSets(setsArray) {
        const totalSet = new Set();
        setsArray.forEach(vectorSet =>{
            vectorSet.forEach(element=> totalSet.add(element));
        })
        return totalSet;
    }
    
    getUnionOfAllSetsArray(setsArray){
        return Array.from(this.getUnionOfAllSets(setsArray));
    }

    getPercentageString(partSize, totalSize){
        if(totalSize===0||partSize===0){
            return "0.0";
        }
        return (partSize*100/totalSize).toFixed(1);
    }

}


const setService = new SetService();

var importedNode;
var begintersectionsset = ["a", "b", "c", "d", "e", "f", "ab", "ac", "ad", "ae", "af", "bc", "bd", "be", "bf", "cd", "ce", "cf", "de", "df", "ef", "abc", "abd", "abe", "abf", "acd", "ace", "acf", "ade", "adf", "aef", "bcd", "bce", "bcf", "bde", "bdf", "bef", "cde", "cdf", "cef", "def", "abcd", "abce", "abcf", "abde", "abdf", "abef", "acde", "acdf", "acef", "adef", "bcde", "bcdf", "bcef", "bdef", "cdef", "abcde", "abcdf", "abcef", "abdef", "acdef", "bcdef"];
var originalAllSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
var allSetsNames = ['A', 'B', 'C', 'D', 'E', 'F']; //currently selected!! depends on nWays 
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

// Probability?
var probability = false;
function togglePercentage (){
    probability = !probability;
    updateDiagram();
}

/**
 * @description Checks if a set, the current object, contains an element (argument obj).
 */
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};


/**
 * @description Navigates in the possible unions identifiers. For instance a list of [ab, abc, ad...] that represents all unions that will be showed to the user when he navigate through diagrams of unions.
 */
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

/**
 * @description Decodes the string str and identifies the unions. If the web interface is related to "Slider/List" version, the code is similar to this: "ab; cd,ef; abc,de; abcd,ef; ab,cd,ef". If the web interface is related to "Tree" version, the code is similar to this: "((A,((D,(F,E)),C)),B)".
 * @param {string} str The string given by the user.
 */
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

/**
 * @description Updates the label of a set in the diagram given the label typed by the user on the web interface.
 * @param {string} setID The set ID.
 */
function updateSetLabel(setID) {
    var text = document.getElementById("name" + setID).value;
    d3.select("#label" + setID).text(text.replace(/:/g, '-'));
}


/**
 * @description Updates the label of all sets in the diagram given the labels typed by the user on the web interface.
 */
function updateSetsLabels() {
    for (var i = 0; i < nWay; i++) {
        updateSetLabel(allPossibleSetsNames[i]);
    }
}

/**
 * @description Updates the sets names according to the global variable "allSetsNames" and attributes a list of zero elements to it.
 */
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

/**
 * @description Resets the allSetsNames global variable and define it as originalAllSetsNames.
 */
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

/**
 * @description Updates the sets and sets' labels given the texts inputs in the web interface.
 */
function updateActiveSets() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        modified = true;
        updateSets(originalAllSetsNames[i]);
        updateSetLabel(originalAllSetsNames[i]);
    }
}

/**
 * @description Clear the forms of sets input area in the web interface.
 */
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

/**
 * @description Updates the number of sets in a diagram as well the number of input forms shown in the web interface. Loads a new diagram according to the number of sets. The loaded diagram is updated by the function loadNewDiagram().
 * @param {integer} newvalue The number of sets.
 */
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


/**
 * @description Updates the values (numbers) that are shown in the diagram. Identifies all the possible intersections and set a new numeric text to it.
 */
function updateDiagram() {
    var fontsize = globalfontsize;
    if (nWay == 5) {
        fontsize = globalfontsize - 5;
    }
    if (nWay == 6) {
        fontsize = globalfontsize - 10;
    }
    const setsVector = allSetsNames.map(name=>sets[name]);
    const totalSetSize = setService.getUnionOfAllSets(setsVector).size;
    
    for (var i = 0; i < labelsDiagram.length; i++) {
        var id = "#" + labelsDiagram[i];
        var size = getIntersection(labelsDiagram[i]);
        selected = d3.select(id);
//        if (selected.node().textContent != str) {
        //.style("font-size","4").transition().delay(function(){i*5}).duration(50)
        let translateX = 7;
        if(nWay===5) translateX += 3;
        if(probability && !isNaN(new Number(size)) ){           
            translateX +=3;
            selected.text(" " + setService.getPercentageString(size, totalSetSize) + " ")
                    .attr("transform",`translate(${translateX},0)`)
                    .style("font-size", fontsize.toString() + "px")
                    .style("text-anchor","middle");
        }else{
            selected.text(" " + size + " ")
                    .attr("transform",`translate(${translateX},0)`)
                    .style("font-size", fontsize.toString() + "px")
                    .style("text-anchor","middle");
                      
        }
       
       
//        }
    }
}


/**
 * @description Analyses the sets and rebuild the lists of intersections.
 */
function updateIntersections() {
    //Union of all sets
    const setsVector = allSetsNames.map(name=>sets[name]);
    var totalSet = setService.getUnionOfAllSetsArray(setsVector);

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

/**
 * @description Updates the lists of elements of a set and its intersections. Updates the global variable "sets" changing these values. Calls UpdateIntersections() and updateDiagram().
 * @param {string} s The set that was changed.
 */
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
            // var temp = [];
            // $.each(list, function (i, el) {
            //     if ($.inArray(el, temp) === -1)
            //         temp.push(el);
            // });
            // list = temp;
            let old_list = list;
            list = Array.from(new Set(list));
            if(list.length !== old_list.length) alert(`Problem in Set ${s}: there are duplicated elements in at least one of your lists. We try and remove duplicates before showing the intersections in the diagram, but we don't remove the duplicates from the input-boxes that are on the right-side. We recommend you to input always sets (lists of unique values). The numbers in the website are respective to the number of unique values that we found, and not the number of elements in your lists when they have duplicates. You can continue the analysis if you are aware of the differences between a set and a list with duplicated elements.`);
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

/**
 * @description Updates the input forms of a set based on the values stored in the variable "sets".
 * @param {string} s The set id that is being updated.
 */              
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

/**
 * @description Updates the texts that indicates the size of each set.
 */
function updateLabelsSizes() {
    for (var i = 0; i < originalAllSetsNames.length; i++) {
        var s = originalAllSetsNames[i];
        var size = sets[s].length;
        d3.select("#total" + s).text("(" + size + ")");
    }
}


/**
 * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
 */
function mergeSetsDown() {
//    document.getElementById("updateMerge").disabled = true;
//    document.getElementById("downMerge").disabled = true;
//    document.getElementById("upMerge").disabled = true;
    if (currentIndex > 0) {
        currentIndex--;
        mergeSets(currentIndex);
    }
}

/**
 * @description Applies the union operation based on the sequency defined by the Slider or Tree structure.
 */
function mergeSetsUp() {
//    document.getElementById("updateMerge").disabled = true;
//    document.getElementById("downMerge").disabled = true;
//    document.getElementById("upMerge").disabled = true;
    if (currentIndex < slide.getSize() - 1) {
        currentIndex++;
        mergeSets(currentIndex);
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


function setMouseOverIntersectionsLabels(){
    for (var i = 0; i < labelsDiagram.length; i++) {        
        const label =  labelsDiagram[i];  
        selected = d3.select("#"+label);
        
        selected.on('mouseover', function (d) {
            allSetsNames.forEach(setName=>{
                d3.select("#elipse"+setName.toUpperCase())
                    .style({"fill-opacity": 0})
                    .style({"padding": "5px"})
                d3.select("#label"+setName.toUpperCase())
                    .style({"fill-opacity": 0.2}); 
                d3.select("#total"+setName.toUpperCase())
                    .style({"fill-opacity": 0.2});   
            });      
            
            label.split("").forEach(setName=>{
                d3.select("#elipse"+setName.toUpperCase()).style({"fill-opacity": globalOpacity + 0.2});
                d3.select("#label"+setName.toUpperCase())
                    .style({"fill-opacity": 1}); 
                d3.select("#total"+setName.toUpperCase())
                    .style({"fill-opacity": 1});   

            })                  
        }).attr("title",label);
        
        selected.on('mouseout', function (d) { 
            allSetsNames.forEach(setName=>{
                d3.select("#elipse"+setName.toUpperCase()).style({"fill-opacity": globalOpacity})
                d3.select("#label"+setName.toUpperCase())
                    .style({"fill-opacity": 1}); 
                d3.select("#total"+setName.toUpperCase())
                    .style({"fill-opacity": 1});   
            });         
        })

        

    }
}


/**
 * @description Loads a diagram and process everything based on it. 
 * @param {string} path The path of a .svg diagram
 */
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
        
        // d3.selectAll("path").on('mouseover', function (d) {
        //     console.log("mouseover", d);
        //     d3.select(this).style({"fill-opacity": globalOpacity + 0.2});
        // })
        // d3.selectAll("path").on('mouseout', function (d) {
        //     d3.select(this).style({"fill-opacity": globalOpacity});
        // })
        setMouseOverIntersectionsLabels();
    });

   
}


/**
 * @description Gets the code written by the user from the web interface.
 */
function getCode() {
    var code = document.getElementById("mergeCode").value;
    return code;
}

/**
 * @description Merges the sets of a given union code. Argument is actually a index of a union code in the union codes list.
 * @param {numeric} index The index of a union in the list of unions. For instance, if the list is [ab, abc, ad] the index 0 gives you the union code "ab".
 */
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

