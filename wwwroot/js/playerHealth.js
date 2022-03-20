$(function () {

    followMe.userServicesDefined.on("updateMemberLives", function (object, level, username) {

    }
    followMe.updatehealth = function (name, health, automated, otherObj) {


            var object = followMe.players[1];
            identifier = "player";
            if (otherObj !== undefined) {
                object = otherObj
                identifier = "player" + object.username
                //alert(object.username)
            }

            if (identifier === "player") //the local player has been hurt, no longer invincible
            {
                followMe.players[1].hasSurvived = 0;
            }

            var isDying = false;

            if ((automated && health < object.maxHealth) || automated === undefined || localStorage.getItem("resetting") === true) {
                object.health = health;
                memServer.server.updateHealth(object.username, object.health, object.maxHealth, isDying, object.maxLives)
                if (otherObj === undefined) {
                    followMe.showPlayerStats(object, true);
                }
                else {
                    followMe.showPlayerStats(object, false);
                    followMe.setPrimaryHealth(object);
                }
            }

            //alert(automated + ", " + followMe.players[1].health);

            if (health <= 0) {

                isDying = true;
                object.health = object.maxHealth;
                object.lives -= 1;
                //alert(otherObj + ", " + object.lives);

                if (otherObj === undefined) {//Don't reset if the player is already on another screen
                    followMe.resetPlayer();//takes off the life
                    followMe.x("player", localStorage.getItem("startX"))
                    followMe.y("player", localStorage.getItem("startY"))
                    followMe.showOtherPlayer(followMe.x(identifier), followMe.y(identifier), object.username)
                    followMe.showPlayerStats(object, true);
                }
                else {
                    followMe.showPlayerStats(object, false);
                    followMe.setPrimaryHealth(object);
                    $("#player" + object.username).hide();
                    $("#onlineWeapon" + object.username).hide();
                    $("#" + object.username + "name").hide();
                }
                followMe.userServicesDefined.server.updateHealth(object.username, object.health, object.maxHealth, isDying, object.maxLives)

            }

            if (object.lives <= 0 && otherObj === undefined) {
                object.lives = object.maxLives
                object.health = object.maxHealth
                followMe.showPlayerStats(object, true);
                alert("game over")
                $(".checkpoint").each(function () {
                    var x = this.id
                    var checkpoint = $("#" + x).attr("alt")
                    var displayValue = 0;
                    localStorage.setItem("checkpoint", 0)
                    if (checkpoint === localStorage.getItem("checkpoint")) {
                        displayValue = -64
                    }
                    followMe.userServicesDefined.server.gameOver(localStorage.getItem("username"), object.lives, object.maxHealth)
                    //alert(object.lives + ", " + object.maxHealth)

                    if (followMe.checkpoints[x.substring(10)].caveName === "") {
                        $("#" + x).css("backgroundPosition", displayValue + "px -64px");
                    }
                    localStorage.setItem("startY", followMe.checkpoints[0].y + 32)
                    localStorage.setItem("startX", followMe.checkpoints[0].x)

                })
                localStorage.setItem("checkpoint", 0)
                localStorage.setItem("checkpoint2", 0)
                followMe.players[1].checkpoint = 0;
                followMe.userServicesDefined.server.gameOver(localStorage.getItem("username"), object.lives, object.maxHealth)
                followMe.resetPlayer(1)
                $("#livesPlayer").val(object.maxLives)
                followMe.x("player", localStorage.getItem("startX"))
                followMe.y("player", localStorage.getItem("startY"))
                followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), localStorage.getItem("username"))
            }


        })

})