const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Disable web security and Cross-Origin Opener Policy (COOP) to allow Firebase Auth popup communication
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy,CrossOriginOpenerPolicyByDefault');

let mainWindow;
let localServer;

// Start local HTTP server on a stable, fixed port to preserve user's origin, local storage, and login persistence.
// Falls back to port+1 incrementally if port is already bound.
function startLocalServer(port = 51833) {
  const server = http.createServer((req, res) => {
    const safeUrl = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(__dirname, '../dist', safeUrl === '/' ? 'index.html' : safeUrl);
    
    // SPA routing: fallback to index.html if file doesn't exist
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, '../dist/index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.pdf': 'application/pdf'
    }[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Internal Server Error: ${err.code}`);
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Opener-Policy': 'unsafe-none'
        });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({ server, port });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        resolve(startLocalServer(port + 1));
      } else {
        console.error("Local server error:", err);
      }
    });
  });
}

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 830,
    minWidth: 1000,
    minHeight: 600,
    title: "Data Scientist Path",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, // Disable webSecurity inside webPreferences as well
      plugins: true // Enable built-in PDF viewer plugin
    },
    // Sleek macOS design integration
    titleBarStyle: 'hiddenInset', 
    backgroundColor: '#13111c', // Match the custom dark mode pastel background!
    show: false // Show only when ready to avoid white flicker
  });

  // Native back/forward history navigation for macOS swipe trackpad gestures and mouse buttons
  mainWindow.on('swipe', (event, direction) => {
    if (direction === 'left') {
      if (mainWindow.webContents.canGoForward()) {
        mainWindow.webContents.goForward();
      }
    } else if (direction === 'right') {
      if (mainWindow.webContents.canGoBack()) {
        mainWindow.webContents.goBack();
      }
    }
  });

  mainWindow.on('app-command', (event, cmd) => {
    if (cmd === 'browser-backward' && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    } else if (cmd === 'browser-forward' && mainWindow.webContents.canGoForward()) {
      mainWindow.webContents.goForward();
    }
  });

  // Open developer tools ONLY in development mode to avoid exposing source code window in production
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Redirect frontend console messages to terminal output
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[FRONTEND CONSOLE] ${message} (Line: ${line}, Source: ${path.basename(sourceId)})`);
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Start local server to host build under localhost origin (required for Firebase Auth OAuth popups)
    startLocalServer().then(({ server, port }) => {
      localServer = server;
      mainWindow.loadURL(`http://localhost:${port}`);
    }).catch(err => {
      console.error("Failed to start local HTTP server:", err);
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (localServer) {
      localServer.close();
      localServer = null;
    }
  });
}

// Security restrictions for production & Firebase Auth configuration
app.on('web-contents-created', (event, contents) => {
  // Set standard User Agent for all windows (including popups) to prevent Google OAuth blocks
  const customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
  contents.setUserAgent(customUserAgent);

  contents.setWindowOpenHandler(({ url }) => {
    // Allow Firebase Auth popup windows to open as child windows in Electron
    if (url.includes('firebaseapp.com') || url.includes('__/auth/')) {
      return { 
        action: 'allow',
        overrideBrowserWindowOptions: {
          webPreferences: {
            contextIsolation: false,
            sandbox: false,
            webSecurity: false // Disable webSecurity on the popup window
          }
        }
      };
    }
    // Open all other external URLs in default system browser instead of Electron window
    const { shell } = require('electron');
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

function setMainMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom', accelerator: 'CmdOrCtrl+0' },
        { role: 'zoomIn', accelerator: 'CmdOrCtrl+=' },
        { role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win && win.webContents.canGoBack()) {
              win.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win && win.webContents.canGoForward()) {
              win.webContents.goForward();
            }
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  setMainMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
