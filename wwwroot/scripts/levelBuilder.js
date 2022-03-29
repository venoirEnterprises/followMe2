function getImageFileURL(type, imageName) {
    var extension = imageName == 'flight' ? '.gif' : '.png'; // all animations will be managed in separate code
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension);
    //return 'https://media1.giphy.com/media/WU0d55LjcutnDx1RBy/giphy.gif';
}
//# sourceMappingURL=levelBuilder.js.map