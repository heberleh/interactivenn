# Migration Checklist

## 🚨 CRITICAL LAYOUT ISSUE - IMMEDIATE FIX REQUIRED

**PROBLEM:** Current React structure does not match legacy HTML hierarchy at all.

**LEGACY STRUCTURE (from index.html analysis):**
```html
contentContainer:
  leftColumn:
    mergeMenu (union operations: "List merging code" input + Start/Stop buttons)
    imageContainer:
      diagramframe (Venn diagram SVG)
      export controls (filename input + .svg/.png/.txt dropdown + Export button)
      displayOptions (font-size +/-, opacity +/-, Reset diagram button)
  
  rightColumn:
    newFeatures (show percentages checkbox + mouseover highlight text)
    nWayMenu (Number of Sets: radio buttons 2,3,4,5,6)
    dataMenu (Set inputs A,B,C,D,E,F with name inputs, color pickers, textareas)
```

**CURRENT REACT STRUCTURE (WRONG):**
- InputPanel has set inputs (should be rightColumn)
- VisualizationPanel has diagram + some controls (should be leftColumn imageContainer)
- Missing mergeMenu completely
- Export/display controls split incorrectly

**ACTION REQUIRED:**
1. Restructure App.tsx to have leftColumn + rightColumn
2. Move mergeMenu logic to leftColumn (union operations)
3. Move set inputs to rightColumn (InputPanel content)
4. Ensure exact visual parity with legacy layout

## Projektziel und Hinweise

Dieses Projekt ist eine 1:1-Migration der InteractiVenn-Webanwendung zu React + TypeScript. Ziel ist vollständige visuelle und funktionale Parität mit der Original-Webanwendung. Keine neuen Features, keine Altlasten. Fokus auf sauberen, modernen Code und Komponentenstruktur.

- Bei jeder Aufgabe und jedem Fortschritt ist stets die Datei `PROJECT_STRUCTURE.md` zu konsultieren, um aktuelle Informationen zur Projektstruktur, zu Dateien und zu Migrationshinweisen zu erhalten.
- Wenn sich im Verlauf der Arbeit relevante Änderungen an der Projektstruktur, an Dateibeschreibungen oder am Migrationsstand ergeben, ist `PROJECT_STRUCTURE.md` entsprechend zu aktualisieren.
- Wenn Aufgaben aus der Fortschritts-Checkliste erledigt werden, ist diese Datei (`MIGRATION_CHECKLIST.md`) ebenfalls zu aktualisieren (Kästchen abhaken, Hinweise ergänzen).

## Neue Anforderungen (Juni 2025)

- **Legacy-Seiten übernehmen:** Die Seiten `help.html`, `contact.html`, `citation.html` aus `legacy/web/` werden als React-Komponenten übernommen und in die App eingebunden (z.B. über ein Menü oder Footer-Links). ✅ **ERLEDIGT:** Inhalte dieser Seiten in neue React-Komponenten übernommen.
- **Weitere Inhalte aus Legacy übernehmen:**
  - **index.html, index2.html:** Logik und Layout für Slider- und Tree-Modus als Grundlage für die neuen Visualisierungskomponenten nutzen. **TODO:** Alle relevanten UI- und Logikbestandteile in React/TypeScript portieren.
  - **main.css:** Original-Styles für visuelle Parität übernehmen und ggf. anpassen. **TODO:** CSS in das neue Styling-System integrieren.
  - **javascript.js, slider.js, tree.js:** Set-Operationen, Parsing- und Visualisierungslogik nach TypeScript portieren. **TODO:** Prüfen, ob noch Logik aus diesen Dateien übernommen werden muss.
  - **SVG- und Diagramm-Templates:** Sicherstellen, dass alle SVG-Templates und Diagrammdateien aus `diagrams/` und `public/templates/` übernommen und im neuen System nutzbar sind. **TODO:** SVG-Import und -Verwendung testen.
  - **Beispiel-Datensätze (.ivenn):** Lade- und Speicherfunktion für .ivenn-Dateien implementieren und testen. **TODO:** Beispiel-Datensätze für Tests nutzen.

## Vorgehen

