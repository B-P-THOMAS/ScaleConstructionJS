var startTime = -1;
var animationLength = 500; // Animation length in milliseconds

let ctx = document.getElementById('canvas').getContext('2d');
let bezel = new Bezel(ctx);
let shapes = new CShapeCollection(ctx, bezel.radius);

function doAnimation(timestamp) {
    // Calculate animation progress
    var progress = 0;

    if (startTime < 0) {
        startTime = timestamp;
    } else {
        progress = timestamp - startTime;
    }
    // time is in the range [0.0, 1.0]
    //
    let time = progress / animationLength;
    // console.log(time);

    // Do animation ...
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    bezel.render(ctx);
    shapes.render(ctx, time);
    ctx.restore();

//    if (progress < animationLength) {
        requestAnimationFrame(doAnimation);
//    }
    if (progress > animationLength) {
        startTime = timestamp;
        shapes.advanceScene();
    }
}

// Start animation
requestAnimationFrame(doAnimation);