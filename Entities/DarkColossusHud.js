class DarkColossusHud {

    constructor(boss) {
        this.boss = boss;
        this.bossMaxHealth = MAX_HEALTH;
        //create a timer to time the boss fight
        this.bossTimer = new Timer();
        this.bossTimer.gameTime = 0;
        this.bossTimer.totalTime = 0;

        this.previousSeconds = 0;

        // update the timer display every second
        setInterval(() => {
            this.bossTimer.gameTime += 1;
            //this.updateTimerDisplay();
        }, 1000);

    }

    draw(ctx) {
        //draw a big health bar at the top center of the screen
        let xCenter = CANVAS_WIDTH / 2;

        ctx.fillStyle = "red";
        ctx.fillRect(460, CANVAS_HEIGHT - 100, 1000, 20);
        ctx.fillStyle = "green";
        ctx.fillRect(460, CANVAS_HEIGHT - 100, (Math.max(this.boss.health,0) / this.bossMaxHealth) * 1000, 20);

        //Draw the boss name at the top center of the screen
        ctx.fillStyle = "white";
        ctx.font = "50px " + params.FONT
        let textWidth = ctx.measureText("Dark Colossus").width/2;
        ctx.fillText("Dark Colossus", xCenter - textWidth, CANVAS_HEIGHT - 120);

        //Draw the boss timer at the top center of the screen
        const minutes = Math.floor(this.bossTimer.gameTime / 60);
        const seconds = this.bossTimer.gameTime % 60;
        const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        ctx.font = "30px " + params.FONT
        textWidth = ctx.measureText(timerText).width/2;
        ctx.fillText(timerText, xCenter - textWidth, CANVAS_HEIGHT - 30);

        //Draw the boss phase at the top center of the  (was for testing)
        ctx.font = "30px Agency";
        textWidth = ctx.measureText("Phase: " + this.boss.state).width/2;
        //ctx.fillText("Phase: " + this.boss.state, xCenter - textWidth, CANVAS_HEIGHT - 60);
    }

    update() {
        const seconds = this.bossTimer.gameTime % 60;
        if (seconds % 10 === 0 && this.boss.state == PHASE_ONE && seconds != this.previousSeconds) {
            this.boss.state = PHASE_TWO;
            this.previousSeconds = seconds;
            let numberOfEnemies = Math.random() * 30 + 5;
            let enemiesAdded = [];

            for (let i = 0; i < numberOfEnemies; i++) {
                let spawnX = Math.random() * 2000 + player.x-1000;
                let spawnY = Math.random() * 600;
                enemiesAdded.push({x: spawnX, y: spawnY});
            }

            this.hordeFightManager = new HordeFightManager(enemiesAdded, player.x - 2000, player.x + 2000);

            gameEngine.addEntityFirst(this.hordeFightManager);

        } else if ( (this.boss.state == PHASE_TWO && this.boss.health == MAX_HEALTH) || (this.hordeFightManager != null && this.hordeFightManager.enemiesRemaining == 0)) {
            this.boss.state = PHASE_ONE;
            this.previousSeconds = seconds;
            this.hordeFightManager.removeFromWorld = true;
            this.hordeFightManager = null;
        } 

            //Win
        if (this.boss.health <= 0) {
            let minutes = Math.floor(this.bossTimer.gameTime / 60);
            let secs = this.bossTimer.gameTime % 60;
            let winTime = `${minutes}:${secs.toString().padStart(2, '0')}`;
            gameEngine.camera.winTime = winTime;
            gameEngine.camera.gameWin = true;
            console.log("You win!: " + winTime);
        }
    }
}