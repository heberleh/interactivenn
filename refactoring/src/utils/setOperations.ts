// Set-Operationen und Utility-Funktionen (portiert aus legacy JS)

export class SetService {
  getUnionOfAllSets(setsArray: string[][]): Set<string> {
    const totalSet = new Set<string>();
    setsArray.forEach(vectorSet => {
      vectorSet.forEach(element => totalSet.add(element));
    });
    return totalSet;
  }
  
  getUnionOfAllSetsArray(setsArray: string[][]): string[] {
    return Array.from(this.getUnionOfAllSets(setsArray));
  }

  getPercentageString(partSize: number, totalSize: number): string {
    if (totalSize === 0 || partSize === 0) {
      return "0.0";
    }
    return (partSize * 100 / totalSize).toFixed(1);
  }
}

export const setService = new SetService();

// Array-Prototyp-Erweiterung (aus Legacy-Code)
declare global {
  interface Array<T> {
    contains(obj: T): boolean;
    subtract(arr: T[]): T[];
  }
}

Array.prototype.contains = function<T>(obj: T): boolean {
  let i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

Array.prototype.subtract = function<T>(arr: T[]): T[] {
  return this.filter(x => !arr.includes(x));
};

// Utility-Funktionen
export function cleanElementList(list: string[]): string[] {
  return list
    .map(item => item.replace(/^\s+/g, "").replace(/\s+$/g, ""))
    .filter(item => item !== "" && item !== "\n" && item !== " ")
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
}

export function updateIntersections(allSetsNames: string[], sets: Record<string, string[]>) {
  const setsVector = allSetsNames.map(name => sets[name] || []);
  const totalSet = setService.getUnionOfAllSetsArray(setsVector);
  
  // Hash of sets for fast lookup
  const hash: Record<string, Record<string, boolean>> = {};
  allSetsNames.forEach(setName => {
    hash[setName] = {};
    sets[setName]?.forEach(element => {
      hash[setName][element] = true;
    });
  });

  const intersections: Record<string, number> = {};
  const intersectionsSet: Record<string, string[]> = {};

  // Compute all possible intersections
  totalSet.forEach(currentElement => {
    let intersectionID = "";
    allSetsNames.forEach(setName => {
      if (hash[setName][currentElement]) {
        intersectionID += setName;
      }
    });

    if (!intersectionsSet[intersectionID]) {
      intersectionsSet[intersectionID] = [];
    }
    intersectionsSet[intersectionID].push(currentElement);
    
    if (!intersections[intersectionID]) {
      intersections[intersectionID] = 1;
    } else {
      intersections[intersectionID]++;
    }
  });

  return { intersections, intersectionsSet };
}

export function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("MSIE") !== -1) return "MSIE";
  if (userAgent.indexOf("Firefox") !== -1) return "Firefox";
  if (userAgent.indexOf("Opera") !== -1) return "Opera";
  if (userAgent.indexOf("Chrome") !== -1) return "Chrome";
  if (userAgent.indexOf("Safari") !== -1) return "Safari";
  return "Unknown";
}
