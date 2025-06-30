<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Dieses Projekt ist eine 1:1-Migration von InteractiVenn zu React + TypeScript. Ziel ist vollständige visuelle und funktionale Parität mit der Original-Webanwendung. Keine neuen Features, keine Altlasten. Fokus auf sauberen, modernen Code und Komponentenstruktur.
Project Modernization: A Focused Migration of InteractiVenn to React & TypeScript
Primary Goal: A Clean, 1-to-1 Migration
The highest priority of this project is a clean and efficient migration of the existing InteractiVenn application to a modern tech stack. The scope is strictly limited to replicating the current functionality and visual appearance in React and TypeScript. New features, such as .xls support, are explicitly out of scope for this phase. The project must result in a clean, maintainable codebase, avoiding the structural issues present in the dev branch.
1. Overview
InteractiVenn is an essential web-based tool for the scientific community. This initiative will refactor the application into a modern, single-page application (SPA). All existing functionality will be preserved, and the final product will be visually indistinguishable from the original website.
2. Core Principles & Constraints for Efficiency
 * Analyze First, Code Second: We will thoroughly audit the existing main and dev branches to extract only the logic required to rebuild the current features.
  * dev Branch as a Reference Only: The dev branch should be used as a reference for reusable business logic and algorithms. Its file structure, duplicated code, and incomplete features must be ignored. We are starting with a clean project structure.
   * Visual & Functional Parity: The new application must look and feel exactly like the original. This includes layout, styling, and all user interactions.
    * Single-File Refactoring (Stage 1): To manage scope and cost, the initial migration will consolidate the application logic into a single .tsx file. If costs are not reduced with taking this approach, then the creation of multiple.tsx is allowed.
     * Technology Stack: TypeScript, React, and Webpack, set up with npm.
     3. Step-by-Step Migration Plan
     Here is a high-level, phased approach designed for a focused and efficient migration.
     Phase 0: Strategic Analysis & Logic Extraction (Critical First Step)
     The objective is to create a precise map of the logic needed for a 1-to-1 migration, drawing from the best parts of the existing branches.
      * Task 0.1: Full Codebase Audit
         * Review the main branch to map out all core functionality: set operations, SVG drawing, UI interactions, and visualization modes ("Slider" and "Tree").
            * Review the dev branch to identify any superior or already-migrated TypeScript logic that can be salvaged, while discarding its messy structure.
             * Task 0.2: Create a Reuse & Integration Map
                * Document exactly which functions from main and dev will be ported to implement the existing feature set.
                   * Define a clear strategy for merging these sources into a cohesive whole, preventing any duplication of effort.
                   Phase 1: Foundational Setup & Component Shells
                   This phase establishes a clean project foundation, independent of the legacy structure.
                    * Task 1.1: Project Initialization & Webpack Configuration
                       * Set up a clean npm project, and configure Webpack and TypeScript.
                        * Task 1.2: Create the Single Page & App Entrypoint
                           * Create a clean folder structure (public/, src/).
                              * Create public/index.html and the main application file: src/InteractiVenn.tsx.
                               * Task 1.3: Define Component Shells (within the single file)
                                  * Based on the Phase 0 analysis, create the empty functional components inside InteractiVenn.tsx: App, Header, Controls, Visualization, Footer, etc.
                                  Phase 2: Porting Core Logic & Achieving Visual Parity
                                  The focus here is on rebuilding the application's engine and skin.
                                   * Task 2.1: Port, Refactor & Test Reusable Set Logic
                                      * Migrate the essential set-theory functions identified in the audit into src/InteractiVenn.tsx as TypeScript functions.
                                         * Write unit tests for this core logic using Jest to ensure correctness.
                                          * Task 2.2: Implement the Interactive Diagram Component
                                             * Port the SVG generation logic, using the strategy decided in Phase 0.
                                                * Connect the component to React state and event handlers to ensure full interactivity.
                                                 * Task 2.3: Recreate Original CSS
                                                    * Create a CSS file and meticulously replicate the styles from the original website to ensure visual parity. The goal is for a user to not notice the underlying technology has changed.
                                                    Phase 3: Final Integration & Testing
                                                    This final phase connects all the pieces and ensures the application is a robust and faithful replacement for the original.
                                                     * Task 3.1: Implement State Management & Data Flow
                                                        * Use React hooks (useState, useMemo) in the main App component to manage the application state (sets, inputs, visualization mode).
                                                           * Wire the Controls component's inputs to the state, ensuring the diagram updates reactively.
                                                            * Task 3.2: End-to-End Functionality Testing
                                                               * Perform thorough testing on all features: data input, diagram generation for all set numbers, interactivity (hovers, clicks), view switching, and data export/save functionality (as .ivenn).
                                                                * Task 3.3: Final Polish & Deployment
                                                                   * Create production build scripts in package.json using Webpack to generate optimized assets for deployment.

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

**Hinweis:**
Jedes Mal, wenn eine Aufgabe erledigt ist, bitte das entsprechende Kästchen abhaken (von [ ] auf [x] setzen) und diese Datei aktualisieren.