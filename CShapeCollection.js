class CShapeCollection {

    // In total there are 12 steps, one per semitone.
    //
    steps = [2, 2, 1, 2, 2, 2, 1];

    constructor(ctx, radius) {
        this.selector = 6;
        this.shapes = [];

        let idx = 0;
        let angle = -Math.PI / 2;
        do {
            console.log(angle);
            this.shapes.push(new CShape(radius, angle));
            angle += this.steps[idx] * (Math.PI / 6);
        } while (++idx < this.steps.length)
    }

    render(ctx, time) {
        for (let idx = 0; idx < this.shapes.length; ++idx) {
            let t = (idx == this.selector) ? -time : 0;
            this.shapes[idx].render(ctx, t);
        }
    }

    advanceScene() {
        this.shapes[this.selector].addAngle(Math.PI / -6);
        this.selector += 3;
        this.selector = this.selector % this.shapes.length;
        if (this.selector >= this.shapes.length) {
            this.selector = 0;
        }
    }
}