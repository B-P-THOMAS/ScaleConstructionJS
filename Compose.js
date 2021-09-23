var startTime = -1;
var animationLength = 1000; // Animation length in milliseconds

let ctx = document.getElementById('canvas').getContext('2d');
let bezel = new Bezel(ctx);
let shapes = new CShapeCollection(ctx, bezel.radius);

// Thanks to https://easings.net/
//
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

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
    time = easeOutExpo(time);

    // Do animation ...
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    bezel.render(ctx);
    shapes.render(ctx, time);
    ctx.restore();

    requestAnimationFrame(doAnimation);

    if (progress > animationLength) {
        startTime = timestamp;
        shapes.advanceScene();
    }
}

// Start animation
requestAnimationFrame(doAnimation);