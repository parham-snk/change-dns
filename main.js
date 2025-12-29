const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { exec } = require("child_process")
const { send } = require('process')
const { text } = require('stream/consumers')
const { stat } = require('fs')
let win

function createWindow() {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        maxWidth: 600,
        maxHeight: 300,
        center: true,
        movable: true,
        autoHideMenuBar: true,
        transparent: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })


    win.loadFile("index.html")
}

app.whenReady().then(() => {

    ipcMain.handle("exit", () => {
        win.close()   // ✅ نه app.exit
    })

    ipcMain.on("save", (event, dns) => {
        if (typeof dns !== "string") return

        const parts = dns.split(".")
        const valid =
            parts.length === 4 &&
            parts.every(p => /^\d+$/.test(p) && +p >= 0 && +p <= 255)

        console.log(valid ? "ok!" : "failed!")
    })
    ipcMain.handle("setDHCP", () => {
        exec("netsh interface ip set dns name=\"Wi-Fi\" dhcp", (err, std, stderr) => {

            if (err && stderr) {
                win.webContents.send("error", {
                    status: false,
                    text: err
                })
            } else if (std.includes("The requested operation requires elevation (Run as administrator).") == true) {
                win.webContents.send("error", ({
                    event: "error",
                    status: false,
                    text: "(Run as administrator)"
                }))
            }
            else {
                win.webContents.send("success", ({
                    event: "success",
                    status: true,
                    text: "successfull!"
                }))
            }
        })
    })
    ipcMain.handle("setShekan", () => {
        exec("netsh interface ip set dns name=\"Wi-Fi\" static 178.22.122.100 && netsh interface ip add dns name=\"Wi-Fi\" 185.51.200.2 index=2", (err, std, stderr) => {

            if (err && stderr) {
                win.webContents.send("error", {
                    status: false,
                    text: err
                })
            } else if (std.includes("The requested operation requires elevation (Run as administrator).") == true) {
                win.webContents.send("error", ({
                    event: "error",
                    status: false,
                    text: "(Run as administrator)"
                }))
            }
            else {
                win.webContents.send("success", ({
                    event: "success",
                    status: true,
                    text: "successfull!"
                }))
            }
        })
    })
    createWindow()
})
