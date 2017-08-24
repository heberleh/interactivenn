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


var text_options_form = document.getElementById("text-options");
var globalfontsize = 20;
var defaultGlobalfontsize = 20;
var globalOpacity = 0.2;
var defaultGlobalOpacity = 0.2;
var globalFontOpacity = 1;
var globalDarker = 0.3;
  var firstLoad = true;



function hideInput(inputName) {
    document.getElementById("name" + inputName).style.display = 'none';
    document.getElementById("elements" + inputName).style.display = 'none';
    document.getElementById("input" + inputName).style.display = 'none';
    document.getElementById("color" + inputName).style.display = 'none'
}

function showInput(inputName) {
    document.getElementById("name" + inputName).style.display = 'inline';
    document.getElementById("elements" + inputName).style.display = 'inline';
    document.getElementById("input" + inputName).style.display = 'inline';
    document.getElementById("input" + inputName).disabled = false;
    document.getElementById("color" + inputName).style.display = 'inline';
}


function saveDataset() {
    var bname = getBrowserName();
    if( bname == "Safari"){
        alert("You are using Safari and it does not support Blob type. Exporting the dataset probably will not work. Please consider to use the Chrome or Firefox web browsers.");
    }
    updateFile2Save();
    document_name = document.getElementById("dataset-name").value + ".ivenn";
    //alert("Saving dataset as "+document_name+". It may take some seconds.");
    dataset = document.getElementById("data_set_content").value;
    saveAs(new Blob([dataset], {type: "text/plain;charset=" + document.characterSet}), document_name);
    return false;
}

function getBrowserName() {
    var name = "Unknown";
    if(navigator.userAgent.indexOf("MSIE")!=-1){
        name = "MSIE";
    }
    else if(navigator.userAgent.indexOf("Firefox")!=-1){
        name = "Firefox";
    }
    else if(navigator.userAgent.indexOf("Opera")!=-1){
        name = "Opera";
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1){
        name = "Chrome";
    }
    else if(navigator.userAgent.indexOf("Safari")!=-1){
        name = "Safari";
    }
    return name;
}

function getPicture() {
    var bname = getBrowserName();
    if( bname == "Safari"){
        alert("You are using Safari and it does not support Blob type. Exporting the diagram probably will not work. Please consider to use the Chrome or Firefox web browsers.");
    }

    var serializer = new XMLSerializer();
    var svg = document.getElementById("diagram");

//    d3.select("diagram").attr("width", x).attr("height", y);

    var chooser = document.getElementById("figureformat");
    var choosen_type = chooser.options[chooser.selectedIndex].value;
    var serialized = serializer.serializeToString(svg);
    var new_blob = new Blob([serialized], {type: "image/svg+xml;charset=" + document.characterSet});
    var document_name = document.getElementById("svg-name").value + choosen_type;
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

                console.log(context);



                var a = document.createElement('a');
                a.download = document_name;
                a.href = canvas.toDataURL('image/png');
                document.body.appendChild(a);
                a.click();
            }
            return false;
        } else {
            var file = "";
            if (choosen_type == '.txt') { //exportar listas de elementos das intersecções em vez de diagrama propriamente dito
                for (var i = 0; i < labelsDiagram.length; i++) {
                    var id = labelsDiagram[i].toUpperCase();
                    var set = intersectionsSet[id];

                    if (set != null) {
                        var textName = "[";
                        textName = textName + document.getElementById("name" + id[0]).value;
                        for (var j = 1; j < id.length; j++) {
                            textName = textName + "] and [" + document.getElementById("name" + id[j]).value;
                        }
                        textName = textName + "]";

                        file = file + textName + ": ";
                        file = file + set.toString();
                        file = file + "\n";
                        console.log(file);
                    }

                }
                saveAs(new Blob([file], {type: "text/plain;charset=" + document.characterSet}), document_name);
                return false;
            }
        }
    }



}




