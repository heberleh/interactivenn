<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Custom Instructions
- Use React (with functional components and hooks) and TypeScript for all new code.
- Maintain strict 1:1 visual and functional parity with the original InteractiVenn web application.
- Do not introduce new features or legacy code from other branches.
- Use modular, maintainable, and modern code structure.
- Use semantic, human-understandable component names (e.g., InputPanel, VisualizationPanel).
- Keep state management local where possible, and use idiomatic React patterns.
- Use the original CSS (`main.css`) as a reference for visual parity, but adapt to modern best practices.
- All static content (Help, Contact, Citation) should be implemented as React components.
- Always update `PROJECT_STRUCTURE.md` and `MIGRATION_CHECKLIST.md` when making structural or migration-relevant changes.
- Always try to run the application in dev mode using `npm run dev` (not `npm start`). There is no `npm start` script in this project. If it fails with errors, prioritize fixing them. If the fix is not straightforward, document the errors and your planned next steps in `MIGRATION_CHECKLIST.md` before attempting to migrate more features.
- If the code cannot be compiled, don't try to migrate more features. Instead, try to fix the problem. Access the 'Problems' report from VSCode if you can.
- When working on Layout of the website and Look and Feel, always refer to the original legacy website screenshot `legacy/legaccy_screenshot.png` to ensure visual consistency.
## Folder Structure Overview

- `src/components/`: React components (functional, TypeScript).
- `src/pages/`: Static and routed pages.
- `src/utils/`: Utility/helper functions.
- `src/hooks/`: Custom React hooks.
- `src/types.ts`: TypeScript type definitions.
- `src/assets/`: Project-specific static assets (images, icons, etc).
- `public/`: Publicly served static files.
- `legacy/web/`: Reference legacy code for migration.

## Migration Reference

- Refer to the legacy files in `legacy/` and subfolders and files for all migration and parity tasks.
- Use the checklist in `MIGRATION_CHECKLIST.md` to track progress and ensure completeness.
