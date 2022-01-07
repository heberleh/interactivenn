  /**
  * @description Navigates in the possible unions identifiers. For instance a list of [ab, abc, ad...] that represents all unions that will be showed to the user when he navigate through diagrams of unions.
  */
   export function Slide() {
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