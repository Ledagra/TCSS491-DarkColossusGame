class FloatingObject {

    constructor(x, y, width, height, amplitude, increment, message) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.amplitude = amplitude;
        this.increment = increment;
        this.message = message;
        this.t = 0;
    }

    update() {
        this.t += this.increment
    }

    draw(ctx) {
        ctx.font = "30px " + params.FONT;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.message, this.x - gameEngine.camera.x, this.y - gameEngine.camera.y + this.amplitude * Math.sin(this.t));

       // ctx.drawImage(this.sprite, this.x, this.y + this.amplitude * Math.sin(this.t), this.width, this.height);
    }
}