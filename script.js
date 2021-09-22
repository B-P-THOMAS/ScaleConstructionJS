function CShape(radius, angle) {
    console.log("CShape constructor");

    this._fill = 'rgb(220, 220, 0)';
    var stroke = 'rgb(0, 0, 0)';

    this._radius = radius;
    this._angle = angle;
}

CShape.prototype.draw = function (ctx) {
    // Create the shape as a group
    //
    // this._group = createShape(GROUP);
    ctx.save();

    // var spoke = createShape(LINE, 15 - radius, 0, 0, 0);
    ctx.beginPath();
    ctx.moveTo(15 - radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // var spot = createShape(ELLIPSE, 0, 0, 20, 20);
    ctx.beginPath();
    ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
    ctx.stroke();

    // this._group.addChild(spoke);
    // this._group.addChild(spot);

    //this._group.setFill(_fill);
    //this._group.setStroke(stroke);
    //this._group.setStrokeWeight(2);

    ctx.restore();
}


function ShapeCollection(radius) {
    this._wantpausebehaviour = true;
    this._radius = radius;

    this._nsteps = [2, 2, 1, 2, 2, 2, 1]; // T T S T T T S
    this._nshapes = this._nsteps.length;
    this._selector = this._nshapes - 1;
    this._initialipause = 5;
    this._pause = this._initialpause;
    this._bezelselector = 0;

    this._shapes = []; //  = [this._nshapes];
    var currentangle = Math.PI * 3 / 2;

    for (var idx = 0; idx < this._nshapes; ++idx) {
        // The first blob to be placed is at the
        // 12 o'clock position on the circle:
        //
        var shape = new CShape(radius, currentangle);

        var deltaangle = this._nsteps[idx] * Math.PI / 6;
        currentangle = currentangle + deltaangle;
        this._shapes.push(shape);
    }

    console.log("CShapeCollection constructor");
    console.log(this._nshapes);
}

ShapeCollection.prototype.draw = function (ctx) {

    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    for (var idx = 0; idx < this._nshapes; ++idx) {

        let shape = this._shapes[idx];

        ctx.save();

        ctx.translate(w / 2, h / 2);
        ctx.rotate(shape._angle - angle);
        ctx.translate(_radius, 0);

        shape.draw(ctx);
        if (idx == 0) {
            shape.setFill(color(255, 100, 100));
        }

        ctx.restore();
        // _shapes.push(shape);
        // _shapes[idx] = shape;
    }
}

function drawDialface(ctx) {
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    ctx.save();

    ctx.translate(w / 2, h / 2);

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#325FA2';
    ctx.arc(0, 0, w / 2.5, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.restore();
}

let sc = new ShapeCollection(150);

function compose() {
    var ctx = document.getElementById('canvas').getContext('2d');

    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    drawDialface(ctx);
    sc.draw(ctx);

    ctx.restore();

    window.requestAnimationFrame(compose);
}

compose();
