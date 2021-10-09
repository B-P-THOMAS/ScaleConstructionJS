class CShapeCollection {

    constructor(ctx, radius, direction, fgColor, strokeColor) {

        // The numbers in the steps array represent the intervals in a 
        // one-octave major scale:        
        //        *  T  T  S  T  T  T  S
        let steps = [2, 2, 1, 2, 2, 2, 1];

        this.angles = [];
        this.blobcolors = [];
        this.piesegmentcolors = [];
        this.direction = direction; // +1 for clockwise, -1 for counterclockwise
        this.selector = (this.direction > 0) ? 6 : 3;
        this.lasttime = 0;
        this.radius = radius;
        this.fgColor = fgColor; // [r,g,b]
        this.bgColor = [0xff, 0xff, 0xff];
        this.strokeColor = strokeColor;

        let idx = 0;
        let angle = -Math.PI / 2;
        do {
            let piesegmentcolor = this.fgColor;
            this.angles.push(angle);
            this.blobcolors.push(this.bgColor);
            if (steps[idx] == 2) {
                piesegmentcolor = this.bgColor;
            }
            this.piesegmentcolors.push(piesegmentcolor);
            angle += steps[idx] * (Math.PI / 6);
        } while (++idx < steps.length)
    }

    piesegmentcolor(time) {
        if (this.direction < 0) {
            time = 1 - time;
        }
        let rval = this.fgColor[0] + time * (this.bgColor[0] - this.fgColor[0]);
        let gval = this.fgColor[1] + time * (this.bgColor[1] - this.fgColor[1]);
        let bval = this.fgColor[2] + time * (this.bgColor[2] - this.fgColor[2]);
        // return `rgb(${rval},${gval},${bval})`;
        return [rval, gval, bval];
        // return `rgb(255,${Math.floor(255 * time)},${Math.floor(255 * time)})`;
    }

    update(time, direction) {
        let deltatime = time - this.lasttime;
        this.lasttime = time;

        if (deltatime == 0 && direction != 0 && this.direction != direction) {
            this.direction = direction;
            this.advanceScene();
        }

        // update the angles array.
        //
        this.angles[this.selector] -= (this.direction * deltatime * Math.PI / 6);
        this.angles[this.selector] %= (Math.PI * 2);

        // update the colours we'll use to shade items in the layout
        //
        // this.blobcolors[this.selector] = `rgb(${Math.floor(255 * time)},${Math.floor(255 * time)},0)`;

        this.piesegmentcolors[this.selector] = this.piesegmentcolor(time);
        let nextselector = this.selector - 1;
        if (nextselector < 0) {
            nextselector = this.piesegmentcolors.length - 1;
        }
        nextselector = nextselector % this.piesegmentcolors.length;
        this.piesegmentcolors[nextselector] = this.piesegmentcolor(1 - time);
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
        ctx.strokeStyle = `rgb(${this.strokeColor.toString()})`;
        ctx.fillStyle = `rgb(${this.blobcolors[idx].toString()})`;

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
            ctx.fillStyle = `rgb(${this.piesegmentcolors[idxstart].toString()})`;
            ctx.translate(width / 2, height / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, this.radius, this.angles[idxstart], this.angles[idxend], false); // outer (filled)
            ctx.fill();
            ctx.restore();
        }
    }

    advanceScene() {
        this.selector += 3 * this.direction;
        if (this.selector < 0) {
            this.selector += this.angles.length;
        }
        this.lasttime = 0;
        this.selector = this.selector % this.angles.length;
        if (this.selector >= this.angles.length) {
            this.selector = 0;
        }
    }
}