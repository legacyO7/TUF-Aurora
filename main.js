const { app, BrowserWindow, nativeImage } = require('electron');
require('electron-reload')(__dirname);

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 995,
        height: 650,
        roundedCorners: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
        },
        resizable: false,
        title: "TUF Aurora",
        icon: nativeImage.createFromPath(__dirname + '/images/appicon.ico'),
    });

    // and load the index.html of the app.
    win.loadFile('./src/index.html');
}

app.on('ready', createWindow);

app.on('activate', () => {
    0;
    if (win === null) {
        createWindow();
    }
});