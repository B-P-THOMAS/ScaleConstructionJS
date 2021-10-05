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
            if (this.actions.length > 0) {
                let action = this.actions.shift();
                if (action.direction != undefined) {
                    this.direction = action.direction
                }
                if (action.stopped != undefined) {
                    this.stopped = action.stopped;
                }
                if (action.continuous != undefined) {
                    this.stopping = !action.continuous;
                }

            }
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
        let action = {
                command: 1,
                stopped: false,
                direction: -1,
                continuous: true,
            }
            // If there's already a continuous action in the queue don't add a duplicate.
            //
        if (compose.actions.length > 0) {
            let obj = compose.actions.shift();
            if (obj.command != action.command) {
                compose.actions.push(obj);
            }
        }
        compose.actions.push(action);

        if (compose.direction != action.direction) {
            compose.stopping = true;
        }
    }

    clickBackwardOnce() {
        console.dir("clickBackwardOnce");
        let action = {
            command: 2,
            stopped: false,
            direction: -1,
            continuous: false,
        }
        compose.stopping = true;
        compose.actions.push(action);
    }

    clickStop() {
        console.dir("clickStop");
        // This action is instantaneous not queued.
        //
        compose.stopping = true;
    }

    clickForwardOnce() {
        console.dir("clickForwardOnce");
        let action = {
            command: 3,
            stopped: false,
            direction: +1,
            continuous: false,
        }
        compose.stopping = true;
        compose.actions.push(action);
    }

    clickForwardContinuous() {
        console.dir("clickForwardContinuous");
        let action = {
            command: 4,
            stopped: false,
            stopping: false,
            direction: +1,
            continuous: true,
        }

        // If there's already a continuous action in the queue don't add a duplicate.
        //
        if (compose.actions.length > 0) {
            let obj = compose.actions.shift();
            if (obj.command != action.command) {
                compose.actions.push(obj);
            }
        }
        compose.actions.push(action);

        if (compose.direction != action.direction) {
            compose.stopping = true;
        }
    }

    speedSetting(item) {
        //
        // At slider value 1 the animation length is 10000ms
        // at slider value 50 the length is 1000ms
        // and at value 100 the length is 100ms
        // So I use y = mx + c to start with the slider x value and
        // calculate a y value between 2 and 4, and then calculate 10 ^ y
        //
        let m = 1 / 49.5;
        let c = 4 + m;
        let x = item.target.value;
        let y = (-m * x) + c;
        let ms = Math.pow(10, y);
        compose.animationLength = ms;
    }

    constructor() {
        this.actions = []; // queue the button clicks
        this.stopped = true;
        this.stopping = false;
        this.startTime = -1;
        this.animationLength = 1000; // Animation length in milliseconds
        this.direction = -1; // +1 clockwise, -1 counterclockwise

        this.ctx = document.getElementById('canvas').getContext('2d');
        this.bezel = new Bezel(this.ctx, this.direction);
        this.shapes = new CShapeCollection(this.ctx, this.bezel.radius, this.direction);

        document.getElementById("backward_continuous").addEventListener("click", this.clickBackwardContinuous);
        document.getElementById("backward_once").addEventListener("click", this.clickBackwardOnce);
        document.getElementById("stop").addEventListener("click", this.clickStop);
        document.getElementById("forward_once").addEventListener("click", this.clickForwardOnce);
        document.getElementById("forward_continuous").addEventListener("click", this.clickForwardContinuous);

        document.getElementById("speed_slider").addEventListener("change", this.speedSetting);


        requestAnimationFrame(this.doAnimation.bind(this));
    }
}

// Start animation
//
let compose = new Compose();