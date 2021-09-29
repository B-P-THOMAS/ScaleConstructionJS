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

        if (this.stopped || this.startTime < 0) {
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
        this.shapes.update(time, this.direction);
        this.bezel.update(time, this.direction);

        this.ctx.save();
        this.ctx.clearRect(0, 0, w, h);
        this.shapes.renderPieWedges(this.ctx);
        this.bezel.render(this.ctx);
        this.shapes.renderSpokesAndBlobs(this.ctx);
        this.ctx.restore();

        if (progress > this.animationLength) {
            this.startTime = timestamp;
            this.shapes.advanceScene();
            this.bezel.advanceScene();
            if (this.stopping) {
                this.stopped = true;
            }
        }

        requestAnimationFrame(this.doAnimation.bind(this));
    }

    clickBackwardContinuous() {
        console.dir("clickBackwardContinuous");
        compose.stopped = false;
        compose.stopping = false;
        compose.direction = -1;
    }

    clickBackwardOnce() {
        console.dir("clickBackwardOnce");
        compose.stopped = false;
        compose.stopping = true;
        compose.direction = -1;
    }

    clickStop() {
        console.dir("clickStop");
        compose.stopping = true;
    }

    clickForwardOnce() {
        console.dir("clickForwardOnce");
        compose.stopped = false;
        compose.stopping = true;
        compose.direction = +1;
    }

    clickForwardContinuous() {
        console.dir("clickForwardContinuous");
        compose.stopped = false;
        compose.stopping = false;
        compose.direction = +1;
    }

    constructor() {
        this.stopped = true;
        this.stopping = false;
        this.startTime = -1;
        this.animationLength = 2000; // Animation length in milliseconds
        this.direction = -1; // +1 clockwise, -1 counterclockwise

        this.ctx = document.getElementById('canvas').getContext('2d');
        this.bezel = new Bezel(this.ctx, this.direction);
        this.shapes = new CShapeCollection(this.ctx, this.bezel.radius, this.direction);

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
