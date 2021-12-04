const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require("electron");
require('electron-reload')(app.getAppPath());
const path = require('path');
const iconPath = path.join(app.getAppPath(), "..", "..", "icon.png");

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
        icon: iconPath
    });

    // and load the index.html of the app.
    win.loadFile('./src/index.html');

    ipcMain.on('resize', (event, arg) => {
        win.setResizable(true);
        win.setSize(arg[0], arg[1])
        win.setResizable(false);
    })

    ipcMain.on('restart', (event, arg) => {
        app.relaunch()
        app.exit()
    })

    ipcMain.on('appversion', function(event, arg) {
        event.sender.send('appversion-response', [app.getVersion()]);
    });

    ipcMain.on('shelldir', function(event, arg) {
        let shellpath = app.getAppPath()
        if (shellpath.includes("/resources/app.asar"))
            shellpath = path.join(shellpath, '..', '..', 'src', 'shell').replace(/\s/g, '\\ ')
        else
            shellpath = path.join(shellpath, 'src', 'shell').replace(/\s/g, '\\ ')

        event.sender.send('shelldir-response', [shellpath]);
    });

    ipcMain.on('showdialog', async function(event, arg) {
        event.sender.send('showdialog-response', [await dialog.showMessageBox(null, arg[0], (response, checkboxChecked) => {

        }), ]);

    });

}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', createWindow);

app.on('activate', () => {
    0;
    if (win === null) {
        createWindow();
    }
});