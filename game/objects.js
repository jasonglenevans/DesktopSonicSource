var objectCount = 0;
function summonObject(color, danger, pushable, type, hasGravity) {
    var div = document.createElement("div");
    div.style.resize = "both";
    div.style.width = "32px";
    div.style.height = "32px";
    div.style.background = color;
    div.style.border = "1px solid";
    div.style.overflow = "auto";
    div.style.position = "fixed";
    addContextMenu(div)
    objectCount += 1;
    div.id = "OBJECT" + objectCount;
    if (danger) {
        div.setAttribute("kill", true);
    }
    if (pushable) {
        div.setAttribute("pushable", true);
    }
    if (hasGravity) {
        div.setAttribute("hasGravity", true);
    }
    div.setAttribute("type", type);
    div.setAttribute("paused", "false");
    document.getElementById("objects").appendChild(div);
    window.objects.push(div);
    dragElement(div, true);
}
var spacePressed = false;
document.body.addEventListener("keydown", (e) => {
    if (e.key == "Shift") {
        e.preventDefault();
        spacePressed = true;
    }
})
document.body.addEventListener("keyup", (e) => {
    if (e.key == "Shift") {
        e.preventDefault();
        spacePressed = false;
    }
})
function rgbToHex(red, green, blue) {
    const rgb = (red << 16) | (green << 8) | (blue << 0);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
}
function hexToRgb(hex) {
    const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (normal)
        return normal.slice(1).map(e => parseInt(e, 16));
    const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (shorthand)
        return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16));
    return null;
}
function dragElement(elmnt,holdingShift) {
    var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
		if (spacePressed ||	!(holdingShift)) {
			this.setAttribute("paused", "true");
			window.draggingElement = this;
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement(e) {
        if (draggingElement) {
            draggingElement.setAttribute("paused", "false");
        }
        draggingElement = null;
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
window.objects.push(document.getElementById("floor"));
window.objects.push(document.createElement("div"));
const contextMenu = document.getElementById("context-menu");
window.objectScope = null;
function deleteAllObjects() {
    var index = 0;
    while (index < window.objects.length) {
        if (index > 1) {
            window.objects[index].remove();
        }
        index += 1;
    }
    window.objects = [window.objects[0], window.objects[1]];
}
window.closeCustContextMenu = function (obj) {
    if (objectScope) {
        var selected = obj.getAttribute("value")
            if (selected == "delete") {
                var index = 0;
                var objs = [];
                while (index < window.objects.length) {
                    if (!(window.objectScope.id == window.objects[index].id)) {
                        objs.push(window.objects[index]);
                    }
                    index += 1;
                }
                window.objectScope.remove();
                window.objects = objs;
            }
            if (selected == "color") {
                function extractRgb(css) {
                    return css.match(/[0-9.]+/gi)
                }
                document.getElementById('color').value = rgbToHex(extractRgb(window.objectScope.style.background)[0], extractRgb(window.objectScope.style.background)[1], extractRgb(window.objectScope.style.background)[2]);
            }
            if (selected == "deleteAll") {
                deleteAllObjects();
            }
    }
};
closeCustContextMenu();
function addContextMenu(scope) {
    scope.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const {
            clientX: mouseX,
            clientY: mouseY
        } = event;
        contextMenu.style.top = `${mouseY}px`;
        contextMenu.style.left = `${mouseX}px`;
        contextMenu.hidden = false;
        objectScope = scope;
    });
}
document.body.onclick = function () {
    contextMenu.hidden = true;
};
document.body.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
dragElement(document.getElementById("objectSelect"))
var minmizeObjectSelectWin = document.getElementById("minmizeObjectSelectWin");
var objectSelectMain = document.getElementById("objectSelectMain");
minmizeObjectSelectWin.onclick = function () {
	if (objectSelectMain.hidden == false) {
		minmizeObjectSelectWin.innerHTML = "+";
	} else {
		minmizeObjectSelectWin.innerHTML = "-";
	}
	objectSelectMain.hidden = !(objectSelectMain.hidden);
};