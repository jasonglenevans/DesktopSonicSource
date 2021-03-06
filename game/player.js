window.objects = [];
function boundingBoxCollide(object1, object2) {

    var left1 = object1.x;
    var left2 = object2.x;
    var right1 = object1.x + object1.width;
    var right2 = object2.x + object2.width;
    var top1 = object1.y;
    var top2 = object2.y;
    var bottom1 = object1.y + object1.height;
    var bottom2 = object2.y + object2.height;

    if (bottom1 < top2)
        return (false);
    if (top1 > bottom2)
        return (false);

    if (right1 < left2)
        return (false);
    if (left1 > right2)
        return (false);

    return (true);

}
function htmlObjectCollideCheck(object1, object2) {
    var object1br = object1.getBoundingClientRect();
    var object2br = object2.getBoundingClientRect();
    return boundingBoxCollide(object1br, object2br);
}

window.assets = {
    sprites: {
        sonic: {
            idle: "./assets/sonic/stand.png",
            walk1: "./assets/sonic/walk1.png",
            walk2: "./assets/sonic/walk2.png",
            walk3: "./assets/sonic/walk3.png",
            walk4: "./assets/sonic/walk4.png",
            walk5: "./assets/sonic/walk5.png",
            walk6: "./assets/sonic/walk6.png",
            walk7: "./assets/sonic/walk7.png",
            walk8: "./assets/sonic/walk8.png",
            lookup: "./assets/sonic/lookup2.png",
            spin1: "./assets/sonic/spin1.png",
            spin2: "./assets/sonic/spin2.png",
            spin3: "./assets/sonic/spin3.png",
            spin4: "./assets/sonic/spin4.png",
            spin5: "./assets/sonic/spin5.png",
            push1: "./assets/sonic/push1.png",
            push2: "./assets/sonic/push2.png",
            push3: "./assets/sonic/push3.png",
            push4: "./assets/sonic/push4.png",
            died: "./assets/sonic/die.png",
            hurt: "./assets/sonic/hurt1.png",
            run1: "./assets/sonic/run1.png",
            run2: "./assets/sonic/run2.png",
            run3: "./assets/sonic/run3.png",
            run4: "./assets/sonic/run4.png",
            skid: "./assets/sonic/brake2.png"
        },
        ring: "./assets/objects/ring.png"
    },
    sfx: {
        jump: "./assets/sfx/jump.wav",
        death: "./assets/sfx/die.wav",
        ring: "./assets/sfx/ring.wav"
    },
    music: {
        Addiction: "./assets/music/Addiction.mp3"
    },
    bg: {
        ghz: "./assets/bg/GHZ.png"
    }
};
var player = document.getElementById("playerHitbox");
var playerdisplay = document.getElementById("player");
var gravity = 0;
var speed = 0;
var x = window.innerWidth / 2 - 16;
var y = 0;
var frame = "idle";
function getCollideWithObjects(main, ignorer, firstIgnore) {
    var index = 0;
    while (index < window.objects.length) {
        if (htmlObjectCollideCheck(main, window.objects[index]) && !(ignorer == window.objects[index]) && !(index < 1 && firstIgnore)) {
            window.objectTouched = window.objects[index];
            if (!(
                    window.objects[index].getAttribute("type") == "ring")) {
                return true;
            }
        }
        index += 1;
    }
}
function dangerObjectCheck(main) {
    var index = 0;
    while (index < window.objects.length) {
        if (htmlObjectCollideCheck(main, window.objects[index])) {
            if (window.objects[index].getAttribute("kill")) {
                setTimeout(() => {
                    killPlayer();
                }, 1)
            }
        }
        index += 1;
    }
}
var offcenterFrames = {};
function updateplayerpos() {
    playerdisplay.src = window.assets.sprites.sonic[frame];
    player.style.position = "fixed";
    player.style.left = x + "px";
    player.style.top = y + "px";
    playerdisplay.style.position = "fixed";
    var flipnum = 1;
    if (playerdisplay.getAttribute("class") == "flip") {
        flipnum = -1;
    }
    if (offcenterFrames[frame + flipnum]) {
        var offsetLeft = (offcenterFrames[frame + flipnum].left);
        var offsetTop = (offcenterFrames[frame + flipnum].top);
        playerdisplay.style.left = x - (offsetLeft) + "px";
        playerdisplay.style.top = y - (offsetTop) + "px";
    } else {
        playerdisplay.style.left = x + "px";
        playerdisplay.style.top = y + "px";
    }
}
window.playerInputs = {};
var walkAnimIndex = 1;
var spinAnimIndex = 1;
var pushAnimIndex = 1;
var runAnimIndex = 1;
var jumping = false;
var died = false;
var pushing = false;
var skiding = false;
setInterval(() => {
    if (died) {
        frame = "died";
    } else {
        if (jumping) {
            spinAnimIndex += 0.2;
            if (spinAnimIndex > 5) {
                spinAnimIndex = 1;
            }
            var spinAnimIndexnum = 0;
            if (Math.round(spinAnimIndex) == 0) {
                spinAnimIndexnum = 1;
            } else {
                spinAnimIndexnum = Math.round(spinAnimIndex);
            }
            frame = "spin" + spinAnimIndexnum;
        } else {
            if (pushing) {
                pushAnimIndex += 0.1 / 20;
                if (pushAnimIndex > 4) {
                    pushAnimIndex = 1;
                }
                var walkind = 0;
                if (Math.round(pushAnimIndex) == 0) {
                    walkind = 1;
                } else {
                    walkind = Math.round(pushAnimIndex);
                }
                frame = "push" + walkind;
            } else {
                if (gravity > 0.8) {
                    frame = "hurt";
                } else {
					if (skiding) {
						frame = "skid";
					} else {
						if (Math.abs(speed) > 2) {
							runAnimIndex += Math.abs(speed) / 20;
							if (runAnimIndex > 4) {
								runAnimIndex = 1;
							}
							var spinAnimIndexnum = 0;
							if (Math.round(runAnimIndex) == 0) {
								spinAnimIndexnum = 1;
							} else {
								spinAnimIndexnum = Math.round(runAnimIndex);
							}
							frame = "run" + spinAnimIndexnum;
						} else {
								if (Math.abs(speed) > 0.1) {
									walkAnimIndex += Math.abs(speed) / 16;
									if (walkAnimIndex > 8) {
										walkAnimIndex = 1;
									}
									var walkind = 0;
									if (Math.round(walkAnimIndex) == 0) {
										walkind = 1;
									} else {
										walkind = Math.round(walkAnimIndex);
									}
									frame = "walk" + walkind;
								} else {
									if (false) {}
									else {
										walkAnimIndex = 0;
										frame = "idle";
										if (playerInputs["ArrowUp"]) {
											frame = "lookup";
										}
									}
								}
						}
					}
				}
            }
        }
    }
}, 1)
var grounded = false;
var groundedTime = 0;
function resetPlayer() {
    y = 0;
    x = window.innerWidth / 2 - 16;
    frame = "idle";
    died = false;
    gravity = 0;
    speed = 0;
}
function killPlayer() {
    gravity = -2;
    died = true;
    var sfx = new Audio(window.assets.sfx.death);
    sfx.play();
}
resetPlayer();
function pushWalls(main) {
    var index = 0;
    while (index < window.objects.length) {
        if (htmlObjectCollideCheck(main, window.objects[index])) {
            if (window.objects[index].getAttribute("pushable")) {
                var objectX = window.objects[index].getBoundingClientRect().left;
                window.objects[index].style.left = objectX + Math.sign(speed) * 0.5 + "px";
                if (getCollideWithObjects(window.objects[index], window.objects[index], true)) {
                    window.objects[index].style.left = objectX + (Math.sign(speed) * -0.5) + "px";
                    x -= speed;
                    x -= Math.sign(speed) * 0.5;
                    updateplayerpos();
                    speed = 0;
                }
            }
        }
        index += 1;
    }
}
function remObject(obj) {
    var index = 0;
    var objs = [];
    while (index < window.objects.length) {
		try{
			if (!(obj == window.objects[index])) {
				objs.push(window.objects[index]);
			}
		}catch(e){}
        index += 1;
    }
    obj.remove();
    window.objects = objs;
}
var sfxRing = new Audio(window.assets.sfx.ring);
var floortime = 0;
var ySpeed = 0;
function objFunction() {
    var index = 0;
    while (index < window.objects.length) {
		try{
        if (window.objects[index].getAttribute("type") == "movingVER") {
            if (window.objects[index].getAttribute("paused") == "false") {
                var vdir = Number(window.objects[index].getAttribute("vdir"));
                if (window.objects[index].getAttribute("time")) {
                    window.objects[index].setAttribute("time", Number(window.objects[index].getAttribute("time")) + 1);
                } else {
                    window.objects[index].setAttribute("time", 1);
                    window.objects[index].setAttribute("vdir", 1);
                }
                var time = Number(window.objects[index].getAttribute("time"));
                var vdir = Number(window.objects[index].getAttribute("vdir"));
                if (time > 400) {
                    if (vdir == 1) {
                        vdir = -1;
                    } else {
                        vdir = 1;
                    }
                    time = 0;
                }
                window.objects[index].setAttribute("time", time);
                window.objects[index].setAttribute("vdir", vdir);
                var bounding = window.objects[index].getBoundingClientRect();
                window.objects[index].style.top = bounding.top + vdir * 0.5 + "px";
                if (htmlObjectCollideCheck(player, window.objects[index])) {
                    y += vdir;
                    updateplayerpos();
                }
            }
        }
        if (window.objects[index].getAttribute("type") == "movingHOR") {
            if (window.objects[index].getAttribute("paused") == "false") {
                var vdir = Number(window.objects[index].getAttribute("vdir"));
                if (window.objects[index].getAttribute("time")) {
                    window.objects[index].setAttribute("time", Number(window.objects[index].getAttribute("time")) + 1);
                } else {
                    window.objects[index].setAttribute("time", 1);
                    window.objects[index].setAttribute("vdir", 1);
                }
                var time = Number(window.objects[index].getAttribute("time"));
                var vdir = Number(window.objects[index].getAttribute("vdir"));
                if (time > 400) {
                    if (vdir == 1) {
                        vdir = -1;
                    } else {
                        vdir = 1;
                    }
                    time = 0;
                }
                window.objects[index].setAttribute("time", time);
                window.objects[index].setAttribute("vdir", vdir);
                var bounding = window.objects[index].getBoundingClientRect();
                window.objects[index].style.left = bounding.left + vdir * 0.5 + "px";
                if (htmlObjectCollideCheck(player, window.objects[index])) {
                    x += vdir;
                    updateplayerpos();
                }
            }
        }
		if (window.objects[index].getAttribute("hasGravity")) {
			if (window.objects[index].getAttribute("paused") == "false") {
				if (!(window.objects[index].getAttribute("gravity"))) {
					window.objects[index].setAttribute("gravity", 0);
				}
				var gravityobj = Number(window.objects[index].getAttribute("gravity"));
				var bounding = window.objects[index].getBoundingClientRect();
				gravityobj += 0.02;
				window.objects[index].style.top = bounding.top + gravityobj + "px";
				if (htmlObjectCollideCheck(player,window.objects[index])) {
					var bounding = window.objects[index].getBoundingClientRect();
					window.objects[index].style.left = bounding.left + speed*2 + "px";
					gravityobj = 4;
				}
				if (getCollideWithObjects(window.objects[index], window.objects[index]) || htmlObjectCollideCheck(player,window.objects[index])) {
					var bounding = window.objects[index].getBoundingClientRect();
					window.objects[index].style.top = bounding.top + gravityobj*-1 + "px";
					gravityobj = 0;
				}
				window.objects[index].setAttribute("gravity", gravityobj);
			}
		}
        if (window.objects[index].getAttribute("type") == "ring") {
			try{
				window.objects[index].style.resize = "none";
				window.objects[index].innerHTML = "<img src='" + window.assets.sprites.ring + "' width=16 height=16>";
				var pos = window.objects[index].style.position;
				var left = window.objects[index].style.left;
				var top = window.objects[index].style.top;
				window.objects[index].setAttribute("style", "");
				window.objects[index].style.left = left;
				window.objects[index].style.top = top;
				window.objects[index].style.position = pos;
				if (window.objectTouched == window.objects[index]) {
					sfxRing.currentTime = 0;
					sfxRing.play();
					remObject(window.objects[index]);
				}
			}catch(e){}
        }
		}catch(e){}
        index += 1;
    }
}
setInterval(() => {
	skiding = false;
    if (died == false) {
        if (playerInputs["ArrowRight"]) {
            speed += 0.046875/5;
			if (speed < 0) {
				speed += 0.046875/5;
				skiding = true;
			} else {
				playerdisplay.setAttribute("class", "");
			}
            updateplayerpos();
        }
        if (playerInputs["z"] && grounded) {
            gravity += -2.6;
            var sfx = new Audio(window.assets.sfx.jump);
            sfx.play();
            jumping = true;
        }
        if (playerInputs["ArrowLeft"]) {
            speed += -0.046875/5;
			if (speed > 0) {
				speed += -0.046875/5;
				skiding = true;
			} else {
				playerdisplay.setAttribute("class", "flip");
			}
        }
    }
    function doCollideCheck() {
        pushWalls(player);
        if (getCollideWithObjects(player)) {
            dangerObjectCheck(player);
            x += -speed;
            speed = 0;
            updateplayerpos();
        }
    };
    function accel() {
        if (Math.abs(speed) > 2.5) {
            speed = 2.5 * Math.sign(speed);
        } else {}
        if (!(playerInputs["ArrowRight"] || playerInputs["ArrowLeft"])) {
            if (Math.abs(speed) > 0.05) {
				speed -= Math.sign(speed)*0.5/20;
			} else {
				speed = 0;
			}
        }
    }
    accel()
    x += speed;
    updateplayerpos();
    if (died == false) {
        doCollideCheck();
    }
    var playerDir = 1;
    if (playerdisplay.getAttribute("class") == "flip") {
        playerDir = -1;
    }
    x += playerDir;
    updateplayerpos();
    if (getCollideWithObjects(player) && (playerInputs["ArrowRight"] || playerInputs["ArrowLeft"])) {
        pushing = true;
    } else {
        pushing = false;
    }
    x -= playerDir;
    updateplayerpos();
    y += gravity;
    updateplayerpos();
    gravity += 0.02;
    grounded = false;
	if (grounded == false) {
		ySpeed = gravity;
	}
    if (died == false) {
        if (grounded == false) {
            groundedTime += 1;
        } else {
            groundedTime = 0;
        }
        if (getCollideWithObjects(player)) {
            dangerObjectCheck(player);
            y += -gravity;
            if (gravity < -0) {
                grounded = false;
            } else {
                grounded = true;
                jumping = false;
            }
            gravity = 0;
            updateplayerpos();
        }
    }
    if (y > window.innerHeight) {
        resetPlayer();
    }
	objFunction();
},1)
window.onresize = function () {
    resetPlayer()
};
window.bgm = new Audio(window.assets.music.Addiction);
setInterval(() => {
    bgm.play();
}, 1)
window.background = document.getElementById("background");
background.style.position = "fixed";
background.style.top = "0";
background.style.left = "0";
background.style.width = "100vw";
background.style.height = "100vh";
background.style.zIndex = "-10";
background.src = assets.bg.ghz;
background.style.imageRendering = "pixelated";
background.hidden = true;
function enableBG() {
    document.body.appendChild(background);
}
window.objectTouched = null;

offcenterFrames["lookup1"] = {
    left: 11,
    top: -2
};
offcenterFrames["lookup-1"] = {
    left: -3,
    top: -2
};
