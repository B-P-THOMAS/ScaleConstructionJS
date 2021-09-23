class CShape {
    constructor(radius, angle) {
        this.radius = radius;
        this.angle = angle;
    }

    addAngle(angle) {
        this.angle += angle;
        this.angle = this.angle % (2 * Math.PI);
    }

    render(ctx, time) {

        let width = ctx.canvas.width;
        let height = ctx.canvas.height;

        ctx.save();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#325FA2';
        ctx.fillStyle = '#ffffff';

        ctx.translate(width / 2, height / 2);
        ctx.rotate(this.angle + (time * Math.PI / 6));
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
}