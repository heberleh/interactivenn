/**
 * File handling utilities for InteractiVenn
 * Handles .ivenn file format parsing and saving
 */

import type { VennSet } from '../types';

/**
 * Parse .ivenn file content into VennSet array
 * Format: "name1:e1,e2,e3;name2:e4,e5,e6;"
 */
export function parseIvennFile(content: string): VennSet[] {
  const sets: VennSet[] = [];
  const defaultColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];
  
  // Remove newlines and split by semicolon
  const str = content.replace(/\n/g, "");
  const setsList = str.split(";").filter(x => x.trim() !== "");
  
  setsList.forEach((setString, index) => {
    const parts = setString.split(":");
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const elementsString = parts[1];
      const elements = elementsString
        .split(",")
        .map(e => e.trim())
        .filter(e => e !== "");
      
      sets.push({
        id: `set_${index}`,
        name,
        elements,
        color: defaultColors[index % defaultColors.length]
      });
    }
  });
  
  return sets;
}

/**
 * Convert VennSet array to .ivenn file format
 */
export function serializeToIvenn(sets: VennSet[]): string {
  const lines = sets.map(set => {
    const elementsString = set.elements.join(",");
    return `${set.name}:${elementsString}`;
  });
  
  return lines.join(";\n") + (lines.length > 0 ? ";" : "");
}

/**
 * Download a file with given content and filename
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export SVG as PNG using canvas
 */
export function exportSvgAsPng(svgElement: SVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const serialized = serializer.serializeToString(svgElement);
  
  const image = new Image();
  image.src = 'data:image/svg+xml;base64,' + btoa(serialized);
  
  image.onload = function() {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(scale, scale);
      context.drawImage(image, 0, 0);
      
      // Set background color
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Download
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
}

/**
 * Export intersections as text
 */
export function exportIntersectionsAsText(intersections: Record<string, string[]>, setNames: Record<string, string>): string {
  let file = "";
  
  Object.entries(intersections).forEach(([id, elements]) => {
    if (elements && elements.length > 0) {
      let textName = "[";
      textName += setNames[id[0]] || id[0];
      
      for (let j = 1; j < id.length; j++) {
        textName += "] and [" + (setNames[id[j]] || id[j]);
      }
      textName += "]";
      
      file += textName + ": ";
      file += elements.join(", ");
      file += "\n";
    }
  });
  
  return file;
}
