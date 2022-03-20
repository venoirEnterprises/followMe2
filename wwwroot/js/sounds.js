$(document).ready(function () {

    followMe.jumpSound = function () {
        if (localStorage.getItem("effectsMute") === "false") {
            followMe.destroySoundDuplication(new Audio("../Sounds/Effects/jump.mp3"), "jump", true, false, false)
        }
    }
    followMe.shotSound = function (identifier) {

        if (localStorage.getItem("effectsMute") === "false") {
            followMe.destroySoundDuplication(new Audio("../Sounds/Effects/Weapon" + identifier + ".mp3"), "shoot", true, false, false)
        }
    }

    followMe.destroySoundDuplication = function (soundItself, soundName, actionBased, cancellingOldBackground//if you're changing scenes, the old one has to be killed
                                                , killSound)//Tied into followMe.soundLoading to stop all sounds, also for player death or leaving a level
    {
        soundName += ","//Make it a false list

        //Checks in case this is a first load to a level
        if (localStorage.getItem("volume") === null) {
            localStorage.setItem("volume", 1);
        }
        if (localStorage.getItem("effectsMute") === null) {
            localStorage.setItem("effectsMute", true);
        }

        if (actionBased === true)//a click or other action causes the sound
            //The duplication can happen here, one sound effect doesn't have to be finished for the other "pew-pew" to start per sa
        {
            controlSound(soundItself, killSound)
        }
        else {//scenery or bosses, including the background which is not directly going to "cancel" through an action, it loops until cancelled
            if ($.inArray(soundName, followMe.playingSounds) === -1)
                //The sound hasn't already been logged, let's continue and play it
            {
                controlSound(soundItself, killSound);
                soundItself.loop = true;
            }
            followMe.playingSounds.push(soundName)
            localStorage.setItem("playingSounds", followMe.playingSounds)
            //This should prevent duplications of sound [jQuery mobile], based on the above query
        }
    }

    function controlSound(sound, killSound)//For notification alerts too e.g.
    {
        if (killSound) {
            sound.pause();
        }
        else {
            sound.play()
            sound.volume = parseFloat(localStorage.getItem("volume"));
        }
    }


    followMe.soundsLoading = function () {//Built when a cut-scene changes or you press pause, all sounds should stop and be removed from memory
        localStorage.setItem("playingSounds", null);
        followMe.playingSounds = null;
    }

    //singular controls for different sounds - for muting START


   



    if (localStorage.getItem("effectsMute") === "true") {
        $("#effectsMute").prop("checked", "")
    }
    if (localStorage.getItem("effectsMute") === "false") {
        $("#effectsMute").prop("checked", "true")
    }


});

$(document).ready(function () {
    $("#effectsMute").on("click", function () {
        window.console.log(localStorage.getItem("effectsMute"))
        if (localStorage.getItem("effectsMute") === "true") {
            localStorage.setItem("effectsMute", "false")
        }
        else {
            localStorage.setItem("effectsMute", "true")
        }
    });
    $("#backgroundMute").click(function () {
        if ($("#backgroundMute").prop("checked")) {
            localStorage.setItem("backgroundMute", false);
        }
        else {
            localStorage.setItem("backgroundMute", true);
        }


        //backgroundMute(localStorage.getItem("backgroundMute"), false);
    })


    function backgroundMute(shouldWe, load) {
        if ($("#isGame").val() !== "no") {
            if (shouldWe === "true" || null) {
                followMe.soundTest.volume = 0;
            }
            else {
                $("#backgroundMute").prop("checked", true)
                followMe.destroySoundDuplication(followMe.soundTest, "background", false, false, false)
            }
        }
    }


    $("#gameVolume").val(parseFloat(localStorage.getItem("volume")) * 100)
    $("#gameVolume").change(function () {
        localStorage.setItem("volume", $("#gameVolume").val() / 100);
        backgroundMute(localStorage.getItem("backgroundMute"), true);
    })
    var shouldMute = localStorage.getItem("backgroundMute");


    backgroundMute(localStorage.getItem("backgroundMute"), true);
});