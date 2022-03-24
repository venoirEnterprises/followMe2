$(function () {
    followMe.multiplayer.start().then(function () {
        followMe.setPrimaryHealth = function (personObj) {
            followMe.multiplayer.invoke("showPrimaryHealth", personObj.health, personObj.username, personObj.lives);
        }

        followMe.showOtherPlayer = function (x, y, username, shot, stealth) {
            if (stealth === undefined) {
                stealth = false;
            }
            if (followMe.players[1].online || shot === true) {
                //if (shot)
                //    {alert()}
                followMe.multiplayer.invoke("showOtherPlayer",x, y, username, localStorage.getItem("currentCaveName"), stealth, followMe.helpRequest);
            }
        }
        followMe.shootOnline = function (shotID, down, moveEachTime, mouseX, mouseY, behind, weaponClass, username, shotObj) {
            if (followMe.players[1].online) {
                followMe.multiplayer.invoke("fireOnlineBullet",shotID, down, moveEachTime, mouseX, mouseY, behind, weaponClass, username, localStorage.getItem("currentCaveName"), shotObj)
                //The player is going to have existed, just check cave
            }
        }
    });

    followMe.otherShots = [];
    followMe.otherPlayers = [];
    followMe.otherPlayer = function (options) {
        var defaultValues =
        {
            x: "0",
            y: "9",
            username: "",
            head: 0,
            chest: 0,
            legs: 0,
            health: 0,
            maxHealth: 0,
            lives: 0,
            maxLives: 0,
            weaponClass: 0,
            weaponHurt: 0,
            weaponRate: 0
        }
        $.extend(this, defaultValues, options);
    };

    followMe.multiplayer.on("showPlayers", function (x, y, userModel, xpDefinition, caveName, weaponDefined, stealth, helpString) {
        if ($("#isGame").val() === "yes" && (userModel.username !== followMe.players[1].username && userModel !== undefined && followMe.players[1].online && followMe.helpRequest === helpString)) {//No need to render player to the player that just moved again.
            $.getJSON("/playerCommunity/checkFriendStatus",
                {
                    me: localStorage.getItem("username"),
                    them: userModel.username
                }, function (data) {
                    if (followMe.players[1].username !== userModel.username) {
                        followMe.otherPlayFriend = data;
                    }
                    else {
                        followMe.otherPlayFriend = true;
                    }
                });

            $("onlineWeapon" + userModel.username).remove();
            var highestOtherPlayer = followMe.otherPlayers.length + 1;
            var numberToUse = highestOtherPlayer;
            var newUser = true;
            if (followMe.helpRequest !== null) {
                if (followMe.players[1].username !== followMe.helpUsername) {
                    followMe.otherPlayername = followMe.helpUsername
                }
                else {
                    followMe.otherPlayername = followMe.helpRequest.substring(followMe.helpUsername.length + 1);
                }
                $.getJSON("/playerCommunity/getMessages",
                    {
                        forUser: followMe.players[1].username,
                        to: followMe.otherPlayername
                    }, function (data) {
                        $("#game #otherPlayerChat p").remove();
                        $.each(data, function (item, data) {

                            followMe.updateMessageForPlayer(data.from, data.message, data.from)
                        })
                    });


                //$("#game #otherPlayerChat").hide();
            }
            if (localStorage.getItem("currentCaveName") !== caveName || stealth) {//Shouldn't show movement if they are in a different cave [including if outside when you're in a cave]
                $("#" + userModel.username + "name").remove();
                $("#player" + userModel.username).remove();
                $("onlineWeapon" + userModel.username).remove();
            }
            if ((followMe.players[1].socialOnly === followMe.otherPlayFriend ||
                followMe.players[1].socialOnly === userModel.socialOnly) &&
                (followMe.players[1].rankOnline &&
                    userModel.rank === followMe.players[1].rank &&
                    followMe.players[1].rankOnline &&
                    followMe.helpRequest === null ||
                    followMe.players[1].rankOnline === false &&
                    userModel.rankOnline == false &&
                    followMe.helpRequest === null ||
                    followMe.helpRequest !== null)) {

                for (var i = 1; i < followMe.otherPlayers.length; i++) {
                    otherPlayerObject = followMe.otherPlayers[i];
                    if (otherPlayerObject !== undefined && otherPlayerObject.username === userModel.username) {
                        newUser = false
                        otherPlayerObject.x = x,
                            otherPlayerObject.y = y;
                        otherPlayerObject.health = userModel.health;
                        otherPlayerObject.maxHealth = userModel.maxHealth;
                        otherPlayerObject.lives = userModel.lives;
                        otherPlayerObject.maxLives = xpDefinition.numberOfLives;
                        otherPlayerObject.weaponClass = userModel.weaponID,
                            otherPlayerObject.personType = userModel.personType,
                            otherPlayerObject.weaponHarmMultiplier = xpDefinition.weaponHarmMultiplier;
                        otherPlayerObject.xp = userModel.XP;
                        numberToUse = i;
                        if (userModel.personType !== 1 && weaponDefined !== null) {
                            otherPlayerObject.weaponHurt = weaponDefined.hurt;
                            otherPlayerObject.weaponRate = weaponDefined.rate;
                        }
                        followMe.numberToUse = numberToUse
                    }
                }

                if (newUser) {
                    $("#onlineWeapon" + userModel.username).remove();

                    $("<aside id='onlineWeapon" + userModel.username + "'></aside>").appendTo($("#game"))
                    followMe.otherPlayers[highestOtherPlayer] = new followMe.otherPlayer({
                        x: x,
                        y: y,
                        username: userModel.username,
                        head: userModel.head,
                        chest: userModel.chest,
                        legs: userModel.legs,
                        lives: userModel.lives,
                        maxLives: xpDefinition.numberOfLives,
                        weaponClass: userModel.weaponClass,
                        personType: userModel.personType,
                        weaponHarmMultiplier: xpDefinition.weaponHarmMultiplier,
                        weaponRight: true,
                        friendlyFire: userModel.friendlyFire,
                        xp: userModel.XP
                    });
                    followMe.numberToUse = numberToUse
                }
                //if (followMe.otherPlayers[highestOtherPlayer] != undefined) {
                followMe.setPlayerDesign(false, followMe.otherPlayers[numberToUse])
                followMe.memServer.server.getWeapon(userModel.username, true, false);
                //}
            }
        }
    })

    followMe.multiplayer.on("sharedXP", function (username, helpRequest, newXP, xpReward, message) {
        if (followMe.helpRequest === helpRequest && followMe.helpRequest !== null) {
            //helpRequest should not be null, no need to loop through other players
            if (followMe.players[1].username == username) {
                followMe.players[1].XP = newXP;
                followMe.showXPMessage("player", message);
            }
            else {
                followMe.otherPlayers[1].xp = newXP;
            }
        }
    })

    followMe.multiplayer.on("onlineShotFired", function (shotID, down, moveEachTime, mouseX, mouseY, behind, weaponClass, username, caveName, shotObj) {
        var localPlayer = followMe.players[1]
        if (localPlayer.username !== username && localStorage.getItem("currentCaveName") == caveName) {

            shotID = followMe.shots.length + 1

            var identifier = "onlineWeapon" + username;
            var right = $("#" + identifier).css("left")
            var width = $("#" + identifier).css("width");
            var toptop = $("#" + identifier).css("top");
            toptop = toptop.substring(0, toptop.length - 2)
            //to get the right shot back

            var begin = 463;
            var beforeStart = 3;
            var length = 5;
            var height = 9;
            var downdown = 14;

            switch (weaponClass) {
                case "2":
                    begin = 463;
                    beforeStart = 4;
                    length = 11;
                    height = 12;
                    downdown = 12;
                    break;
                case "3":
                    begin = 461;
                    beforeStart = 16;
                    length = 5;
                    height = 10;
                    downdown = 11;
                    break;
            }

            width = width.substring(0, width.length - 2)
            right = right.substring(0, right.length - 2)
            right = parseFloat(right) + parseFloat(width)

            //shotID += "online";
            beforeStart = -306 - beforeStart
            $("<aside></aside>")
                .css("left", right)
                .css("top", parseFloat(toptop) + parseFloat(down) + "px")
                .css("backgroundImage", "url('/images/spriteSheet.png')")
                .css("width", length)
                .css("height", height)
                .css("backgroundPosition", beforeStart + "px " + (497 - parseFloat(begin)) + "px")
                .css("display", "block")
                .css("position", "absolute")
                .css("zIndex", "100")
                .css("marginLeft", "0px!important")
                .attr("id", "shotOnline" + shotID).appendTo($("#game"))

            followMe.shotSound(weaponClass)
            var otherPlayerID = 0;
            var playerDefinition = "";
            var op = followMe.otherPlayers.length;
            for (var i = 1; i < op; i++) {
                otherPlayerObject = followMe.otherPlayers[i];
                if (otherPlayerObject != undefined && otherPlayerObject.username == username) {
                    otherPlayerID = i
                    playerDefinition = followMe.otherPlayers[otherPlayerID]
                }
            }

            followMe.shots[shotID] = new followMe.shot({
                identifier: "shotOnline" + shotObj.identifier,
                y: shotObj.y,
                x: shotObj.x,
                hurt: shotObj.hurt,
                behind: shotObj.behind,
                friendlyFire: shotObj.friendlyFire
            })



            var object = $("#" + identifier).attr("class");

            if (playerDefinition != "") {
                if (behind) {
                    if (playerDefinition.weaponRight !== true) {
                        followMe.changeImageDesign("weapon", identifier, false, true, true)
                        playerDefinition.weaponRight = true
                    }
                }
                else {
                    if (playerDefinition.weaponRight == undefined) {
                        followMe.changeImageDesign("weapon", identifier, false, false, true)
                    }
                    playerDefinition.weaponRight = false;
                }


                var abilityEnhancment = 1;
                if (playerDefinition.personType == "1") {
                    abilityEnhancment = 1.5
                }
                if (playerDefinition.personType == "2") {
                    abilityEnhancment = 0.75
                }

                //alert(hurt);
                //objectIdentifier.hurt = hurt;

                //alert(shotID)
                setInterval(function () {
                    followMe.moveTheShot(shotID, down, moveEachTime, mouseX, mouseY, behind, true, followMe.shots[shotID])
                }, 50)

            }
        }
    })
    followMe.multiplayer.on("showLocalStatsFromShot", function (username, health, lives, died) {
        //alert("local reStat - 1")
        var personObj = followMe.players[1];
        if (personObj.username == username)//As this is local respawn
        {
            personObj.health = health;
            personObj.lives = lives;
            //alert("local reStat - 2")
            if (lives == personObj.numberOfLives) {
                alert("Game over")
            }
            if (died) {
                followMe.resetPlayer(-1);//Don't take off the life
                followMe.showOtherPlayer(localStorage.getItem("startX"), localStorage.getItem("startY"), username)
            }
            followMe.showPlayerStats(personObj)
        }
    })
})