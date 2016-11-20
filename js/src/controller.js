var $canvas, ctx, originalImage;

getExampleImage()
    .then(setupCanvas)
    .then(function(data){
        $canvas = data[0];
        ctx = data[1];
        originalImage = data[2];
    })
    .catch(function(error){
        console.log(error);
    });

