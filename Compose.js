class Compose {


    // Thanks to https://easings.net/
    //
    easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    doAnimation(timestamp) {
        // Calculate animation progress
        var progress = 0;

        if (this.startTime < 0) {
            this.startTime = timestamp;
        } else {
            progress = timestamp - this.startTime;
        }
        // time is in the range [0.0, 1.0]
        //
        let time = progress / this.animationLength;
        time = Math.min(1, time);
        time = this.easeOutExpo(time);

        // Do animation ...
        let w = this.ctx.canvas.width;
        let h = this.ctx.canvas.height;
        this.shapes.update(time);
        this.bezel.update(time);

        this.ctx.save();
        this.ctx.clearRect(0, 0, w, h);
        this.shapes.renderPieWedges(this.ctx);
        this.bezel.render(this.ctx);
        this.shapes.renderSpokesAndBlobs(this.ctx);
        this.ctx.restore();

        requestAnimationFrame(this.doAnimation.bind(this));

        if (progress > this.animationLength) {
            this.startTime = timestamp;
            this.shapes.advanceScene();
            this.bezel.advanceScene();
        }
    }

    clickBackwardContinuous() {
        console.dir("clickBackwardContinuous");
    }

    clickBackwardOnce() {
        console.dir("clickBackwardOnce");
    }

    clickStop() {
        console.dir("clickStop");
    }

    clickForwardOnce() {
        console.dir("clickForwardOnce");
    }

    clickForwardContinuous() {
        console.dir("clickForwardContinuous");
    }

    constructor() {
        this.startTime = -1;
        this.animationLength = 2000; // Animation length in milliseconds

        this.ctx = document.getElementById('canvas').getContext('2d');
        this.bezel = new Bezel(this.ctx);
        this.shapes = new CShapeCollection(this.ctx, this.bezel.radius);

        document.getElementById("backward_continuous").addEventListener("click", this.clickBackwardContinuous);
        document.getElementById("backward_once").addEventListener("click", this.clickBackwardOnce);
        document.getElementById("stop").addEventListener("click", this.clickStop);
        document.getElementById("forward_once").addEventListener("click", this.clickForwardOnce);
        document.getElementById("forward_continuous").addEventListener("click", this.clickForwardContinuous);

        requestAnimationFrame(this.doAnimation.bind(this));
    }
}

// ####################################
//


// Start animation
//
let compose = new Compose();
