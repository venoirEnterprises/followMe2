function getImageFileURL(type: string, imageName: string) {
    let extension = imageName == 'wheely' ? '.png' : '.gif' // all animations will be managed in separate code
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension)
}