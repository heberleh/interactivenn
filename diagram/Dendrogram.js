/**
 * TODO: Convert to class
 * 
 * Input: treeCode: string
 * 
 * Output: 
 * near-term: creates a new dendrogram and appends it to #dendrogram
 * long-term: returns an object with an SVG element at this.element and a render function
 * 
 */
// TODO: Migrate to TypeScript

var dendrogramtree = null;

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
