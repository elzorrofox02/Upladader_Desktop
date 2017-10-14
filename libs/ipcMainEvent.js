const { ipcMain, dialog } = require('electron')


function setMainIpc (win) {
  ipcMain.on('open-directory', (event) => {
  	console.log("events opend cirecotri")
  
  })

  ipcMain.on('load-directory', (event, dir) => {
  
  }) 
  ipcMain.on('closed-win', (event, arg) => {   
	   //app.quit();
	   // Event emitter for sending asynchronous messages
	   //event.sender.send('asynchronous-reply', 'async pong')
   })
}
module.exports = setMainIpc