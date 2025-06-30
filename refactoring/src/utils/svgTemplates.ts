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

/**
 * Lädt und passt ein SVG-Template an die aktuellen Set-Daten an
 */
export async function loadAndCustomizeSVG(
  setCount: number, 
  sets: Record<string, string[]>, 
  colors: Record<string, string>,
  opacity: number = 0.5,
  fontSize: number = 16
): Promise<string> {
  const activeCombinations = getActiveCombinations(sets);
  
  try {
    let svgContent = await loadSVGTemplate(setCount, activeCombinations);
    
    // Anpassung der SVG-Eigenschaften
    svgContent = customizeSVGContent(svgContent, sets, colors, opacity, fontSize);
    
    return svgContent;
  } catch (error) {
    console.error('Fehler beim Laden des SVG-Templates:', error);
    return generateFallbackSVG(setCount, sets, colors, opacity, fontSize);
  }
}

/**
 * Passt SVG-Content an (Farben, Labels, Opazität)
 */
function customizeSVGContent(
  svgContent: string,
  sets: Record<string, string[]>,
  colors: Record<string, string>,
  opacity: number,
  fontSize: number
): string {
  let customized = svgContent;
  
  // Ersetze Opazität
  customized = customized.replace(/fill-opacity="[^"]*"/g, `fill-opacity="${opacity}"`);
  
  // Ersetze Font-Size
  customized = customized.replace(/font-size="[^"]*"/g, `font-size="${fontSize}px"`);
  
  // Ersetze Farben für Sets
  Object.entries(colors).forEach(([setName, color]) => {
    const lowerSetName = setName.toLowerCase();
    // Ersetze fill-Farben
    const regex = new RegExp(`(id="[^"]*${lowerSetName}[^"]*"[^>]*fill=")[^"]*(")`,'g');
    customized = customized.replace(regex, `$1${color}$2`);
  });
  
  // Ersetze Labels mit Mengengröße
  Object.entries(sets).forEach(([setName, elements]) => {
    const lowerSetName = setName.toLowerCase();
    const count = elements.length;
    
    // Ersetze Text-Content
    const labelRegex = new RegExp(`(<text[^>]*id="[^"]*${lowerSetName}[^"]*"[^>]*>[^<]*<tspan[^>]*>)[^<]*(</tspan>)`, 'g');
    customized = customized.replace(labelRegex, `$1${count}$2`);
  });
  
  return customized;
}

/**
 * Generiert Fallback-SVG wenn Template nicht gefunden wird
 */
function generateFallbackSVG(
  setCount: number,
  sets: Record<string, string[]>,
  colors: Record<string, string>,
  opacity: number,
  fontSize: number
): string {
  const width = 400;
  const height = 300;
  
  const layouts: Record<number, {cx: number, cy: number, r: number}[]> = {
    2: [{cx: 120, cy: 150, r: 80}, {cx: 280, cy: 150, r: 80}],
    3: [{cx: 200, cy: 100, r: 70}, {cx: 150, cy: 200, r: 70}, {cx: 250, cy: 200, r: 70}],
    4: [{cx: 120, cy: 100, r: 60}, {cx: 280, cy: 100, r: 60}, {cx: 120, cy: 200, r: 60}, {cx: 280, cy: 200, r: 60}],
    5: [{cx: 200, cy: 70, r: 50}, {cx: 100, cy: 150, r: 50}, {cx: 150, cy: 230, r: 50}, {cx: 250, cy: 230, r: 50}, {cx: 300, cy: 150, r: 50}],
    6: [{cx: 200, cy: 60, r: 45}, {cx: 100, cy: 120, r: 45}, {cx: 100, cy: 180, r: 45}, {cx: 200, cy: 240, r: 45}, {cx: 300, cy: 180, r: 45}, {cx: 300, cy: 120, r: 45}]
  };
  
  const layout = layouts[setCount] || layouts[2];
  const setNames = Object.keys(sets).slice(0, setCount);
  
  let circles = '';
  let labels = '';
  
  setNames.forEach((setName, i) => {
    const pos = layout[i];
    const color = colors[setName] || '#cccccc';
    const count = sets[setName]?.length || 0;
    circles += `<circle cx="${pos.cx}" cy="${pos.cy}" r="${pos.r}" fill="${color}" fill-opacity="${opacity}" stroke="#666" stroke-width="2"/>`;
    labels += `<text x="${pos.cx}" y="${pos.cy + fontSize/3}" text-anchor="middle" font-size="${fontSize}px" fill="#333">${setName}: ${count}</text>`;
  });
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${circles}
    ${labels}
  </svg>`;
}
