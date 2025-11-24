# Electron Packaging Guide

This project is configured to be packaged as a Windows installable .exe using Electron.

## Prerequisites
- Node.js installed.
- Tally Prime running on `http://localhost:9000` (for the app to connect to).

## Development
To run the app in development mode (Next.js dev server + Electron window):

```bash
npm run electron:dev
```

This will:
1. Start the Next.js dev server on port 3000.
2. Wait for it to be ready.
3. Launch Electron loading `http://localhost:3000`.

## Building for Production
To package the application as an installer:

```bash
npm run package
```
or
```bash
npm run electron:build
```

This will:
1. Build the Next.js app (`next build`).
2. Export the static files to `out/` (`output: 'export'`).
3. Package the Electron app using `electron-builder`.

The output installer (e.g., `TallyInsight Dashboard Setup X.X.X.exe`) will be in the `dist/` folder.

## QA Checklist
1. **Launch**: Install the .exe and launch the app.
2. **Content**: Verify the dashboard loads correctly.
3. **Tally Connection**: Ensure the app can fetch data from Tally (running on localhost:9000).
   - *Note*: The Electron app runs on `localhost` (served by Express), so it should be able to call Tally's localhost API without CORS issues if Tally allows it, or via the main process if needed.
4. **Navigation**: Click around to ensure all pages work (client-side routing).
5. **Reload**: Press Ctrl+R (or Cmd+R) to reload and ensure it still works.

## Troubleshooting
- **White Screen**: Check if `out/` folder was generated correctly. Check console for errors (Ctrl+Shift+I).
- **Tally Error**: Ensure Tally is running and accessible at port 9000.
- **Build Error**: If building on macOS for Windows, you might need `wine` installed, or build on a Windows machine.
