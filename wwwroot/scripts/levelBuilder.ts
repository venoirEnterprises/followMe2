function getImageFileURL(type: string, imageName: string, animate: boolean) {
    let extension = animate ? '.gif' : '.png' // all animations managed separately
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension)
}