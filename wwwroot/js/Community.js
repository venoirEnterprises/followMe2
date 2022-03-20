$(function () {

    followMe.levelXPStats = []
    followMe.levelXPStatDefinition = function (options) {
        var defaultValues =
            {
                objectType: "",
                objectIdentifier: ""
            }
        $.extend(this, defaultValues, options);
    };

    if ($("#isGame").val() == "yes") {
        $.connection.hub.start("~/signalr").done(function () {
            $("button, a").off().on("click", function () {
                followMe.communityServices.server.deleteOnlinePresence(followMe.players[1].username, followMe.helpRequest);
            })
        });
    }

    followMe.recordPlayTime = function () {
        setInterval(function () {
            followMe.players[1].playTime += 0.5
            //alert(followMe.players[1].playTime)
        }, 1000)
    }

    followMe.communityServices.on("addLevelProgressObject ", function (progressObject) {
        //alert(progressObject.length)
        //for (var i = 0; i < progressObject.length; i++) {
        if (progressObject != undefined) {
            var i = followMe.levelXPStats.length + 1;
            followMe.levelXPStats[i] = new followMe.levelXPStatDefinition({
                objectType: progressObject.objectType,
                objectIdentifier: progressObject.objectIdentifier
            })
        }
    })

    followMe.communityServices.on("DisplayFullProgress"), function (rankName, fullname,
        levelBonus, levelCaves, levelAllies, levelCheckpoint,
        playerBonus, playerCaves, playerAllies, playerCheckpoint, worldName, totalProgressInWorld, username, whyLocked) {

        if (username == followMe.players[1].username) {
            if ($("table#" + worldName).length < 1) {

                $("#playerProgress").append('<button class="linkBorder" onclick="followMe.toggleTable(this.id)" class="linkBorder inline" id="' + worldName + '_toggle">+-</button><p class="inline">' + worldName + ' : <b id="' + worldName + '_total"></b> [average rank]</p><table border="0" width="100%" id="' + worldName + '"><tr><th>Global rank</th><th>World</th><th>Level</th><th>Allies</th><th>Bonuses</th><th>Checkpoints</th><th>Caves</th></tr></table><p class="middle" id="' + worldName + "_locked" + '"<hr/>');
            }

            if (totalProgressInWorld != "0th" && followMe.worldAlready != worldName) {
                $("#" + worldName + "_total").text(totalProgressInWorld)
                if (whyLocked != "") {
                    $("#" + worldName + "_locked").text(whyLocked);
                }
                followMe.worldAlready = worldName
            }
            $("tr#" + fullname).remove();
            $("table#" + worldName).append($("<tr id='" + fullname + "'>" +
                "<td class ='textRight'>" + rankName +
                //parseInt(parseInt(playerBonus + playerCaves + playerCheckpoint + playerAllies) / parseInt(levelBonus + levelCaves + levelCheckpoint + levelAllies) * 100) +

                "</td><td class ='textRight'>" + worldName +
                "</td><td class ='textRight'>" + fullname +
                "</td><td class ='textRight'>" + playerAllies + "/" + levelAllies +
                "</td><td class ='textRight'>" + playerBonus + "/" + levelBonus +
                "</td><td class ='textRight'>" + playerCheckpoint + "/" + levelCheckpoint +
                "</td><td class ='textRight'>" + playerCaves + "/" + levelCaves + "</td></tr>"))
            //alert(playerBonus)
        }
    }

    //Login To Venoir
    followMe.debug = 0;

    $("#registerHeadline").off("click").on("click", function () {

        var regPassword = $("#firstPassword").val();
        var emailDeclared = $("#email").val()
        var usernameDeclared = $("#username").val();
        if (usernameDeclared == "") {
            usernameDeclared = emailDeclared
        }

        followMe.debug += 1;
        $("#venoirError").text("");
        if (regPassword != "" && emailDeclared != "") {
            $.getJSON("http://headline.azurewebsites.net/jsonaccount/addUserFromOtherVenoir",
                {
                    password: regPassword,
                    username: usernameDeclared,
                    email: emailDeclared

                }, function (data) {
                    $("#registerHeadlineStatus").html(data)
                });
        }
        else {
            $("#venoirError").text("Please check your details, the email is required")
        }
    });

    $("#registerSelfImprove").off("click").on("click", function () {
        var regPassword = $("#firstPassword").val();
        var emailDeclared = $("#email").val()
        var usernameDeclared = $("#username").val()
        if (usernameDeclared == "") {
            usernameDeclared = emailDeclared
        }
        followMe.debug += 1;

        $("#venoirError").text("");
        if (regPassword != "" && emailDeclared != "") {
            $.getJSON("http://selfimprove.azurewebsites.net/accountjson/RegisterIncludingExternal",
                {
                    personType: "Student",//$("#personTypeSelect").val(),
                    highlightColor: "lightRed",
                    backgroundColor: "lightBlue",
                    email: emailDeclared,
                    securityQuestionID: 1,
                    password: regPassword,
                    username: usernameDeclared,
                    securityanswer: regPassword
                }, function (data) {
                    $("#registerSelfImprove").parent().append(data)
                });
        }
        else { $("#venoirError").text("Please check your details, the email is required for other accounts") }
    });

    //VENOIR end

    followMe.hasXPActionHappened = function (objectType, identifier, toFind) {
        var checkAction = true;
        for (var i = 1; i <= followMe.levelXPStats.length; i++) {
            if (followMe.levelXPStats[i] != undefined) {
                if (followMe.levelXPStats[i].objectType == objectType && followMe.levelXPStats[i].objectIdentifier == identifier.toString()) {
                    checkAction = false;
                }
            }
        }
        if (checkAction) {

            followMe.levelXPStats[followMe.levelXPStats.length + 1] = new followMe.levelXPStatDefinition({
                objectType: objectType,
                objectIdentifier: identifier
            })

            followMe.updateXPFromAction(toFind);
        }
    }
    $("#helpMe").attr("class", "inline linkBorder")
    $("#levelNameForHelp-button").parent().attr("class", "inline linkBorder")
    $("#levelNameForHelp-button").attr("id", "").attr("class", "inline")
    $("#levelNameForHelp-button").attr("id", "").attr("class", "inline")
    $("#backGameComm").off().on("click", function () {
        $.getJSON("/Connect/getRedirection",
                {
                    username: followMe.players[1].username
                }, function (data) {
                    window.location.assign("/" + data.worldName + "/" + data.fullName)
                });
    });

    //Notifications

    $("#levelNameForHelp").off().on("change", function () {
        $("#otherPlayerDetails span").remove();
    })

    $("#helpMe").off("click").on("click", function () {
        if ($("#levelNameForHelp").val() == 0) {
            $("#helpMessage").text("Please select a valid level")
        }
        else {
            followMe.communityServices.server.addNotificationToPlayer(followMe.otherPlayername, followMe.players[1].username, "help", $("#levelNameForHelp").val())
            $("option[value='" + $("#levelNameForHelp").val() + "']").remove()
            $("#helpMessage").text("Request sent")
        };
    });

    $("#add").off("click").on("click", function () {
        var actionForOtherPlayer = "add"//Most likely and ignored if already sent

        switch (followMe.friendStatus) {
            case 0:
                actionForOtherPlayer = "add"
                followMe.friendStatus = 1;
                break;
            case 1:
                actionForOtherPlayer = "add"
                break;
            case 2:
                actionForOtherPlayer = "remove";
                break;
        }

        followMe.communityServices.server.addNotificationToPlayer(followMe.otherPlayername, followMe.players[1].username, actionForOtherPlayer, "")
        followMe.editAddFriendButton(followMe.friendStatus)
    })


    $("#commNotificationAlert")
        .css("backgroundImage", "url('/images/spriteSheet.png')")
        .css("width", "64px").css("height", "32px")



    followMe.communityServices.on("showNotificationCount", function (howMany, forWho, type, information) {
        followMe.showNotificationCount(howMany, forWho, type, information);
    })

    followMe.showNotificationCount = function (howMany, forWho, type, information) {
        //alert(type + ", " + information)
        if (followMe.helpRequest == null) {
            if (followMe.players[1].username == forWho) {
                var designNotification = 0;
                var clickAction = "";
                var title = "You have some new notifications, go to the community to find out more";
                if (howMany > 0) {
                    designNotification = 160;

                    switch (type) {

                        case "add":
                            title = "New friend request"
                            break;
                        case "newMessage":
                            title = "New message"
                            break;
                        case "help":
                            title = "New help request"
                            break;
                        case "helpAgreed":
                            title = "Help has been agreed"
                            break;
                        case "helpAttending":
                            title = information
                            break;
                        case "helpConfirmation":
                            title = information
                            break;
                        case "newChallenge":
                            title = information;
                            break;
                    }
                }
                else {
                    designNotification = 192;
                }

                if (type != undefined && howMany > 0 && followMe.url && followMe.url.search("/community/players") == -1) {
                    if (localStorage.getItem("effectsMute") != "true") {
                        destroySoundDuplication(new Audio("../Sounds/Effects/notification.wav"), "notification", true, false, false)
                    }
                }

                $("#commNotificationAlert").css("backgroundPosition", "-512px " + designNotification + "px").attr("title", title).off("click").on("click", function () {
                    switch (type) {
                        case "helpAttending":
                            followMe.redirectFromNotification(information.substring(information.indexOf('in') + 4, information.indexOf(', click') - 1),
                            information.substring(information.indexOf('help') + 6, information.indexOf('in') - 2), "EndingTheBeginning", false)
                            break;
                        case "helpConfirmation":
                            followMe.redirectFromNotification(information.substring(information.indexOf('in') + 3, information.indexOf(', click')),
                            information.substring(0, information.indexOf(" said")), "EndingTheBeginning", true)
                            followMe.testString = information;
                            break;
                        case "newChallenge":
                            alert("redirect to level + ?Challenge=mode, just as the notification should in game")
                            break;
                    }
                }
            )
            };
        }
    }

    followMe.redirectFromNotification = function (level, fromWho, world, fromHelper) {
        if (fromHelper) {
            window.location = "/" + world + "/" + level + "?toHelp=:" + followMe.players[1].username + ":" + fromWho;

        }
        else {
            window.location = "/" + world + "/" + level + "?toHelp=:" + fromWho + ":" + followMe.players[1].username;
        }
    }

    ////CHAT

    $("#submitChatMessage").off().on("click", function () {
        followMe.communityServices.server.sendMessageToUser(followMe.players[1].username, $("#sendChatMessage").val(), followMe.otherPlayername);
        followMe.updateMessageForPlayer(false, $("#sendChatMessage").val(), "you")
    });

    followMe.communityServices.on("showOtherPlayerMessage", function (to, from, message) {
        if (to == followMe.players[1].username && from == followMe.otherPlayername) {

            followMe.updateMessageForPlayer(true, message, from)
        }
    })
    //Clients.All.showOtherPlayerMessage(to, from, additionalDetail);



    followMe.updateMessageForPlayer = function (fromOther, userMessage, username) {
        var userMessageClass = "textRight"
        if (fromOther == false || fromOther == "you") {
            userMessageClass = "evenAngular";
        }
        if ($("#otherPlayerChat p").length > 9) {
            $("#otherPlayerChat p").first().remove();
        }
        $("#chatMessages").append(
          "<p class='" + userMessageClass + "' id='" + fromOther + "'><b>" + username + " : </b>" + userMessage + "</p>"

          );

        $("#sendChatMessage").val("")
    }

    followMe.communityServices.on("givePartnerCheckpoint", function (username, helpRequest, checkpoint) {

        if (username == followMe.players[1].username && followMe.helpRequest == helpRequest) {
            localStorage.setItem("startX", $("#checkpoint" + checkpoint).css("left"))
            localStorage.setItem("startY", $("#checkpoint" + checkpoint).css("top"))

            if (checkpoint != localStorage.getItem("checkpoint")) {
                followMe.changeImageDesign("newCheckpoint", localStorage.getItem("checkpoint"), false, false, false)
                followMe.changeImageDesign("newCheckpoint", checkpoint, false, true, false)
            }
            if (checkpoint == -1) {
                if (confirm("You did it, thanks to your friend. You should thank them. Back to your current level now?")) {
                    $.getJSON("/Connect/getRedirection",
                {
                    username: followMe.players[1].username
                }, function (data) {
                    window.location.assign("/" + data.worldName + "/" + data.fullName)
                });
                }
            }


            localStorage.setItem("checkpoint", checkpoint)
        }
    })
    followMe.communityServices.on("hurtPartnerEnemy", function (username, helpRequest, hurtExternal, enemyID) {

        if (username == followMe.players[1].username && followMe.helpRequest == helpRequest && followMe.helpRequest != null) {
            //alert(hurtExternal + ", " + enemyID + ", " + username)
            followMe.hurtEnemy(enemyID, "", false, hurtExternal)
        }
    })

    followMe.communityServices.on("thisPlayerPresenceRemoved", function (username, helpRequest) {
        if (followMe.helpRequest == helpRequest) {
            $("#player" + username).remove();
            $("#" + username + "name").remove();
            $("#onlineWeapon" + username).remove();
        }
    })
});