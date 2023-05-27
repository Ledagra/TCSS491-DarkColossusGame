class HordeFightManager {
    constructor(enemies, leftBound, rightBound) {

        this.enemies = enemies;
        this.enemyInstances = [];
        this.enemiesStartingCount = enemies.length;
        this.enemiesRemaining = enemies.length;
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.fightStarted = false;
        this.win = false;
        this.timeUntilRemoveFromWorld = 15;
        this.leftBoundGrowthHazard = new GrowthHazardStatic(this.leftBound, GROUND_HEIGHT-1500, GROWTH_HAZARD_TALL);
        this.rightBoundGrowthHazard = new GrowthHazardStatic(this.rightBound-200, GROUND_HEIGHT - 1500);

        //console log every enemy's x and y
        console.log("HordeFightManager created with " + this.enemies.length + " enemies");
        this.enemies.forEach(enemy => {
            console.log(enemy.x + ", " + enemy.y);
        });

    }

    onPlayerEnterHordeFight() {
        gameEngine.addEntityFirst(this.leftBoundGrowthHazard);
        gameEngine.addEntityFirst(this.rightBoundGrowthHazard);

        this.enemies.forEach(enemy => {
            if ( params.LEVEL_MODIFIER == REAPERS_ONLY || (params.LEVEL_MODIFIER != MOLECULES_ONLY && Math.random() < 0.5) ) {
                this.enemyInstances.push(new Reaper(gameEngine, enemy.x, enemy.y, 2));
                //hacky fix to make sure the HUD is always on top of the entities
                for (let i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i] === params.HUD) {
                        gameEngine.entities.splice(i, 1);
                        break;
                    }
                }
                gameEngine.addEntityFirst(this.enemyInstances[this.enemyInstances.length-1]);
                gameEngine.addEntityFirst(params.HUD);
            } else {
                this.enemyInstances.push(new Molecule(gameEngine, enemy.x, enemy.y, 2));
                for (let i = 0; i < gameEngine.entities.length; i++) {
                    if (gameEngine.entities[i] === params.HUD) {
                        gameEngine.entities.splice(i, 1);
                        break;
                    }
                }
                gameEngine.addEntityFirst(this.enemyInstances[this.enemyInstances.length-1]);
                gameEngine.addEntityFirst(params.HUD);

            }
        });
        this.fightStarted = true;

        
    }

    //check if any of the enemies are still alive, update enemiesRemaining
    updateEnemiesRemaining() {
        //remove dead enemies from the list
        for (let i = 0; i < this.enemyInstances.length; i++) {
            if (this.enemyInstances[i].removeFromWorld) {
                this.enemyInstances.splice(i, 1);
                i--;
            }
        }

        this.enemiesRemaining = this.enemyInstances.length;
    }

    //check if the player has won the fight
    checkWin() {
        if (this.enemiesRemaining == 0) {
            this.win = true;
            gameEngine.addEntityFirst(new DnaItemDrop(gameEngine, (this.leftBound + this.rightBound)/2, 600 ));
            for (let i = 0; i < this.enemiesStartingCount; i++) {
                let x = Math.random() * (this.rightBound-this.leftBound) + this.leftBound;
                let y = Math.random() * 200 + 500;
                gameEngine.addEntityFirst(new DarkEnergyItemDrop(gameEngine, x, y)); 
            }

            this.leftBoundGrowthHazard.removeFromWorld = true;
            this.rightBoundGrowthHazard.removeFromWorld = true;
        }
    }

    update() {
        if (player.x > this.leftBound + 400 && !this.fightStarted) {
            this.fightStarted = true;
            this.onPlayerEnterHordeFight();
        }

        if (this.fightStarted && !this.win) {
            this.updateEnemiesRemaining();
            this.checkWin();
        }

        if (this.win) {
            this.timeUntilRemoveFromWorld -= .1;
            if (this.timeUntilRemoveFromWorld <= 0) {
                this.removeFromWorld = true;
            }
        }

    }

    draw(ctx) {
        if (!this.fightStarted) return;

        if (this.win){
            ctx.font = "100px " + params.FONT;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("VANQUISHED", CANVAS_WIDTH/2, 150);
            return;
        }
        ctx.font = "100px " + params.FONT;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.9;
        ctx.fillText(this.enemiesRemaining + " LEFT", CANVAS_WIDTH/2, 150);
        ctx.globalAlpha = 1;
    }
}