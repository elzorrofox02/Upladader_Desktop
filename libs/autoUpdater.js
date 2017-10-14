'use strict';
const os = require('os');
const path = require('path');
const {app,dialog} = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");



//dev
const isDev = require("electron-is-dev")
if (isDev) {	
    autoUpdater.updateConfigPath = path.join('./dev-app-update.yml');   
}

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
let updater;
//const updaterFeedURL = 'http://zulipdesktop.herokuapp.com/update/' + platform + '/' + version;
// replace updaterFeedURL with http://yourappname.herokuapp.com

function appUpdater() {
	autoUpdater.autoDownload = false
	//autoUpdater.setFeedURL(updaterFeedURL);
	autoUpdater.on('error', (ev, err) => {
		dialog.showErrorBox('Error: ', err == null ? "unknown" : (err.stack || err).toString())		
		sendStatusToWindow('Error in auto-updater.');
	})
	autoUpdater.on('checking-for-update', () => {		
		sendStatusToWindow('Checking for update...');
	})
	autoUpdater.on('update-available', () => {
		dialog.showMessageBox({
		    type: 'info',
		    title: 'Found Updates',
		    message: 'Found updates, do you want update now?',
		    buttons: ['Sure', 'No']
		}, (buttonIndex) => {
		    if (buttonIndex === 0) {
		      autoUpdater.downloadUpdate()
		    }
		    else {
		      //updater.enabled = true
		      updater = null
		    }
	  	})
	})
	autoUpdater.on('update-not-available', (info) => {		
		sendStatusToWindow('Update not available.');
	})	
	autoUpdater.on('download-progress', (ev, progressObj) => {
		let log_message = "Download speed: " + progressObj.bytesPerSecond;
    	log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    	log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    	sendStatusToWindow(log_message);
		sendStatusToWindow('Download progress...');
	})
	autoUpdater.on('update-downloaded', (ev, info) => {
		//sendStatusToWindow('Update downloaded; will install in 5 seconds');
	});

	// Ask the user if update is available
	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName,releaseDate, updateURL) => {
		let message = app.getName() + ' ' + releaseName + ' is now available. It will be installed the next time you restart the application.';
		if (releaseNotes) {
			const splitNotes = releaseNotes.split(/[^\r]\n/);
			message += '\n\nRelease notes:\n';
			splitNotes.forEach(notes => {
				message += notes + '\n\n';
			});
		}
		// Ask user to update the app
		dialog.showMessageBox({
			type: 'question',
			buttons: ['Install and Relaunch', 'Later'],
			defaultId: 0,
			message: 'A new version of ' + app.getName() + ' has been downloaded',
			detail: message
		}, response => {
			if (response === 0) {
				//setTimeout(() => autoUpdater.quitAndInstall(), 1);
			}
		});
	});
	
	autoUpdater.checkForUpdates();
}

function sendStatusToWindow(text) {
	log.info(text);
	//win.webContents.send('message', text);
}

exports = module.exports = {
	appUpdater
};