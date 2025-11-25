const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Add any API methods here that you want to expose to the renderer
    // Example: sendMessage: (message) => ipcRenderer.send('message', message)
});
