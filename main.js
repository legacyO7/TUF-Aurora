const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
require('electron-reload')(__dirname);
const path = require('path');
const iconPath = path.join(__dirname, "images", "appicon.png");
require('@electron/remote/main').initialize()


function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 995,
        height: 700,
        roundedCorners: true,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        resizable: false,
        title: "TUF Aurora",

        preload: path.join(__dirname, "preload.js"),
        icon: iconPath
    });

    // and load the index.html of the app.
    win.loadFile('./src/index.html');

    ipcMain.on('resize', (event, arg) => {
        win.setResizable(true);
        win.setSize(arg[0], arg[1])
        win.setResizable(false);
    })
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', createWindow);

app.on('activate', () => {
    0;
    if (win === null) {
        createWindow();
    }
});