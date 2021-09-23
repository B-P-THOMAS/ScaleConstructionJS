class CShapeCollection {

    constructor(ctx, radius) {

        // The numbers in the steps array represent the intervals in a 
        // one-octave major scale:        
        //        *  T  T  S  T  T  T  S
        let steps = [2, 2, 1, 2, 2, 2, 1];

        this.selector = 6;
        this.angles = [];
        this.lasttime = 0;
        this.radius = radius;

        let idx = 0;
        let angle = -Math.PI / 2;
        do {
            this.angles.push(angle);
            angle += steps[idx] * (Math.PI / 6);
        } while (++idx < steps.length)
    }

    render(ctx, time) {
        let deltatime = time - this.lasttime;
        this.lasttime = time;

        this.angles[this.selector] -= (deltatime * Math.PI / 6);

        for (let idx = 0; idx < this.angles.length; ++idx) {
            this.renderSpokeAndBlob(ctx, this.angles[idx]);
        }
    }

    renderSpokeAndBlob(ctx, angle) {

        let width = ctx.canvas.width;
        let height = ctx.canvas.height;

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';
        ctx.fillStyle = '#ffffff';

        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        ctx.translate(this.radius, 0);

        ctx.beginPath();
        ctx.moveTo(10 - this.radius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    advanceScene() {
        this.selector += 3;
        this.lasttime = 0;
        this.selector = this.selector % this.angles.length;
        if (this.selector >= this.angles.length) {
            this.selector = 0;
        }
    }
}