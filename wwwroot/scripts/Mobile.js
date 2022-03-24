$("#game").on('pagebeforeshow ready', function () {



    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function () {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function (event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[0] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [data.pageX, data.pageY],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[0] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function (event) {
                            $this.unbind(touchMoveEvent, moveHandler);
                            if (start && stop) {
                                if (stop.time - start.time < 1000 &&
                                        Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                        Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                    start.origin
                                            .trigger("swipeupdown")
                                            .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                                }
                            }
                            start = stop = undefined;
                        });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function (event, sourceEvent) {
        $.event.special[event] = {
            setup: function () {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

    //DEBUGGING
    $("#collision").text("tilting?")
    localStorage.setItem("mobileCanMove", "reset")
    followMe.currentAlpha = 0;
    followMe.countTap = 0
    followMe.currentTap = "";
    followMe.direction = "0"
    //DEBUGGING

    $.event.special.tap.tapholdThreshold = 5000;

    if ($("#isGame").val() === "yes" && followMe.url.search("levelselect")) {
        $(document).off("tap").on("tap", function (e) {
            followMe.fireTheShot(e)                        
        })
        $(document).off("swipedown").on("swipedown", function () {
            followMe.moveUser(followMe.players[1].special);
        });
        $(document).off("swipeup").on("swipeup", function () {
            followMe.keyboard[followMe.direction] = true;
            followMe.moveUser(followMe.players[1].up);//If a direction is true, and so is up, it jumps
            followMe.keyboard[followMe.direction] = false;
            followMe.direction = "0"//They have to tilt to jump again
        });
        $(document).off("swipeleft").on("swipeleft", function () {
            followMe.moveUser(followMe.players[1].enter)
        });

        $(document).off("taphold").on("taphold", function () {//Time has to be changed manually [line 80]

            followMe.memServer.server.surrender(localStorage.getItem("username"));
            if (confirm("Do you want to surrender? Back to level select...")) {
                window.location = "../../Connect/LevelSelect"
            }
        });
    }


    if (window.DeviceOrientationEvent) {
        
        window.addEventListener('deviceorientation', function (eventData) {
            $("#collision").text("tilting? " + eventData.alpha)
            //- is right, + is left
            if (followMe.players[1] !== undefined) {
                var checkMove = eventData.alpha
                var canProcess = false;
                var direction = ""
                if (checkMove >= 5) {
                    direction = "left"
                    canProcess = true;
                    followMe.currentAlpha = eventData.alpha
                    followMe.direction = followMe.players[1].left;
                }

                if (checkMove <= -5) {
                    direction = "right";
                    canProcess = true;
                    followMe.currentAlpha = eventData.alpha
                    followMe.direction = followMe.players[1].right;
                }

                followMe.moveUser(direction);
                followMe.keyboard[followMe.direction] = false;
            }
            });
    }
    
});