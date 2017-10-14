const fs = require("fs")
const {dialog} = require('electron');


//const {remote} = require('electron');
//const {BrowserWindow, dialog, shell} = remote;

function getPDFPrintSettings() {
  var option = {
	landscape: true,
	marginsType: 0,
	printBackground: false,
	printSelectionOnly: false,
	pageSize: 'A4',
  }
  return option
}

function imprimirPdf(win){
	dialog.showSaveDialog(win, {}, (file_path) => {    
		win.webContents.printToPDF(getPDFPrintSettings(), (error, data) => {
			if (error) throw error
			fs.writeFile(file_path+".pdf", data, (error) => {
			  if (error) throw error
			  console.log('Write PDF successfully.')
			})
		})
	})
}


function viewPDF(save_pdf_path) {
  if (!save_pdf_path) {
    dialog.showErrorBox('Error', "You should save the pdf before viewing it");
    return;
  }
  shell.openItem(save_pdf_path);
}



function printer(win) {
  if (win)
    win.webContents.print();


		//let contents = win.webContents.getURL()
		let contents2 = win.webContents.getPrinters()


		var option = {
			silent : true,
			printBackground : false,
			deviceName : "AQUI EL NOMBRE o si no usa el default",			
  		}

		contents.print([options], [callback])

		console.log(contents2)

		//use page-break-before: always; CSS style to force to print to a new page.

		//To style the print use a media query (@media print {...}) and related css properties like page-break-before.



}


module.exports = {
  imprimirPdf: imprimirPdf,
  viewPDF: viewPDF,
  printer,printer
}



/*





document.addEventListener('DOMContentLoaded', function() {
  print_win = new BrowserWindow({'auto-hide-menu-bar':true});
  print_win.loadURL('file://' + __dirname + '/print.html');
  print_win.show();

  print_win.webContents.on('did-finish-load', function() {
    document.getElementById('print_button').addEventListener('click', print);
    document.getElementById('save_pdf_button').addEventListener(
      'click', savePDF);
    document.getElementById('view_pdf_button').addEventListener(
      'click', viewPDF);
  });
  print_win.on('closed', function() {
    print_win = null;
  });
});

*/