class DarkEnergyUI {
    constructor(game) {
        //initializing state
        this.game = game;
        this.BROWSE = 1;
        this.state = this.BROWSE;
        params.STATE = "menu";

        //Build menu information
        this.rows = 5;
        this.columns = 2;
        this.x = CANVAS_WIDTH/2;
        this.y = CANVAS_HEIGHT/2;
        this.width = 1050;
        this.height = 675;
        this.slotHorizontal = 468;
        this.slotVertical = 69;
        this.gridStartX = 331;
        this.gridStartY = 240;
        this.firstColXOffset = 5;
        this.secondColXOffset = 500;
        this.initialRowOffset = 45;
        this.followingRowOffset = 69;
        this.darkEnergyDisplayX = 610;
        this.darkEnergyDisplayY = 218;

        //Tracks currently highlighted slot
        this.currentSlot = 0;

        //Stats in printable format
        this.statIncreaseAmount = 35;
        this.deInfo = [
            "Melee Attack Bonus: " + this.game.darkEnergy.meleeAttack,
            "Ranged Attack Bonus: " + this.game.darkEnergy.rangedAttack,
            "Health Drop Bonus: " + this.game.darkEnergy.healthDropRate,
            "Movement Speed Bonus: " + this.game.darkEnergy.movementSpeed,
            "Jump Height Bonus: " + this.game.darkEnergy.jumpHeight,
            "Melee Defense Bonus: " + this.game.darkEnergy.meleeDefense,
            "Ranged Defense Bonus: " + this.game.darkEnergy.rangedDefense,
            "HP Bonus: " + this.game.darkEnergy.hp,
            "DNA Drop Rate Bonus: " + this.game.darkEnergy.dnaDropRate,
            "Dark Energy Gather Bonus: " + this.game.darkEnergy.darkEnergyChance,
        ];
    }



