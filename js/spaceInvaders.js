var gameTimer;

var leftArrowDown = false;
var rightArrowDown = false;

var shotCount = 0;
var enemies =[];
var autoFire = false;

const GS_WIDTH = 800;
const GS_HEIGHT = 600;
const BG_SPEED = 4;

function init(){
    $("#endGame").hide();
    
	$("#gameScreen").css("width", GS_WIDTH + "px");
	$("#gameScreen").css("height", GS_HEIGHT + "px");
    
    $("#gameScreen").append("<img src='img/bg.jpg' id='bg1' class='gameObject'/>");
    $("#bg1").css({
        "width":"800px",
        "height":"1422px",
        "top":"0px",
        "left":"0px"
    });
    
    $("#gameScreen").append("<img src='img/bg.jpg' id='bg2' class='gameObject'/>");
    $("#bg2").css({
        "width":"800px",
        "height":"1422px",
        "top":"-1422px",
        "left":"0px"
    });
    
    $("#gameScreen").append("<div class='gameObject' id='bullets'></div>");
    $("#bullets").css({
        "width": $("#gameScreen").css("width"),
        "height": $("#gameScreen").css("height"),
        "top":"0px",
        "left":"0px"
    });
    
    $("#gameScreen").append("<img src='img/ship.gif' id='ship' class='gameObject'/>");
    $("#ship").css({
        "width":"68px",
        "height":"68px",
        "top":"500px",
        "left":"366px"
    });
    
    $('#gameScreen').append("<img src='img/blueOrb.png' id='orb' class='gameObject'/>");
    $("#orb").css({
        "width":"40px",
        "height":"40px",
        "left":"395px",
        "top":"-3500px"
    });
    $("#orb").data("speed",15);
    // JS ------>
    for(var i = 0; i < 10; ++i){
        var enemy = new Image();
        enemy.className = 'gameObject';
        enemy.style.width = '64px';
        enemy.style.height = '64px';
        enemy.src = 'img/enemyShip.gif';
        $("#gameScreen").append(enemy);
        placeEnemyShip(enemy);
        enemies[i] = enemy;
    }
    // ----------------------------
	gameTimer = setInterval(gameloop, 50);
}

// JS ------->
function placeEnemyShip(e){
    e.speed = Math.floor(Math.random() * 10) + 6;
    
    var maxX = GS_WIDTH - parseInt(e.style.width);
    var newX = Math.floor(Math.random() * maxX);
    e.style.left = newX + "px";
    
    var newY = Math.floor(Math.random()*600) - 1000;
    e.style.top = newY + "px";
}
// ------------


function placeOrb(o){
    var maxX = GS_WIDTH - parseInt($(o).css("width"));
    var newX = Math.floor(Math.random() * maxX);
    var newY = Math.floor(Math.random()*1000) - 4500;
    
    $(o).data("speed", Math.floor(Math.random() * 10) + 6);
    $(o).css({
        "left": newX + "px",
        "top": newY + "px"
    });
}

