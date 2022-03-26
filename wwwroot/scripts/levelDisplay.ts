///   <reference path="declareClasses.ts"/>

function faceSpriteToDirectionItMoves(id: string, faceLeft: boolean) {
    const direction = faceLeft ? '-1' : '1';
    const matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
    const matches = $("#".concat(id)).css('transform').match(matrixRegex);
    //Flip the scaleX from 1 to -1 or vice versa to flip the object on the y-axis. transform though is a matrix e.g. 'matrix(1, 0, 0, 1, 0, 0)'. so matches[1] is the X flip
    $("#".concat(id)).css("transform", "scaleX(".concat(direction).concat(")"))
}