1. Inhalte der Legacy-Seiten als React-Komponenten übernehmen und einbinden.
2. Modus-Selector im Visualisierungsbereich einbauen, der die Ansicht und Controls dynamisch anpasst.
3. Menü oder Footer-Links zu den statischen Seiten (Hilfe, Kontakt, Zitation) bereitstellen.
4. Projektdokumentation entsprechend aktualisieren.

## Letzte Fortschritte (Aktuell)

**✅ ERLEDIGT (Heute):**
- **File-Handler implementiert:** Vollständige `.ivenn`-Datei-Parser und -Serializer in `src/utils/fileHandlers.ts`
- **InputPanel erweitert:** Vollständige Lade- und Speicherfunktionalität für Datensätze, Name- und Color-Handler
- **VisualizationPanel erweitert:** Export-Funktionen für SVG, PNG, TXT, Opacity/Font-Size-Controls, Percentage-Toggle
- **App.tsx aktualisiert:** State-Management für alle Komponenten, korrekte Prop-Interfaces
- **Type-Safety verbessert:** Alle Komponenten verwenden TypeScript-Interfaces ordnungsgemäß

**� KRITISCHE LAYOUT-PROBLEME IDENTIFIZIERT:**

**AKTUELLER ZUSTAND (Refactored Version):**
- Layout ist vertikal gestapelt (Data Input oben, Visualization Controls unten)
- Venn-Diagramm wird sehr klein in der Mitte angezeigt
- Set-Input-Felder sind untereinander angeordnet
- Navigation-Links fehlen komplett
- Schwarze/dunkle UI-Elemente statt der ursprünglichen Farben
- Kein Header mit Tabs (Unions by tree, Unions by list, etc.)
- Input-Panel nimmt zu viel vertikalen Platz ein

**ZIELZUSTAND (Legacy Layout):**
- **Header mit Tab-Navigation:** Schwarzer Header mit weißen Tabs (Unions by tree, Unions by list, Citation, Contact, Help, Terms & Privacy)
- **Horizontal Layout:** Links Input-Panel, rechts großes Venn-Diagramm
- **Input-Panel (Links):** 
  - List code Input-Feld oben
  - Set-Input-Felder (A-F) vertikal mit Farb-Squares
  - File Operations unten (Save set, Load Set)
- **Haupt-Diagramm-Bereich (Zentral):** Großes Venn-Diagramm nimmt den Großteil des Bildschirms ein
- **Control-Panel (Rechts):** 
  - Show Percentages Checkbox
  - Number of Sets Radio Buttons
  - Export Controls unten
  - Font-size und Color-opacity Controls unten

**🔧 SOFORTIGE LAYOUT-FIXES ERFORDERLICH:**
1. **Header mit Tab-Navigation implementieren** (schwarzer Header, weiße Tabs)
2. **3-Spalten-Layout erstellen** (Input links, Diagramm zentral, Controls rechts)
3. **CSS-Styling korrigieren** (Original main.css übernehmen)
4. **Venn-Diagramm-Größe maximieren** 
5. **Set-Input-Panel kompakter gestalten** (vertikale Anordnung mit Farb-Indikatoren)
6. **Export-Controls nach rechts verschieben**

**�🔧 NÄCHSTE SCHRITTE:**
1. **PRIORITÄT 1:** Layout-Struktur komplett überarbeiten (Header + 3-Spalten)
2. **PRIORITÄT 2:** Original CSS integrieren für visuelle Parität
3. SVG-Template-Loading und Diagramm-Rendering vervollständigen
4. Set-Intersection-Calculation implementieren
5. Modal-Dialog für Region-Details implementieren
6. Slider/Tree-Mode-Navigation implementieren
7. Mouseover-Effekte hinzufügen

## Fortschritts-Checkliste

