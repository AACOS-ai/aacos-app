const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'user_data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

contextBridge.exposeInMainWorld('electronAPI', {
  loadHistory: (user) => {
    const file = path.join(dataDir, `${user}.json`);
    if (!fs.existsSync(file)) return Promise.resolve([]);
    const content = fs.readFileSync(file, 'utf-8');
    return Promise.resolve(JSON.parse(content));
  },
  saveHistory: (user, messages) => {
    const file = path.join(dataDir, `${user}.json`);
    fs.writeFileSync(file, JSON.stringify(messages, null, 2));
  },
  askAI: (messages) => ipcRenderer.invoke('ask-ai', messages),
  switchUser: (user) => ipcRenderer.send('switch-user', user),
  updateUserPrefs: (user, prefs) => ipcRenderer.send('save-prefs', { user, prefs }),
  onLoadUserPrefs: (callback) => ipcRenderer.on('load-user-prefs', (_event, data) => callback(data)),

  // New: show input dialog (for username prompt replacement)
  requestUsername: () => ipcRenderer.invoke('prompt-for-username')
});