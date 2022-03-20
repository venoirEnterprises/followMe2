$(document).ready(function () {
    $("#collision").text(surrenderTime)
    followMe.canMove = true;
    followMe.functionNumber = 0;
    var surrendering = false;
    followMe.keyboard = [];


    $(document).keyup(function (e) {
        if (e.handled !== true) {
            followMe.keyboard[e.keyCode] = false;
            e.handled = true;
        }
        //this key is not being held
    });


    function getCode(code) {
        var returnThis = code + " Not known";
        switch (code) {
            case 8:
                returnThis = "[Backspace]"
                break;
            case 13:
                returnthis = "[Enter]"
                break;
            case 16:
                returnThis = "[Shift]"
                break;
            case 32:
                returnThis = "[Space]"
                break;
            case 37:
                returnThis = "[Left]"
                break;
            case 38:
                returnThis = "[Up]"
                break;
            case 39:
                returnThis = "[Right]"
                break;
            case 40:
                returnThis = "[Down]"
                break;
            case 65:
                returnThis = "A"
                break;
            case 68:
                returnThis = "D"
                break;
            case 72:
                returnThis = "H"
                break;
            case 74:
                returnThis = "J"
                break;
            case 75:
                returnThis = "K"
                break;
            case 80:
                returnThis = "P"
                break;
            case 81:
                returnThis = "Q"
                break;
            case 87:
                returnThis = "W"
                break;
            case 83:
                returnThis = "S"
                break;
            case 85:
                returnThis = "U"
                break;
            case 48:
                returnThis = "0"
                break;

        }
        return returnThis;
    }
    var surrenderTime = 0;
    var stealthTime = 0;
    
        if ($("#isGame").val() !== "no") {

            $(document).on("keydown", function (e) {
                if (e.handled !== true) {
                    e.handled = true;
                    followMe.moveUser(e.keyCode)
                    followMe.keyboard[e.keyCode] = true;
                }
            });
        }


    followMe.moveUser = function (action) {
        followMe.updateXPFromAction("start");
        var object = followMe.players[1];
        var object2 = followMe.players[2];
        var rate = 50
        //should come from the person future wise


        if (action === "left") {
            action = followMe.players[1].left
        }

        if (action === "right") {
            action = followMe.players[1].right
        }

        var isStill = false;
        if ((followMe.keyboard[followMe.players[1].right] === undefined || followMe.keyboard[followMe.players[1].right] === false) &&
                            (followMe.keyboard[followMe.players[1].left] === undefined || followMe.keyboard[followMe.players[1].left] === false) &&
                            (followMe.keyboard[followMe.players[1].up] === undefined || followMe.keyboard[followMe.players[1].up] === false)) {
            isStill = true;
        }
        if (followMe.players[1] !== undefined) {

            // allows you to hold keys
            switch (action) {
                case followMe.players[1].left: //left  from mobile.js                   

                    followMe.hasCollided("left", followMe.x("player"), followMe.y("player"), '.enemies', "player")

                    followMe.x("player", followMe.x("player") - object.pace);
                    followMe.defineDrop(followMe.players[1].left, followMe.x("player"), "left", "player")
                    followMe.hasCollided("", followMe.x("player"), followMe.y("player"), '.checkpoint', "player")
                    followMe.hasCollided(followMe.players[1].left, followMe.x("player"), followMe.y("player"), '.caves', "player")
                    if (followMe.keyboard[followMe.players[1].special] === false && followMe.players[1].personType === "3") {
                        followMe.changeImageDesign("stealth")

                    }
                    followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username)
                    break;
                case followMe.players[1].right: // right from mobile.js
                    followMe.hasCollided("right", followMe.x("player"), followMe.y("player"), '.enemies', "player")
                    followMe.hasCollided("", followMe.x("player"), followMe.y("player"), '.teleports', "player")

                    followMe.defineDrop(followMe.players[1].right, followMe.x("player"), "right", "player")
                    //alert("2")
                    followMe.x("player", followMe.x("player") + object.pace);
                    followMe.hasCollided("", followMe.x("player"), followMe.y("player"), '.checkpoint', "player")
                    followMe.hasCollided(followMe.players[1].right, followMe.x("player"), followMe.y("player"), '.caves', "player")
                    if (followMe.keyboard[followMe.players[1].special] === false && followMe.players[1].personType === "3") {
                        followMe.changeImageDesign("stealth")
                    }
                    followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username)
                    break;
                case followMe.players[1].surrender:
                    if (followMe.url.search("connect/levelselect") === -1) {
                        surrendering = true;
                        setInterval(function () {
                            if (surrendering) {
                                surrenderTime += 1
                                $("#collision").text(surrenderTime)
                                surrendering = false;
                            }
                            if (surrenderTime >= 5) {
                                surrenderTime = 0
                                surrendering = false;
                                followMe.memServer.server.surrender(localStorage.getItem("username"));
                                if (confirm("Do you want to surrender? Back to level select...")) {
                                    window.location = "../../Connect/LevelSelect"
                                }

                            }
                        }, 500);
                    }
                    break;
                case followMe.players[1].up:
                    if (isStill) {
                        followMe.specialForPersonType("still", "tryUp")
                    }
                    else {
                        if (followMe.keyboard[followMe.players[1].right]) {
                            //alert()   
                            followMe.jumpSound()
                            followMe.jump("player", "right", 100, 150 * parseFloat(followMe.players[1].jumpHeightMultiplier))
                            //followMe.moveUser(followMe.players[1].right);
                            //followMe.hasCollided(followMe.players[1].right, followMe.x("player"), followMe.y("player"), '.caves', "player")
                        }
                        if (followMe.keyboard[followMe.players[1].left]) {
                            followMe.jumpSound()
                            followMe.jump("player", "left", 100, 150 * parseFloat(followMe.players[1].jumpHeightMultiplier))
                            followMe.moveUser(followMe.players[1].left)
                        }
                    }
                    followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username)
                    break;

                case followMe.players[1].enter:
                    followMe.hasCollided(followMe.players[1].enter, followMe.x("player"), followMe.y("player"), '.caves', "player")
                    followMe.hasCollided(followMe.players[1].enter, followMe.x("player"), followMe.y("player"), '.checkpoint', "player")
                    break;

                case followMe.players[1].special:
                    var fromAction = ""
                    var toComplete = "";
                    switch (followMe.players[1].personType) {
                        case "2":
                            if (isStill) {
                                followMe.specialForPersonType("still", "tryDown")
                                followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username)
                            }
                            break;
                        case "3":
                            if (isStill) {
                                stealth = true;
                                setInterval(function () {
                                    if (stealth) {
                                        stealthTime += 1
                                        $("#collision").text(surrenderTime)
                                        stealth = false;
                                    }
                                    if (stealthTime >= 2) {
                                        stealthTime = 0
                                        stealth = false;
                                        followMe.specialForPersonType("still", "stealth")
                                    }
                                }, 500);


                            }
                            break;
                    }
                    break;
                case followMe.players[1].build://feb 14th, start a building button, fully programmed
                    window.console.log("building");
                    break;
            }
        }
    }


    $("#designLeft").keydown(function (e) {
        $("#left").text(getCode(e.keyCode))
        $("#userleft").val(e.keyCode)
    })

    $("#designUp").keydown(function (e) {
        $("#up").text(getCode(e.keyCode))
        $("#userup").val(e.keyCode)
    })
    $("#designRight").keydown(function (e) {
        $("#right").text(getCode(e.keyCode))
        $("#userright").val(e.keyCode)
    })
    $("#designSurrender").keydown(function (e) {
        $("#surrender").text(getCode(e.keyCode))
        $("#usersurrender").val(e.keyCode)
    })

    $("#designEnter").keydown(function (e) {
        $("#enter").text(getCode(e.keyCode))
        $("#userenter").val(e.keyCode)
    })

    $("#designSpecial").keydown(function (e) {
        $("#special").text(getCode(e.keyCode))
        $("#userspecial").val(e.keyCode)
    })

    $("#designBuild").keydown(function (e) {
        $("#build").text(getCode(e.keyCode))
        $("#userbuild").val(e.keyCode)
    })
});