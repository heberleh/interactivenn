/**
 * @description Navigates in the possible unions identifiers. For instance a list of [ab, abc, ad...] that represents all unions that will be showed to the user when he navigate through diagrams of unions.
 */
 export function Tree() {
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
      let C = [this.getRoot()];
      var count = 0;
      var level = 0;
      var F = C;
      //enquanto nao leu todos os nos
      // TODO: Troubleshoot remaining methods and general issue with levelnames and maxlevel not being set correctly
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
      const length = this.levelNames[level] ? this.levelNames[level].length : 0;
      for (var i = 0; i < length; i++) {
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


export const jsonTree = {};

export function printTreeJSON(node) {
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


export function Node(tree, root) {
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
