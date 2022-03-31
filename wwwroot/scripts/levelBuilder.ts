function getImageFileURL(type: string, imageName: string, animate: boolean) {
    let extension = animate ? '.gif' : '.png' // all animations will be managed in separate code
    return '/images/'.concat(type).concat("_").concat(imageName).concat(extension)
}