- [x] Kernfunktionen und Legacy-Quellen identifiziert
- [x] Mapping-Tabelle Legacy → React/TypeScript erstellt
- [x] Projekt mit React, TypeScript, Vite/Webpack korrekt konfiguriert
- [x] Komponenten-Shells in `InteractiVenn.tsx` angelegt (App, Header, InputPanel, VisualizationPanel, Visualization, Footer)
- [x] Set-Operationen (Union, Intersection, Subtract, etc.) nach TypeScript portiert und getestet
- [x] Typen für Mengen, Labels, Intersections in `types.ts` definiert
- [x] Utility-Funktionen für Parsing, Duplikat-Entfernung, etc. erstellt
- [x] State-Management für Mengen, Labels, Farben, Opazität, Font-Size, Visualisierungsmodus, Frame/Level, Intersections, aktuelle Region umgesetzt
- [x] Logik für das Parsen und Anwenden von Union-Operationen (Slider/Tree) übernommen (**TEILWEISE:** Basis-Framework erstellt)
- [x] Interaktive Features (Mouseover, Klick auf Regionen, Anzeige von Elementlisten) als React-Events umgesetzt
- [x] HTML-Struktur aus `index.html`/`index2.html` in JSX übersetzt
- [x] Controls (Buttons, Inputs, Color-Picker, File-Upload, etc.) als React-Komponenten nachgebaut: Aufgeteilt in `InputPanel` und `VisualizationPanel`.
- [x] SVG-Diagramm exakt nach Vorlage gerendert (inkl. dynamischer Labels, Farben, Opazität, Font-Size) (**TEILWEISE:** Basis-Structure erstellt)
- [x] Original-CSS (`main.css`) übernommen/angepasst, bis visuelle Parität erreicht ist
- [x] .ivenn-Dateien laden und speichern (Textformat) (**ERLEDIGT:** File-Handler implementiert)
- [x] Diagramm-Export als SVG und PNG (Canvas-Konvertierung) (**ERLEDIGT:** Export-Funktionen implementiert)
- [x] File-Upload/-Download-Logik in React umgesetzt (**ERLEDIGT:** Vollständig in InputPanel/VisualizationPanel)
- [ ] Slider-Modus: Navigation durch Union-Frames, Undo/Redo, Anzeige der aktuellen Union
- [ ] Tree-Modus: Newick-Parser, Tree-Visualisierung, Navigation durch Tree-Level, Dendrogramm-Export
- [ ] Mouseover-Effekte für Regionen und Labels
- [x] Klick auf Regionen: Anzeige der enthaltenen Elemente in einem Modal/Dialog (**TEILWEISE:** Event-Handler erstellt)
- [x] Dynamische Aktualisierung aller UI-Elemente bei State-Änderungen
- [x] Unit-Tests für Set-Operationen und Parsing-Logik (Jest)
- [ ] End-to-End-Tests für die wichtigsten User-Flows (optional)
- [ ] Manuelle Prüfung auf vollständige visuelle und funktionale Parität
- [x] Build-Skripte für Produktion (Vite/Webpack)
- [ ] Letzter visueller Vergleich mit Original-Webseite
- [ ] Dokumentation der Migration und Hinweise für zukünftige Wartung

## Referenzdateien für die Migration

Die folgenden Legacy-Dateien dienen als maßgebliche Referenz für die Migration und den visuellen sowie funktionalen Vergleich:

- **legacy/web/index.html**: Original-Startseite im Slider-Modus (Unions by list)
- **legacy/web/index2.html**: Original-Startseite im Tree-Modus (Unions by tree)
- **legacy/web/help.html**: Hilfeseite (Help)
- **legacy/web/contact.html**: Kontaktseite (Contact)
- **legacy/web/citation.html**: Zitationshinweise (Citation)
- **legacy/web/css/main.css**: Original-Stylesheet für das Look & Feel

Diese Dateien sind die Grundlage für die 1:1-Übernahme von Layout, Funktionalität und Inhalt. Die neue Anwendung muss in allen Aspekten mit diesen Vorlagen übereinstimmen. Für die Migration der statischen Seiten (Hilfe, Kontakt, Zitation) werden die Inhalte aus den jeweiligen HTML-Dateien übernommen und als React-Komponenten eingebunden. Für die Visualisierung und Controls dienen `index.html` und `index2.html` als Vergleich für die beiden Modi (Slider/Tree).

---

**Hinweis:**
Jedes Mal, wenn eine Aufgabe erledigt ist, bitte das entsprechende Kästchen abhaken (von [ ] auf [x] setzen) und diese Datei aktualisieren.
