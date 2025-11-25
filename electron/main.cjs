const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // In production, serve the static files.
    // In development, we can load from the Next.js dev server.

    if (app.isPackaged) {
        // Load the index.html file from the dist/out folder
        // __dirname is electron/ so we go up one level to find out/
        const indexPath = path.join(__dirname, '../out/index.html');
        mainWindow.loadFile(indexPath);
    } else {
        // In development, load the Next.js dev server
        mainWindow.loadURL('http://localhost:3000');
    }

    // Open the DevTools in development
    // if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
    // }

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