function gameloop(){
    
    // Background movement
    var bgY = parseInt($("#bg1").css("top")) + BG_SPEED;
    if(bgY > GS_HEIGHT){
        $("#bg1").css("top", (-1 * parseInt($("#bg1").css("height"))) + "px");
    }
    else{
        $("#bg1").css("top", bgY + "px");
    }
    
    bgY = parseInt($("#bg2").css("top")) + BG_SPEED;
    if(bgY > GS_HEIGHT){
        $("#bg2").css("top", (-1 * parseInt($("#bg2").css("height"))) + "px");
    }
    else{
        $("#bg2").css("top", bgY + "px");
    }

    // Movement
	if(leftArrowDown){
		var newX = parseInt($("#ship").css("left"));
		if(newX > 0){
            $("#ship").css("left",(newX - 20) + "px");
		}
		else{
            $("#ship").css("left","0px");
		}
	}

	if(rightArrowDown){
		var newX = parseInt($("#ship").css("left"));
		var maxX = GS_WIDTH - parseInt($("#ship").css("width"));
		if(newX <  maxX){
		    $("#ship").css("left",(newX + 20) + 'px');
		}
		else {
		    $("#ship").css("left",maxX + "px");
        }
    }
    
    // Autofire Logic
    if(autoFire == true){
        if(shotCount % 2 == 0)
            fire();
        else
            ++shotCount;
    }
    
    // Bullet Movement
    var b = $("#bullets").children();
    for(var i = 0; i < b.length; ++ i){
        var newY = parseInt($(b[i]).css("top")) - $(b[i]).data("speed");
        if(newY < 0){
            $(b[i]).remove();
        }
        else{
            $(b[i]).css("top", newY + "px");
            for(var j = 0; j < enemies.length; ++ j){
                if(hittest(b[i], enemies[j])){
                    $(b[i]).remove();
                    explode(enemies[j]);
                    placeEnemyShip(enemies[j]);
                    break;
                }
            }
        }
    }
    
    // Enemy collision detection(JS)
    for(var i = 0; i < enemies.length; ++ i){
        var newY = parseInt(enemies[i].style.top);
        if(newY > GS_HEIGHT){
            placeEnemyShip(enemies[i]);
        }
        else{
            enemies[i].style.top = newY + enemies[i].speed + "px";
        }
        
        if(hittest(enemies[i], $("#ship"))){
            explode($("#ship"));
            explode(enemies[i]);
            $("#ship").css("top", "-10000px");
            placeEnemyShip(enemies[i]);
            $("#endGame").show();
            clearInterval(gameTimer);
            
        }
    }
    
    //Blue orb Movement
    var newY = parseInt($("#orb").css("top"))
    if(newY > GS_HEIGHT)
        placeOrb($("#orb"));
    else
        $("#orb").css("top", (newY + $("#orb").data("speed")) + "px");
        
    if(hittest($("#ship"), $("#orb"))){
        autoFire = true;
        shotCount = 0;
        placeOrb($("#orb"));
    }
}

//JS
function explode(obj){
    var explosion = document.createElement('IMG');
    explosion.src = 'img/explosion.gif?x=' + Date.now();
    explosion.className = 'gameObject';
    explosion.style.width = $(obj).css("width");
    explosion.style.height = $(obj).css("height");
    explosion.style.left = $(obj).css("left");
    explosion.style.top = $(obj).css("top");
    $("#gameScreen").append(explosion);
}

function fire(){
    var shipX = parseInt($("#ship").css("left")) +  parseInt($("#ship").css("width"))/2;
    var bulletWidth = 4;
    var bulletHeight = 10;
    
    if(shotCount == 150){
        shotCount = 0;
        autoFire = false;
    }
    
    $("#bullets").append("<div class='gameObject bullet' id='bullet"+ shotCount +"'></div>");
    $("#bullet" + shotCount).data("speed",20);
    $("#bullet" + shotCount).css({
        "width": bulletWidth + "px",
        "height": bulletHeight + "px",
        "top": (parseInt($("#ship").css("top")) - bulletHeight) + "px",
        "left": (shipX - bulletWidth/2) + "px",
        "backgroundColor": "yellow"
    });
    ++shotCount;
}

// JS
function hittest(a, b){
    var aW = parseInt($(a).css("width"));
    var aH = parseInt($(a).css("height"));
    
    var aX = parseInt($(a).css("left")) + aW/2;
    var aY = parseInt($(a).css("top")) + aH/2;
    
    var aR = (aW + aH) / 4;
    
    var bW = parseInt($(b).css("width"));
    var bH = parseInt($(b).css("height"));
    
    var bX = parseInt($(b).css("left")) + bW/2;
    var bY = parseInt($(b).css("top")) + bH/2;
    
    var bR = (bW + bH) / 4;
    
    var minDistance = aR + bR;
    
    var cXs = (aX - bX) * (aX - bX);
    var cYs = (aY - bY) * (aY - bY);
    var distance = Math.sqrt(cXs + cYs);
    
    return distance < minDistance;
}

$(document).on("keydown",function(event){
    if(event.keyCode==37) 
        leftArrowDown = true;
	if(event.keyCode==39) 
	    rightArrowDown = true;
});

$(document).on("keyup", function(event){
    if(event.keyCode==37) 
        leftArrowDown = false;
	if(event.keyCode==39) 
	    rightArrowDown = false;
});

$(document).on("keypress",function(event) {
    if(event.charCode == 32)
        fire();
});