class Portal {

    constructor(game, x, y, sceneManager) {
        this.game = game;
        this.sceneManager = sceneManager;
        this.width = 364;
        this.height = 364;
        this.x = x;
        this.y = y;
        this.levelModifier = Math.min(Math.floor(Math.random() * 11), 10);
        this.levelModifierText = getLevelModifierText(this.levelModifier);

        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.animation = new Animator(ASSET_MANAGER.getAsset("./Sprites/LevelAssets/portal.png"), 0, 0, 364, 364, 4, 0.2, false, true);
    }

    draw(ctx) {

        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 1);
        //draw the bounding box
        ctx.strokeStyle = 'Red';
       // ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        //draw above the portal the name of the modifed level i.e. "No Reapers"
        ctx.font = "30px " + params.FONT
        ctx.fillStyle = "white";
        //align text to center of portal
        ctx.textAlign = "center";
        //measure text width
        let textWidth = ctx.measureText(this.levelModifierText).width;
        if (params.LEVEL != 0 && this.levelModifier >= 0) ctx.fillText(this.levelModifierText, this.x + textWidth/2 - this.game.camera.x, this.y - this.game.camera.y - 50);
        if (this.levelModifier < 0) ctx.fillText(this.levelModifierText, this.x - this.game.camera.x + textWidth/2, this.y - this.game.camera.y - 50);

    }

    update() {

        if ((this.game.keys.KeyE || this.game.controllerButtonX) && this.BB.collide(player.BB)) {
            currentLevelModifier = this.levelModifier;

            if (this.levelModifier == -2) {
                this.game.camera.loadBoss();
            } else if (this.levelModifier >= 0) {
                this.game.camera.loadLevel();
            } else {
                this.game.camera.loadHub();
            }
        }
    }
}