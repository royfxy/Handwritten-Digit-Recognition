$(document).ready(function() {
    adjust_size()
    $(window).resize(function() {
        adjust_size()
    });

    $(".refresh-button").click(function() {
        $(".refresh-button").prop('disabled', true)
        $(".media-button").prop('disabled', true)
        $(".media-button-icon").css("opacity", 0.1)
        sketcher.clear()
        updateResult(10)
        predict_num = 10
        $.each($(".predictions-container td"), function(index, elem) {
            $(elem).text((0).toFixed(1) + "%")
        })
    });

    $("#audio-button").click(function() {
        document.getElementById("num-audio").play()
    })

    $("#video-button").click(function() {
        if (predict_num != 10) {
            window.open(num_video[predict_num], "_blank");
        }
    })
});

const canvas = document.getElementById("mySketcher")
const imageCanvas = document.getElementById("sketcher-image")

const ChineseNumber = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', "空"]
const ChineseTradition = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '空']
const ArabNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Ø']
const EnglishNumber = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Null']
const audio_herf = ["../audio/zero.mp3", "../audio/one.mp3", "../audio/two.mp3", "../audio/three.mp3", "../audio/four.mp3", "../audio/five.mp3", "../audio/six.mp3", "../audio/seven.mp3", "../audio/eight.mp3", "../audio/nine.mp3", ""]
const num_video = ["https://www.youtube.com/watch?v=agDvqwfysCc", "https://www.youtube.com/watch?v=GTsVPCgRh2Y", "https://www.youtube.com/watch?v=8RkcPG_y5X8", "https://www.youtube.com/watch?v=0VpVeWqV3U0", "https://www.youtube.com/watch?v=YZYmJQjFjFY", "https://www.youtube.com/watch?v=c79AEDPaIKg", "https://www.youtube.com/watch?v=NrJPONNcO3E", "https://www.youtube.com/watch?v=dxlW1DaQc9Q", "https://www.youtube.com/watch?v=clxs4aNyQ3o", "https://www.youtube.com/watch?v=quGYozHZzyo", ""]

predict_num = 10

function adjust_size() {
    discriptionHeight = parseFloat($(".description").css("height"))
    $(".description").css("padding", discriptionHeight * 0.05);
    $(".name-container").css("font-size", discriptionHeight * 0.08)
    $(".pred-result-prob").css("font-size", discriptionHeight * 0.04)
}

/**
 * 函数节流方法
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @return Function 延迟执行的方法
 */
var throttle = function(fn, delay) {
    var timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn();
        }, delay);
    }
};

/**
 * 求一维数组最小项的下标
 * @param Array a 
 */
function indexOfMax(a) {
    return a.indexOf(Math.max.apply(Math, a));
}

function updateResult(num) {
    document.getElementById("number-zh-simp").innerHTML = ChineseNumber[num]
    document.getElementById("number-zh-trad").innerHTML = ChineseTradition[num]
    document.getElementById("number-digit").innerHTML = ArabNumber[num]
    document.getElementById("number-en").innerHTML = EnglishNumber[num]
    $("#num-audio").attr('src', audio_herf[num]);
}

bodyWidth = document.body.clientWidth
bodyHeight = document.body.clientHeight
sketcherSize = 0

if (bodyWidth < bodyHeight) {
    sketcherSize = Math.min(bodyWidth * 0.8, bodyHeight * 0.4)
} else {
    sketcherSize = Math.min(bodyWidth * 0.4, bodyHeight * 0.8)
}

var sketcher = atrament('#mySketcher', sketcherSize, sketcherSize, "#03a9f4");
sketcher.weight = sketcherSize / 22;
sketcher.smoothing = false;

canvas.addEventListener('dirty', throttle(e => {
    if (sketcher.dirty) {
        image = new Image
        image.src = sketcher.toImage()
        image.onload = function() {
            $(".refresh-button").prop('disabled', false);
            imageCanvas.getContext("2d").clearRect(0, 0, imageCanvas.width, imageCanvas.height)
            imageCanvas.width = 50
            imageCanvas.height = 50
            imageCanvas.getContext("2d").drawImage(image, 0, 0, 50, 50);
            centralizeImage()
            centralizedImage = new Image
            centralizedImage.src = imageCanvas.toDataURL()
            centralizedImage.onload = function() {
                imageCanvas.getContext("2d").clearRect(0, 0, imageCanvas.width, imageCanvas.height)
                imageCanvas.width = 28
                imageCanvas.height = 28
                imageCanvas.getContext("2d").drawImage(centralizedImage, 0, 0, 28, 28)
                data = tf.tensor(normalize())
                model.predict(data).array().then(e => {
                    predict_num = indexOfMax(e[0])
                    updateResult(predict_num)
                    $.each($(".predictions-container td"), function(index, elem) {
                        $(elem).text((e[0][index] * 100).toFixed(1) + "%")
                    })
                    $(".media-button").prop('disabled', false)
                    $(".media-button-icon").css("opacity", 1)
                })
            }
        }
    }


}, 1000))