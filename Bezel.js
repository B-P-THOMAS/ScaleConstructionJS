class Bezel {
    constructor (ctx) {
        this.radius = ctx.canvas.width /2.5
    }

    render(ctx) {
        let w = ctx.canvas.width;
        let h = ctx.canvas.height;
    
        ctx.save();
    
        ctx.translate(w / 2, h / 2);
    
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#325FA2';
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.restore();    
    }
}