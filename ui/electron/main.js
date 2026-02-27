import { app, BrowserWindow } from 'electron'

function createWindows() {

  // Center Console (iPad-like)
  const center = new BrowserWindow({
    width: 1600,
    height: 1000,
    frame: false,
    webPreferences: {
      contextIsolation: true
    }
  })

  center.loadURL('http://localhost:5173/center')

  // Gauge Cluster (wide horizontal)
  const cluster = new BrowserWindow({
    width: 1920,
    height: 480,
    frame: false,
    webPreferences: {
      contextIsolation: true
    }
  })

  cluster.loadURL('http://localhost:5173/cluster')
}

app.whenReady().then(createWindows)
