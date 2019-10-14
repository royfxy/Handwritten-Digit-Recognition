function getImageData() {
    const imageCanvas = document.getElementById("sketcher-image")
    originalDots = imageCanvas.getContext("2d").getImageData(0, 0, 50, 50).data
    var top_index, left_index, bottom_index, right_index
    topLoop:
        for (i = 0; i < 50; i++) {
            for (j = 0; j < 200; j++) {
                if (originalDots[i * 200 + j] != 0) {
                    top_index = i
                        // console.log(i, j)
                    break topLoop
                }
            }
        }

    bottomLoop:
        for (i = 49; i >= 0; i--) {
            for (j = 0; j < 200; j++) {
                if (originalDots[i * 200 + j] != 0) {
                    bottom_index = i + 1
                        // console.log(i, j)
                    break bottomLoop
                }
            }
        }

    rightLoop:
        for (i = 0; i < 200; i += 4) {
            for (j = 0; j < 50; j++) {
                if (originalDots[i + j * 200] != 0) {
                    left_index = i
                        // console.log(i, j)
                    break rightLoop
                }
            }
        }

    leftLoop:
        for (i = 196; i >= 0; i -= 4) {
            for (j = 0; j < 50; j++) {
                if (originalDots[i + j * 200] != 0) {
                    right_index = i + 4
                        // console.log(i, j)
                    break leftLoop
                }
            }
        }

    // console.log(top_index, left_index, bottom_index, right_index)

    width = (right_index - left_index) / 4
    height = bottom_index - top_index

    var slicedDots = new Array
    imgSize = Math.max(width, height) * 1.3
    whiteSpaceV = Math.round((imgSize - height) / 2)
    whiteSpaceH = Math.round((imgSize - width) / 2) * 4

    for (i = 0; i < whiteSpaceV; i++) {
        for (j = 0; j < (whiteSpaceH * 2 + width * 4); j++) {
            slicedDots.push(0)
        }
    }

    for (i = top_index; i < bottom_index; i++) {
        for (j = 0; j < whiteSpaceH; j++) {
            slicedDots.push(0)
        }
        for (j = left_index; j < right_index; j++) {

            slicedDots.push(originalDots[i * 200 + j])
        }
        for (j = 0; j < whiteSpaceH; j++) {
            slicedDots.push(0)
        }
    }

    for (i = 0; i < whiteSpaceV; i++) {
        for (j = 0; j < (whiteSpaceH * 2 + width * 4); j++) {
            slicedDots.push(0)
        }
    }

    return {
        width: (whiteSpaceH * 2 + width * 4) / 4,
        height: whiteSpaceV * 2 + height,
        data: slicedDots
    }
}

function centralizeImage() {
    const imageCanvas = document.getElementById("sketcher-image")

    sliced_image_data = getImageData()

    imageDataArray = Uint8ClampedArray.from(sliced_image_data.data)

    imageData = new ImageData(imageDataArray, sliced_image_data.width, sliced_image_data.height)


    imageCanvas.getContext("2d").clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    imageCanvas.width = sliced_image_data.width
    imageCanvas.height = sliced_image_data.height
    imageCanvas.getContext("2d").putImageData(imageData, 0, 0);

}

function normalize() {
    const imageCanvas = document.getElementById("sketcher-image")
    dots = imageCanvas.getContext("2d").getImageData(0, 0, 28, 28).data
    data = new Array()
    for (i = 0; i < 28; i++) {
        data.push([])
        for (j = 0; j < 28; j++) {
            data[i].push([dots[i * 112 + j * 4 + 3] / 255])
        }
    }
    return [data]

}