///   <reference path="declareClasses.ts"/>

function faceSpriteToDirectionItMoves(id: string) {
    const matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
    const matches = $("#".concat(id)).css('transform').match(matrixRegex);
    //Flip the scaleX from 1 to -1 or vice versa to flip the object on the y-axis. transform though is a matrix e.g. 'matrix(1, 0, 0, 1, 0, 0)'. so matches[1] is the X flip
    $("#".concat(id)).css("transform", "scaleX(".concat((parseFloat(matches[1]) * -1).toString()).concat(")"))
}

//function animateObject(iduse, objectName) {    
//    var myY = 0;
//    var myMaxY = 0;
//    var myX = 0;
//    var myMaxX = 0;
//    var timeToMove = 500;
//    switch (objectName) {
//        case "surface":
//            var object = gameProperties.getSurface(iduse);
//            myY = object.miny;
//            myMaxY = object.maxy;
//            myX = object.minx;
//            myMaxX = object.maxx;
//            timeToMove = 500;
//            break;
//        case "enemies":
//            var object = gameProperties.getEnemy(iduse);
//            myY = object.y;
//            myX = object.x;
//            break;
//    }
//    var top = $("." + objectName + "#" + iduse).css("top")
//    var left = $("." + objectName + "#" + iduse).css("left")
//    left = left.substring(0, left.length - 2)
//    var left2 = left
//    var code = 65;
//    var direction = "left"//could be an option in the future
//    var x = object.xend
//    var newleft2 = parseFloat(left) + 64 + "px"

//    if (object.backToStartPoint) {
//        setInterval(function () {
//            //The loop is right, down, left, up


//            if (object.xend > 0) {
//                moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, false);
//            }
//            if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
//                moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, false);
//            }
//            if (object.xend > 0) {
//                moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, true);
//            }
//            if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
//                moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, true);
//            }
//        }, 1000)
//    }
//    //sleep(500)
//    //Not back to startpoint
//    else {
//        if (object.xend > 0) {
//            moveObjectOnLoop(object.xend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, false, false);
//        }
//        if (object.yend > 0 && (object.fly || objectName !== "enemies")) {
//            moveObjectOnLoop(object.yend, top, left, object, iduse, objectName, timeToMove, code, myX, myY, true, false);
//        }
//    }
//}

