# InteractiVenn User Actions, UI, and System Responses

This document details the user interactions, UI elements, and corresponding system responses of the legacy InteractiVenn application. This analysis is based on the legacy files: `index.html`, `javascript.js`, `slider.js`, and `tree.js`.

## 1. Main Page (`index.html`)

### UI Elements

*   **Header**: Contains the title "InteractiVenn" and links to "Help", "Contact", and "Citation".
*   **Input Panel (Left)**:
    *   Text areas for up to 6 lists.
    *   "Load" button to load an `.ivenn` file.
    *   "Save" button to save the current state as an `.ivenn` file.
    *   "Clear" button to clear all input fields.
    *   "Submit" button to generate the Venn diagram.
    *   Example datasets links ("prostate\_dataset.ivenn", "banana\_dataset.ivenn").
*   **Visualization Panel (Center)**:
    *   Displays the Venn diagram SVG.
    *   Intersection labels (e.g., "ab", "abc") are displayed on the diagram.
    *   Mouseover on diagram regions highlights them.
    *   Clicking on a diagram region shows a modal with the list of intersecting elements.
*   **Controls Panel (Right)**:
    *   "Export" section with buttons to export the diagram as SVG, PNG, or the lists as TXT.
    *   "Colors" section with color pickers for each list.
    *   "Sizes" section with a slider to adjust the size of the diagram.
    *   "Display Mode" with options to show counts, percentages, or both.

### User Actions and System Responses

| User Action | UI Element | System Response |
| :--- | :--- | :--- |
| **Input Data** | Text Areas | User can type or paste lists of items, one item per line. |
| **Load Data** | "Load" button | Opens a file dialog to select an `.ivenn` file. The content of the file populates the input text areas. |
| **Save Data** | "Save" button | Generates and downloads an `.ivenn` file with the current lists. |
| **Clear Inputs** | "Clear" button | Clears all text areas and resets the visualization. |
| **Generate Diagram** | "Submit" button | 1. Reads the lists from the text areas. <br> 2. Calculates intersections between all lists. <br> 3. Selects the appropriate SVG template based on the number of lists (2-6). <br> 4. Populates the SVG with intersection sizes/percentages. <br> 5. Renders the SVG in the Visualization Panel. |
| **Load Example** | Example dataset links | Loads the content of the selected `.ivenn` file into the input text areas and generates the diagram. |
| **Mouseover Diagram** | SVG regions | The hovered region is highlighted (e.g., stroke color changes). |
| **Click Diagram** | SVG regions | A modal window appears, displaying the list of items in the selected intersection. |
| **Export SVG** | "Export as SVG" button | Generates and downloads the current Venn diagram as an SVG file. |
| **Export PNG** | "Export as PNG" button | Generates and downloads the current Venn diagram as a PNG file. |
| **Export TXT** | "Export as TXT" button | Generates and downloads a text file containing the lists of items for each intersection. |
| **Change Color** | Color pickers | Updates the color of the corresponding circle/ellipse in the Venn diagram in real-time. |
| **Change Size** | Size slider | Resizes the Venn diagram SVG in the Visualization Panel in real-time. |
| **Change Display Mode** | Radio buttons (Counts, %, Both) | Updates the labels on the diagram to show counts, percentages, or both for each intersection. |

## 2. JavaScript Logic (`javascript.js`, `slider.js`, `tree.js`)

*   **`javascript.js`**:
    *   Handles the core logic of reading inputs, calculating intersections, and updating the DOM.
    *   Contains functions for file loading/saving (`.ivenn`).
    *   Manages the display of intersection data in the modal.
    *   Handles the export functionality (SVG, PNG, TXT).
*   **`slider.js`**:
    *   Implements the logic for the size slider in the right panel.
    *   Updates the `width` and `height` attributes of the SVG element.
*   **`tree.js`**:
    *   This file seems to be related to a tree view, but its direct usage in the main `index.html` is not immediately clear. It might be part of an unused feature or an alternative view (`index2.html`).

This detailed breakdown will guide the implementation of the React components and state management to ensure functional parity with the legacy application.
