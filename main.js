const electron = require('electron')
const {app, BrowserWindow,globalShortcut,ipcMain,Tray,Menu,protocol,dialog} = electron
const path = require('path')
const url  = require('url')
const setIpcMain = require('./libs/ipcMainEvent')
const menus = require('./libs/menu')
let win


const {appUpdater} = require('./libs/autoUpdater');

//dev
//require('electron-reload')(__dirname);

app.on('ready', () => {
	const {width, height} = electron.screen.getPrimaryDisplay().size
	//const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
	win = new BrowserWindow ({
		width: 300, 
		height:300,  
		title: 'Uploader',
		//center: true,
		x:width-300,
		y:50,
		frame: false,
		transparent: true,
		alwaysOnTop: true,		   
		//titleBarStyle: 'hidden',      
		//skipTaskbar: true,
		//fullscreen: true,
		//fullscreenable: false,       
	   /* resizable: true,
		frame: false,
		transparent: true*/
		icon: path.join(__dirname + '/statics/img/platzi_favicon.01ca534ca7d3.png')
	})
	// Mostrando la ventana solo cuando el contenido a mostrar sea cargado
	win.once('ready-to-show', () => {
		win.show()
	})
	win.on('closed', () => {
		win = null       
		app.quit()
	});
	win.on('move', () => {
		//const position = win.getPosition()		
	})
	win.webContents.on('did-finish-load', () => {
		appUpdater();
		 //autoUpdater.checkForUpdates();
		//imprimirPdf()  
	})
	win.webContents.openDevTools()
	// win.maximize();
	
	//shorcuts
	globalShortcut.register('Control+Space', () => {       
		win.isVisible() ? win.hide() : win.show()
	});
	globalShortcut.register('Control+f3', () => {       
		//win.show();
		//win.focus()       
	});
	globalShortcut.register('Control+f4', () => {
		//win.hide();
	});
	globalShortcut.register('Control+f5', () => {
		win.focus()
	});
	
	//icono
	let trayIcon = new Tray(path.join('',path.join(__dirname + '/statics/img/platzi_favicon.01ca534ca7d3.png')))  
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Rockjs Uploader',enabled: false},
		{label: 'Item3', type: 'radio', checked: true},
		{ label: 'Settings',click: function () {console.log("Clicked on settings")}},
		{label: 'Exit',click: function () {app.quit();}}
	])
	trayIcon.setToolTip('Rockjs Uploader')
	trayIcon.setContextMenu(contextMenu)
	trayIcon.on('click', () => {
		win.isVisible() ? win.hide() : win.show()
	})
	setIpcMain(win)
	menus()
	win.loadURL(url.format({pathname: path.join(__dirname, '/statics/index.html'),protocol: 'file',slashes: true,}))
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('before-quit', () => {
  globalShortcut.unregisterAll()
})


exports.openWindow = () => {
	let newWin = new BrowserWindow ({width: 400, height:200})
	newWin.loadURL(url.format({
		pathname: path.join(__dirname, '/statics/prueba1.html'),
		protocol: 'file',
		slashes: true
	}))
}


