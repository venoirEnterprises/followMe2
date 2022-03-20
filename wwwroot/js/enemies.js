$(document).ready(function () {
    localStorage.setItem("killCount", 0)
    function enemyDies(identified) {
        //alert(identified)
        if (localStorage.getItem("effectsMute") !== "true") {
            destroySoundDuplication(new Audio("../Sounds/Effects/enemy died.mp3"), "notification", true, false, false)
        }
        if (localStorage.getItem("lastEnemyDead") !== identified && identified !== undefined) {
            localStorage.setItem("killCount", parseFloat(localStorage.getItem("killCount")) + 1)
            followMe.updateXPFromAction("kill");
            localStorage.setItem("lastEnemyDead", identified)

            //followMe.communityServices.server.recordLevelAccomplishment(followMe.players[1].username, "enemy", identified, $("#welcome").text(), "EndingTheBeginning")

            if (followMe.players[1].personType === 1) {
                var object = followMe.players[1];
                followMe.updatehealth(localStorage.getItem("username"), object.health + parseFloat(followMe.enemies[identified].maxHealth))
                followMe.dangerMode();
            }
        }
    }

    followMe.hurtEnemy = function (enemyID, shotID, local, hurtExternal) {
        var shotIDhere = shotID.substring(4);
        //if (local) {
        var hurt = followMe.weapon.hurt;

        if (local === false) {
            hurt = hurtExternal
        }
        var health = followMe.enemies[enemyID].currentHealth;
        console.log("enemy of ID: " + enemyID + ", " + health)

        if (localStorage.getItem("bulletEnemy") !== shotIDhere + ": " + enemyID) {            
            localStorage.setItem("bulletEnemy",
                shotIDhere + ": " + enemyID
            )
            if (health - hurt < 1 || health < 1) {

                enemyDies(enemyID)
                $(".enemies#" + enemyID).remove();
                $(".shots#" + shotID).remove();
            }
            if (health - hurt > 1) {

                $(".enemies#" + enemyID + ">progress").val($(".enemies#" + enemyID + ">progress").val() - hurt)
                followMe.enemies[enemyID].currentHealth = health - hurt
            }


        }
    }
    followMe.enemyHurt = function(location, id, object) {
        if ($(".enemies#" + id).length !== 0) {
            var enemyleft = followMe.enemies[id].x
            var enemytop = followMe.enemies[id].y


            var left = followMe.x("player");
            var left2 = (left + 48)
            var top = followMe.y("player");
            var top2 = (top + 96)

            //alert(top + ", " + top2)
            //alert(left + ", " + left2)

            var itemtoupdate = followMe.players[1]
            if (left !== "au" || top !== "au") {
                if (left <= enemyleft && left2 >= enemyleft
                    && top <= enemytop && top2 >= enemytop
                    && id !== localStorage.getItem("enemyHit") && object.caveName === localStorage.getItem("currentCaveName") && followMe.players[1].usedStealth !== 1
                    ) {
                    var newhealth = parseInt(itemtoupdate.health -= object.hurt)
                    //alert(object.hurt + ", " + itemtoupdate.health + ", " + newhealth)
                    if (localStorage.getItem("enemyHit") !== id) {
                        followMe.updatehealth(itemtoupdate.username, newhealth, true)
                        localStorage.setItem("enemyHit", id)
                    }
                    //alert(itemtoupdate.maxHealth+"..."+ itemtoupdate.health+"..."+itemtoupdate.maxLives+"..."+ itemtoupdate.lives)                       
                }
            }
        }
    }

    followMe.enemyDrop = function(code, direction, player, canfly) {

        var continuing = true
        var counting = 0
        var playerX = direction
        var yDiff = followMe.y(player)
        var playerID = player;

        if (canfly === false) {
            $(".surface").each(function () {
                counting += 1
                var x = this.id;
                var surfaceObject = followMe.surfaces[x]
                var min = null;
                var surfaceMinX = surfaceObject.minx
                var surfaceMaxX = surfaceObject.maxx
                var surfaceY = surfaceObject.miny;

                if (playerX + 48 >= surfaceMinX && playerX <= surfaceMaxX && yDiff <= surfaceY && continuing
                    ) {
                    somethingBelow = true;
                    var movement = "left"
                    if (code === 68) { movement = "right" }
                    $("#" + player).css("top", parseFloat(surfaceY - 96))
                    //alert(player.substring(".enemies".length+1))
                    followMe.enemies[playerID].y = parseFloat(surfaceY - 96)
                    continuing = false
                }
            });
            if (continuing) {
                enemyDies()
                followMe.sleep(150)
                $("#" + player).remove();
            }
        }
    }
});