const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;
let server;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // In production, serve the static files.
    // In development, we can load from the Next.js dev server.

    if (app.isPackaged) {
        const expressApp = express();
        const staticPath = path.join(process.resourcesPath, 'app', 'out');
        expressApp.use(express.static(staticPath));

        server = expressApp.listen(0, () => {
            const port = server.address().port;
            console.log(`Server running on port ${port}`);
            mainWindow.loadURL(`http://localhost:${port}`);
        });
    } else {
        // In development, load the Next.js dev server
        mainWindow.loadURL('http://localhost:3000');
    }

    // Open the DevTools in development
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (server) {
        server.close();
    }
});