function updateFile2Save() {
    var file = "";
    var size = 0;

    for (var i = 0; i < nWay - 1; i++) {
        var setID = allPossibleSetsNames[i];
        var setname = d3.select("#label" + setID).text();
        var dataset = "";
        size = original_sets[setID].length;
        if (size > 0) {
            for (var j = 0; j < size - 1; j++) {
                dataset = dataset + original_sets[setID][j] + ",";
            }
            dataset = dataset + original_sets[setID][size - 1];
        }
        file = file + setname + ":" + dataset + ";\n";
    }

    var i = nWay - 1;
    var setID = allPossibleSetsNames[i];
    var setname = d3.select("#label" + setID).text();
    var dataset = "";

    size = original_sets[setID].length;
    if (size > 0) {
        for (var j = 0; j < size - 1; j++) {
            dataset = dataset + original_sets[setID][j] + ",";
        }
        dataset = dataset + original_sets[setID][size - 1];
    }

    file = file + setname + ":" + dataset;
    document.getElementById("data_set_content").value = file;
}


function fontsizeup() {
    globalfontsize = globalfontsize + 1;
    updateDiagram();
}

function fontsizedown() {
    globalfontsize = globalfontsize - 1;
    updateDiagram();
}

function updateColorBox() {
    for (var i = 0; i < nWay; i++) {
        var setname = originalAllSetsNames[i];
        var boxname = "color" + setname;
        var myPicker = new jscolor.color(document.getElementById(boxname), {});
        var color = d3.rgb(d3.select("#elipse" + setname).style("fill")).toString();
        myPicker.fromString(color);
    }
}

function changeColor(setname) {
    var myPicker = new jscolor.color(document.getElementById("color" + setname), {});
    d3.select("#elipse" + setname).style("fill", d3.rgb("#" + myPicker.toString())).style("fill-opacity", globalOpacity);
    var darker = d3.rgb("#" + myPicker.toString()).darker(globalDarker);
    var black = d3.rgb(0,0,0);
    d3.select("#label" + setname).style("fill", darker).style("fill-opacity", globalFontOpacity);
    d3.select("#total" + setname).style("fill", darker).style("fill-opacity", globalFontOpacity);
}

function updateColors() {
    for (var i = 0; i < nWay; i++) {
        var setname = originalAllSetsNames[i];
        var elipse = d3.select("#elipse" + setname);
        if (elipse != null) {
            changeColor(setname);
        }
    }
}


function updateOpacity() {
    for (var i = 0; i < nWay; i++) {
        var setname = originalAllSetsNames[i];
        d3.select("#elipse" + setname).style("fill-opacity", globalOpacity);
        d3.select("#label" + setname).style("fill-opacity", globalFontOpacity);
        d3.select("#total" + setname).style("fill-opacity", globalFontOpacity);
    }
}

function opacityUp() {
    globalOpacity = globalOpacity + 0.03;
    if (globalOpacity > 0.7) {
        globalOpacity = 0.7;
    }

    for (var i = 0; i < nWay; i++) {
        var setname = originalAllSetsNames[i];
        d3.select("#elipse" + setname).style("fill-opacity", globalOpacity);
    }
}

function opacityDown() {
    globalOpacity = globalOpacity - 0.03;
    if (globalOpacity < 0.03) {
        globalOpacity = 0.03;
    }
    for (var i = 0; i < nWay; i++) {
        var setname = originalAllSetsNames[i];
        d3.select("#elipse" + setname).style("fill-opacity", globalOpacity);
    }
}



function resetColor() {
    // merging será falso e tudo será reiniciado...
    started = false;
    document.getElementById('updateMerge').textContent = "Start";
    document.getElementById('mergeCode').disabled = false;
    document.getElementById('clearSets').disabled = false;
    document.getElementById('nway2').disabled = false;
    document.getElementById('nway3').disabled = false;
    document.getElementById('nway4').disabled = false;
    document.getElementById('nway5').disabled = false;
    document.getElementById('nway6').disabled = false;
    updateNWay(nWay);
    globalOpacity = defaultGlobalOpacity;
}

function resetFontSize() {
    globalfontsize = defaultGlobalfontsize;
    updateDiagram();
}

function resetDiagram() {
    resetColor();
    resetFontSize();
}