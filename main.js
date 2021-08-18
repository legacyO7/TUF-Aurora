const { app, BrowserWindow } = require('electron');
require('electron-reload')(__dirname);

function createWindow() {
	// Create the browser window.
	let win = new BrowserWindow({
		width: 995,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
		},
		resizable: false,
		title:"TUF-Control"
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
