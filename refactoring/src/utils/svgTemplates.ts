// SVG-Template-Utility für das Laden und Anpassen von Venn-Diagramm-Templates

/**
 * Lädt ein SVG-Template basierend auf Set-Anzahl und aktiven Kombinationen
 * @param setCount Anzahl der Mengen (2-6)
 * @param activeCombinations Array der aktiven Set-Kombinationen (z.B. ['ab', 'abc'])
 * @returns Promise mit dem SVG-String
 */
export async function loadSVGTemplate(setCount: number, activeCombinations: string[]): Promise<string> {
  // Bestimme das passende Template basierend auf aktivierten Kombinationen
  const templateName = getTemplateName(setCount, activeCombinations);
  const templatePath = `/diagrams/${setCount}/${templateName}.svg`;
  
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Template nicht gefunden: ${templatePath}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Fehler beim Laden des SVG-Templates:', error);
    // Fallback: Basis-Template ohne spezifische Kombinationen
    const fallbackPath = `/diagrams/${setCount}/${setCount}waydiagram.svg`;
    const fallbackResponse = await fetch(fallbackPath);
    return await fallbackResponse.text();
  }
}

/**
 * Bestimmt den Template-Namen basierend auf aktiven Kombinationen
 */
function getTemplateName(setCount: number, activeCombinations: string[]): string {
  if (activeCombinations.length === 0) {
    return `${setCount}waydiagram`;
  }
  
  // Sortiere Kombinationen alphabetisch und verbinde sie
  const sortedCombinations = activeCombinations
    .map(combo => combo.split('').sort().join(''))
    .sort()
    .join('_');
  
  return `${setCount}waydiagram_${sortedCombinations}`;
}

/**
 * Ersetzt Labels und passt Farben/Opazität in einem SVG-Template an
 */
export function customizeSVGTemplate(
  svgContent: string,
  setLabels: Record<string, string>, // z.B. { 'a': 'Set A', 'b': 'Set B' }
  colors: Record<string, string>,
  opacity: number = 0.5,
  fontSize: number = 18
): string {
  let customizedSVG = svgContent;

  // Ersetze Labels in <text>-Elementen
  Object.entries(setLabels).forEach(([key, label]) => {
    // Einzelne Sets (a, b, c, etc.)
    customizedSVG = customizedSVG.replace(
      new RegExp(`(<text[^>]*id="${key}"[^>]*>)[^<]*(</text>)`, 'gi'),
      `$1${label}$2`
    );
    
    // Kombinationen (ab, abc, etc.) - ersetze durch Elementanzahl
    const combinationRegex = new RegExp(`(<text[^>]*id="[^"]*${key}[^"]*"[^>]*>)[^<]*(</text>)`, 'gi');
    customizedSVG = customizedSVG.replace(combinationRegex, (match, start, end) => {
      const idMatch = match.match(/id="([^"]*)"/);
      if (idMatch) {
        const regionId = idMatch[1];
        // Berechne Anzahl der Elemente in dieser Region (Platzhalter)
        const elementCount = calculateRegionElementCount(regionId);
        return `${start}${elementCount}${end}`;
      }
      return match;
    });
  });

  // Ersetze Farben in style-Attributen
  Object.entries(colors).forEach(([_, color]) => {
    // Suche nach Elementen mit IDs die den Set-Key enthalten
    const colorRegex = new RegExp(`(style="[^"]*fill:)#[^;"]*(;[^"]*")`, 'gi');
    customizedSVG = customizedSVG.replace(colorRegex, `$1${color}$2`);
  });

  // Anpassung der Opazität
  customizedSVG = customizedSVG.replace(
    /fill-opacity:[\d.]+/g,
    `fill-opacity:${opacity}`
  );

  // Anpassung der Schriftgröße
  customizedSVG = customizedSVG.replace(
    /font-size:[\d.]+px/g,
    `font-size:${fontSize}px`
  );

  return customizedSVG;
}

/**
 * Berechnet die Anzahl der Elemente in einer bestimmten Region
 * (vereinfachte Implementierung - sollte mit echten Set-Daten arbeiten)
 */
function calculateRegionElementCount(regionId: string): number {
  // Platzhalter: Gibt die Länge der Region-ID als Elementanzahl zurück
  // In der echten Implementierung sollte hier die Schnittmenge berechnet werden
  return regionId.length * 5; // Beispielwert
}

/**
 * Hilfsfunktion: Generiert alle möglichen Set-Kombinationen für eine gegebene Anzahl
 */
export function generateAllCombinations(setCount: number): string[] {
  const sets = Array.from({ length: setCount }, (_, i) => String.fromCharCode(97 + i)); // a, b, c, ...
  const combinations: string[] = [];
  
  // Generiere alle Teilmengen (außer der leeren Menge)
  for (let i = 1; i < Math.pow(2, setCount); i++) {
    let combination = '';
    for (let j = 0; j < setCount; j++) {
      if ((i >> j) & 1) {
        combination += sets[j];
      }
    }
    combinations.push(combination);
  }
  
  return combinations;
}

/**
 * Bestimmt welche Kombinationen aktiv sein sollten basierend auf den Set-Daten
 */
export function getActiveCombinations(sets: Record<string, string[]>): string[] {
  const setNames = Object.keys(sets);
  const activeCombinations: string[] = [];
  
  // Generiere alle möglichen Kombinationen und prüfe ob sie Elemente enthalten
  const allCombinations = generateAllCombinations(setNames.length);
  
  allCombinations.forEach(combo => {
    const involvedSets = combo.split('').map(char => {
      const index = char.charCodeAt(0) - 97; // a=0, b=1, etc.
      return setNames[index];
    }).filter(Boolean);
    
    if (involvedSets.length > 0) {
      // Berechne Schnittmenge
      let intersection = sets[involvedSets[0]] || [];
      for (let i = 1; i < involvedSets.length; i++) {
        intersection = intersection.filter(elem => sets[involvedSets[i]]?.includes(elem));
      }
      
      // Nur hinzufügen wenn die Schnittmenge nicht leer ist
      if (intersection.length > 0) {
        activeCombinations.push(combo);
      }
    }
  });
  
  return activeCombinations;
}
