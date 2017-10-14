//const remote = require('electron').remote
//const main = remote.require('./main.js')

const {dialog,remote} = require('electron').remote
const {ipcRenderer} = require('electron')


 
const path = require('path')
const os = require("os")

$(function () {
	
	history.pushState({url: "",title: "title"}, "title", "");

	var dropArea = document.getElementById("Bk");
	dropArea.addEventListener('dragenter', function (argument) {
		event.stopPropagation();
		event.preventDefault();
		dropArea.style.background = "rgba(255,255,255,0.9)";
	}, false)
	dropArea.addEventListener('dragleave', function (argument) {
	event.stopPropagation();
	event.preventDefault();  
	dropArea.style.background = "";
	}, false)
	dropArea.addEventListener('dragover', function (argument) {
		event.stopPropagation();
		event.preventDefault();  
	}, false);
	dropArea.addEventListener("drop", function(e) {
		e.stopPropagation();
		e.preventDefault();
		dropArea.style.background = "red";
		var items = e.dataTransfer.items;
		for (var i=0; i<items.length; i++) {   
			var item = items[i].webkitGetAsEntry();
			if (item) {     
			console.log(item);     
			  traverseFileTree(item);        
			}
	  }
	}, false); 		
	$("#form1").on("submit",function(event){
		event.stopPropagation();
		event.preventDefault();
		verFiles()		
	});
})

function verFiles(){
	var files = $("#filex")[0].files;   
	$.each(files, function(key, value)
	{	
		enviar(key,value);		
	});
}

function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
   
	item.file(function(file) {     
		enviarFolderDrag(file,path);
	});
  } else if (item.isDirectory) {   
	var dirReader = item.createReader();
	dirReader.readEntries(function(entries) {
	  for (var i=0; i<entries.length; i++) {       
		traverseFileTree(entries[i], path + item.name + "/");
	  }
	});
  }
}

function enviar(key,value){	
	var data = new FormData();
	data.append(key,value);
	var listfile = $('#listfile');
	var txt2 = $('<div id="listfile_cont"></div>');
	var tx3 = $('<div class="namefile">'+value.name+'</div>');
	var tx4 =$('<div class="sizefile"></div>');
	txt2.append(tx3);
	tx3.after(tx4)
	$(listfile).append(txt2);

	var enviar = $.ajax({
		url: 'http://localhost:8080/Upload',
		type: 'POST',
		data: data,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		xhr:function(){
			var xhr = new window.XMLHttpRequest();
			var started_at = new Date();
			xhr.upload.addEventListener('loadstart', function(e) {
			});	
			xhr.upload.addEventListener("progress",function(e){
				var ratio = objs._formatPercentage(e.loaded / e.total);
				tx4.html(ratio);
			});
			return xhr;
		},	
		success:function(data, textStatus){
				console.log("Ok");
		},
		error: function(jqXHR, textStatus, errorThrown)
		{	
			window.stat = false;
			console.log('ERRORS: ' + textStatus);
			//console.log(errorThrown);
		}
	});
}

function enviarFolderDrag(value,path) {
	var listfile = $('#listfile');
	var txt2 = $('<div id="listfile_cont"></div>');
	var tx3 = $('<div class="namefile">'+value.name+'</div>');
	var tx4 =$('<div class="sizefile"></div>');
	txt2.append(tx3);
	tx3.after(tx4)
	$(listfile).append(txt2);
	var formData = new FormData();
	formData.append("ruta", path);
	formData.append('file', value, value.name);
	 $.ajax({
		type: 'POST',
		url: 'http://localhost:8080/api/photo',
		data: formData,
		dataType: 'json',
		processData: false,
		contentType: false,
		xhr:function(){
			var xhr = new window.XMLHttpRequest();
			var started_at = new Date();
			xhr.upload.addEventListener('loadstart', function(e) {
			});	
			xhr.upload.addEventListener("progress",function(e){
				var ratio = objs._formatPercentage(e.loaded / e.total);
				tx4.html(ratio);
			});
			return xhr;
		},
		success: function(data) {
			console.log('success');
		},
		error: function(jqXHR, textStatus, errorThrown)
		{	
			window.stat = false;
			console.log('ERRORS: ' + textStatus);
			console.log(errorThrown);
		}
	});   
}

