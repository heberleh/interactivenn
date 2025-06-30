<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Custom Instructions für InteractiVenn-Migration

## Projektziel

Dieses Projekt ist eine 1:1-Migration der InteractiVenn-Webanwendung zu React + TypeScript. Ziel ist vollständige visuelle und funktionale Parität mit der Original-Webanwendung. Keine neuen Features, keine Altlasten. Fokus auf sauberen, modernen Code und Komponentenstruktur.

## Neue Anforderungen (Juni 2025)

- **Legacy-Seiten übernehmen:** Die Seiten `help.html`, `contact.html`, `citation.html` aus `legacy/web/` werden als React-Komponenten übernommen und in die App eingebunden (z.B. über ein Menü oder Footer-Links).
- **Modus-Auswahl (Tree/Slider):** Die Unterscheidung zwischen Tree- und Slider-Modus erfolgt nicht mehr über verschiedene Seiten (`index.html`/`index2.html`), sondern als Modus-Selector (Dropdown, Tabs o.ä.) direkt im Visualisierungsbereich. Die Seite bleibt gleich, nur die Visualisierung und Controls passen sich an. Die Umschaltung des Modus erfolgt lokal im Diagramm-Bereich, ohne Seitenwechsel. Die Visualisierungskomponente rendert je nach Modus die passenden Buttons, Controls und Logik für Tree- bzw. Slider-Ansicht. Die State-Logik für den Modus ist lokal im Visualisierungsbereich zu halten und nicht global als Seitenrouting.
- **Komponentenstruktur:** Die App bleibt eine SPA. Die Visualisierungskomponente zeigt je nach Modus die passenden Buttons und Controls für Tree oder Slider.
- **Visuelle Parität:** Die übernommenen Legacy-Seiten sollen im Look & Feel an das neue Design angepasst werden, aber inhaltlich identisch bleiben.

## Vorgehen

1. Inhalte der Legacy-Seiten als React-Komponenten übernehmen und einbinden.
2. Modus-Selector im Visualisierungsbereich einbauen, der die Ansicht und Controls dynamisch anpasst.
3. Menü oder Footer-Links zu den statischen Seiten (Hilfe, Kontakt, Zitation) bereitstellen.
4. `.github/copilot-instructions.md` und Projektdokumentation entsprechend aktualisieren.

## Hinweise für Copilot
- Keine neuen Features oder Experimente, nur 1:1-Übernahme und Modernisierung.
- Keine Altlasten aus der dev-Branch übernehmen.
- Komponentenstruktur und State-Management nach modernen React/TypeScript-Standards.
- Legacy-Inhalte (Hilfe, Kontakt, Zitation) als statische Komponenten, keine dynamische Logik nötig.
- Modus-Selector für Tree/Slider lokal im Diagramm-Bereich, nicht als Seitenwechsel.

---

## Fortschritts-Checkliste (bitte bei jedem Fortschritt aktualisieren)

- [x] Kernfunktionen und Legacy-Quellen identifiziert
- [x] Mapping-Tabelle Legacy → React/TypeScript erstellt
- [x] Projekt mit React, TypeScript, Vite/Webpack korrekt konfiguriert
- [x] Komponenten-Shells in `InteractiVenn.tsx` angelegt (App, Header, Controls, Visualization, Footer)
- [x] Set-Operationen (Union, Intersection, Subtract, etc.) nach TypeScript portiert und getestet
- [x] Typen für Mengen, Labels, Intersections in `types.ts` definiert
- [x] Utility-Funktionen für Parsing, Duplikat-Entfernung, etc. erstellt
- [x] State-Management für Mengen, Labels, Farben, Opazität, Font-Size, Visualisierungsmodus, Frame/Level, Intersections, aktuelle Region umgesetzt
- [ ] Logik für das Parsen und Anwenden von Union-Operationen (Slider/Tree) übernommen
- [x] Interaktive Features (Mouseover, Klick auf Regionen, Anzeige von Elementlisten) als React-Events umgesetzt
- [x] HTML-Struktur aus `index.html`/`index2.html` in JSX übersetzt
- [x] Controls (Buttons, Inputs, Color-Picker, File-Upload, etc.) als React-Komponenten nachgebaut
- [x] SVG-Diagramm exakt nach Vorlage gerendert (inkl. dynamischer Labels, Farben, Opazität, Font-Size)
- [ ] Original-CSS (`main.css`) übernommen/angepasst, bis visuelle Parität erreicht ist
- [x] .ivenn-Dateien laden und speichern (Textformat)
- [x] Diagramm-Export als SVG und PNG (Canvas-Konvertierung)
- [x] File-Upload/-Download-Logik in React umgesetzt
- [ ] Slider-Modus: Navigation durch Union-Frames, Undo/Redo, Anzeige der aktuellen Union
- [ ] Tree-Modus: Newick-Parser, Tree-Visualisierung, Navigation durch Tree-Level, Dendrogramm-Export
- [ ] Mouseover-Effekte für Regionen und Labels
- [x] Klick auf Regionen: Anzeige der enthaltenen Elemente in einem Modal/Dialog
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