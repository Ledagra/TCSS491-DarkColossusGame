class GrowthHazard {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        if (size == GROWTH_HAZARD_SHORT) {  
            this.image = ASSET_MANAGER.getAsset("./Sprites/LevelAssets/Hazards/hazard_growth_short.png")     
            this.width = 256;
            this.height = 256;
            this.frameCount = 7;
        } else if (size == GROWTH_HAZARD_TALL) {
            this.image = ASSET_MANAGER.getAsset("./Sprites/LevelAssets/Hazards/hazard_growth_tall.png")
            this.width = 256;
            this.height = 512;
            this.frameCount = 9;
        }
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.animation = new Animator(this.image, 0, 0, this.width, this.height, this.frameCount, 0.1, 0, true);
    }

    update() {
        if (this.BB.collide(player.BB)) {
            player.velocity.x *= -1;
            if (player.currentIFrameTimer <= 0){
                player.health--;
                player.currentIFrameTimer = player.maxIFrameTimer;
            }
        }

        this.updateBB();

    }

    updateBB() {
        if (this.animation.currentFrame() < this.frameCount/2)
            this.BB = new BoundingBox(this.x, this.y*1.8, this.width, this.height/2.3);
        else
            this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }


    draw(ctx) {
        this.animation.drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x, this.y - gameEngine.camera.y, 1);

        if (debug){
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - gameEngine.camera.x, this.BB.y - gameEngine.camera.y, this.BB.width, this.BB.height);
        }
    }
}
const GROWTH_HAZARD_SHORT = 0;
const GROWTH_HAZARD_TALL = 1;