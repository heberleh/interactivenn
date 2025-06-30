// SetService: Kernlogik für Set-Operationen (aus Legacy-Code extrahiert)
import { VennSet, Intersection } from './types';

export class SetService {
  /**
   * Vereinigung aller Sets in einem Array
   */
  getUnionOfAllSets(setsArray: string[][]): Set<string> {
    const totalSet = new Set<string>();
    setsArray.forEach(vectorSet => {
      vectorSet.forEach(element => totalSet.add(element));
    });
    return totalSet;
  }

  /**
   * Vereinigung aller Sets als Array
   */
  getUnionOfAllSetsArray(setsArray: string[][]): string[] {
    return Array.from(this.getUnionOfAllSets(setsArray));
  }

  /**
   * Berechnet Prozentstring für Anzeige
   */
  getPercentageString(partSize: number, totalSize: number): string {
    if (totalSize === 0 || partSize === 0) {
      return "0.0";
    }
    return (partSize * 100 / totalSize).toFixed(1);
  }

  /**
   * Berechnet alle Schnittmengen zwischen Sets
   */
  calculateIntersections(sets: Record<string, string[]>, allSetsNames: string[]): Record<string, Intersection> {
    const setsVector = allSetsNames.map(name => sets[name]);
    const totalSet = this.getUnionOfAllSetsArray(setsVector);
    
    // Hash für schnelle Set-Zugehörigkeit
    const hash: Record<string, Record<string, boolean>> = {};
    for (let i = 0; i < allSetsNames.length; i++) {
      hash[allSetsNames[i]] = {};
    }

    for (let i = 0; i < allSetsNames.length; i++) {
      for (let j = 0; j < sets[allSetsNames[i]].length; j++) {
        hash[allSetsNames[i]][sets[allSetsNames[i]][j]] = true;
      }
    }

    const intersections: Record<string, Intersection> = {};
    
    // Berechne alle möglichen Schnittmengen
    for (let j = 0; j < totalSet.length; j++) {
      let intersectionID = "";
      const currentElement = totalSet[j];
      
      for (let k = 0; k < allSetsNames.length; k++) {
        if (hash[allSetsNames[k]][currentElement] === true) {
          intersectionID = intersectionID + allSetsNames[k];
        }
      }

      if (!intersections[intersectionID]) {
        intersections[intersectionID] = {
          id: intersectionID,
          elements: [],
          size: 0
        };
      }
      
      intersections[intersectionID].elements.push(currentElement);
      intersections[intersectionID].size++;
    }

    return intersections;
  }

  /**
   * Entfernt Duplikate aus einem Array
   */
  removeDuplicates(list: string[]): string[] {
    return Array.from(new Set(list));
  }

  /**
   * Bereinigt Input-Strings (Whitespace, leere Zeilen)
   */
  cleanInputList(input: string): string[] {
    let list = input.split("\n");
    for (let t = 0; t < list.length; t++) {
      list[t] = list[t].replace(/^\s+/g, "");
      list[t] = list[t].replace(/\s+$/g, "");
    }
    list = list.filter(x => x !== "" && x !== "\n" && x !== " ");
    return this.removeDuplicates(list);
  }

  /**
   * Prüft ob ein Element in einem Array enthalten ist
   */
  contains(array: string[], element: string): boolean {
    return array.includes(element);
  }
}

export const setService = new SetService();
