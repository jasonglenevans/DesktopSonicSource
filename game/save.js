
try{
	var remote = require("@electron/remote");
	var dialog = remote.dialog;
	var fs = require("fs");
	var someArgument = null;
	setTimeout(() => {
		console.clear();
	},90);
	function changeBGM() {
		var response = dialog.showOpenDialogSync(remote.getCurrentWindow(),{
			filters: [
				{ name: 'Audio Files', extensions: ['wav','mp3','ogg'] }
			],
            title:"Select a audio file"
		})
		try{
			if (response) {
				bgm.src = "data:audio/"+response[0].split(".").pop()+";base64,"+fs.readFileSync(response[0],{encoding:"Base64"});
			}
		}catch(e){dialog.showErrorBox("Failed To Open Map","Failed To Open Map\nError: "+e)}
	}

	window.onerror = function (message, source, lineno, colno, error) {
		remote.app.console.error("Error Message: "+message+"\nSource: "+source+"\nLine number: "+lineno+"\nCol Number: "+colno+"\nError: "+error);
		remote.getCurrentWindow().hide();
		bgm.volume = 0;
		dialog.showErrorBox("ERROR","Sorry, but an error has been caught in the processes, of Desktop Sonic");
		remote.getCurrentWindow().close();
	};
	try{
		fs.mkdirSync("SAVE")
		//fs.writeFileSync("SAVE/USER.DATA",JSON.stringify({
		//	maps:[
		//		
		//	]
		//},null,"\t"))
		fs.mkdirSync("SAVE/MAPS")
	}catch(e){}
	function makeJSONMapData() {
		var objectsHTML = document.getElementById("objects").innerHTML;
		return {
			objects:objectsHTML
		};
	}
	function loadJSONMapData(data) {
		deleteAllObjects();
		var index = 0;
		document.getElementById("objects").innerHTML = data.objects;
		var objlist = document.getElementById("objects").children;
		while (index < objlist.length) {
			window.objects.push(objlist[index]);
			addContextMenu(objlist[index]);
			dragElement(objlist[index],true);
			index += 1;
		}
	}
	var selectingMap = false;
	function saveMap() {
		if (!(selectingMap)) {
			selectingMap = true;
			remote.getCurrentWindow().setAlwaysOnTop(false);
			var selecedWin = remote.getCurrentWindow();
			selecedWin.hide();
			remote.require("electron-prompt")({
				title:"Save Map",
				label:"Name",
				icon:"icon.png"
			}).then((res) => {
				if (res) {
					try{
					var data = makeJSONMapData();
					fs.writeFileSync("./SAVE/MAPS/"+res+".MAP",JSON.stringify(data));
					}catch(e){remote.app.console.log(e);}
				}
				selecedWin.show();
				selecedWin.setAlwaysOnTop(true);
				selectingMap = false;
			}).catch(() => {})
		}
	}
	function loadMap() {
		if (!(selectingMap)) {
			selectingMap = true;
			var selecedWin = remote.getCurrentWindow();
			selecedWin.hide();
			selecedWin.setAlwaysOnTop(false);
			remote.require("electron-prompt")({
				title:"Load Map",
				label:"Name",
				icon:"icon.png"
			}).then((res) => {
				if (res) {
					try{
						resetPlayer();
						loadJSONMapData(JSON.parse(fs.readFileSync("./SAVE/MAPS/"+res+".MAP")));
					}catch(e){remote.app.console.log(e);dialog.showErrorBox("Error Reading Map","Either File Does Not Exist, Or There Was An Error");}
				}
				selecedWin.setAlwaysOnTop(true);
				selectingMap = false;
				selecedWin.show();
			}).catch(() => {})
		}
	}
}catch(e){try{
	dialog.showErrorBox(e);
} catch(e){background.hidden = false;}}

document.onselectstart = () => {
  return false; // cancel selection
};