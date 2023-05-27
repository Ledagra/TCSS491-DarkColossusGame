class hud {

    constructor(game) {
        this.game = game;
        this.width = 1400;
        this.height = 900;
        this.x = 0;
        this.y = 0;
        this.locationTitleX = 50;
        this.locationTitleY = 80;
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);

        this.abilityHudX = 50;
        this.abilityHudY = -50;
    }

    update() {

    }

    draw(ctx) {
        
        //draw current level text on screen top right corner if not level 0
        ctx.font = "50px " + params.FONT;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        if (params.LEVEL == 0) {
            ctx.fillText("Awakening Cross", this.locationTitleX, this.locationTitleY);
        } else if (currentLevelModifier == BOSS) {
            ctx.fillText(getLevelModifierText(currentLevelModifier) + " ", this.locationTitleX, this.locationTitleY);
        } else {
            ctx.fillText(getLevelModifierText(currentLevelModifier) + " " + params.LEVEL, this.locationTitleX, this.locationTitleY);
        }

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.locationTitleX - 20, this.locationTitleY*1.2);
        ctx.lineTo(this.locationTitleX*13, this.locationTitleY*1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.locationTitleX, this.locationTitleY*1.3);
        ctx.lineTo(this.locationTitleX*10, this.locationTitleY*1.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.locationTitleX + 40, this.locationTitleY*1.4);
        ctx.lineTo(this.locationTitleX*6, this.locationTitleY*1.4);
        ctx.stroke();

        //draw health bar rectangle
        // ctx.fillStyle = "#FF3232";
        // ctx.fillRect(50, 150, 300, 50);
        // //draw health bar fill
        // ctx.fillStyle = "green";
        // ctx.fillRect(50, 150, player.hp, 50);
        // //draw health bar border
        // ctx.strokeStyle = "white";
        // //set line width to 5
        // ctx.lineWidth = 2;
        // ctx.strokeRect(50, 150, 300, 50);

        //draw hp crosses images for each unit of hp, when it goes over 10 make a new row
        for (let i = 0; i < player.health; i++) {
            if (i < 10) {
                ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/UI/hp_cross.png"), 50 + (i * 55), 150, 64, 64);
            } else if (i < 20){
                ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/UI/hp_cross.png"), 50 + ((i - 10) * 55), 205, 64, 64);
            } else {
                ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/UI/hp_cross.png"), 50 + ((i*2 - 10) * 55), 205, 64, 64);
            }
        }

        this.drawDarkEnergyHud(ctx);
        this.drawAbilityHud(ctx);

        //this.pauseControl(ctx);

    }

    drawDarkEnergyHud(ctx) {
        //draw Dark Energy currency
        ctx.fillStyle = "white";
        //MEASURE TEXT WIDTH
        let textWidth = ctx.measureText("" + params.DARK_ENERGY.currency).width;
        ctx.fillText("" + params.DARK_ENERGY.currency, CANVAS_WIDTH - textWidth - 30, this.locationTitleY*.9);
        ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/LevelAssets/dark_energy.png"), CANVAS_WIDTH - textWidth - 100, this.locationTitleY*.3, 64, 64);
    }

    drawAbilityHud(ctx) {
        //draw the dnaSlot1 and dnaSlot2
        if (params.INVENTORY.dnaSlot1 != null) {
            let alpha = params.INVENTORY.dnaSlot1.alphaAbility;
            let sigma = params.INVENTORY.dnaSlot1.sigmaAbility;
            let beta = params.INVENTORY.dnaSlot1.betaAbility;
            let epsilon = params.INVENTORY.dnaSlot1.epsilonAbility;
            ctx.fillStyle = "white";
            ctx.font = "50px " + params.FONT;
            
            //TOP
            if (sigma) {
                let icon = (sigma.inUse) ? sigma.inUseIcon : sigma.icon;
                //draw the cooldown number on top of the ability icon
                if (sigma.cooldownTimer != null && sigma.cooldownTimer.getRemainingSeconds() != 0)  {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(icon, 110+ this.abilityHudX, CANVAS_HEIGHT-280 + this.abilityHudY, 98, 98);
                    ctx.globalAlpha = 1;
                    let textWidth = ctx.measureText(sigma.cooldownTimer.getRemainingSeconds()).width;
                    ctx.fillText(sigma.cooldownTimer.getRemainingSeconds(), 160 + this.abilityHudX - textWidth/2, CANVAS_HEIGHT-260 + this.abilityHudY + 50);
                } else {
                    ctx.drawImage(icon, 110+ this.abilityHudX, CANVAS_HEIGHT-280 + this.abilityHudY, 98, 98);
                }
            }

            //RIGHT
            if (alpha) {
                let icon = (alpha.inUse) ? alpha.inUseIcon : alpha.icon;
                if (alpha.cooldownTimer != null && alpha.cooldownTimer.getRemainingSeconds() != 0)  {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(icon, 203+ this.abilityHudX, CANVAS_HEIGHT-195 + this.abilityHudY, 98, 98);
                    ctx.globalAlpha = 1;
                    let textWidth = ctx.measureText(alpha.cooldownTimer.getRemainingSeconds()).width;
                    ctx.fillText(alpha.cooldownTimer.getRemainingSeconds(), 253 + this.abilityHudX - textWidth/2, CANVAS_HEIGHT-175 + this.abilityHudY + 50);
                } else {
                    ctx.drawImage(icon, 203+ this.abilityHudX, CANVAS_HEIGHT-195 + this.abilityHudY, 98, 98);
                }
            }


            //DOWN
            if (beta) {
                let icon = (beta.inUse) ? beta.inUseIcon : beta.icon;
                if (beta.cooldownTimer != null && beta.cooldownTimer.getRemainingSeconds() != 0)  {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(icon, 108+ this.abilityHudX, CANVAS_HEIGHT-110 + this.abilityHudY, 98, 98);
                    ctx.globalAlpha = 1;
                    let textWidth = ctx.measureText(beta.cooldownTimer.getRemainingSeconds()).width;
                    ctx.fillText(beta.cooldownTimer.getRemainingSeconds(), 160 + this.abilityHudX - textWidth/2, CANVAS_HEIGHT-90 + this.abilityHudY + 50);
                } else {
                    ctx.drawImage(icon, 108+ this.abilityHudX, CANVAS_HEIGHT-110 + this.abilityHudY, 98, 98);
                }
            }


            //LEFT
            if (epsilon) {
                let icon = (epsilon.inUse) ? epsilon.inUseIcon : epsilon.icon;
                if (epsilon.cooldownTimer != null && epsilon.cooldownTimer.getRemainingSeconds() != 0)  {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(icon, 15 + this.abilityHudX, CANVAS_HEIGHT-195 + this.abilityHudY, 98, 98);
                    ctx.globalAlpha = 1;
                    let textWidth = ctx.measureText(epsilon.cooldownTimer.getRemainingSeconds()).width;
                    ctx.fillText(epsilon.cooldownTimer.getRemainingSeconds(), 60 + this.abilityHudX - textWidth/2, CANVAS_HEIGHT-175 + this.abilityHudY + 50);
                } else {
                    ctx.drawImage(icon, 15 + this.abilityHudX, CANVAS_HEIGHT-195 + this.abilityHudY, 98, 98);
                }
            }


            let A = ASSET_MANAGER.getAsset("./Sprites/UI/ability_hud.png");
            ctx.drawImage(A, 0+ this.abilityHudX, CANVAS_HEIGHT - 290 + this.abilityHudY, 316, 288);

        }

        
        if (params.INVENTORY.dnaSlot2) params.INVENTORY.dnaSlot2.drawDna(ctx, 250, 930, 116);
    }

    pauseControl(ctx) {
        //display controls for the game in pause menu
        if (this.game.PAUSED) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, 1400, 900);
            ctx.fillStyle = "white";
            ctx.font = "50px " + params.FONT;
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", 700, 100);
            ctx.font = "30px " + params.FONT;
            ctx.fillText("Press 'P' to resume", 700, 150);
            ctx.fillText("Press 'R' to restart", 700, 200);
            ctx.fillText("Press 'ESC' to return to main menu", 700, 250);
        }
    }
}