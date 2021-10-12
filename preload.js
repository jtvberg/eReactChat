const { ipcRenderer, contextBridge, contentTracing } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message)
    }
  },
  otherApi: {
    
  }
})