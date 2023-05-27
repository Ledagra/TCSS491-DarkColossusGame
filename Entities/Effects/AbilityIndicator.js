class AbilityIndicatorEffect {
    constructor(iconImage) {
        this.timerStart = 40;
        this.timer = this.timerStart;
        this.alpha = 1;
        this.x = params.HUD.x + 145;
        this.y = params.HUD.y + 650;
        this.iconImage = iconImage;
    }

    update() {
        this.timer--;
        if (this.timer <= 0) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.globalAlpha = this.timer / this.timerStart;
        ctx.drawImage(this.iconImage, this.x, this.y - (50 - this.timer/2) * 2, 130, 130);
        ctx.globalAlpha = 1;
    }
}