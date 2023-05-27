class SolarFlareAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Solar Flare';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/solar_flare_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/solar_flare_in_use_icon.png");
        this.dominant = false;
        this.effect = this.setEffect(effectRarity);

        this.effectRarity = effectRarity;
        this.updateDamage();
        this.cooldownRarity = cooldownRarity;
        this.cooldown = this.setCooldown(this.cooldownRarity);
        this.cooldownTimer = new AbilityCooldown(this.cooldown);
        this.inUse = false;

        //Ability specific properties
        this.BB1_TAIL = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.BB2_UPPER_ARM = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.BB3_LOWER_ARM = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.frameSpeed = 0.09;
        this.initializeSolarFlareHitBoxAnimation();
        this.BB1 = new BoundingBox(player.x, player.y - 650, 500, 100);
    }

    onEquip() {

    }

    onUnequip() {
        
    }

    //This runs when the Character presses the ability button
    onUse() {
        if (this.inUse || (this.cooldownTimer.checkCooldown()) ) return;
        gameEngine.addEntityFirst(new AbilityIndicatorEffect(this.icon));
        player.animations[4][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/solar_flare.png"), 0, 0, 612, 612, 13, this.frameSpeed, 0, false);
        player.animations[4][0].yOffset = -300;
        player.animations[4][0].xOffset = -180;
        player.animations[4][1] = player.animations[4][0];
        player.velocity.y -= 1000;

        this.inUse = true;
        player.usingAbility = true;
        console.log('Solar Flare started');
    }

    //The ability will call this itself 
    //(useful for cooldowns, reverting player state, etc)
    onEnd() {
        this.cooldownTimer.startCooldown();
        player.usingAbility = false;  
        this.inUse = false;
        this.initializeSolarFlareHitBoxAnimation();
    }

    initializeSolarFlareHitBoxAnimation() {
        this.solarFlareHitBoxAnimation = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/solar_flare_hit_box.png"), 0, 0, 1920, 1080, 8, this.frameSpeed, 0, false);
        this.solarFlareHitBoxAnimation.yOffset = -730;
        this.solarFlareHitBoxAnimation.xOffset = -790;
    }

    //Edit these to change the cooldown of the ability based on rarity
    setCooldown(cooldownRarity) { 
        switch (cooldownRarity) {
            case 1:
                return 7;
            case 2:
                return 6;
            case 3:
                return 5;
            case 4:
                return 4;
        }
        return 1;
    }

    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                return 2;
            case 2:
                return 3
            case 3:
                return 4
            case 4:
                return 5
        }
    }

    updateDamage() {
        this.damage = Math.round(this.effect * ((params.DARK_ENERGY.meleeAttack+1)) *10) / 10;
        this.description = 'Unleash the power of the sun dealing ' + this.damage + ' dmg per hit';
    }

    //Required
    update() {
        this.updateDamage();
        this.BB1 = new BoundingBox(player.x - 256 - CANVAS_WIDTH/3, player.y - 156 - CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT*1.5);
        //round to the nearest tenth
        this.cooldownTimer.checkCooldown();

        if (this.inUse) {
            
            gameEngine.entities.forEach((enemy) => {
                if ( enemy.hostile && 
                      (this.BB1.collide(enemy.BB) ) &&
                      (player.animations[4][0].currentFrame() >= 5 || player.animations[4][1].currentFrame() >= 5)) {
                    
                        params.PARTICLE_SYSTEM.createParticleEffect(enemy.x + enemy.width/2 - gameEngine.camera.x, enemy.y + enemy.height/2 - gameEngine.camera.y, 8, 20, '#FF995D', 40, 40, 0.35);
                    
                    if (enemy.currentIFrameTimer < enemy.maxIFrameTimer/1.2){
                        console.log('Solar Flare HIT');
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
        if (this.inUse && (player.animations[4][0].currentFrame() >= 5 || player.animations[4][1].currentFrame() >= 5)) {
                this.solarFlareHitBoxAnimation.drawFrame(gameEngine.clockTick, ctx, player.x - gameEngine.camera.x, player.y - gameEngine.camera.y, 1);
                ctx.strokeStyle = 'red';
                
                if (debug) ctx.strokeRect(this.BB1.x -gameEngine.camera.x, this.BB1.y - gameEngine.camera.y, this.BB1.width, this.BB1.height);
        
            }

    }
}