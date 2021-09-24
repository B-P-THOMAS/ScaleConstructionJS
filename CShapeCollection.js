class CShapeCollection {

    constructor(ctx, radius) {

        // The numbers in the steps array represent the intervals in a 
        // one-octave major scale:        
        //        *  T  T  S  T  T  T  S
        let steps = [2, 2, 1, 2, 2, 2, 1];

        this.angles = [];
        this.blobcolors = [];
        this.piesegmentcolors = [];
        this.selector = 6;
        this.lasttime = 0;
        this.radius = radius;

        let idx = 0;
        let angle = -Math.PI / 2;
        do {
            this.angles.push(angle);
            this.blobcolors.push('#ffffff');
            this.piesegmentcolors.push('#808080');
            angle += steps[idx] * (Math.PI / 6);
        } while (++idx < steps.length)
    }

    update(time) {
        let deltatime = time - this.lasttime;
        this.lasttime = time;

        // update the angles array.
        //
        this.angles[this.selector] -= (deltatime * Math.PI / 6);

        // update the colours we'll use to shade items in the layout
        //
        this.blobcolors[this.selector] = `rgb(${Math.floor(255 * time)},${Math.floor(255 * time)},255)`;

        this.piesegmentcolors[this.selector] = `rgb(255,${Math.floor(255 * time)},${Math.floor(255 * time)})`;
        let nextselector = this.selector - 1;
        if (nextselector < 0) {
            nextselector = this.piesegmentcolors.length - 1;
        }
        this.piesegmentcolors[nextselector] = `rgb(255,${Math.floor(255 - (255 * time))},${Math.floor(255 - (255 * time))})`;
    }

    renderSpokesAndBlobs(ctx) {
        for (let idx = 0; idx < this.angles.length; ++idx) {
            this.renderSpokeAndBlob(ctx, idx);
        }
    }

    renderSpokeAndBlob(ctx, idx) {
        let width = ctx.canvas.width;
        let height = ctx.canvas.height;

        let angle = this.angles[idx];

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';
        ctx.fillStyle = this.blobcolors[idx];

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

    renderPieWedges(ctx) {
        for (let idxstart = 0; idxstart < this.angles.length; ++idxstart) {
            let idxend = idxstart + 1;
            if (idxend == this.angles.length) {
                idxend = 0;
            }

            let width = ctx.canvas.width;
            let height = ctx.canvas.height;

            ctx.save();
            ctx.fillStyle = this.piesegmentcolors[idxstart];
            ctx.translate(width / 2, height / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            //ctx.arc(x,y,radius,startAngle,endAngle, anticlockwise); 
            ctx.arc(0, 0, this.radius, this.angles[idxstart], this.angles[idxend], false); // outer (filled)
            ctx.fill();
            ctx.restore();
        }
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