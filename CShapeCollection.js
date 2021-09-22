class CShapeCollection {

    constructor(ctx, radius) {
        this.selector = 1;
        this.shapes = [];
        this.shapes.push(new CShape(radius, 2));
        this.shapes.push(new CShape(radius, 3));
        this.shapes.push(new CShape(radius, 4));
    }

    render(ctx, time) {
        for (let idx = 0; idx < this.shapes.length; ++idx) {
            let t = (idx == this.selector) ? time : 0;
            this.shapes[idx].render(ctx, t);
        }
    }

    advanceScene() {
        this.shapes[this.selector].addAngle(Math.PI / 6);
        this.selector++;
        if (this.selector >= this.shapes.length) {
            this.selector = 0;
        }
    }
}