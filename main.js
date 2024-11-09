// main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';
// import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // If you have a preload script
      nodeIntegration: false, // Disable Node integration for security
      contextIsolation: true, // Enable context isolation for security
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3006'); // Correct port for React app
    mainWindow.webContents.openDevTools(); // Optional: Open DevTools in development
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'client', 'build', 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) serverProcess.kill();
  });
}

app.on('ready', () => {
  // Start the Node.js server
  // serverProcess = spawn('node', ['./index.js'], {
  //   cwd: __dirname,
  //   stdio: 'inherit',
  //   shell: true,
  // });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});
