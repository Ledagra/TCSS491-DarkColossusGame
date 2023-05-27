class Interactable {

    constructor(game, x, y, width, height, sprite, boundingBox, action) {
        Object.assign(this);
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.action = action;
        this.BB = boundingBox
        this.amplitude = 40;
        this.t = 0;
        this.brightness = 100;

    }

    draw(ctx) {
        this.t += 0.04;
        this.brightness = 100 + Math.sin(this.t) * this.amplitude;
        ctx.filter = `brightness(${this.brightness}%)`;
        ctx.drawImage(this.sprite, this.x-this.game.camera.x, this.y-this.game.camera.y, this.width, this.height);
        ctx.filter = "none";
        if (debug) ctx.strokeRect(this.BB.x-this.game.camera.x, this.BB.y-this.game.camera.y, this.BB.width, this.BB.height);
    
    }

    update() {
        if ((this.game.keys.KeyE || this.game.controllerButtonX_press) && !this.game.PAUSED) {
            if (this.BB.collide(player.BB)) {
                this.action();
            } 
        }
    }
}