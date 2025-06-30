# Project File and Folder Overview

This document provides a description of every major file and folder in the InteractiVenn project, including the legacy codebase. The new codebase is a refactoring of the old website, aiming for modularized, maintainable code using TypeScript and React.

---

## Root Directory

- **LICENSE**: Project license information.
- **README.md**: Project overview and setup instructions.
- **MIGRATION_CHECKLIST.md**: Checklist for migration progress and tasks.
- **eslint.config.js**: ESLint configuration for code linting.
- **index.html**: Main HTML entry point for the new app.
- **jest.config.cjs / jest.config.js**: Configuration files for Jest testing.
- **package.json / package-lock.json**: Node.js project metadata and dependencies.
- **tsconfig.json / tsconfig.app.json / tsconfig.node.json**: TypeScript configuration files.
- **vite.config.ts**: Vite build tool configuration.
- **public/**: Static assets and SVG diagram templates for the new app.
- **src/**: Main source code for the new React + TypeScript application.

---

## src/

- **App.tsx, App.css**: Main React app component and styles.
- **InteractiVenn.tsx**: Core logic and layout for the InteractiVenn visualization.
- **SetService.ts, SliderService.ts, TreeService.ts**: Services for set operations and visualization logic.
- **main.tsx**: React app entry point.
- **types.ts**: TypeScript type definitions for sets, labels, intersections, etc.
- **index.css**: Global styles.
- **vite-env.d.ts**: Vite environment type declarations.
- **assets/**: Static assets (e.g., SVGs, images) for the app.
- **components/**: Modular React components (ColorPicker, FileUpload, Footer, Header, InputPanel, SetInput, Visualization, VisualizationPanel, and tests).
- **hooks/**: Custom React hooks (e.g., useVennDiagram).
- **utils/**: Utility functions and tests (set operations, SVG template loader, etc.).

---

## public/

- **vite.svg**: Vite logo.
- **svg-templates/**: SVG files for diagram templates.
- **templates/**: Multiple SVG diagram templates for 2- to 6-way Venn diagrams.

---

## legacy/

This folder contains the old website codebase, which is used for reference during the refactoring. The legacy code includes the original HTML, JavaScript, and assets for InteractiVenn.

### legacy/web/

- **index.html**: Original homepage (Slider mode logic).
- **index2.html**: Original homepage (Tree mode logic).
- **help.html, contact.html, citation.html**: Static help, contact, and citation pages.
- **javascript.js, slider.js, tree.js**: Main JavaScript logic for the legacy app.
- **css/main.css**: Original stylesheet for the legacy app.
- **d3/**: Third-party libraries and plugins (D3, canvg, jscolor, etc.).
- **diagrams/**: SVG and text files for Venn diagram templates (2- to 6-way), scripts for generating diagrams, and backups.
- **images/**: Image assets (e.g., vicg.png).
- **banana_dataset.ivenn, prostate_dataset.ivenn, test_model.ivenn**: Example dataset files.

---

## Refactoring Note

The new codebase is a complete refactor of the legacy website, focusing on modularized, maintainable code using TypeScript and React. The legacy folder is preserved for reference, especially for porting logic and ensuring visual/functional parity. The new app is structured as a modern SPA with reusable components and strong typing.
