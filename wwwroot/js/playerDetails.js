$(document).ready(function () {
    var url = document.URL.valueOf();
    $("#furtherDetails #sounds div.ui-checkbox input").off().on("click", function () {
        var idToSet = this.id

        if (idToSet === "setIsOnline") {
            if ($("#onlineDetails").attr("class") === "inline") {
                $("#onlineDetails").attr("class", "");
            }
            else {
                $("#onlineDetails").attr("class", "inline");
            }
        }

        idToSet = idToSet.substring(3);
        followMe.setOptionValue(idToSet, $("#" + this.id).prop("checked"));
    })

    followMe.setOptionValue = function (setValueHere, checked) {
        var fullID = setValueHere + "Get"
        //alert($("#"+fullID).length + fullID)
        $("#" + setValueHere + "Get").prop("checked", checked).val(checked);

    }

    if ($("#isCommunity").val() !== "" && followMe.url.search("/community") !== -1) {
        var competitionLevels = "";
        $.getJSON("/playerCommunity/getMyLevels", {
            username: localStorage.getItem("username"),
            onlyDone: true
        }, function (data) {
            $.each(data, function (item, data) {
                {
                    if (item === 0) {
                        competitionLevels = "<option value='0'>" + data + "</option>";
                    }
                    else {
                        competitionLevels += "<option value='" + data + "'>" + data + "</option>";
                    }
                }
                $("#comp_levelName").html(competitionLevels);
            })
        });
    };

    $("#setuseremail").off().on('change keypress paste textInput input click', function () {
        $("#useremail").val($("#" + this.id).val());
    })

    $("#helping").hide();
    followMe.showPlayerStats = function (object, primary)//, id)--multiplayer support
    {
        var identifierToUpdate = "Player"
        if (primary === false) {
            identifierToUpdate = object.username
        }
        if ((object.maxHealth !== undefined && object.health !== undefined && object.lives !== undefined && object.maxHealth >= object.health) || primary === false) {
            $("#health" + identifierToUpdate).attr("max", object.maxHealth)
            $("#health" + identifierToUpdate).val(object.health)
            $("#lives" + identifierToUpdate).attr("max", object.maxLives)
            $("#lives" + identifierToUpdate).val(object.lives)
        }
    }
    followMe.xpStat = function (options) {
        var defaultValues =
        {
            action: "",
            xpPoints: 0,
            special: false,
            message: "Complete: ",
            numberToDo: 0,
            oncePerLevel: false,
            type: "collection",
            specialID: -1
        }
        $.extend(this, defaultValues, options);
    };
    followMe.xpStats = [];

    followMe.memServer.start().then(function () {

        var lengthSlash = ((url.match(/\//g) || []).length);

        if (url.search("Welcome") === -1 && lengthSlash > 3) {
            followMe.memServer.invoke("getUserStats", true, localStorage.getItem("username"), $("#welcome").text());
        }

        followMe.memServer.invoke("getWeapons", localStorage.getItem("username"));
        if ($("#isGame").val() != "no") {
            followMe.memServer.invoke("getWeapon", localStorage.getItem("username"), false, false);
        }

        followMe.userServicesDefined.on("userMethods", function (existingName, newName, method, username) {
            if (username == localStorage.getItem("username")) {
                if (method != "insert") {
                    $("p#" + existingName).remove();
                    $("#namelist option:[value='" + existingName + "']").remove();
                }
                if (method != "delete") {
                    var newitem = "<p id=" + newName + "></p>"
                    $("#mDB").append(newitem, newName + " : plumber")
                    var newlistitem = "<option>" + newName + "</option>"
                    $("#namelist").append(newlistitem)
                }
                if (method == "delete") {
                    $("#responseMessage").text(newName + " has been deleted!");
                }
                if (method == "insert") {
                    $("#responseMessage").text(newName + " has been added!");
                }
                if (method == "Unknown") {
                    $("#responseMessage").text("Unknown error: please check your data");
                }
            }
        })
    })

    followMe.userServicesDefined.start().then(function () {
        $("#namesubmit").click(function () {
            followMe.userServicesDefined.server.manipulateName($("#namelist").val(), $("#newname").val(), "update", localStorage.getItem("username"))
        })
        $("#delete").click(function () {
            followMe.userServicesDefined.server.manipulateName($("#namelist").val(), "", "delete", localStorage.getItem("username"))
        })
        $("#insert").click(function () {
            followMe.userServicesDefined.server.manipulateName($("#newname").val(), "", "insert", localStorage.getItem("username"))
        })
    })

    followMe.specialAchieve = function (options) {
        var defaultValues =
        {
            message: "",
            type: ""
        }
        $.extend(this, defaultValues, options);
    };
    followMe.specialAchieveArray = [];

    followMe.userServicesDefined.on("getXPAllocationArray", function (username, allocationArray) {
        if (username == localStorage.getItem("username")) {
            //alert(allocationArray)
            for (var i = 0; i < allocationArray.length; i++) {
                followMe.xpStats[i] = new followMe.xpStat({
                    action: allocationArray[i].action,
                    xpPoints: allocationArray[i].xpPoints,
                    special: allocationArray[i].special,
                    message: allocationArray[i].message,
                    numberToDo: allocationArray[i].numberToDo,
                    oncePerLevel: allocationArray[i].oncePerLevel,
                    type: allocationArray[i].type,
                    specialID: allocationArray[i].specialID
                });

                if (allocationArray[i].special == true) {
                    followMe.specialAchieveArray[allocationArray[i].specialID] =
                        new followMe.specialAchieve({
                            message: allocationArray[i].message,
                            type: allocationArray[i].type
                        })
                }
            }

        }
        followMe.checkUserAchievements();
    })


    followMe.updateXPFromAction = function (type) {

        var shareUsername = followMe.helpUsername;
        var useExternal = false;
        var xpToUpdate = followMe.players[1].XP
        var message = "";
        for (var i = 0; i < followMe.xpStats.length; i++) {
            statsArray = followMe.xpStats[i]
            if (statsArray.type == type && statsArray.type != "done") {

                statsArray.xpPoints *= ((followMe.players[1].difficulty + 1) / 2)
                if (followMe.helpRequest != null && followMe.players[1].shareXPInHelp) {
                    useExternal = true;
                    statsArray.xpPoints *= .5
                    if (shareUsername == followMe.players[1].username) {
                        shareUsername = followMe.helpRequest.substring(followMe.players[1].username.length + 1);
                    }
                }
                statsArray.numberToDo -= 1;
                if (statsArray.numberToDo <= 0) {
                    message += "<p>" + statsArray.xpPoints + "<p>";
                    xpToUpdate += parseFloat(statsArray.xpPoints);
                    //alert(xpToUpdate)                   
                    followMe.userServicesDefined.invoke("updateXPLogForUser",localStorage.getItem("username"), statsArray.action, statsArray.type, $("#welcome").text())
                    if (statsArray.oncePerLevel == true || statsArray.special == true) {
                        statsArray.type = "done";
                        if (statsArray.type == "kill" || statsArray.type == "level") {//Extend to other XP actions
                            followMe.userServicesDefined.invoke("updateXPorLevel",localStorage.getItem("username"), parseFloat(followMe.players[1].XP + statsArray.xpPoints))
                            followMe.userServicesDefined.invoke("updateXPLogForUser",localStorage.getItem("username"), "one", statsArray.type, $("#welcome").text())

                            if (useExternal) {
                                followMe.userServicesDefined.invoke("updateXPorLevel",shareUsername, parseFloat(followMe.players[1].XP + statsArray.xpPoints))
                                followMe.userServicesDefined.invoke("updateXPLogForUser",shareUsername, "one", statsArray.type, $("#welcome").text())
                            }
                        }
                        message += statsArray.message
                    }
                    followMe.showXPMessage("player", message);

                    if (followMe.helpRequest != null) {
                        $.connection.hub.start("~/signalr").done(function () {
                            followMe.multiplayer.invoke("shareXP",shareUsername, followMe.helpRequest, xpToUpdate, message);//This is just for displaying to other user, see if(useExternal) for actual XP processing
                        });
                    }

                }
            }
        };
        followMe.players[1].XP = xpToUpdate
        followMe.userServicesDefined.invoke("updateXPorLevel",localStorage.getItem("username"), parseFloat(xpToUpdate))

    }


    followMe.showXPMessage = function (id, message) {
        var playerForStyleTop = $("#" + id).css("top");
        var playerForStyleLeft = $("#" + id).css("left");
        playerForStyleTop = parseFloat(playerForStyleTop.substring(0, playerForStyleTop.indexOf("px"))) - 32 + "px";
        playerForStyleLeft = parseFloat(playerForStyleLeft.substring(0, playerForStyleLeft.indexOf("px"))) + 96 + "px";
        $("#playerXPMessage").show().html(message).css("position", "absolute")
            .css("top", playerForStyleTop).css("left", playerForStyleLeft)
            .delay(2500).hide("slow")
        //if(id != "player")
        //{
        //    alert(playerForStyleLeft + ", " + playerForStyleTop + " : message = "+ message);
        //}
    }

    followMe.userServicesDefined.on("playerNewXPAndRank", function (username, xp, rank, max, stats) {
        if (localStorage.getItem("username") == username) {

            var updateThis = followMe.players[1];

            $("#xpPlayer").val(xp).attr("max", max)
            if (followMe.players[1].rank != rank) {
                alert("Rank Up! You are now rank: " + rank + ". You will be stronger than ever.")
                updateThis.rank = rank

                updateThis.XP = xp;
                updateThis.maxHealth = stats.health
                updateThis.health = stats.health;
                updateThis.lives = stats.numberOfLives;
                updateThis.maxLives = stats.numberOfLives;
                updateThis.pace = stats.pace
                updateThis.weaponHarmMultiplier = parseFloat(stats.weaponHarmMultiplier)
                updateThis.jumpHeightMultiplier = parseFloat(stats.jumpHeightMultiplier)


                switch (followMe.players[1].personType) {
                    case "1":
                        updateThis.maxHealth *= 2;
                        updateThis.health *= 2;
                        updateThis.weaponHarmMultiplier *= 1.5;
                        break;
                    case "2":
                        updateThis.maxHealth *= 0.75;
                        updateThis.health *= 0.75;
                        updateThis.weaponHarmMultiplier *= 0.75;
                        break;
                    default:
                        followMe.showPlayerStats(stats);
                        break;
                }
            }
        }
    })
})