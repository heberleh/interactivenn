// Utility zum dynamischen Laden und Anpassen von SVG-Templates

export async function loadAndCustomizeSVGTemplate(
  templateName: string,
  labelMap: Record<string, string>,
  colorMap: Record<string, string>,
  opacity: number = 0.5,
  fontSize: number = 20
): Promise<string> {
  // SVG-Template laden
  const res = await fetch(`/templates/${templateName}`);
  let svg = await res.text();

  // Labels ersetzen
  Object.entries(labelMap).forEach(([region, label]) => {
    // Ersetze <text ... id="region">...</text> oder <tspan id="region">...</tspan>
    const regex = new RegExp(`(<text[^>]*id=["']${region}["'][^>]*>)(.*?)(</text>)`, 'g');
    svg = svg.replace(regex, `$1${label}$3`);
    // Optional: tspan
    const tspanRegex = new RegExp(`(<tspan[^>]*id=["']${region}["'][^>]*>)(.*?)(</tspan>)`, 'g');
    svg = svg.replace(tspanRegex, `$1${label}$3`);
  });

  // Farben und Opazität ersetzen (vereinfachtes Beispiel: alle fill-Attribute)
  Object.entries(colorMap).forEach(([region, color]) => {
    // Ersetze fill für id="region"
    const fillRegex = new RegExp(`(<[^>]+id=["']${region}["'][^>]+)fill:[^;"']*`, 'g');
    svg = svg.replace(fillRegex, `$1fill:${color}`);
  });
  // Opazität global ersetzen (vereinfachtes Beispiel)
  svg = svg.replace(/fill-opacity:[0-9.]+/g, `fill-opacity:${opacity}`);
  // Schriftgröße
  svg = svg.replace(/font-size:[0-9.]+px/g, `font-size:${fontSize}px`);

  return svg;
}
