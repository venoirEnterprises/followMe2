function getImageFileURL(type, imageName, animate) {
    var extension = animate ? '.gif' : '.png'; // all animations will be managed in separate code
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension);
}
//# sourceMappingURL=levelBuilder.js.map