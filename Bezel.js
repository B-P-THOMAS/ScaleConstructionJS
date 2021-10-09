class Bezel {
    constructor(ctx, direction, fgColor) {
        this.radius = ctx.canvas.width / 2.5
        this.angle = -Math.PI / 2;
        this.lasttime = 0;
        this.direction = direction; // +1 clockwise, -1 counterclockwise
        this.fgColor = fgColor; // array [r,g,b] e.g. [ 255, 100, 100 ]
    }

    render(ctx) {
        let w = ctx.canvas.width;
        let h = ctx.canvas.height;

        ctx.save();

        ctx.translate(w / 2, h / 2);

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';
        ctx.fillStyle = ctx.strokeStyle;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        // Blob indicates root of new scale.
        //
        ctx.rotate(this.angle);
        ctx.translate(this.radius + 30, 0);
        ctx.fillStyle = `rgb(${this.fgColor.toString()}`;

        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.restore();
    }

    update(time, direction) {
        let deltatime = time - this.lasttime;
        this.lasttime = time;

        this.angle += (this.direction * deltatime * 5 * Math.PI / 6);

        if (time == 0 && direction != 0 && this.direction != direction) {
            this.direction = direction;
        }

        if (this.angle < 0) {
            this.angle += Math.PI * 2;
        }

        if (this.angle > 2 * Math.PI) {
            this.angle %= (2 * Math.PI);
        }
    }

    advanceScene() {
        this.lasttime = 0;
    }
}