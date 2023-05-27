class GrowthChaseManager {
    constructor() {
        this.chaseInProgress = false;
        this.growthChaser = new GrowthHazardStatic(300, GROUND_HEIGHT - 1000);
        this.growthChaser.width = this.growthChaser.width/2;
        this.growthChaser.height = this.growthChaser.height/1.3;
        this.speed = player.MAX_RUN*0.004;

        console.log("GrowthChaseManager created");
    }

    startChase() {
        if (player.x > 1000) {
            this.chaseInProgress = true;
            gameEngine.addEntityFirst(this.growthChaser);

            //hacky fix to make sure the HUD is always on top of the entities
            for (let i = 0; i < gameEngine.entities.length; i++) {
                if (gameEngine.entities[i] === params.HUD) {
                    gameEngine.entities.splice(i, 1);
                    break;
                }
            }
            gameEngine.addEntityFirst(params.HUD);
        } 
    }


    update() {
        this.startChase();
        if (this.chaseInProgress) {
            this.growthChaser.x += this.speed;
            this.growthChaser.y = player.y-800
        }
        console.log("chase in progress: " + this.chaseInProgress);
        console.log("player x: " + player.x);
    }



    draw(ctx) {
        //draw text that says run at the top of the screen
        if (this.chaseInProgress) {
            ctx.font = "100px " + params.FONT;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.globalAlpha = 0.9;
            ctx.fillText("RUN", CANVAS_WIDTH/2, 150);
            ctx.globalAlpha = 1;
        }
    }

}