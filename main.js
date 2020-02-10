const electron = require('electron')
const path = require('path')
const {
  app,
  BrowserWindow,
  Menu
} = require('electron')

process.env.NODE_ENV = 'development';

let mainWindow;

let createWindow = () => {
  // Création de la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: "#2E2C29",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // Chargement du fichier index.html de l'application
  mainWindow.loadFile('index.html')

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Construction du menu à partir du modèle
  const mainMenu = Menu.buildFromTemplate(modelMenu)

  // Insertion du menu
  Menu.setApplicationMenu(mainMenu)
}
app.on('ready', createWindow)

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (mainWindow === null) {
    createWindow()
  }
})

// Création du modèle de menu
const modelMenu = [{
  label: 'File',
  submenu: [{
    label: "Quitter l'application",
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }]
}];

// Ajout des outils de développement si on développe l'application
if (process.env.NODE_ENV !== 'production') {
  modelMenu.push({
    label: 'Développement',
    submenu: [{
        label: 'Rafraîchir',
        role: 'reload'
      },
      {
        label: 'Inspecter les éléments',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}