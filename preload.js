const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('api', {
    SaveDNS: (dns) => ipcRenderer.send("save", dns),
    exit: () => ipcRenderer.invoke("exit"),
    setDHCP: () => ipcRenderer.invoke("setDHCP"),
    setShekan: () => ipcRenderer.invoke("setShekan"),
    success: (callback) => {
        ipcRenderer.on("success", (_eve, data) => {
            callback(data)
        })
    },
    error: (callback) => {
        ipcRenderer.on("error", (_eve, data) => {

            callback(data)
        })
    },

})