var objs = {
	_exten:function(filename){
		var names = filename;
		return names.split('.').pop();
	},
	_exten2:function(filename){
		var obj = {
			name:  false,
			extex: false,
			namerecord: filename.substring(0,20),
			strs:"",
		};
		var names = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename):"";	
		if (names != ""){	
			obj.name = filename;
			obj.extex = names[0];
			obj.strs = obj.namerecord+"."+names[0];
			return obj;
		}
		else{	
			obj.name = filename;
			obj.extex = "";
			obj.strs = obj.namerecord;		
			return obj;
		}
	},
	_formatFileSize:function(bytes) {
		if (typeof bytes !== 'number') {
			return '';
		}
		if (bytes >= 1000000000) {
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}
		if (bytes >= 1000000) {
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	},
	_formatBitrate:function (bits) {
		if (typeof bits !== 'number') {
			return '';
		}
		if (bits >= 1000000000) {
			return (bits / 1000000000).toFixed(2) + ' Gbit/s';
		}
		if (bits >= 1000000) {
			return (bits / 1000000).toFixed(2) + ' Mbit/s';
		}
		if (bits >= 1000) {
			return (bits / 1000).toFixed(2) + ' kbit/s';
		}
		return bits.toFixed(2) + ' bit/s';
	},
	_formatTime:function (seconds) {
		var date = new Date(seconds * 1000),
			days = Math.floor(seconds / 86400);
		days = days ? days + 'd ' : '';
		return days +
			('0' + date.getUTCHours()).slice(-2) + ':' +
			('0' + date.getUTCMinutes()).slice(-2) + ':' +
			('0' + date.getUTCSeconds()).slice(-2);
	},
	_formatPercentage:function (floatValue) {
		return (floatValue * 100).toFixed(2);
	},
	renderImage:function(file) {
		var reader = new FileReader(); 
		reader.onload = function(event) {

			console.log("file",file);

			console.log("even",event);

			//console.log(file.name)
			the_url = event.target.result;  
			//console.log(the_url);
			//var listfile = document.getElementById('listfile').innerHTML = "<img src='" + the_url + "' />";
		}  
		reader.readAsDataURL(file);
	},
	notifyMe:function(title,message) {
		if (!("Notification" in window)) {alert("This browser does not support desktop notification");}
		else if (Notification.permission === "granted") {
			  var options = {
					body: message,
					icon: "/img/platzi_favicon.01ca534ca7d3.png",
					dir : "auto",
				 };
				 var notification = new Notification(title,options);
				 notification.onclick = function(){
					console.log("asas");
				 }
				//notification.onshow = show();
				//notification.onerror = error();
				//notification.onclose = close();
				//notification.onclick = click();	
		}
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				if (!('permission' in Notification)) {Notification.permission = permission; }
				if (permission === "granted") {
					var options = {
						body: message,
						icon: "/img/platzi_favicon.01ca534ca7d3.png",
						dir : "auto",
					};
					var notification = new Notification(title,options);
				}
			});
		}
	},
}






function icon_Barra(){
	const {Tray, Menu} = remote	
	let trayIcon = new Tray(path.join('',path.join(__dirname + '/img/platzi_favicon.01ca534ca7d3.png')))
	const trayMenuTemplate = [
	{
	   label: 'Empty Application',
	   enabled: false
	},
	{
	   label: 'Settings',
	   click: function () {
	      console.log("Clicked on settings")
	   }
	},
	{
	   label: 'Help',
	   click: function () {
	      console.log("Clicked on Help")
	   }
	}
	]
	let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
	trayIcon.setContextMenu(trayMenu)
}




