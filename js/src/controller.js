var $canvas, ctx, originalImage, pixelData;

var mosaicWidth = 50;
var mosaicHeight = 50;

getExampleImage()
    .then(setupCanvas)
    .then(function(data){
        $canvas = data[0];
        ctx = data[1];
        originalImage = data[2];
    })
    .then(analyzeImage)
    .then(function(pd){
        pixelData = pd;
        return $canvas;
    })
    .then(setupCopyCanvas)
    .then(function(data){
        $copyCanvas = data[0];
        copyCtx = data[1];
        return pixelData;
    })
    .then(createMosaic)
    .catch(function(error){
        console.log(error);
    });

function createMosaic(data){

    _.each(data, function(d, idx){

        console.log(copyCtx, d);
        copyCtx.fillStyle = getColorString(d.rgb);
        copyCtx.fillRect(d.x, d.y, mosaicWidth, mosaicHeight);

    });

}

function analyzeImage(){

    return new Promise(function(resolve, reject){

        var canvasWidth = $canvas.get(0).width;
        var canvasHeight = $canvas.get(0).height;

        var pixelData = [];

        for(var x = 0; x < canvasWidth; x += mosaicWidth){

            for(var y = 0; y < canvasHeight; y += mosaicHeight){

                var data = ctx.getImageData(x, y, mosaicWidth, mosaicHeight).data;

                var colors = _.groupBy(data, function(ele, idx){
                    return Math.floor(idx/4);
                });

                var averageColor = {
                    x: x,
                    y: y,
                    rgb: {r: 0, g: 0, b: 0}
                };
                colors = _.toArray(colors);
                _.each(colors, function(color, idx){
                    averageColor.rgb.r += color[0];
                    averageColor.rgb.g += color[1];
                    averageColor.rgb.b += color[2];
                });
                averageColor.rgb.r = Math.floor(averageColor.rgb.r / colors.length);
                averageColor.rgb.g = Math.floor(averageColor.rgb.g / colors.length);
                averageColor.rgb.b = Math.floor(averageColor.rgb.b / colors.length);

                pixelData.push(averageColor);

            }

        }

        /*
        $colorchecker = $('.colorchecker');
        $empty = $('<p></p>');
        _.each(pixelData, function(element, idx){
            $empty.clone().text(idx).css('backgroundColor', getColorString(element.rgb)).appendTo($colorchecker);
        });
        */

        resolve(pixelData);

    });
}