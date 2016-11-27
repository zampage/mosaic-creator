var $canvas, ctx, originalImage, pixelData;

var mosaicWidth = 10;
var mosaicHeight = 10;

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