function noty(title,message,url){
	const notifier = require('node-notifier')         
	
	notifier.notify ({
	   title: title,
	   message: message,
	   icon: path.join('',path.join(__dirname + '/img/platzi_favicon.01ca534ca7d3.png')),  // Absolute path  (doesn't work on balloons)
	   sound: true,  // Only Notification Center or Windows Toasters
	   wait: true    // Wait with callback, until user action is taken against notification 
	});
	notifier.on('click', function (notifierObject, options) {
	   console.log("You clicked on the notification")
	});
	notifier.on('timeout', function (notifierObject, options) {
	   console.log("Notification timed out!")
	});
	
}


function cap_camera(){      

	navigator.getUserMedia({video: true, audio: true}, (localMediaStream) => {
		var video = document.querySelector('video')
		video.src = window.URL.createObjectURL(localMediaStream)
		video.onloadedmetadata = (e) => {
		   // Ready to go. Do some stuff.
		};
	}, function(){
		console.log("error jr");
	})
}





function cap_win(){
	const {desktopCapturer} = require('electron')
	desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
	   if (error) throw error
	   for (let i = 0; i < sources.length; ++i) {
	   		console.log(sources[i].name)
	      if (sources[i].name === 'Entire screen') {
	         navigator.webkitGetUserMedia({
	            audio: false,
	            video: {
	               mandatory: {
	                  chromeMediaSource: 'desktop',
	                  chromeMediaSourceId: sources[i].id,
	                  minWidth: 1280,
	                  maxWidth: 1280,
	                  minHeight: 720,
	                  maxHeight: 720
	               }
	            }
	         }, handleStream, handleError)
	         return
	      }
	   }
	})

}
function handleStream (stream) {
   document.querySelector('video').src = URL.createObjectURL(stream)
}

function handleError (e) {
   console.log(e)
}











document.getElementById('notify').onclick = (event) => {

	//noty("Hola","esto es una prueba","cahas")
	//ipcRenderer.sendSync('open-directory')
	//ipcRenderer.send('open-directory')
	//event.sender.send('asynchronous-reply', 'async pong')
	//console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}))

}, function (err, response) {

}





function ver_information(){	
	const si = require('systeminformation');


	var mbTotal = ((os.totalmem())/1048576);
	var mbFree = ((os.freemem())/1048576);
	var cpus = os.cpus()
	var interfaces = os.networkInterfaces()	

	$(".stats").append("<p>Cpus:<span>"+cpus.length+"</span></p>")
	$(".stats").append("<p>Archivos Temporales:<span>"+os.tmpdir()+"</span></p>")
	$(".stats").append("<p>Arquitectura :<span>"+os.arch()+"</span></p>")
	$(".stats").append("<p>Total memoria disponible en MB :" +mbTotal+"</p>")
	$(".stats").append("<p>Hay "+mbFree+" mb libres en la memoria</p>")
	$(".stats").append("<p>Tipo "+os.type()+"</p>")
	$(".stats").append("<p>Plataforma "+os.platform()+"</p>")

	

	$(".stats").append("<p>Nombre Pc "+os.hostname()+"</p>")
	$(".stats").append("<p>Tiempo Encendido "+os.uptime()+"</p>")
	$(".stats").append("<p>Sistema Operativo Release: "+os.release()+"</p>")




	si.cpu()
		.then(data => console.log(data))
		.catch(error => console.error(error));

	si.system()
		.then(data=> console.log(data))

	si.cpuTemperature()
		.then(data=> console.log(data))

	si.graphics()
		.then(data=> console.log(data))

	si.osInfo()
		.then(data=> console.log(data))

	si.users()
		.then(data=> console.log(data))

	si.networkInterfaces()
		.then(data=> console.log(data))

	si.mem()
		.then(data=> console.log(data))

	si.diskLayout()
		.then(data=> console.log(data))

	si.battery()
		.then(data=> console.log(data))

	
	
}

//ver_information()



