class DamageIndicator {
    constructor(x, y, damage) {
        Object.assign(this, { x, y, damage });
        this.timerStart = 20 + Math.pow(damage, 1.1);
        this.timer = this.timerStart;
        this.alpha = 1;
        this.randomOffset = 50;
        this.randomX = Math.random() * this.randomOffset - this.randomOffset*2;
        this.randomY = Math.random() * this.randomOffset/2 - this.randomOffset;

        //have font size expoenetially increase with damage
        this.fontSize = 40;//25 + (damage+1) + Math.pow(damage, 1.5);

    }

    update() {
        this.timer--;
        if (this.timer <= 0) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.font = "bold " + this.fontSize + "pt " + params.FONT;
        ctx.fillStyle = "white";
        ctx.globalAlpha = this.timer / this.timerStart;

        ctx.fillText(this.damage, this.x - gameEngine.camera.x - 4 + this.randomX, this.y - gameEngine.camera.y - 4 - (50 - this.timer/2) * 2 + this.randomY);
        ctx.globalAlpha = 1;

    }
}