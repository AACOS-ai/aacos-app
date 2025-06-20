const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { askAI } = require('./api');

let win;
let userPrefsMap = {};
const userPrefsPath = path.join(__dirname, 'user_data', 'userPrefs.json');
if (fs.existsSync(userPrefsPath)) {
  userPrefsMap = JSON.parse(fs.readFileSync(userPrefsPath, 'utf-8'));
}

function savePrefs() {
  fs.writeFileSync(userPrefsPath, JSON.stringify(userPrefsMap, null, 2));
}

function sendUserPrefs(user = null) {
  const prefs = user ? userPrefsMap[user] || null : null;
  const allUsers = Object.keys(userPrefsMap);
  win.webContents.send('load-user-prefs', { user, prefs, allUsers });
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.loadURL('http://localhost:5173');

  win.webContents.on('did-finish-load', () => {
    sendUserPrefs();
  });
});

ipcMain.handle('ask-ai', async (_event, messages) => {
  return await askAI(messages);
});

ipcMain.on('switch-user', (_event, user) => {
  if (!userPrefsMap[user]) {
    userPrefsMap[user] = { firstTime: true };
    savePrefs();
  }
  sendUserPrefs(user);
});

ipcMain.on('save-prefs', (_event, { user, prefs }) => {
  userPrefsMap[user] = prefs;
  savePrefs();
  sendUserPrefs(user);
});

// Add support for username prompt from renderer
ipcMain.handle('prompt-for-username', async () => {
  const { response, checkboxChecked } = await dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['OK'],
    title: 'New User',
    message: 'Please enter a new username in the frontend.',
    detail: 'Due to limitations, prompt() is not supported. Use a form input instead.'
  });
  return null; // Placeholder, frontend should use a modal/input form instead
});
