const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Mi Cerebro IA - Estudio",
    autoHideMenuBar: true, // Esto quita la barra de menús de arriba para que parezca app pro
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Durante el desarrollo, cargamos lo que hace Vite
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});