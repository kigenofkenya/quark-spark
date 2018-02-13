'use strict'

import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron'
import Store from 'electron-store'

const userOpts = {
  isSingleInstance: true
}
const { isSingleInstance } = userOpts
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// Open app config and keep it in globals
global.config = null
try {
  global.config = new Store()
} catch (e) {}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  let mainWindowOptions = {
    show: false,
    backgroundColor: '#effafe',
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400
    // webPreferences: { devTools: false }
  }

  const appConfig = global.config
  if (appConfig) {
    try {
      const w = appConfig.get('view.window') || {}
      if (w.width) mainWindowOptions.width = w.width
      if (w.height) mainWindowOptions.height = w.height
      if (w.x) mainWindowOptions.x = w.x
      if (w.y) mainWindowOptions.y = w.y
    } catch (e) {}
  } else {
    mainWindowOptions.center = true
  }

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow(mainWindowOptions)

  mainWindow.loadURL(winURL)

  mainWindow.setMenu(null)

  mainWindow.allowClose = false
  mainWindow.on('close', (event) => {
    if (mainWindow.allowClose) return
    event.preventDefault()
    event.sender.send('request-close-app')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || isSingleInstance) {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// ********** IPC Handlers **********
