class SupersonicAbility{

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Supersonic';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/supersonic_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/supersonic_in_use_icon.png");
        this.dominant = false;
        this.cooldownRarity = cooldownRarity;
        this.effectRarity = effectRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.effect = this.setEffect(effectRarity);
        this.currentCooldown = 0;
        this.inUse = false;

        //Supersonic specific properties
        this.originalAnimationRight = player.animations[1][0];
        this.originalAnimationLeft = player.animations[1][1];
        this.speedIncrease = 500;
        this.enemiesHit = [];
        this.updateDamage();


        //set effect to random number between 1 and 15

    }

    onEquip() {
        //equipped supersonic ability
        console.log("Equipped Supersonic Ability");
        player.animations[1][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/supersonic.png"), 0, 0, 320, 256, 9, .06, 0, true);
        player.animations[1][1] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/supersonic_left.png"), 0, 0, 320, 256, 9, .06, 0, true);
        player.MAX_RUN += this.speedIncrease;
        //player.usingAbility = true;

        // facing left = 1
        //this.animations[1][1] 
    }

    onUnequip() {
        player.animations[1][0] = this.originalAnimationRight;
        player.animations[1][1] = this.originalAnimationLeft;
        player.MAX_RUN -= this.speedIncrease;
       // player.usingAbility = false;
    }

    //GAME CHARACTER CALLS THIS
    onUse() {

    }

    //Ability itself
    onEnd() {

    }

    checkForDuplicateAbilities() {
        //check how many abilities is an instance of this ability in dnaslot1 and dnaslot2
        //if more than 1, return true
        //else return false
        

    }

    setCooldown(cooldownRarity) { 
        return 0;
    }

    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                return 6;
            case 2:
                return 7;
            case 3:
                return 8;
            case 4:
                return 9;
            default:
                console.log('Effect rarity not found');
                return -1;
        }
    }

    updateDamage() {
        this.damage = Math.round(this.effect * (params.DARK_ENERGY.meleeAttack+1) * 10) / 10;
        this.description = 'Passive | Increases speed, deals ' + this.damage + ' dmg while moving at max speed';
    }

    update() {
        this.updateDamage();
        if (Math.abs(player.velocity.x) == player.MAX_RUN && player.state == 1) {
            this.inUse = true;
           // this.effect = Math.floor(Math.random() * 15) + 1;

           gameEngine.entities.forEach((enemy) => {
                //Collisions with players bounding box
                if (enemy.hostile && player.BB.collide(enemy.BB)) {
                    if (!this.enemiesHit.includes(enemy)) {
                        this.enemiesHit.push(enemy);
                        
                        enemy.health -= this.damage;

                        if ( !(enemy instanceof MoleculeProjectile)){
                            gameEngine.addEntityFirst(new DamageIndicator(enemy.x+enemy.width/2, enemy.y, this.damage));
                            params.PARTICLE_SYSTEM.createParticleEffect(enemy.x + enemy.width/2 - gameEngine.camera.x, enemy.y + enemy.height/2 - gameEngine.camera.y, 50, 14, '#330000', 12, 25, 0.55);
                        }
                     }
                }
           })
        } else {
            this.enemiesHit = [];
            this.inUse = false;
        }

    }

    draw(ctx) {
        //draw image slightly behind player
        if (Math.abs(player.velocity.x) == player.MAX_RUN && player.state == 1) {
            //ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/Abilities/supersonic.png"), player.x - 300 - gameEngine.camera.x, player.y - 100 - gameEngine.camera.y, 320, 256);
        }
    }
}