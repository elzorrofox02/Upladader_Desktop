'use strict';
const os = require('os');
const {app,dialog} = require('electron');
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


//const updaterFeedURL = 'http://zulipdesktop.herokuapp.com/update/' + platform + '/' + version;
// replace updaterFeedURL with http://yourappname.herokuapp.com

function appUpdater() {
	//autoUpdater.setFeedURL(updaterFeedURL);	
	autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
	})
	autoUpdater.on('update-available', (ev, info) => {

		alert(info)
		sendStatusToWindow('Update available.');
	})
	autoUpdater.on('update-not-available', (ev, info) => {
		alert(info)
		sendStatusToWindow('Update not available.');
	})
	autoUpdater.on('error', (ev, err) => {
		alert(info)
		sendStatusToWindow('Error in auto-updater.');
	})
	autoUpdater.on('download-progress', (ev, progressObj) => {
		sendStatusToWindow('Download progress...');
	})
	autoUpdater.on('update-downloaded', (ev, info) => {
		sendStatusToWindow('Update downloaded; will install in 5 seconds');
	});

	// Ask the user if update is available
	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
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
	// init for updates
	autoUpdater.checkForUpdates();
}




function alert(message){
	dialog.showMessageBox({
			type: 'warning',
			title: 'Platzipics',
			message: String(message)
	})

}

function sendStatusToWindow(text) {
	log.info(text);
//win.webContents.send('message', text);
}



exports = module.exports = {
	appUpdater
};