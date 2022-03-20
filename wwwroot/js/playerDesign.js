$(function () {

    $(".ui-select span").text("");
    $("select").on("click change blur focus", function () {
        $(".ui-select span").text("");
    });
    $("a").attr("class", "link")
    $("input").attr("class", "link")
    $("button").attr("class", "link")
    if ($("#isGame").val() === "no") {
        $("#player").hide();
    }
    //$("#player").hide()
    followMe.players = [];
    $("#comp_recurringType").hide();
    $("#comp_recurring").off().on("click", function () {
        $("#comp_recurringType").toggle();
    });
    $("#skipVideo").remove();

    $("iFrame.main").css("zIndex", 500).css("height", "80%").css("width", "100%")
    if ($("iFrame#whatHappened").length > 0) {
        $("iFrame").parent().append("<a id='skipVideo'>Close</a>")
        destroySoundDuplication(new Audio("../Sounds/gameTheme.mp3"), "whatHappened", true, false, false)
        $("iFrame").parent().css("width", "100%").css("height", "100%").css("zIndex", 500).css("backgroundColor", "white").css("position", "absolute");
    }
    else {
        $("iFrame").css("width", "30%").css("height", "30%")
    }


    followMe.maxNum = -287
    followMe.userDesign1 = "px " + followMe.maxNum + "px"
    followMe.userDesign2 = "px " + parseFloat(followMe.maxNum - 26) + "px"
    followMe.userDesign3 = "px " + parseFloat(followMe.maxNum - 63) + "px"

    $("#skipVideo").off().on("click", function () {
        $("iFrame").parent().remove();
    })


    //Options
    $("#achievements").show();
    $("#achievementsButton").hide();
    $("#playerProgress").hide();
    $("#playerProgressButton").show();
    $("#keyboard").hide();
    $("#keybaordButton").show();
    $("#videos").hide();
    $("#videosButton").show();
    $("#sounds").hide();
    $("#soundsButton").show();
    $("#competeForm").hide();
    $("#newCompete").off().on("click", function () {
        $("#competeForm").toggle("slow");
    })

    $("#otherDetails button").off().on("click", function () {
        var identifier = this.id;
        identifier = identifier.substring(0, identifier.indexOf("Button"))
        $("#otherDetails aside").hide();
        $("#otherDetails button").show();
        $("#" + identifier + "Button").hide();
        $("aside#" + identifier).show();
        if (identifier === "sounds") {
            followMe.hideCommunity();
        }
    });

    //Options end

    followMe.memServer.on("displaydesign", function (isPrimary, head, chest, legs, object, username, xpStats, maxXP, countNotifications) {

        if (username === localStorage.getItem("username")) {
            //Hit every level, let's build the user here!
            var identifier = 1;
            if (isPrimary === false) {
                identifier = 2;
            }
            followMe.players[identifier] = new followMe.player({
                head: object.head,
                chest: object.chest,
                legs: object.legs,
                username: object.username,
                health: object.health,//remaining
                maxHealth: object.maxHealth,
                lives: object.lives,
                //keyboard
                up: object.up,
                left: object.left,
                right: object.right,
                surrender: object.surrender,
                enter: object.enter,
                special: object.special,
                build: object.build,
                rank: object.rank,
                pace: xpStats.pace,
                weaponHarmMultiplier: xpStats.weaponHarmMultiplier,
                jumpHeightMultiplier: xpStats.jumpHeightMultiplier,
                XP: object.XP,
                maxLives: xpStats.numberOfLives,
                caveName: "",
                personType: object.personType,
                //ABILITIES
                usedStealth: 0,
                playTime: object.levelPlayTime,
                //COMMUNITY
                venoir: object.isVenoir,
                online: object.online,
                hasSurvived: 1,
                difficulty: object.difficulty,
                //SOCIAL
                friendlyFire: object.friendlyFire,
                socialOnly: object.socialOnly,
                rankOnline: object.rankOnline,
                shareXPInHelp: object.shareXPInHelp,
                currentSurfaceID: 0
            });


            if (object.isVenoir) {
                $(".commPlayer").show();
                $("#comp_createdBy").val(object.username);
            }
            else {
                $(".commPlayer").hide();
                //URL redirection
                if (followMe.url.search("/community/") !== -1) {
                    window.location.assign("/Connect/LevelSelect")
                }
                //URL end
            }

            switch (followMe.players[identifier].personType) {
                case "3":
                    $("#weaponFull").hide()
                    $("#weaponID").val(0)
                    break;
                case "1":
                    followMe.dangerMode();
                    break;
            }

            //and show it off.
            $("#xpPlayer").val(object.XP).attr("max", maxXP);
            followMe.showPlayerStats(object, true)
            if (followMe.players[1].personType !== 1) {
                $("#specialAbilityProgram").show()
            }

            var health = object.health
            var idupdate = "player"

            followMe.setPlayerDesign(true, object)



            $("#" + idupdate).attr("alt", health)
            localStorage.setItem("player1health", health)
            var userhealth = "#" + idupdate + "1health"
            $(userhealth).parent().show()
            $(userhealth).parent().append("<b id='" + idupdate + "healthdisplay'>" + health + "</b>" + "/" + object.health + "<br/>" + "Lives: " +
                "<b id='lives'>" + object.lives + "</b>")
            $("#personTypeSelected").val(object.personType);
            followMe.recordPlayTime();

            if (followMe.url.search("/connect/options") !== -1) {
                followMe.communityServices.server.overalProgress(followMe.players[1].username)
            }
            followMe.communityServices.server.levelUniqueProgress(followMe.players[1].username, $("#welcome").text())

            followMe.showNotificationCount(countNotifications, username);//Need to get most recent types
        }
    })



    followMe.hideCommunity = function () {
        var isUserOnline = $("#setIsOnline").prop("checked")
        if (isUserOnline === false) {
            $("#onlineDetails").attr("class", "");
        }
        else {
            $("#onlineDetails").attr("class", "inline");
        }
    }

    followMe.setPlayerDesign = function (main, object, community) {
        if (object !== undefined) {
            if (main) {
                //should be simplified
                $("#setIsOnline").prop("checked", object.online);
                $("#IsOnlineGet").prop("checked", object.online).val(object.online);
                $("#setIsVenoir").prop("checked", object.isVenoir);
                $("#IsVenoirGet").prop("checked", object.isVenoir).val(object.isVenoir);
                $("#setIsFriendlyFire").prop("checked", object.friendlyFire);
                $("#IsFriendlyFireGet").prop("checked", object.friendlyFire).val(object.friendlyFire);
                $("#setsocialOnly").prop("checked", object.socialOnly);
                $("#IssocialOnlyGet").prop("checked", object.socialOnly).val(object.socialOnly);
                $("#setIsShareXPInHelp").prop("checked", object.shareXPInHelp);
                $("#IsShareXpInHelpGet").prop("checked", object.shareXPInHelp).val(object.shareXPInHelp);
                $("#setIsRankOnline").prop("checked", object.rankOnline);
                $("#IsRankOnlineGet").prop("checked", object.rankOnline).val(object.rankOnline);
                $("#useremail").val(object.email)
                $("#setuseremail").val(object.email)
                $("#difficulty").val(object.difficulty);
                $("#difficultySet").val(object.difficulty);//
                $("#headDisplay").val(object.head)
                $("#chestDisplay").val(object.chest)
                $("#legsDisplay").val(object.legs)
                $("#forhead").val(object.head)
                $("#forchest").val(object.chest)
                $("#forlegs").val(object.legs)
                $("#headsubmit").css("background", "url('/Images/spriteSheet.png')" + object.head * -48 + followMe.userDesign1)
                $("#chestsubmit").css("background", "url('/Images/spriteSheet.png')" + object.chest * -48 + followMe.userDesign2)
                $("#legssubmit").css("background", "url('/Images/spriteSheet.png')" + object.legs * -48 + followMe.userDesign3)
                $("#head1").css("background", "url('/Images/spriteSheet.png')" + object.head * -48 + followMe.userDesign1)
                $("#torso1").css("background", "url('/Images/spriteSheet.png')" + object.chest * -48 + followMe.userDesign2)
                $("#legs1").css("background", "url('/Images/spriteSheet.png')" + object.legs * -48 + followMe.userDesign3)
            }
            else {//new player x, y etc set
                if (community === undefined) {

                    var identifier = "player" + object.username;

                    $("#" + identifier).remove();
                    $("#" + object.username + "name").remove();
                    $("<div class='player' style='display:block;left:" + object.x + "px;top:" + object.y + "px;' id='" + identifier + "'>"
                        + "<aside class='head' id='head" + object.username + "'></aside>"
                        + "<aside class='torso' id='chest" + object.username + "'></aside>"
                        + "<aside class='legs' id='legs" + object.username + "'></aside>"
                        + "<progress class='standard' id='health" + object.username + "'></progress>"
                        + "<progress class='lives' style='margin-top:8px!important' id='lives" + object.username + "'></progress>"
                        + "</div>").appendTo($("#game"))

                    $("<p class='linkNoBorder' style='top:" + (object.y - 64) + "px;left:" + object.x + "px;position:absolute;' id='" + object.username + "name'>" + object.username + "</p>").appendTo($("#game"))

                    followMe.showPlayerStats(object, false)
                    $("#head" + object.username).css("background", "url('/Images/spriteSheet.png')" + object.head * -48 + followMe.userDesign1)
                    $("#chest" + object.username).css("background", "url('/Images/spriteSheet.png')" + object.chest * -48 + followMe.userDesign2)
                    $("#legs" + object.username).css("background", "url('/Images/spriteSheet.png')" + object.legs * -48 + followMe.userDesign3)

                }

                if (community) {
                    $("#head"/*+object.username*/).css("background", "url('/Images/spriteSheet.png')" + object.head * -48 + followMe.userDesign1)
                    $("#chest"/* + object.username*/).css("background", "url('/Images/spriteSheet.png')" + object.chest * -48 + followMe.userDesign2)
                    $("#legs"/* + object.username*/).css("background", "url('/Images/spriteSheet.png')" + object.legs * -48 + followMe.userDesign3)

                    $("#otherPlayerLevel").text(object.level)
                    $("#otherPlayerWorld").text(object.world)
                }
            }
        }
    }

    $("#forhead").change(function () {

        $("#headsubmit").css("background", "url('/Images/spriteSheet.png')" + ($("#forhead").val() * -48) + followMe.userDesign1)
        $("#headDisplay").val($("#forhead").val())
    })
    $("#forchest").change(function () {
        $("#chestsubmit").css("background", "url('/Images/spriteSheet.png')" + ($("#forchest").val() * -48) + followMe.userDesign2)
        $("#chestDisplay").val($("#forchest").val())
    })
    $("#forlegs").change(function () {

        $("#legssubmit").css("background", "url('/Images/spriteSheet.png')" + ($("#forlegs").val() * -48) + followMe.userDesign3)
        $("#legsDisplay").val($("#forlegs").val())
    })
    followMe.checkUserAchievements = function () {
        $("#achievements aside")
            .each(function () {
                var defaultID = 160;
                var message = "";
                var classAdd = "";

                if (followMe.specialAchieveArray[this.id] === undefined) {
                    //alert(this.id)
                }
                else {
                    message = followMe.specialAchieveArray[this.id].message;
                }

                if (followMe.specialAchieveArray[this.id] !== undefined &&
                    followMe.specialAchieveArray[this.id].type === "done") {
                    defaultID = 192;
                    classAdd = "done"
                }

                if ($("aside#" + this.id).parent().children("p").length < 2) {
                    $("aside#" + this.id).css("background", "url('../Images/spriteSheet.png')"
                        + (-32 * this.id) + "px " + defaultID + "px")
                        .attr("class", classAdd).parent().append(message)
                    $("#achievementsProgress").remove();
                }
            })
    }

    followMe.memServer.on("mongoHere", function (testText) {

        //$("#collision").text(testText)
    })

    followMe.toggleTable = function (id) {

        id = id.substring(0, id.length - 7)
        $("table#" + id).toggle();
        $("p#" + id + "_locked").toggle();
        //alert(id + ", " + id.length)
    }

    $(document).on('focus', 'input', function () {
        if ($(this).closest('div').hasClass('ui-input-search')) { // or $(this).attr('data-type') == 'search'
            $(this).closest('div').addClass('noshadow');
        }
    });

    if ($("#compError").text().length > 1)//Validation error
    {
        $("#competeForm").show();
        $("#compError").attr("class", "required");
    }
})