//$("#game").on('pagebeforeshow ready', function () {
$(document).ready(function () {

    localStorage.setItem("currentCaveName", "");
    $("#playerXPMessage").hide();
    if (localStorage.getItem("lastEnemyDead") === null) {
        localStorage.setItem("lastEnemyDead", 0);
    }
    localStorage.setItem("enemyHit", "testhere");
    $("#secondname").hide();
    $("#firstpassword").hide();
    $("#secondpassword").hide();
    $("#weapon1").hide();
    $("#difficultySet-button span").hide();
    $("#difficultySet-button span").last().show().text("Difficulty   ");
    $("#firstUserPassword").prop("checked", false);
    $("#secondUserPassword").prop("checked", false);
    $("#multiplayer").prop("checked", false);
    window.followMe = window.followMe || {};

    followMe.allSoundNames = ["background", "jump", "shoot", "notification", "whatHappen;d"];
    followMe.playingSounds = []; //Duplicated sound, make an array
    followMe.soundTest = new Audio("/Sounds/youllKnowWhatToDo[1_1].mp3");//Background sound not going to change based on scene
    followMe.url = document.URL.valueOf().toLocaleLowerCase();
    followMe.url2 = document.URL.valueOf();
    followMe.homeurl = followMe.url.substring(7); followMe.homeurl = "http://" + followMe.homeurl.substring(0, followMe.homeurl.indexOf("/"));
    followMe.helpRequest = null;
    followMe.helpUsername = null;
    $("#otherPlayerChat").draggable();
    if (followMe.url.search("tohelp") !== -1) {
        followMe.helpRequest = followMe.url2.substring(followMe.url2.search("toHelp") + 8);
        $("#commNotificationAlert").hide();
        followMe.helpUsername = followMe.helpRequest.substring(0, followMe.helpRequest.indexOf(":"));
        $("#game #otherPlayerChat").show();
    }
    else {
        $("#game #otherPlayerChat").hide();

    }

    //alert(followMe.helpRequest + " = helpRequest")

    $("#levelNameForHelp-button span").remove();
    followMe.userServicesDefined = new signalR.HubConnectionBuilder().withUrl("/userMethods").build();
    followMe.authServicesDefined = new signalR.HubConnectionBuilder().withUrl("/authServices").build();
    followMe.levelServicesDefined = new signalR.HubConnectionBuilder().withUrl("/levelServices").build();
    followMe.multiplayer = new signalR.HubConnectionBuilder().withUrl("/multiplayerServices").build();
    followMe.communityServices = new signalR.HubConnectionBuilder().withUrl("/communityServices").build();

    followMe.imageDefintion = {};

    followMe.imageDefintion.weapon = "240px";
    followMe.imageDefintion.fan = "-560px";

    $("#helpMe").hide();
    $("#levelNameForHelp").hide();
    $("#difficultySet").off().on("change", function () {
        $("#difficultySet-button span").hide();
        $("#difficultySet-button span").last().show().text("Difficulty   ");
        $("#difficulty").val($("#difficultySet").val());
        window.console.log($("#difficultySet").val());
    });

    followMe.removeFromArray = function (array, element) {
        const index = array.indexOf(element);

        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    followMe.player = function (options) {
        var defaultValues =
        {
            head: 0,
            chest: 0,
            legs: 0,
            username: "",
            //KEYBOARD
            left: 65,
            right: 68,
            surrender: 83,
            enter: 0,
            build: 16,//shift
            //KEYBOARD
            maxLives: -1,
            lives: -1,
            maxHealth: 100,
            pace: 20,
            x: followMe.x("player"),
            y: followMe.y("player"),
            rank: 0,
            XP: 0,
            health: 50,
            weaponHarmMultiplier: 0.1,
            jumpHeightMultiplier: 0.1,
            personType: -1,
            difficulty: -1,
            currentSurfaceID: ""
        }
        $.extend(this, defaultValues, options);
    };

    followMe.checkpoint = function (options) {
        var defaultValues =
        {
            identifier: 0,
            x: 0,
            maxx: 0,
            y: 0,
            maxy: 0,
            caveName: ""
        }
        $.extend(this, defaultValues, options);
    };


    $("#player1health").parent().hide();
    $("#player2health").parent().hide();
    localStorage.setItem("enemyHit", "");
    followMe.sleep = function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    };
    followMe.memServer = new signalR.HubConnectionBuilder().withUrl("/userMethods").build();
    $("#userdesigned").val(localStorage.getItem("username"));
    var url = document.URL.valueOf();
    $("#player2").hide();

    var isGame = $("#isGame").val() == '' ? 'No' : $("#isGame").val()
    if (isGame === "no" || isGame === "") {
        localStorage.setItem("multi", false);
        $("footer").hide();
    }
    $("#multiplayer").click(function () {
        $("#secondname").toggle("size");
        localStorage.setItem("multi", $("#multiplayer").prop("checked"));
        if ($("#multiplayer").prop("checked") === false);
        { localStorage.setItem("secondUsername", "n/a"); }
    });


    if (isGame === "yes") {
        $("#weapon1").show();
        //if (localStorage.getItem("multi"))
        //{
        //    $("#player2").show();
        //}
        var gameSurface = 200;
        $("#kinput").keydown(function (e) {
            alert(e.keyCode);
        });
        followMe.imagesToPreload = [];
        //add an image tp the list of preload

        followMe.userServicesDefined.on("getmDB"), function (name, title) {
            $("#mDB").append($("<p id=" + name + ">" + name + " : " + title + "</p>"));
            $("#namelist").append($("<option>" + name + "</option>"));
        };
    }

    followMe.x = function (divId, position) {
        if ($("#isGame").val() === "yes") {

            window.console.log("vnorrisx", divId, position);
            if (position) {
                followMe.players[1].x = position;
                if (divId.search("player") !== -1) {
                    $("#weapon1").css("left", position - 96);
                }
                $("#" + divId).css("left", position);
                $("#" + followMe.players[1].username + "name").css("left", position);
                $("#weapon1").css("left", position - 96);

            }
            else {
                return parseFloat($("#" + divId).css("left"));
            }
        }
    };
    followMe.y = function (divId, position, rate) {
        window.console.log("vnorrisy", divId, position, rate);
        if ($("#isGame").val() === "yes") {
            if (position) {
                followMe.players[1].y = position;
                if (divId.search("player") !== -1) {
                    $("#weapon1").css("top", position - 10);
                    $("#weapon1").animate({ "top": position - 10 }, rate / 4);
                }
                $("#" + divId).css("top", position);
                $("#" + followMe.players[1].username + "name").css("top", position - 64);
                $("#weapon1").css("top", position - 10);
            }

            if (rate === "fan") {
                followMe.y("player", followMe.y("player") - 384);
                followMe.defineDrop("", followMe.x("player"), "", "player");
            }
            else {
                return parseFloat($("#" + divId).css("top"));
            }
        }
    };
    followMe.jump = function (divId, direction, height, speed) {
        var speedToUse = [];
        var move = "";


        if (direction === "right") {
            //DOUBLE JUMP
            speedToUse[1] = followMe.x("player") + speed / 2;
            speedToUse[2] = followMe.x(divId) + speed;
        }
        if (direction === "left") {
            //DOUBLE JUMP
            speedToUse[1] = followMe.x("player") - speed / 2;
            speedToUse[2] = followMe.x(divId) - speed;
        }
        followMe.hasCollided("jump", speedToUse[2], parseInt(followMe.y(divId) - height), '.background', divId);
        followMe.hasCollided("jump", speedToUse[2], parseInt(followMe.y(divId) - height), '.enemies', divId);

        $("#" + divId).animate({ "top": followMe.y(divId) - height, "left": speedToUse[2] }, 400, function () {
            followMe.defineDrop("jump", speedToUse[2], direction, divId);
            $("#weapon1").css("left", speedToUse[2] - 64);
            $("#playerx").text(speedToUse[2] - 64);
            followMe.checkForItems(speedToUse[2]);
        });

    };

    var newPos = followMe.x("player");

    followMe.levelServicesDefined.on("newLevel", function (level, world, username, fromSelection) {
        if (username === localStorage.getItem("username")) {
            if (fromSelection === false) {//They're in a level here..
                if (followMe.players[1].hasSurvived === 1) {
                    followMe.updateXPFromAction("live");
                }
                if (confirm("You did it! Do you want to go to the next level?")) {
                    window.location.assign("/" + world + "/" + level);
                }
            }
            else {
                window.location.assign("/" + world + "/" + level);
            }
        }
    });
    $("#disconnect").on("click", function () {
        window.console.log("quitting...");
        if (confirm("Are you sure?")) {
            window.console.log("else..");
            followMe.userServicesDefined.server.quitUser(followMe.players[1].username);
            window.location.assign("/Connect/Welcome");
            localStorage.removeItem("checkpoint");
            localStorage.removeItem("checkpoint2");
            localStorage.removeItem("multi");
            localStorage.removeItem("secondUsername");
            localStorage.removeItem("startX");
            localStorage.removeItem("startX2");
            localStorage.removeItem("startY");
            localStorage.removeItem("startY2");
            localStorage.removeItem("username");
        }
    });
    $("#firstdesign").attr("href", "/Connect/Design/" + localStorage.getItem("username"));
    $("#firstdesign").hide();
    $("#seconddesign").hide();
    if (localStorage.getItem("multi") === "true") {
        $("#seconddesign").attr("href", "/Connect/Design/" + localStorage.getItem("secondusername"));
        $("#seconddesign").show();
    }
    //.css("backgroundPosition", "0px, 0px")


    if (url.search("/Connect/Design/") !== -1 || $("#isGame").val() !== "yes") {
        $("#firstdesign").hide();
        $("#seconddesign").hide();
        $("#player").hide();
        $("#player2").hide();
    }


    if ($("#isGame").val() === "yes" && url.search("/Connect/Design/") === -1) {
        $("#firstdesign").show();
    }

    $("#firstUserPassword").click(function () { $("#firstpassword").toggle(); });
    $("#secondUserPassword").click(function () { $("#secondpassword").toggle(); });
});