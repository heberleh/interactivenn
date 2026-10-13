# CLAUDE.md: InteractiVenn v0 (the 2015 app)

The original jQuery/D3 InteractiVenn from the 2015 BMC Bioinformatics paper (doi:10.1186/s12859-015-0611-3). Static files in `web/`, no build. Upstream: github.com/heberleh/interactivenn (also served at heberleh.github.io/interactivenn/web/).

- Live: https://v0.interactivenn.fyi (Cloudflare Pages project `interactivenn-v0`, direct upload). Publish with `./deploy.sh` (needs a clean tree; uses the cf CLI login).
- **Owner rule (2026-10-13): fixes must not break the app or change how it looks.** Keep every change minimal; check before deploying that pages render the same (screenshot compare with the previous deploy) and the console has no errors.
- Local check: `cd web && python3 -m http.server 8095`, open the pages, run the union/tree examples.
- Deliberate difference from 2015: the Google Analytics tags were removed (commit ba4f5e6, owner decision 2026-10-13): no third-party requests. Keep it that way.
- The HTML files use CRLF line endings: edit byte-safely so a diff shows only the lines changed.
- Related: v1 in `../interactivenn-v1`, v2 in `../interactivenn_react`.
