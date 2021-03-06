var {
    BrowserWindow,
    app,
    Tray,
    Menu,
    electron,
    dialog,
    ipcMain
} = require('electron');
var path = require('path');
let win = null;
require('@electron/remote/main').initialize();
app.console = new console.Console(process.stdout, process.stderr);

function splashScreen(callback) {
	var splash = win = new BrowserWindow({
		transparent: true,
		frame: false,
		resizable: false,
		title: "Desktop Sonic",
		icon: "./icon.png",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		width:480,
		height:246
	});
	splash.setSkipTaskbar(true);
	splash.setAlwaysOnTop(true);
	splash.loadFile("./splashscreen/index.html")
	setTimeout(() => {
		splash.close();
		callback();
	},8000)
}
const prompt = require('electron-prompt');
app.on('ready', () => {
    if (!(win)) {
		splashScreen(() => {
			win = new BrowserWindow({
				transparent: true,
				frame: false,
				resizable: false,
				title: "Desktop Sonic",
				icon: "./icon.png",
				webPreferences: {
					nodeIntegration: true,
					contextIsolation: false
				}
			});
			Menu.setApplicationMenu(Menu.buildFromTemplate([]))
				tray = new Tray('icon.png')
				var contextMenu = Menu.buildFromTemplate([
					//	{
				    //       label: 'Devlopment',
					//        click: async() => {
					//            win.openDevTools();
					//       }
					//	},
						{
							label: 'Close',
							click: async() => {
								app.quit();
							}
						}, {
							label: 'Toggle Background',
							click: async() => {
								win.webContents.executeJavaScript("background.hidden = !(background.hidden);");
							}
						}, {
							label: 'Change Background Music',
							click: async() => {
								win.webContents.executeJavaScript("changeBGM();");
							}
						}, {
							label: 'Save Map',
							click: async() => {
								win.webContents.executeJavaScript("saveMap();");
							}
						}, {
							label: 'Load Map',
							click: async() => {
								win.webContents.executeJavaScript("loadMap();");
							}
						}, {
							label: 'Hide',
							click: async() => {
								win.hide();
							}
						}, {
							label: 'Show',
							click: async() => {
								win.show();
							}
						}
					])
				tray.setToolTip('Desktop Sonic')
				tray.setContextMenu(contextMenu)
				win.maximize();
			win.loadFile("./game/index.html");
			require('@electron/remote/main').enable(win.webContents);
			win.setSkipTaskbar(true);
			win.show();
			setTimeout(() => {
				win.setAlwaysOnTop(true);
			},2);
			setTimeout(() => {
				win.setAlwaysOnTop(true);
				win.show();
			},50);
		})
    } else {
        var msg = dialog.showMessageBoxSync({
            title: "App Is Already Running!!",
            icon: "icon.png",
            message: "App Is Already Running!!",
            buttons: ["ok"]
        })
    }
})
