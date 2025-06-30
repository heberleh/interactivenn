// SetService - Portiert aus legacy/web/slider.js und tree.js

import type { Intersection } from './types';

export class SetService {
  /**
   * Berechnet die Vereinigung aller Sets als Set-Objekt
   */
  getUnionOfAllSets(setsArray: string[][]): Set<string> {
    const totalSet = new Set<string>();
    setsArray.forEach(vectorSet => {
      vectorSet.forEach(element => totalSet.add(element));
    });
    return totalSet;
  }

  /**
   * Berechnet die Vereinigung aller Sets als Array
   */
  getUnionOfAllSetsArray(setsArray: string[][]): string[] {
    return Array.from(this.getUnionOfAllSets(setsArray));
  }

  /**
   * Berechnet Prozentsatz als formatierten String
   */
  getPercentageString(partSize: number, totalSize: number): string {
    if (totalSize === 0 || partSize === 0) {
      return "0.0";
    }
    return (partSize * 100 / totalSize).toFixed(1);
  }

  /**
   * Entfernt Duplikate aus einem Array
   */
  removeDuplicates(list: string[]): string[] {
    return Array.from(new Set(list));
  }

  /**
   * Bereinigt Array-Elemente (Whitespace entfernen, leere Elemente filtern)
   */
  cleanElements(list: string[]): string[] {
    return list
      .map(item => item.replace(/^\s+/g, "").replace(/\s+$/g, ""))
      .filter(item => item !== "" && item !== "\n" && item !== " ");
  }

  /**
   * Berechnet alle Schnittmengen zwischen den Sets
   */
  calculateIntersections(sets: Record<string, string[]>): Record<string, Intersection> {
    const allSetsNames = Object.keys(sets);
    const setsVector = allSetsNames.map(name => sets[name]);
    const totalSet = this.getUnionOfAllSetsArray(setsVector);

    // Hash für schnelle Zugehörigkeitsprüfung
    const hash: Record<string, Record<string, boolean>> = {};
    for (const setName of allSetsNames) {
      hash[setName] = {};
      for (const element of sets[setName]) {
        hash[setName][element] = true;
      }
    }

    const intersections: Record<string, Intersection> = {};

    // Berechne alle möglichen Schnittmengen
    for (const element of totalSet) {
      let intersectionID = "";
      
      for (const setName of allSetsNames) {
        if (hash[setName][element]) {
          intersectionID += setName;
        }
      }

      if (!intersections[intersectionID]) {
        intersections[intersectionID] = {
          id: intersectionID,
          sets: intersectionID.split(''),
          elements: [],
          size: 0
        };
      }

      intersections[intersectionID].elements.push(element);
      intersections[intersectionID].size++;
    }

    return intersections;
  }

  /**
   * Validiert Set-Namen (aus legacy javascript.js)
   */
  isValidSetName(name: string): boolean {
    const validChars = ['A', 'B', 'C', 'D', 'E', 'F'];
    return name.length === 1 && validChars.includes(name.toUpperCase());
  }

  /**
   * Generiert Standard-Set-Namen basierend auf der Anzahl
   */
  generateSetNames(nWay: number): string[] {
    const allPossibleNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    return allPossibleNames.slice(0, nWay);
  }
}
