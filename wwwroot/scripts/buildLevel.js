$(function () {
    var countLocalObjects = 0;
    var numberx = 0;
    var numbery = 0;
    followMe.teleportPicture = -562;
    localStorage.setItem("fanHit", "00000")
    followMe.teleports = [];
    followMe.enemies = [];


    followMe.teleport = function (options) {
        var defaultValues =
        {
            world: 0,
            level: 0,
            x: 0,
            y: 0,
            maxx: 0,
            maxy: 0
        }
        $.extend(this, defaultValues, options);
    }

    //"replacepoint", "checkpoint" 
    followMe.imagesToPreload = [];
    followMe.addImage = function (url) {
        if ($.inArray(url, followMe.imagesToPreload) < 0) {
            followMe.imagesToPreload.push();
        }
        followMe.imagesToPreload.push(url)
    }
    followMe.animation = function (options) {
        var defaultValues =
        {
            url: false, width: 64, numberOfFrames: 2, currentFrame: 0, rate: 200, pace: 3,
            top: 100,
            id: ""
        };
        $.extend(this, defaultValues, options);
        if (this.url) {
            followMe.addImage(this.url)
        }
    };

    function addItemMessage(message, x, y, id) {
        var newmessage = $("<p>").css("left", (x * 64) + 64)
            .css("top", y * 64)
            .css("position", "absolute")
            .attr("id", "newmessage")
            .css("width", "64px")
            .css("border", "1px dashed black")
            .text(message)
            .attr("id", id + "message")
            .hide();
        return newmessage;
    }

    followMe.levelServicesDefined.on("addImageFromServer", function (serveranimation, type, username, canAccess, totalLevelToDo, playerDone, countGameObjects) {//last param specifically for teleports        
        countLocalObjects += 1;
        addGameObject(serveranimation);
        if (type === "surface" || type === "enemies" || type == "checkpoint") {
            createDisplayForInternalClass(serveranimation.systemId, type)
        }
        followMe.surfaces = getObjectsByType("surface");
        followMe.enemies = getObjectsByType("enemies");
        followMe.checkpoints = getObjectsByType("checkpoint");


        if (username === localStorage.getItem("username")) {
            if (type === "Items") {
                $(followMe.addImage2("readitem", "item", serveranimation, canAccess)
                    .appendTo($("#game")))
            }


            if (type === "teleports") {
                //alert("Total for level: " + totalLevelToDo + ", " + serveranimation.level + ", player has done: " + playerDone)
                $("range#" + serveranimation.level).remove();
                $("<progress title ='Detail in Options and Achievements' id='" + serveranimation.level + "' max='" + totalLevelToDo + "' value='" + playerDone + "' style='left:" + parseInt(parseInt((parseInt(serveranimation.x) * 64)) + 64) + "px;top:" + parseInt(parseInt((parseInt(serveranimation.y) * 64)) + 32) + "px;position:absolute;' class='xp'>").appendTo($("#game"));
            }

            if (whatToAdd !== false && type !== "surface" && type !== "enemies" && type !== "checkpoint") {
                var whatToAdd = followMe.addImage2(
                    false,
                    type,
                    serveranimation,
                    canAccess
                )
                $(whatToAdd.appendTo($("#game")))
            }
            if (type === "Items") {
                addItemMessage(
                    serveranimation.message,
                    serveranimation.x,
                    serveranimation.y,
                    $("." + type + ":last").attr("id"))
                    .appendTo($("#game"));
            }

            physicalDisplayAnimationForGameObject(serveranimation, serveranimation.systemId)

            if ((serveranimation.xend > 0 || serveranimation.yend > 0) && serveranimation.type !== "caves") {//&&( serveranimation.xend >0 || serveranimation.yend >0) ) {
                //1.13.1.4 extension made, surfaces can now move too
                //Method named changed from enemyIsAnimated, as surfaces etc. should be able to move too [dependent on difficulty in futures]
                followMe.animateObject(serveranimation.systemId, serveranimation.type)


            }
            if (type === "background" && serveranimation.inCave) {
                addDownloadKey(followMe.checkpoints[serveranimation.checkpoint]);
            }
            followMe.showCaveContents(false)
        }

        if (countLocalObjects === countGameObjects)//The final addition has taken place in addImage2
        {
            window.console.log("this is where the preloading UI would end")
        }
    })

    followMe.surfaces = [];
    followMe.caves = [];



    followMe.cave = function (options) {
        var defaultValues =
        {
            parentName: "notSet",
            height: "-1px",
            width: "-1px",
            xMove: -1,
            yMove: -1,
            entrance: false,
            x: 0,
            maxx: 0,
            y: 0,
            maxy: 0,
            isWall: false
        }
        $.extend(this, defaultValues, options);
    };


    followMe.addImage2 = function (isUpdate, type, object, hasAccess) {
        //64px restriction of size dividing        
        //hasAccess for teleport lock show

        var startFrame = (-64 * object.startFrame) + "px 0px";


        //Feb 14th, generic object declaration to override specific objects, then just use array filter to create followMe.surfaces e.g.

        if (type === "checkpoint") {

            startFrame = (-64 * object.startFrame) + "px -64px";


            var y = parseFloat(object.y * 64);
            var x = parseFloat(object.x * 64);
            if (object.heightY === 0) {
                object.heightY = 1
            }

            iduse = object.systemId


        }


        if (type === "checkpoint") {
            type = "background";


        }
        var url = "url('/images/spriteSheet.png')"

        if (isUpdate === "readitem") {
            startFrame = "0px 0px";
            url = "url('/images/spriteSheet.png')";
            classToUse = object.message + " " + "items"
            iduse = "";
        }

        var valueToAdd = 1
        var imageDefined = $("<aside>").css("backgroundImage", url)
            .css("left", object.x * 64 + "px")
            .css("top", object.y * 64 + "px")
            .css("width", (object.widthX * 64) + "px")
            .css("height", (object.heightY * 64) + "px")
            .css("position", "absolute")
            .css("marginLeft", "0px!important")
            .css("backgroundPosition", startFrame)
            .attr("id", object.systemId)
            .attr("class", type);

        if (object.caveName === null) {
            object.caveName = "";
        }

        //This is to deal with the fact that the original render thinks 0,0 is where to start
        //Due to default in followMe.Animation, as most likely object is surface
        //START

        if (type === "teleports") {
            y = parseFloat(object.y * 64);
            x = parseFloat(object.x * 64);
            imageDefined.css("backgroundPosition", (-64 * object.startFrame) + "px " + followMe.teleportPicture + "px")
            var identifier = object.level.substring(0, 1) + object.world
            imageDefined.attr("id", identifier);
            //alert(identifier)
            followMe.teleports[identifier] = new followMe.teleport({
                world: object.world,
                level: object.level,
                x: x,
                maxx: parseFloat(x + parseFloat(object.widthX * 64)),
                y: y,
                maxy: parseFloat(y + parseFloat(object.heightY * 64)),
                teleportAllowed: hasAccess,
                whyLocked: object.whyLocked
            });
            var teleportId = followMe.teleports[identifier];
            iduse = identifier
            if (hasAccess === false) {
                var teleportBlocked = $("<aside>")
                    .attr("id", (parseFloat(teleportId.x) - 64) + "_" + (parseFloat(teleportId.y) - 64)
                        + "-" + parseFloat(teleportId.maxx - 64) + "y"
                        + parseFloat(teleportId.maxy - 64))
                    .css("left", teleportId.x - 80).css("top", teleportId.y - 62).css("position", "absolute")
                    .css("backgroundPosition", "-256px " + followMe.teleportPicture + "px").css("height", "126px").css("width", "64px")
                    .attr("class", "background block").css("backgroundImage", url)
                    .css("position", "absolute")

                //should be OO surfaces soon
                $("#game").append(teleportBlocked);
            }
        }
        else {
            if (object.message !== null && type === "ITems") {
                imageDefined.css("backgroundPosition", (-64 * object.startFrame) + "px -384px")
            }
            if (isUpdate === "readitem") {
                imageDefined.css("backgroundPosition", "-128px -884px")
            }

            if (type === "caves") {

                var imageX = -320
                if (object.xMove !== undefined && object.xMove !== 0 && object.xMove < 4) {
                    imageX -= parseFloat(object.xMove * 32)
                }

                var imageY = -560
                if (object.yMove !== undefined && object.yMove !== 0 && object.yMove < 5) {
                    imageY -= parseFloat(object.yMove * 32)
                }

                imageDefined.css("backgroundPosition", imageX + "px " + imageY + "px").attr("id", "cave" + object.systemId)

                y = parseFloat(object.y * 64);
                x = parseFloat(object.x * 64);

                followMe.caves[object.systemId] = new followMe.cave({
                    caveName: object.caveName,
                    height: object.heightY * 64 + "px",
                    width: object.widthX * 64 + "px",
                    xMove: object.xMove,
                    yMove: object.yMove,
                    entrance: object.entrance,
                    x: x,
                    maxx: parseFloat(x + parseFloat(object.widthX * 64)),
                    y: y,
                    maxy: parseFloat(y + parseFloat(object.heightY * 64)),
                    isWall: object.caveWall,
                    isCeiling: object.caveCeiling
                });
            }
            if (type === "background" && (object.checkpoint !== "" || object.newLevel !== null)
            ) {
                imageDefined.addClass("checkpoint")
                imageDefined.css("backgroundPosition", (-64 * object.startFrame) + "px -64px")

                //if (object.inCave) {
                //    alert(imageDefined.css("backgroundPosition"))
                //}

            }
        }

        //Cave check - add the class if inCave
        if (object.inCave) {
            imageDefined.addClass("insideCave")
            imageDefined.addClass("caveName" + object.caveName)
        }

        if (type === "caves") {
            imageDefined.addClass("isCave " + object.caveName)
        }

        if ((object.inCave === false || object.inCave === undefined) && type !== "caves") {
            imageDefined.addClass("outsideCave")
            imageDefined.addClass("caveName")

        }


        //END

        if (type === "checkpoint" && object.checkpoint === localStorage.getItem("checkpoint")
            || isUpdate === "startpoint") {

            startFrame = (-64 * (object.startFrame + 1)) + "px -64px";
            imageDefined.css("backgroundPosition", startFrame)
        }


        if (isUpdate === "gameover") {
            window.console.log("game over");
        }
        if (object.inCave && type === "background") {


            //alert (imageDefined.css("backgroundPosition") + ", " + imageDefined.attr("id"))
        }
        if ($("#" + imageDefined.attr("id")).length > 0) {
            if (type !== "surface" || object.fan === "1") {
                $("#" + imageDefined.attr("id")).remove();
            }
        }

        if (stop === false || type !== "surface") {
            return imageDefined
        }
        else {
            return false;
        }


    }
        
    followMe.addSprite = function (parentId, divId, options) {
        options = $.extend({
            x: 0, y: 0, width: 64, height: 64
        }, options);
    }
    setFrame = function (divId, animation) {
        $("#" + divId).css("backgroundImage", "url('" + animation.url + "')");
        $("#" + divId).css("backgroundPosition", "-" + animation.currentFrame * animation.width + "px " + animation.spriteY + "px");
    };
    setSpeed = function (divId, animation, pace) {
        $("#" + divId).css("marginLeft", animation.pace * pace);
    }

    //DEFINE THE ITEMS
    var firstSprite = new followMe.animation(
        {
            url: '/Images/spriteSheet.png', numberOfFrames: 2, rate: 700

        });
    if ($("#isGame").val() !== "no") {
        setInterval(function () {
            var x = 1
            setFrame("spriteAlert", firstSprite);
            firstSprite.currentFrame = (firstSprite.currentFrame + 1) % firstSprite.numberOfFrames;
            setSpeed("spriteAlert", firstSprite, firstSprite.pace + 1);

        }, firstSprite.rate);

        if (followMe.helpRequest !== null) {
            window.console.log("help Request: " + followMe.helpRequest);
        }
        followMe.communityServices.start().then(function () {
            if ($("#isGame").val() === "yes") {
                //alert()

                $("button, a").off().on("click", function () {
                    followMe.communityServices.invoke("deleteOnlinePresence", followMe.players[1].username, followMe.helpRequest);
                })

                followMe.communityServices.invoke("checkLevelAttendanceForHelp",
                    $("#welcome").text(),
                    localStorage.getItem("username"),
                    true//For helper
                );
                if (followMe.helpRequest !== null) {//You're helping, let's tell the person that asked
                    followMe.communityServices.invoke("checkLevelAttendanceForHelp",
                        $("#welcome").text(),
                        followMe.helpUsername,
                        false
                    );
                }
            }
        })

        followMe.levelServicesDefined.start().then(function () {
            followMe.levelServicesDefined.invoke("getImages",
                $("#welcome").text(),
                localStorage.getItem("username"),
                followMe.helpUsername
            );


            followMe.levelServicesDefined.invoke("sendMessage", "test");
        });
    }

    function addDownloadKey(checkpointObject) {
        $("<p>" + checkpointObject.messageForKey + "</p>")
            .css("position", "absolute")
            .css("top", checkpointObject.y - 8)
            .css("left", checkpointObject.x + 20)
            .css("fontSize", "10pt")
            .attr("id", checkpointObject.identifier + "key")
            .appendTo($("#game"))
    }
    //1.13.1.4 extension made, surfaces can now move too
    //We'e dealing with the local objects now
    followMe.animateObject = function (iduse, objectName) {
        var object = followMe.enemies[iduse];
        var myY = 0;
        var myMaxY = 0;
        var myX = 0;
        var myMaxX = 0;
        var timeToMove = 500;
        switch (objectName) {
            case "surface":
                object = followMe.surfaces[iduse];
                myY = object.miny;
                myMaxY = object.maxy;
                myX = object.minx;
                myMaxX = object.maxx;
                timeToMove = 500;
                break;
            case "enemies":
                myY = object.y;
                myX = object.x;
                break;
        }
        var top = $("." + objectName + "#" + iduse).css("top")
        var left = $("." + objectName + "#" + iduse).css("left")
        left = left.substring(0, left.length - 2)
        var left2 = left
        var code = 65;
        var direction = "left"//could be an option in the future
        var x = object.xend
        var newleft2 = parseFloat(left) + 64 + "px"

        if (object.backToStartPoint) {
            setInterval(function () {
                //The loop is right, down, left, up
                if (object.xend > 0) {
                    moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, false);
                    window.console.log("right")
                }
                if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
                    moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, false);
                    window.console.log("down")
                }
                if (object.xend > 0) {
                    moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, true);
                    window.console.log("left")
                }
                if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
                    moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, true);
                    window.console.log("up")
                }
            }, 1000)
        }
        //sleep(500)
        //Not back to startpoint
        else {
            if (object.xend > 0) {
                moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, false);
            }
            if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
                moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, false);
            }
        }
    }

    //based on surface collection, set the max and min coordinates of the "surfaceAnimationCollection"
    function checksurfaceAnimationCollection(surfaces) {
        return surfaces.surfaceAnimationCollection === followMe.checkSurfaceAnimationCollection;
    }


    //27/01/18 code centralised for object animation looping, called above
    function moveObjectOnLoop(valueToLoop, top, left, object, iduse, objectName, timeToMove, code, myX, myY, isY, reverse) {
        for (var i = 0; i < valueToLoop; i++) {
            var newattribute = parseFloat(left) + 64 /** (i+1)*/ + "px";
            if (reverse) {
                newattribute = parseFloat(left) - 64 /** (i+1)*/ + "px"
            }
            var newattribute2 = newattribute.substring(0, newattribute.length - 2);
            var identifier = "." + objectName + "#" + iduse;
            var attributeToChange = "top";
            if (!isY) {
                attributeToChange = "left";
            }
            var animationProperties = {}; animationProperties[attributeToChange] = "+=64px";
            if (reverse) {
                animationProperties = {}; animationProperties[attributeToChange] = "-=64px";
            }


            $(identifier).animate(animationProperties,
                {
                    duration: timeToMove
                    ,
                    step: function (now, fx) {
                        switch (objectName) {
                            case "enemies":

                                if (!isY) {
                                    followMe.enemyDrop(code, fx.end, iduse, object.fly)
                                    followMe.enemies[iduse].x = fx.end;
                                }
                                if (isY) {
                                    followMe.enemies[iduse].y = fx.end;
                                }
                                followMe.enemyHurt(fx.end, iduse, object)

                                break;
                            case "surface":
                                object.miny = myY;
                                var playerObj = followMe.players[1];
                                if (!isY) {
                                    if (object.surfaceAnimationCollection !== "")//This should always be true for surfaces, we're in an animation collection, the min and max x forced by the overall width
                                    {
                                        //Got to make it wider for the matching to take place less harshly as they do if the surface isn't moving'
                                        followMe.checkSurfaceAnimationCollection = object.surfaceAnimationCollection;
                                        var arrayToModifyXCoords = followMe.surfaces.filter(checksurfaceAnimationCollection);
                                        //object.minx = arrayToModifyXCoords[0].minx;
                                        //object.maxx = arrayToModifyXCoords[arrayToModifyXCoords.length - 1].maxx
                                        if (reverse) {
                                            object.minx = fx.end;
                                            object.maxx = fx.end + 128;
                                        }
                                        else {
                                            object.minx = fx.end - 128;
                                            object.maxx = fx.end;
                                        }
                                    }


                                }
                                else {
                                    object.miny = fx.end
                                    object.maxy = fx.end + 64;
                                }
                                if (playerObj.currentSurfaceID === iduse) {
                                    iduse2 = iduse
                                    var realTop = $(iduse2).css("top");//will need to get the current x as it animates, so the player moves along
                                    var realLeft = $(iduse2).css("left");
                                    if (!isY) {
                                        followMe.x("player", realLeft.substring(0, realLeft.length - 2) - 10, true);
                                    }
                                    else {
                                        followMe.y("player", realTop.substring(0, realTop.length - 2) - 96, 0, true);//Set the physical here, the other one will just move when an animation ends
                                    }
                                }
                                break;
                        }
                        //Special behaviour is needed here, as they are "dynamic" objects that know where the floor is


                    }
                })
            if (!isY) {
                left = newattribute2;
            }
            else {
                top = newattribute2;
            }
        }
    }


    /* Detach a datepicker from its control.
     * @param  ID   int - the ID of the element from the server, to grab its object
     * @param type  string - the type of element to root the details from
     */
    function createDisplayForInternalClass(ID, type) {

        var obj = getObjectsByType(type)[ID]
        var imageDefined = $("<aside>")
            .css("left", obj.x + "px")
            .css("top", obj.y + "px")
            .css("width", obj.widthX + "px")
            .css("height", obj.heightY + "px")
            .css("position", "absolute")
            .css("marginLeft", "0px!important")
            .css("transform", "scaleX(1)") // so we can flip it's direction later
            .attr("id", obj.systemId)
            .attr("class", type);


        switch (type) {
            case "enemies":
                imageDefined.append("<progress class='standard' max='" + obj.maxHealth +
                    "' value='" + obj.maxHealth + "' min='0' style=position:absolute;width:" + obj.widthX + "px!important" + " />");
                imageDefined.css("backgroundImage", "url(".concat(getImageFileURL(type, obj.imageName)).concat(")"));
                break;
            case "checkpoint":
                imageDefined.attr("alt", obj.checkpoint);
                // console.log(obj.checkpoint);
            default:
                imageDefined.css("backgroundImage", "url('/images/spriteSheet.png')")
                    .css("backgroundPosition", obj.startFrame)
                break;
        }
        if (obj.fan === true) {
            //alert()
            imageDefined.css("backgroundPosition", (-64 * obj.startFrame) + "px " + followMe.imageDefintion.fan)
            imageDefined.css("top", (parseFloat(obj.y) - 2) * 64 + "px")
            imageDefined.css("height", "192px")
            imageDefined.attr("class", "surface fan")
        }
        imageDefined.appendTo($("#game"))
    };

    function physicalDisplayAnimationForGameObject(obj, iduse) {
        if (obj.animate === true) {
            var frameCount = parseFloat(obj.endFrame) - parseFloat(obj.startFrame)
            if (parseFloat(obj.checkpoint) === 0) { rateDefined = 200 }
            var animationDefined = new followMe.animation(
                {
                    url: "/images/spriteSheet.png", numberOfFrames: frameCount,
                    currentFrame: obj.startFrame, startFrame: obj.startFrame, spriteY: obj.spriteY * 64
                });
            window.console.log("vnorris-ad", animationDefined, obj);
            setInterval(function () {
                animationDefined.currentFrame += 1
                if (animationDefined.currentFrame - animationDefined.startFrame > animationDefined.numberOfFrames) {
                    animationDefined.currentFrame = animationDefined.startFrame
                }
                setFrame(iduse, animationDefined);

                setSpeed(iduse, animationDefined, animationDefined.pace + 1);
            }, animationDefined.rate)
        }
    }

});