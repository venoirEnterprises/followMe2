$(document).ready(function () {

    var shots = [];
    if ($("#isGame").val() !== "no") {


        followMe.shots = [];

        //if (followMe.url.search("levelselect") == -1 && followMe.players[1].personType != 3) {
            followMe.moveTheShot = function (shotID, down, moveEachTime, mouseX, mouseY, behind, online, object) {
                var id = "#shot" + shotID
                var lookingFor = "shot" + shotID;
                if (online)
                {
                    id = "#shotOnline" + shotID;
                    lookingFor = "shotOnline" + shotID;
                    followMe.fireOnlineDebug = object
                }
                var d = new Date();
                //if (online == false) {
                    var myright = object.x;
                    object.x += parseFloat(moveEachTime) * 20

                    var rate = 10
                    if (behind) { rate = -rate }

                    object.y += rate;
                    $(id).css("left", object.y + "px")
                    $(id).css("top", object.x + "px")
                    //DOES IT HIT?

                    if (online === false) {
                        followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".enemies", lookingFor, true)
                        if (object.friendlyFire && followMe.players[1].friendlyFire) {
                            followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".player", lookingFor, true)
                        }
                    }

                    followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".surface", lookingFor)

                    if (localStorage.currentCaveName !== "") {
                        followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".caves", lookingFor)
                    }


                    if (online && object.friendlyFire && followMe.players[1].friendlyFire) {
                        //followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".enemies", "shot" + shotID, false)
                        followMe.hasCollided(parseFloat(moveEachTime * rate) * rate, object.x, object.y, ".player", lookingFor, false)//Search for the player in the screen first
                        
                    }

                    if ((object.x - followMe.x("player") > 1280) || (followMe.x("player") - object.x > 1280)) {
                        $(id).remove();
                        followMe.removeFromArray(followMe.shots, object)
                    }
                //}
            }
        //}


        followMe.fireTheShot = function (mouseObj, weaponClass) { 
            if (followMe.players[1].personType !== 3 && mouseObj.clientX + mouseObj.clientY !== followMe.currentTap) {
                var shotID = 1;
                followMe.countTap += 1;
                followMe.currentTap = mouseObj.clientX + mouseObj.clientY
                //alert(followMe.currentTap)
                weaponClass = followMe.weapon.classDefinition


                if (localStorage.getItem("shotNumber") !== null) {
                    shotID = parseFloat(localStorage.getItem("shotNumber")) + 1;
                }
                localStorage.setItem("shotNumber", shotID);

                var right = $("#weapon1").css("left")
                var width = $("#weapon1").css("width")
                var top = $("#weapon1").css("top")
                var mouseX = parseFloat(mouseObj.clientX)
                var mouseY = parseFloat(mouseObj.clientY)
                top = top.substring(0, top.length - 2)
                //to get the right shot back

                var begin = 463;
                var beforeStart = 3;
                var length = 5;
                var height = 9;
                var down = 14;

                switch (weaponClass) {
                    case "2":
                        begin = 463;
                        beforeStart = 4;
                        length = 11;
                        height = 12;
                        down = 12;
                        break;
                    case "3":
                        begin = 461;
                        beforeStart = 16;
                        length = 5;
                        height = 10;
                        down = 11;
                        break;
                }

                width = width.substring(0, width.length - 2)
                right = right.substring(0, right.length - 2)
                right = parseFloat(right) + parseFloat(width)
                var moveEachTime = (mouseY - top) / (mouseX - right)
                var behind = false;

                if (mouseX < right) {
                    behind = true
                    moveEachTime = (mouseY - top) / (right - mouseX);
                    if (followMe.weaponRight !== true) {
                        followMe.changeImageDesign("weapon", "", false, true)
                        followMe.weaponRight = true
                    }
                }
                else {
                    if (behind === false) {
                        if (followMe.weaponRight) {
                            followMe.changeImageDesign("weapon", "", false, false)
                        }
                        followMe.weaponRight = false;
                    }
                }

                followMe.shotDebug = moveEachTime + ", " + behind

                var toShow = "Move To this";
                $("#shot").remove();

                if ($("#isGame").val() !== "no") {
                    if ((moveEachTime < -.5 || (moveEachTime > 2.5))) {
                    }

                        //Only on boss levels?

                    else {
                        beforeStart = -306 - beforeStart
                        $("<aside></aside>")
                            .css("left", right)
                            .css("top", parseFloat(top) + parseFloat(down) + "px")
                            .css("backgroundImage", "url('/images/spriteSheet.png')")
                            .css("width", length)
                            .css("height", height)
                            .css("backgroundPosition", beforeStart + "px " + (497 - parseFloat(begin)) + "px")
                            .css("display", "block")
                            .css("position", "absolute")
                            .css("zIndex", "100")
                    .css("marginLeft", "0px!important")
                        .attr("id", "shot" + shotID).appendTo($("#game"))

                        followMe.shotSound(weaponClass)

                        var object = $("#weapon1").attr("class")
                        var abilityEnhancment = 1
                        if (followMe.players[1].personType === "1") {
                            abilityEnhancment = 1.5
                        }
                        if (followMe.players[1].personType === "2") {
                            abilityEnhancment = 0.75
                        }
                        var hurt = parseFloat(followMe.weapon.rate * (followMe.weapon.hurt * abilityEnhancment) * parseFloat(followMe.players[1].weaponHarmMultiplier));

                        //should be weapon object

                        followMe.shots[shotID] = new followMe.shot(
                            {
                                identifier: "shot" + shotID,
                                y: right,
                                x: parseFloat(top) + parseFloat(down),
                                hurt: hurt,
                                behind: behind,
                                friendlyFire : followMe.players[1].friendlyFire
                            })

                        //alert(hurt)
                        if (followMe.weapon.rate === "0") {
                            followMe.shots[shotID].hurt = (5 * parseFloat(followMe.weapon.hurt)
                            * parseFloat(followMe.players[1].weaponHarmMultiplier))
                        }

                        followMe.shootOnline(shotID, down, moveEachTime, mouseX, mouseY, behind, weaponClass, followMe.players[1].username, followMe.shots[shotID])

                        setInterval(function () {
                            if (followMe.shots[shotID] !== undefined) {
                                followMe.moveTheShot(shotID, down, moveEachTime, mouseX, mouseY, behind, false, followMe.shots[shotID])
                            }
                        }, 25)
                    }
                }
            }

            $.connection.hub.start("~/signalr").done(function () {

            });
            $("#weaponID").val(1);
        }
    }
});