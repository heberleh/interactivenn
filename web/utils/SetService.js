export class SetService{

  constructor(allSetsIDs, dataSets) {
    this.setsArray = allSetsIDs.map(set => dataSets[set].data);
  }

  getUnionOfAllSets(setsArray) {
      if (!setsArray) {
        setsArray = this.setsArray;
      }
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

export const intersections = {}; //[a:0,b:0,c:0...]  
export const intersectionsSet = {}; //{ab:[gene1,gene2],bc:[gene3,gene4]}


