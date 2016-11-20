function getExampleImage(){

    return new Promise(function(resolve, reject){
        var img = new Image();
        img.onload = function(){
            resolve(this);
        };
        img.onerror = reject;
        img.src = 'img/example.png';
    });

}

function setupCanvas(image){

    return new Promise(function(resolve, reject){
        var $stage = $('.stage');
        var $canvas = $('<canvas></canvas>');

        //configure canvas
        $canvas.get(0).height = image.height;
        $canvas.get(0).width = image.width;
        $canvas.appendTo($stage);

        //add image
        var ctx = $canvas.get(0).getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);

        resolve([$canvas, ctx, image]);
    });

}