    draw(ctx) {
        this.ctx = ctx;
        ctx.fillStyle = "#994B50";
        ctx.globalAlpha = 0.8;
        ctx.fillRect(this.gridStartX, this.gridStartY, this.columns*this.slotHorizontal, this.rows*this.slotVertical);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                ctx.strokeRect(
                    this.gridStartX + j * this.slotHorizontal,
                    this.gridStartY + i * this.slotVertical,
                    this.slotHorizontal,
                    this.slotVertical
                );
            }
        }
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 5;
        ctx.strokeRect(
            this.gridStartX + (this.currentSlot % this.columns) * this.slotHorizontal,
            this.gridStartY + Math.floor(this.currentSlot / this.columns) * this.slotVertical,
            this.slotHorizontal,
            this.slotVertical
        );
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(
            this.gridStartX + (this.currentSlot % this.columns) * this.slotHorizontal,
            this.gridStartY + Math.floor(this.currentSlot / this.columns) * this.slotVertical,
            this.slotHorizontal,
            this.slotVertical
        );
        ctx.globalAlpha = 1;
        

        //Fill in stats
        let m = 0;
        ctx.font = "25px " + params.FONT;
        ctx.fillStyle = "#FFFFFF";
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                if(j % 2 == 0) {
                    ctx.fillText(this.deInfo[m++], this.gridStartX + this.firstColXOffset, this.gridStartY + this.initialRowOffset + (this.followingRowOffset * i));
                } else {
                    ctx.fillText(this.deInfo[m++], this.gridStartX + this.secondColXOffset, this.gridStartY + this.initialRowOffset + (this.followingRowOffset * i));
                }
            }
        }
        

        //print controls on the right side of DE_UI
        ctx.fillText("Controls:", this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 90);
        ctx.fillText("1: Increase Stat", this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 130);

        //Debug option to show current slot on side menu
        if(debug) {
            ctx.fillText("Current Slot: " + this.currentSlot, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 170);
            ctx.fillText("Current Melee Attack Value: " + this.game.darkEnergy.meleeAttack, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 200);
            ctx.fillText("Movement Speed Bonus: " + this.game.darkEnergy.movementSpeed, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 230);
            ctx.fillText("Current HP Value: " + this.game.darkEnergy.hp, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 260);
            ctx.fillText("Jump Bonus: " + this.game.darkEnergy.jumpHeight, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 290);
            ctx.fillText("Current Dark Energy Gather Value: " + this.game.darkEnergy.darkEnergyChance, this.darkEnergyDisplayX + 660, this.darkEnergyDisplayY + 320);
        }
        
    }

    update() {
        //Controls
        this.increaseStat();
        this.decreaseStat();
        this.closeDarkEnergyUI();

        if ((keypress("KeyW") || this.game.controllerButtonUp_press) && this.state == this.BROWSE) {
            this.game.controllerButtonUp_press = false;
            if(this.currentSlot < 2) {
                this.currentSlot += 8;
            } else {
                this.currentSlot -= 2;
            }
        }

        if ((keypress("KeyA") || this.game.controllerButtonLeft_press) && this.state == this.BROWSE) {
            this.game.controllerButtonLeft_press = false;
            if(this.currentSlot % 2 == 0) {
                this.currentSlot += 1;
            } else {
                this.currentSlot -= 1;
            }
        }

        if ((keypress("KeyS") || this.game.controllerButtonDown_press) && this.state == this.BROWSE) {
            this.game.controllerButtonDown_press = false;
            if(this.currentSlot > 7) {
                this.currentSlot -= 8;
            } else {
                this.currentSlot += 2;
            }
        }

        if ((keypress("KeyD") || this.game.controllerButtonRight_press) && this.state == this.BROWSE) {
            this.game.controllerButtonRight_press = false;
            if(this.currentSlot % 2 == 1) {
                this.currentSlot -= 1;
            } else {
                this.currentSlot += 1;
            }
        }

        //commented out for live build since leaderboards are up too
    //    if ((keypress("KeyX") || this.game.controllerButtonB_press) && this.state == this.BROWSE) {
    //        this.game.darkEnergy.currency += 1000;
    //     }

        // this.deInfo = [
        //     "Melee Attack Bonus: " + this.game.darkEnergy.meleeAttack,
        //     "Ranged Attack Bonus: " + this.game.darkEnergy.rangedAttack,
        //     "Attack Speed Bonus: " + this.game.darkEnergy.attackSpeed,
        //     "Movement Speed Bonus: " + this.game.darkEnergy.movementSpeed,
        //     "Jump Height Bonus: " + this.game.darkEnergy.jumpHeight,
        //     "Melee Defense Bonus: " + this.game.darkEnergy.meleeDefense,
        //     "Ranged Defense Bonus: " + this.game.darkEnergy.rangedDefense,
        //     "HP Bonus: " + this.game.darkEnergy.hp,
        //     "DNA Drop Rate Bonus: " + this.game.darkEnergy.dnaDropRate,
        //     "Sigma Chance Bonus: " + this.game.darkEnergy.sigmaChance,
        //     "Alpha Chance Bonus: " + this.game.darkEnergy.alphaChance,
        //     "Beta Chance Bonus: " + this.game.darkEnergy.betaChance,
        //     "Epsilon Chance Bonus: " + this.game.darkEnergy.epsilonChance,
        //     "Dark Energy Gather Bonus: " + this.game.darkEnergy.darkEnergyChance,
        // ];

        this.deInfo = [
            "Melee Attack+: " + this.game.darkEnergy.meleeAttack + "             Cost: " + this.cost(this.game.darkEnergy.meleeAttack, this.statIncreaseAmount),
            "Ranged Attack+: " + this.game.darkEnergy.rangedAttack + "          Cost: " + this.cost(this.game.darkEnergy.rangedAttack, this.statIncreaseAmount),
            "Health Drop Bonus: " + this.game.darkEnergy.healthDropRate + "          Cost: " + this.cost(this.game.darkEnergy.healthDropRate, this.statIncreaseAmount),
            "Movement Speed+: " + this.game.darkEnergy.movementSpeed + "          Cost: " + this.cost(this.game.darkEnergy.movementSpeed, this.statIncreaseAmount),
            "Jump Height+: " + this.game.darkEnergy.jumpHeight + "          Cost: " + this.cost(this.game.darkEnergy.jumpHeight, this.statIncreaseAmount),
            "Melee Defense+: " + this.game.darkEnergy.meleeDefense + "          Cost: " + this.cost(this.game.darkEnergy.meleeDefense, this.statIncreaseAmount),
            "Ranged Defense+: " + this.game.darkEnergy.rangedDefense + "          Cost: " + this.cost(this.game.darkEnergy.rangedDefense, this.statIncreaseAmount),
            "HP+: " + this.game.darkEnergy.hp + "                              Cost: " + this.cost(this.game.darkEnergy.hp, this.statIncreaseAmount),
            "DNA Drop Rate+: " + this.game.darkEnergy.dnaDropRate + "          Cost: " + this.cost(this.game.darkEnergy.dnaDropRate, this.statIncreaseAmount),
            "Dark Energy Gather+: " + this.game.darkEnergy.darkEnergyChance + "          Cost: " + this.cost(this.game.darkEnergy.darkEnergyChance, this.statIncreaseAmount),
        ];
    }

    closeDarkEnergyUI() {
        if (this.game.keys.KeyE || this.game.controllerButtonX_press) {
            params.STATE = "gameplay";
            this.removeFromWorld = true;
            gameEngine.keys.KeyE = false;
            this.game.controllerButtonX_press = false;
        }
    }

    cost(stat) {
        return Math.ceil( (stat+1) * this.statIncreaseAmount);
    }


    increaseStat() {
        let cost = 0;
        if((keypress("Digit1") || this.game.controllerButtonY_press) && this.state == this.BROWSE) {
            switch (this.currentSlot) {
                case 0:
                    cost = this.cost(this.game.darkEnergy.meleeAttack);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.meleeAttack++;
                        break;
                    } else {
                        break;
                    }
                case 1:
                    cost = this.cost(this.game.darkEnergy.rangedAttack);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.rangedAttack++;
                        break;
                    } else {
                        break;
                    }
                case 2:
                    cost = this.cost(this.game.darkEnergy.healthDropRate);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.healthDropRate++;
                        break;
                    } else {
                        break;
                    }
                case 3:
                    cost = this.cost(this.game.darkEnergy.movementSpeed);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.movementSpeed++;
                        player.MAX_RUN = 800 + (this.game.darkEnergy.movementSpeed * 10);
                        break;
                    } else {
                        break;
                    }
                case 4:
                    cost = this.cost(this.game.darkEnergy.jumpHeight);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.jumpHeight++;
                        player.JUMP_ACC = -1300 - (this.game.darkEnergy.jumpHeight * 10);
                        break;
                    } else {
                        break;
                    }
                case 5:
                    cost = this.cost(this.game.darkEnergy.meleeDefense);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.meleeDefense++;
                        break;
                    } else {
                        break;
                    }
                case 6:
                    cost = this.cost(this.game.darkEnergy.rangedDefense);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.rangedDefense++;
                        break;
                    } else {
                        break;
                    }
                case 7:
                    cost = this.cost(this.game.darkEnergy.hp);
                    if((this.game.darkEnergy.currency - cost >= 0) && this.game.darkEnergy.hp < 10) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.hp++;
                        player.health = player.baseHealth + this.game.darkEnergy.hp;
                        break;
                    } else {
                        break;
                    }
                case 8:
                    cost = this.cost(this.game.darkEnergy.dnaDropRate);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.dnaDropRate++;
                        break;
                    } else {
                        break;
                    }
                
                case 9:
                    cost = this.cost(this.game.darkEnergy.darkEnergyChance);
                    if(this.game.darkEnergy.currency - cost >= 0) {
                        this.game.darkEnergy.currency -= cost;
                        this.game.darkEnergy.darkEnergyChance++;
                        break;
                    } else {
                        break;
                    }
                default:
                    break;
                    
                
            }

        }

        updateAbilities();
    }

    //NYI
    decreaseStat() {
        if(keypress("Digit2") && this.state == this.BROWSE) {

        }

    }

}