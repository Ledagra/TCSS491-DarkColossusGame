class AstralBeamAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Astral Beam';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/astral_beam_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/astral_beam_in_use_icon.png");
        this.dominant = false;
        this.effect = this.setEffect(effectRarity);
        //round to 1 decimal places
        this.effect = Math.round(this.effect * 10) / 10;
        this.effectRarity = effectRarity;
        this.cooldownRarity = cooldownRarity;
        this.cooldown = this.setCooldown(this.cooldownRarity);
        this.cooldownTimer = new AbilityCooldown(this.cooldown);
        this.inUse = false;
        this.updateDamage();


        //Ability specific properties
        this.BB1_TAIL = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.BB2_UPPER_ARM = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.BB3_LOWER_ARM = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
    }

    updateDamage() {
        this.damage = Math.round(this.effect * (params.DARK_ENERGY.rangedAttack+1) * 10) / 10;
        this.description = 'Eviscerate enemies in a line of sight dealing ' + this.damage + ' dmg';
    }
        

    onEquip() {

    }

    onUnequip() {
        
    }

    //This runs when the Character presses the ability button
    onUse() {
        if (this.inUse || (this.cooldownTimer.checkCooldown()) ) return;
        gameEngine.addEntityFirst(new AbilityIndicatorEffect(this.icon));
        player.animations[4][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/astral_beam_right.png"), 0, 0, 320, 320, 10, 0.09, 0, false);
        player.animations[4][1] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/astral_beam_left.png"), 0, 0, 320, 320, 10, 0.09, 0, false);
        player.animations[4][0].yOffset = -50;
        player.animations[4][0].xOffset = -20;
        player.animations[4][1].yOffset = -50;
        player.animations[4][1].xOffset = -50;
        this.inUse = true;
        player.usingAbility = true;
        console.log('Astral Beam started');
    }

    //The ability will call this itself 
    //(useful for cooldowns, reverting player state, etc)
    onEnd() {
        this.cooldownTimer.startCooldown();
        player.usingAbility = false;  
        this.inUse = false;
    }

    //Edit these to change the cooldown of the ability based on rarity
    setCooldown(cooldownRarity) { 
        switch (cooldownRarity) {
            case 1:
                return 4;
            case 2:
                return 3;
            case 3:
                return 2;
            case 4:
                return 1;
        }
    }


    //Strength of laser per hit
    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 5;
            case 4:
                return 6;
        }
    }

    //Required
    update() {
        //round to the nearest tenth
        this.updateDamage();
        this.cooldownTimer.checkCooldown();

        if (player.facing == 0) { //RIGHT FACING
            this.BB1_TAIL = new BoundingBox(player.x+175, player.y-2, CANVAS_WIDTH, 15);
            this.BB2_UPPER_ARM = new BoundingBox(player.x + 270, player.y + 132, CANVAS_WIDTH, 15);
            this.BB3_LOWER_ARM = new BoundingBox(player.x + 230, player.y + 172, CANVAS_WIDTH, 15);
        } else {
            this.BB1_TAIL = new BoundingBox(-100, player.y, player.x + 180, 15);
            this.BB2_UPPER_ARM = new BoundingBox(-100, player.y + 132, player.x + 82, 15);
            this.BB3_LOWER_ARM = new BoundingBox(-100, player.y + 172 , player.x + 128, 15);
        }

        if (this.inUse) {
            //Spawn particles on frame 4
            if (player.animations[4][0].currentFrame() == 4){
                params.PARTICLE_SYSTEM.createParticleEffect(player.x + player.width/2 - gameEngine.camera.x+ 128, player.y + player.height/2 - gameEngine.camera.y, 10, 30, '#FF995D', 200, 200, 2);
            } else if (player.animations[4][1].currentFrame() == 4){
                params.PARTICLE_SYSTEM.createParticleEffect(player.x + player.width/2 - gameEngine.camera.x, player.y + player.height/2 - gameEngine.camera.y, 10, 30, '#FF995D', 200, 200, 2);
            }

            gameEngine.entities.forEach((enemy) => {
                if ( enemy.hostile && 
                      (this.BB1_TAIL.collide(enemy.BB) || this.BB2_UPPER_ARM.collide(enemy.BB) || this.BB3_LOWER_ARM.collide(enemy.BB) ) &&
                      (player.animations[4][0].currentFrame() >= 5 || player.animations[4][1].currentFrame() >= 5)) {
                    
                        params.PARTICLE_SYSTEM.createParticleEffect(enemy.x + enemy.width/2 - gameEngine.camera.x, enemy.y + enemy.height/2 - gameEngine.camera.y, 3, 10, '#FF995D', 10, 25, 0.55);
                    
                    if (enemy.currentIFrameTimer < enemy.maxIFrameTimer/1.2){
                        console.log('Astral Beam HIT');
                        enemy.currentIFrameTimer = enemy.maxIFrameTimer;
                        enemy.health -= this.damage;
                        if ( !(enemy instanceof MoleculeProjectile)) gameEngine.addEntityFirst(new DamageIndicator(enemy.x+30, enemy.y, this.damage));
                    }
                }
           })
        } 

        if (this.inUse && (player.animations[4][0].isDone() || player.animations[4][1].isDone() )) {
            this.onEnd();
        }
    }

    //Required - draw collision BB here
    draw(ctx) {
        if(this.inUse && 
            ( (player.animations[4][0].currentFrame() >= 5 && player.animations[4][0].currentFrame() < 10)
             || (player.animations[4][1].currentFrame() >= 5 && player.animations[4][1].currentFrame() < 10)
             )
            ) { //draw the bounding box for each laser
            ctx.fillStyle = '#DF8652';
            ctx.fillRect(this.BB1_TAIL.x - gameEngine.camera.x, this.BB1_TAIL.y - gameEngine.camera.y, this.BB1_TAIL.width, this.BB1_TAIL.height);
            ctx.fillRect(this.BB2_UPPER_ARM.x- gameEngine.camera.x, this.BB2_UPPER_ARM.y- gameEngine.camera.y, this.BB2_UPPER_ARM.width, this.BB2_UPPER_ARM.height);
            ctx.fillRect(this.BB3_LOWER_ARM.x- gameEngine.camera.x, this.BB3_LOWER_ARM.y- gameEngine.camera.y, this.BB3_LOWER_ARM.width, this.BB3_LOWER_ARM.height);
        }
        
    }
}