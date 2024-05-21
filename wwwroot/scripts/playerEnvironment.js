$(document).ready(function () {

    followMe.shot = function (options) {
        var defaultValues =
        {
            identifier: 1,
            y: 0,
            x: 0,
            hurt: 0,
            friendlyFire: true
        }
        $.extend(this, defaultValues, options);
    }
    if ($("#isGame").val() == "yes" && followMe.url.search("levelselect")) {
        $(document).off("click").on("click", function (e) {
            followMe.fireTheShot(e);
        });
    };

    var url = document.URL.valueOf();
    followMe.players = [];
    followMe.levelServicesDefined.on("Startpoint", function ( serveranimation, y, user, firstplayer, username) {
        if (username == localStorage.getItem("username")) {
            var playerObject = followMe.players[1];

            if (serveranimation.checkpoint != 0) {
                if (followMe.players[1] != undefined) {
                    followMe.players[1].hasSurvived = 0
                }
            }
            var startY = (y * 16) - 128
            var startX = (serveranimation.x * 16)
            var theId = "player"
            if (firstplayer) {
                localStorage.setItem("startX", startX)
                localStorage.setItem("startY", startY)
                localStorage.setItem("checkpoint", user.checkpoint)
            }
            if (playerObject.online) {
                $("p#" + playerObject.username + "name").remove();
                $("<p class='linkNoBorder' style=':" + (startY - 16) + "px;top:" + startX + "px;position:absolute;' id='" + playerObject.username + "name'>" + playerObject.username + "</p>").appendTo($("#game"))

                followMe.showOtherPlayer(startX, startY + 32, followMe.players[1].username)

            }

            followMe.x(theId, 10);
            var playerId = 1;
            if (serveranimation.x == 0 && theId == "player" &&
                localStorage.getItem("multi") == false) { followMe.x(theId, (114)); }
            if (serveranimation.x == 0 && theId == "player2") { followMe.x(theId, (10)); playerId = 2 }
            else { followMe.x(theId, (serveranimation.x * 16)) };
            followMe.y(
                theId,
                ((y - 1) * 16) - 2,
                50
            );

            var object = followMe.players[playerId];
            followMe.showPlayerStats(user);

            //Set that checkpoint to be "current", so that it glows
            $("#".concat(getCheckpointByPlayerCheckpoint(serveranimation.checkpoint).systemId).concat(" img")).attr("src", "/images/checkpoint_current.png")

            $("#" + theId).show();
            if (followMe.url.search("/connect") == -1 && $("#isGame").val() == "yes") {
                //setInterval(function(){
                followMe.communityServices.server.recordLevelAccomplishment(username, "checkpoint", user.checkpoint, $("#welcome").text(), "EndingTheBeginning")
                //},1000)
            }
        }
    })
    followMe.resetPlayer = function (end) {
        alert("live lost, resetting");
        //window.console.log(localStorage.getItem("startX") + ", " + localStorage.getItem("startY"))
        localStorage.setItem("resetting", true)
        if (followMe.players[1].personType == "3") {
            followMe.players[1].usedStealth = 0
            followMe.keyboard[followMe.players[1].special] = undefined;
        }

        if (end != 1 && localStorage.getItem("currentCaveName") != "") {
            localStorage.setItem("currentCaveName", "")
            followMe.showCaveContents(false, "")
        }

        var object = followMe.players[1];
        //if (end != 1 && $("#welcome").text() != "levelSelect") {
        //    object.lives -= 1
        //}
        $("#livesPlayer").val(parseFloat(object.lives))
        $("#player, #weapon1").css("top", localStorage.getItem("startY"))//instant now instead of animated for 50ms, but should show an animation when reloading, and stop player interaction
        $("#player").css("left", localStorage.getItem("startX") + "px")
        $("#weapon1").css("left", (localStorage.getItem("startX") - 96) + "px")
        followMe.showOtherPlayer(localStorage.getItem("startX"), localStorage.getItem("startY"), followMe.players[1].username)
        object.currentSurfaceID = 0;
        localStorage.setItem("enemyHit", "")
        if ($("#lives").text() != "0" && end != 1 && $("#welcome").text() != "levelSelect") {
            //followMe.updatehealth(localStorage.getItem("username"), 0)
        }
        if (localStorage.getItem("checkpoint") != 0) {
            followMe.updateXPFromAction("checkpoint");
        }
    };
    //This is the function for dropping the character on a match
    followMe.defineDrop = function (code, x, direction, player) {//
        var movement = "";
        if (code == followMe.players[1].right) { movement == "right" }
        if (code == followMe.players[1].left) { movement == "left" }

        var yDiff = parseInt(followMe.y("player")) + 64;
        if (movement == "fan") {
            yDiff = parseInt(followMe.y("player")) + 384;
        }
        var min = null;
        var idDefined = "";
        var idDefined2 = "";
        var somethingBelow = false;
        var playerX = followMe.x(player)
        var value = 64
        var continuing = true;
        var playerY = 0;
        if (code == "jump") {
            //alert()
        }
        followMe.hasCollided(movement, x, yDiff, ".surface")
        $(".surface").each(function () {
            var x = this.id;
            var surfaceObject = followMe.surfaces[x];
            //if (surfaceObject == undefined)
            //    {alert(this.id + ", " + x)}
            var surfaceMinX = surfaceObject.minx;
            var surfaceMaxX = surfaceObject.maxx;
            var surfaceY = surfaceObject.miny;

            //var surfaceMaxY = x.substring(x.indexOf("y") + 1, x.length)
            if (playerX + 48 >= surfaceMinX && playerX <= surfaceMaxX && yDiff <= surfaceY
                && continuing && surfaceObject.fan != true
                && (this.id != followMe.players[1].currentSurfaceID || surfaceObject.surfaceAnimationCollection == "")//Just to make sure the animated surface isn't pulling me left or right again
            ) {
                somethingBelow = true;
                if ((min === null) || (surfaceY < min)) {

                    //$("#" + player).css("top", surfaceMinX - 64 + "px")//direction

                    //alert("fan")
                    //alert(player + ", "+ surfaceY + ": "+ surfaceMinX - 64)
                }
                min = surfaceY;
                idDefined = x;
                idDefined2 = this.id
                continuing = false;
                //28/01/18 adding "this is my current surface" to person to allow lifts in moveObjectOnLopp in buildLevel.js to know if it needs to move the person or not
                followMe.players[1].currentSurfaceID = "surface" + x;
            }
        })
        $(".checkpoint").each(function () {
            var id = this.id;
            var id2 = id.substring(id.indexOf("checkpoint") + 10)
            if (id2 == localStorage.getItem("checkpoint")) {
                //playerY = parseFloat(followMe.checkpoints[id2].y + 32) + "px";
                playerY = parseFloat(getCheckpointByPlayerCheckpoint(id2).y + 32) + "px";
                window.console.log(playerY);
                window.console.log(getCheckpointByPlayerCheckpoint(id2));
                localStorage.setItem("startY", playerY)
            }
        })

        if (min != null) {
            var usedFan = false;

            followMe.checkForItems()
            if (usedFan == false && idDefined != (localStorage.getItem("fanHit")) && movement != "fan") {//D 
                //alert(idDefined)d
                followMe.y(player, min - 96)
            }
            followMe.keyboard[code] = true;

        }
        else {
            if (movement != "noFan") {
                $(".fan").each(function () {
                    var x = this.id.substring(7)
                    var surfaceObject = followMe.surfaces[x];
                    var surfaceMinX = surfaceObject.minx;
                    var surfaceMaxX = surfaceObject.maxx;
                    var surfaceY = surfaceObject.miny;
                    if (playerX + 48 >= surfaceMinX && playerX <= surfaceMaxX && yDiff <= surfaceY
                        && continuing && surfaceObject.fan == true && somethingBelow != true
                    ) {
                        somethingBelow = true;
                        if ((min === null) || (surfaceY < min)) {
                            followMe.y("player", followMe.y("player") - 256)
                            //alert(1);

                            //localStorage.setItem("fanHit", idDefined)

                            followMe.defineDrop("noFan", followMe.x("player"), "", "player")
                            continuing = false
                        }
                        min = surfaceY;
                        idDefined = x;
                        idDefined2 = this.id

                    }
                })
            }
            if (min == null) {
                //alert("DEAD");
                followMe.keyboard[code] = false;
                var object = followMe.players[1];
                followMe.updatehealth(localStorage.getItem("username"), 0);
            }

        }
        if (followMe.players[1].online) {
            followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username)
        }
    }


    //Collided
    followMe.hasCollided = function (movement, xDefined, yDefined, classCheck, playerid, local) {
        var matchType = "no match";
        var shotOtherPlayer = false;
        var continuing = true;
        var objectid = "";
        $(classCheck).each(function () {
            if (continuing == true) {
                var x = this.id;
                var object = followMe.players[1];
                var index = $("#" + x).attr("alt")
                var playerleftx = parseFloat(object.pace + xDefined + 32);
                if (movement == "left") {
                    var playerleftx = parseFloat(xDefined - object.pace);
                }
                var playertopy = parseFloat(yDefined + 64);
                var playerbottomy = parseFloat(playertopy + 32)
                var playerrightx = parseFloat(playerleftx + 64)


                var minx = x.substring(0, x.indexOf("_"));
                var maxx = x.substring(x.indexOf("-") + 1, x.indexOf("y"))
                var miny = x.substring(x.indexOf("_") + 1, x.indexOf("-"))
                var maxy = x.substring(x.indexOf("y") + 1, x.length);
                //Make enemy OO                
                objectid = x;

                var objectToQuery = followMe.teleports[x];

                if (classCheck == ".checkpoint") {
                    objectToQuery = followMe.checkpoints[x];
                }

                if (classCheck == ".surface") {
                    objectToQuery = followMe.surfaces[x]
                    minx = objectToQuery.minx;
                    maxx = objectToQuery.maxx;
                    miny = objectToQuery.miny;
                    maxy = objectToQuery.maxy
                }
                if (classCheck == ".player")//online shooting
                {
                    if (local == false) {
                        objectToQuery = followMe.players[1];
                        minx = followMe.x(x);
                        miny = followMe.y(x);
                    }
                    else {
                        minx = followMe.x(x);
                        miny = followMe.y(x);
                        //alert("other found");
                        //    }
                        //}
                    }
                    maxx = minx + 48;
                    maxy = miny + 96;

                }

                if (classCheck == ".caves") {
                    objectToQuery = followMe.caves[x]
                    playerrightx = playerleftx
                    playertopy = yDefined;
                    playerbottomy = yDefined;
                    minx = objectToQuery.x;
                    maxx = objectToQuery.maxx;
                    miny = objectToQuery.y;
                    maxy = objectToQuery.maxy
                }
                if (classCheck == ".teleports") {

                    objectToQuery = followMe.teleports[x];
                }
                if (classCheck == ".teleports" || classCheck == ".checkpoint") {
                    if (objectToQuery == undefined) { window.console.log(classCheck, objectToQuery, $(classCheck), x, gameProperties.getCheckpoints())}
                    minx = objectToQuery.x;
                    maxx = objectToQuery.maxx;
                    miny = objectToQuery.y;
                    maxy = objectToQuery.maxy
                    //alert(miny + ": "+ maxy + "===" + minx + ": " + maxx)
                }

                if (playerid != null) {
                    if (playerid.search("shot") != -1) {
                        playerleftx = yDefined;
                        playerrightx = parseFloat(parseFloat(yDefined) + parseFloat(movement) + 20)
                        playerbottomy = parseFloat(xDefined + 10)
                        playertopy = xDefined;
                    }
                }

                if (($("#" + this.id).attr("class").search(" caveName" + localStorage.getItem("currentCaveName")) != -1 && object != ",enemies" &&
                    (classCheck != ".surface" && playerid == null ||
                        playerid != null && playerid.search("shot") != -1 || classCheck == ".checkpoint" ||
                        classCheck == ".teleports") || classCheck == ".caves")
                ) {
                    if (classCheck == ".enemies") {
                        minx = followMe.enemies[x].x
                        maxx = minx
                        miny = followMe.enemies[x].y
                        maxy = miny + 96

                        //window.console.log(minx + ", "+ maxx + "; "+ miny + ", "+ maxy)
                    }

                    if (parseFloat(minx) <= parseFloat(playerleftx) && parseFloat(playerleftx) <= parseFloat(maxx) &&
                        parseFloat(miny) <= parseFloat(playerbottomy) && parseFloat(playerbottomy) <= parseFloat(maxy)) {
                        matchType = 1;
                    }
                    //top left
                    if (parseFloat(minx) <= parseFloat(playerleftx) && parseFloat(playerleftx) <= parseFloat(maxx) &&
                        parseFloat(miny) <= parseFloat(playertopy) && parseFloat(playertopy) <= parseFloat(maxy)) {
                        matchType = 2;
                    }
                    //top right
                    if (parseFloat(minx) <= parseFloat(playerrightx) && parseFloat(playerrightx) <= parseFloat(maxx) &&
                        parseFloat(miny) <= parseFloat(playertopy) && parseFloat(playertopy) <= parseFloat(maxy)) {
                        matchType = 3.1;
                    }
                    //bottom right
                    if (parseFloat(minx) <= parseFloat(playerrightx) && parseFloat(playerrightx) <= parseFloat(maxx) &&
                        parseFloat(miny) <= parseFloat(playerbottomy) && parseFloat(playerbottomy) <= parseFloat(maxy)) {
                        matchType = 3.3;
                    }
                }
                //x inside
                if (parseFloat(playerleftx) < parseFloat(minx) && parseFloat(maxx) <
                    parseFloat(playerrightx) && parseFloat(playerbottomy) < parseFloat(miny)
                    && parseFloat(playertopy) > parseFloat(maxy)
                    ||
                    parseFloat(playerleftx) < parseFloat(minx) && parseFloat(maxx) <
                    parseFloat(playerrightx) && parseFloat(playerbottomy) > parseFloat(miny)
                    && parseFloat(playertopy) < parseFloat(maxy)
                ) { matchType = 4 }

                ////y inside
                if (parseFloat(playertopy) < parseFloat(miny) && parseFloat(maxy) < parseFloat(playerbottomy)) { matchType = 5; }


                if (matchType != "no match") {

                    if (classCheck == ".teleports" && followMe.teleports[x].teleportAllowed) {
                        if (confirm("Are you sure you want to travel to the " +
                            objectToQuery.level + " level of world " + objectToQuery.world + "?")) {
                            followMe.levelServicesDefined.invoke("redirectFromTeleport",localStorage.getItem("username"),
                                objectToQuery.world, objectToQuery.level, followMe.players[1]);
                        }
                        continuing = false;
                    }

                    if (classCheck == ".teleports" && followMe.teleports[x].teleportAllowed == false) {
                        followMe.x("player", followMe.x("player") - 48, 5);
                        alert("level locked, to unlock: " + followMe.teleports[x].whyLocked)
                        continuing = false;
                    }

                    if (playerid.search("shot") != -1) {
                        if (classCheck == ".surface") {
                            $("#" + playerid).remove();
                        }

                        if ((classCheck == ".enemies" && playerid != localStorage.getItem("bulletFired"))
                        ) {
                            $("#" + playerid).remove();
                            followMe.hurtEnemy(x, playerid)
                            if (followMe.helpRequest != null) {
                                followMe.communityServices.server.sharePartnerEnemyHurt(
                                    followMe.players[1].username,
                                    followMe.helpUsername,
                                    followMe.helpRequest.substring(followMe.helpUsername.length + 1),
                                    followMe.shots[playerid.substring(4)].hurt,
                                    followMe.helpRequest,
                                    x
                                );
                            }
                            localStorage.setItem("bulletFired", playerid, true)
                        }
                        if (classCheck == ".caves" && (objectToQuery.isWall || objectToQuery.isCeiling) && objectToQuery.caveName == localStorage.getItem("currentCaveName")) {
                            $("#" + playerid).remove();
                            //alert("cave, "+ x)
                        }

                        if (classCheck == ".player" && followMe.players[1].friendlyFire) {
                            var dying = false;
                            var status = "";

                            if (local) {
                                status = "local";
                                for (var i = 0; i <= followMe.otherPlayers.length; i++) {
                                    if (followMe.otherPlayers[i] != undefined && followMe.otherPlayers[i].username == x.substring(6, x.length) && followMe.otherPlayers[i].username != "") {
                                        objectToQuery = followMe.otherPlayers[i]
                                    }
                                }
                                hurt = followMe.shots[playerid.substring(4)].hurt;
                                newhealth = objectToQuery.health - hurt;
                            }
                            else {
                                status = "server"
                                hurt = followMe.shots[playerid.substring(10)].hurt;
                                newhealth = objectToQuery.health - hurt;
                                //followMe.updatehealth(objectToQuery.username, newhealth, true)

                            }
                            if (objectToQuery.friendlyFire && followMe.players[1].friendlyFire) {
                                if (newhealth <= 0) { dying = true; }

                                if (hurt > 0 && continuing) {

                                    followMe.updatehealth(objectToQuery.username, newhealth, true, objectToQuery);

                                    if (status == "server") {
                                        followMe.showOtherPlayer(followMe.x("player" + objectToQuery.username), followMe.y("player" + objectToQuery.username), objectToQuery.username, true)
                                    }
                                    else {
                                        if (newhealth <= 0 && (followMe.playerLastKilled != objectToQuery.username || followMe.playerLastKilled == undefined)) {
                                            followMe.updateXPFromAction("person");
                                            followMe.playerLastKilled = objectToQuery.username
                                        }
                                    }
                                    //alert(status + ", hurt: " + hurt + ", username: " + objectToQuery.username + ", oldHealth: " + objectToQuery.health + ", newHealth: " + newhealth)
                                    continuing = false;
                                }
                            }
                        }

                        continuing = false;
                    }
                    if (classCheck == ".checkpoint"
                        && x != localStorage.getItem("checkpoint")
                    ) {
                        console.log(x);
                        followMe.checkpointSubmit(x, miny, movement)
                        continuing = false;
                    }

                    if (classCheck == ".caves") {
                        //alert("cave entered: " + objectToQuery.caveName)//+ ", " + matchType+ ", " + x)

                        continuing = false;


                        if (objectToQuery.entrance == true && movement == followMe.players[1].enter) {
                            //alert("check" + matchType + ", " + x+ " : " + movement)
                            followMe.checkpointSubmit(x, miny, movement)
                            followMe.showCaveContents(true, objectToQuery.caveName)
                        }
                        else {
                            if (localStorage.getItem("currentCaveName") != "" && objectToQuery.isWall == true)//They are inside a cave
                            {
                                if (movement == followMe.players[1].right) {
                                    followMe.x("player", followMe.x("player") - 64)
                                }
                                if (movement == followMe.players[1].left) {
                                    followMe.x("player", followMe.x("player") + 64)
                                }
                            }
                        }
                    }
                }
                else {
                    //$("#collision").html(
                    //    "no collision <br />"+
                    //    "X: "+ xDefined + "->" + playerleftx + 20 + "<br />"+
                    //    "Y: "+ yDefined + "->" + yDefined + (movement * 20)
                    //    );
                }
            }
        })
    }

    followMe.checkpointSubmit = function (index, top, movement) {

        var alt = index.substring(index.indexOf("checkpoint") + 10)
        var objectToQuery = followMe.checkpoints[alt];
        var bottom = top
        var bottom2 = bottom + 96
        var playerbottom = $("#player").css("top");
        var keyForLog = $("#" + alt + "key").text();
        playerbottom = parseFloat(playerbottom.substring(0, playerbottom.length - 2)) + 64

        if (objectToQuery != null) {
            if (objectToQuery.messageForKey != "" && objectToQuery.caveName == localStorage.getItem("currentCaveName")) {

                if (followMe.url.search("/connect") == -1 && $("#isGame").val() == "yes") {
                    if (alt <= -1) {
                        followMe.hasXPActionHappened("bonus", alt, "find")
                        followMe.communityServices.server.recordLevelAccomplishment(followMe.players[1].username, "bonus", keyForLog, $("#welcome").text(), "EndingTheBeginning")
                    }
                }

                if (movement == followMe.players[1].enter) {
                    window.open(followMe.homeurl + "/Bonus/Bonus" + objectToQuery.unityLevel + ".exe", "venoriFollowMe bonus game")
                }
            }


            //alert(alt)

            if (alt != localStorage.getItem("checkpoint") && objectToQuery.messageForKey == "" && objectToQuery.caveName == localStorage.getItem("currentCaveName") && bottom2 == playerbottom) {

                followMe.levelServicesDefined.server.updateCheckpoint(
                    localStorage.getItem("username"),
                    alt,
                    $("#welcome").text(),
                    localStorage.getItem("checkpoint"),
                    followMe.checkpoints[alt].levelName,
                    followMe.players[1].playTime,
                    followMe.players[1].hasSurvived
                )

                if (followMe.helpRequest != null) {
                    followMe.communityServices.server.shareCheckpoint(
                        followMe.players[1].username,
                        followMe.helpUsername,
                        followMe.helpRequest.substring(followMe.helpUsername.length + 1),
                        alt,
                        followMe.helpRequest
                    )
                }
                localStorage.setItem("checkpoint", alt)
                if (alt != "-1") {
                    if (followMe.url.search("/connect") == -1 && $("#isGame").val() == "yes") {
                        followMe.communityServices.server.recordLevelAccomplishment(followMe.players[1].username, "checkpoint", alt, $("#welcome").text(), "EndingTheBeginning")

                    }

                    bottom3 = parseFloat(bottom2) - 96
                    localStorage.setItem("startX", $("#" + index).css("left"))
                    localStorage.setItem("startX2", $("#" + index).css("left"))
                    localStorage.setItem("startY", bottom3 + "px")
                    localStorage.setItem("startY2", bottom3 + "px")



                    if (followMe.players[1].personType == "3") {
                        followMe.players[1].usedStealth = 0;
                        followMe.keyboard[followMe.players[1].special] = undefined;
                    }

                    $(".checkpoint").each(function () {
                        var x = this.id; var alt = $("#" + x).attr("alt");

                        if (alt == localStorage.getItem("checkpoint")) {
                            $("#" + x).css("backgroundPosition", "-64px -64px")
                        }

                        else {
                            if (followMe.checkpoints[x.substring(10)].caveName == "") {
                                $("#" + x).css("backgroundPosition", "0px -64px")
                            }
                        }
                    });

                    localStorage.setItem("startX", objectToQuery.x + "px")
                    localStorage.setItem("startY", objectToQuery.y + "px")

                    if (followMe.players[1].personType == 1) {
                        var object = followMe.players[1];
                        followMe.updatehealth(localStorage.getItem("username"), object.maxHealth)
                    }
                }
            }
        }
    }
    followMe.checkForItems = function (xSubmitted) {
        var continuing = true;
        $(".item").each(function () {
            var xToUse = followMe.x("player");
            if (xSubmitted) {
                xToUse = xSubmitted;
            }

            var id = this.id;
            var x = id.substring(id.indexOf("-") + 1, id.indexOf("y"))
            var y = parseFloat(id.substring(id.indexOf("_") + 1, id.indexOf("-"))) + 32
            var distance = 64;
            $("#itemy").text((x - followMe.x("player")) / 2)
            $("#itemx").text((followMe.x("player") - x) / 2)

            if (
                ((xToUse - x) <= distance && (y - followMe.y("player")) <= distance &&
                    (x - xToUse) <= distance && (followMe.y("player") - y) <= distance
                    ||//Above was bottom right
                    (xToUse - x) <= distance && (y - followMe.y("player")) >= distance &&
                    (x - xToUse) <= distance && (followMe.y("player") - y) <= distance
                    //That was top right
                    ||
                    ((x - xToUse) / 2) <= distance && (followMe.y("player") - y) <= distance
                    && ((xToUse - x) / 2) >= -distance && (y - followMe.y("player")) >= -distance
                    && ((x - xToUse) / 2) >= 0)
                //That was bottom left
                && continuing
                //||                                               
            ) {
                continuing = false;

                if ($("#" + id).css("display") != "none") {
                    continuing = false;
                    $("#" + id).hide();
                    $("#" + id + "message").show();
                    setInterval(function () {
                        $("#" + id + "message").hide("slow")
                    }, 4500)
                }
            }
        });
    }



    followMe.userServicesDefined.on("getWeapon", function (username, weaponDefinition, online, community) {
        //if (username != localStorage.getItem("username"))
        //{
        //    alert("online weapon: " + weaponDefinition + ", " + community + " == " + username)
        //}
        if (url.search("Connect/design") == -1 && weaponDefinition != null && ((community == false && username == localStorage.getItem("username")) || (followMe.players[1] != undefined && followMe.players[1].venoir)) || followMe.helpRequest != null) {
            var identifier = "weapon1"
            var top = parseFloat(followMe.y("player") - 10);
            var left = parseFloat(followMe.x("player") - 96);

            if (community) {
                identifier = "otherWeapon";
            }

            if (online == false) {
                if (localStorage.getItem("username") == username) {
                    followMe.weapon = {};
                    followMe.weapon.classDefinition = weaponDefinition.identifierToSee;;
                    followMe.weapon.hurt = weaponDefinition.hurt;
                    followMe.weapon.rate = weaponDefinition.rate;
                }
                followMe.onlineWeaponIs2 = identifier + ", " + top + ", " + (-96 * (weaponDefinition.identifierToSee - 1)) + ", " + followMe.imageDefintion.weapon;
            }
            else {
                if (localStorage.getItem("username") != username && online && community == false) {
                    identifier = "onlineWeapon" + username;
                    top = parseFloat(followMe.y("player" + username) - 10)
                    left = parseFloat(followMe.x("player" + username) - 96)
                    followMe.onlineWeaponIs = identifier + ", " + top + ", " + (-96 * (weaponDefinition.identifierToSee - 1)) + ", " + followMe.imageDefintion.weapon;
                }
            }

            $("#" + identifier).css("background", "url('/Images/spriteSheet.png')" + (-96 * (weaponDefinition.identifierToSee - 1)) +
                "px " + followMe.imageDefintion.weapon).css("top", top + "px").css("position", "absolute").css("width", "96px")
                .css("height", "48px");
            if (online && username != localStorage.getItem("username")) {
                //alert(identifier)
                $("#" + identifier).css("left", left + "px").css("zIndex", "999")
            }
        }
    })
    $("#weaponID").val(1)
    followMe.userServicesDefined.on("getWeapons", function (username, theWeapon) {
        if (username == localStorage.getItem("username")) {
            var theID = parseFloat(theWeapon.identifierToSee);
            var top = ((theID + 2) * 64)

            $("#weapon_" + theID).css("background", "url('/Images/spriteSheet.png')" + parseFloat((-96 * (theID - 1))) +
                "px " + followMe.imageDefintion.weapon).css("top", top + "px")
                .parent().children().last().css("left", "128px")
                .css("top", top + "px")

            if (theID == 1) {
                $("#weapon_" + theID).addClass("weaponSelected")
            }

            $("#weaponDetail_" + theWeapon.identifierToSee).html(
                "<b>Shot Rate: </b>" + theWeapon.rate +
                "<br/><b>Impact: </b>" + theWeapon.hurt
            )
        }
    })

    $(".weaponImage").click(function () {
        var idhere = this.id
        $(".weaponImage").removeClass("weaponSelected")
        $("#" + idhere).addClass("weaponSelected")
        $("#weaponID").val(idhere.substring(idhere.length - 1))
    })

    //Caves


    followMe.showCaveContents = function (inCave, caveName) {
        //if (caveName != "resetting") {
        followMe.changeImageDesign(localStorage.getItem("currentCaveName"), caveName, true)

        //}
        $(".enemies").show()

        if (inCave == false || localStorage.getItem("currentCaveName") == caveName) {
            $(".insideCave").hide();
            $(".outsideCave").show("slow");
            localStorage.setItem("currentCaveName", "")
        }
        else {
            $(".outsideCave").hide();
            $(".caveName" + caveName).show("slow");
            localStorage.setItem("currentCaveName", caveName)
            followMe.communityServices.server.recordLevelAccomplishment(followMe.players[1].username, "cave", caveName, $("#welcome").text(), "EndingTheBeginning")
        }

    }


    followMe.changeImageDesign = function (interactingName, caveName, forCave, goRight, online) {
        var number = 128;

        if (goRight == null) { goRight = true }

        if (forCave == true) {

            $(".caves").each(function () {
                if ($("#" + this.id).attr("class").search("isCave " + caveName) != -1) {

                    if (caveName == interactingName) {//entering cave
                        goRight = false;
                    }

                    designChanged(this.id, number, goRight)
                }
            })
            $(".caves outside " + caveName).show();
        }
        else {
            switch (interactingName) {
                case "stealth":
                    if (followMe.players[1].usedStealth < 2) {
                        number = 96;
                        if (followMe.players[1].usedStealth == 1) {
                            goRight = false;
                            followMe.players[1].usedStealth = 2 //DONE
                        }
                        designChanged("head1", number, goRight)
                        designChanged("torso1", number, goRight)
                        designChanged("legs1", number, goRight)
                    }
                    break;
                case "weapon":
                    number = 286;
                    if (online !== true) {
                        designChanged("weapon1", number, goRight);
                    }
                    else {
                        designChanged(caveName, number, goRight);
                    }
                    break;
                case "newCheckpoint":
                    number = 64;
                    designChanged("checkpoint" + caveName, number, goRight);
                    break;
            }
        }
    }


    function designChanged(id, number, right) {
        var originalBackground = $("#" + id).css("backgroundPosition");
        var newBackground = parseFloat(originalBackground.substring(0, originalBackground.indexOf("px")));


        if (right == false) {
            parseFloat(newBackground += number);
        }
        else {
            parseFloat(newBackground -= number);
        }
        $("#" + id).css("backgroundPosition", newBackground + originalBackground.substring(originalBackground.indexOf("px")))
    }


})