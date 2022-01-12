// TODO: Evaluate whether there are methods from Diagram that can be moved here
// TODO: Migrate to TypeScript
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

export default new SetService();