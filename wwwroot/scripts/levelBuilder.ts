function getImageFileURL(type: string, imageName: string) {
    return '/images/'.concat(type).concat("_").concat(imageName).concat(".png")
}