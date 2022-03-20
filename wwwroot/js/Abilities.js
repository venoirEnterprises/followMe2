$(function () {
    $("input[name='personTypeSelect']").click(function () {
        $("#personTypeSelected").val($("#" + this.id).val())
        if ($("#" + this.id).val() === "3") {
            $("#weaponFull").hide()
            $("#weaponID").val(0);
        }
        if ($("#" + this.id).val() === "2" || $("#" + this.id).val() === "1") {
            $("#weaponFull").show()
        }
    })

    $("#specialAbilityProgram").hide()
    if ($("#isGame").val() === "no")
    {
        $("#playerDesign").hide();
    }


    //DESIGN END

    followMe.specialForPersonType = function (fromAction, actionToComplete) {
        if (followMe.players[1].personType !== 1 && fromAction.length + actionToComplete.length > 2) {

            var continuing = true;
            //JUST DEBUG FOR NOW
            if (fromAction !=="still") {
                alert(fromAction + ", " + actionToComplete)
            }

            switch (fromAction + "," + actionToComplete) {
                case "still,stealth":
                    if (followMe.players[1].usedStealth === 0) {
                        followMe.changeImageDesign(actionToComplete)
                        followMe.players[1].usedStealth = 1
                        followMe.showOtherPlayer(followMe.x("player"), followMe.y("player"), followMe.players[1].username, false, true)
                    }
                    break;
                case "still,tryDown":
                    followMe.y("player", followMe.y("player") + 128)
                    followMe.defineDrop("", followMe.x("player"), "", "player")
                    break;
                case "still,tryUp":
                    followMe.y("player", followMe.y("player") - 256)
                    followMe.defineDrop("", followMe.x("player"), "", "player")
                    break;
                    
            }
        }
    }

    followMe.dangerMode = function () {
        var continuing = true;
        var oldHealth = followMe.players[1].health;
        setInterval(function () {
            if (continuing && $("#isGame").val() !== "no") {
                var health = followMe.players[1].health;
                health -= 5
                followMe.updatehealth(localStorage.getItem("username"), health, true)
                if(localStorage.getItem("resetting"))
                {
                    localStorage.setItem("resetting", false)
                }
            }
        }, 1000)
    }
})