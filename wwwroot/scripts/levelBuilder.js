function getImageFileURL(type, imageName) {
    var extension = imageName == 'wheely' ? '.png' : '.gif'; // all animations will be managed in separate code
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension);
}
//# sourceMappingURL=levelBuilder.js.map