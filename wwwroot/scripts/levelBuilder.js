function getImageFileURL(type, imageName, animate) {
    var extension = animate ? '.gif' : '.png'; // all animations managed separately
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension);
}
//# sourceMappingURL=levelBuilder.js.map