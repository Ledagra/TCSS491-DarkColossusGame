class EMPAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'EMP';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/emp_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/emp_icon.png");
        this.dominant = false;
        this.effect = this.setEffect(effectRarity);
        this.description = 'Nearby Molecules are removed from reality';
        this.effectRarity = effectRarity;
        this.cooldownRarity = cooldownRarity;
        this.cooldown = this.setCooldown(this.cooldownRarity);
        this.cooldownTimer = new AbilityCooldown(this.cooldown);
        this.inUse = false;

        //Ability specific properties
        this.BB = new BoundingBox(100, 100, CANVAS_WIDTH-100, CANVAS_HEIGHT-100);
        this.moleculesHit = [];
    }

    onEquip() {

    }

    onUnequip() {
        
    }

    //This runs when the Character presses the ability button
    onUse() {
        if (this.inUse || (this.cooldownTimer.checkCooldown()) ) return;
        gameEngine.addEntityFirst(new AbilityIndicatorEffect(this.icon));
        player.animations[4][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/emp.png"), 0, 0, 1200, 1164, 7, 0.1, 0, false);
        player.animations[4][1] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/emp.png"), 0, 0, 1200, 1164, 7, 0.1, 0, false);
        
        player.animations[4][0].yOffset = -730;
        player.animations[4][0].xOffset = -450;
        player.animations[4][1].yOffset = -730;
        player.animations[4][1].xOffset = -500;
        this.inUse = true;
        player.usingAbility = true;
        console.log('EMP started');
    }

    //The ability will call this itself 
    //(useful for cooldowns, reverting player state, etc)
    onEnd() {
        this.cooldownTimer.startCooldown();
        player.usingAbility = false;  
        this.inUse = false;
        console.log('EMP ended');
    }

    //Edit these to change the cooldown of the ability based on rarity
    setCooldown(cooldownRarity) { 
        switch (cooldownRarity) {
            case 1:
                return 6
            case 2:
                return 5
            case 3:
                return 4
            case 4:
                return 3
            default:
                console.log('Cooldown rarity not found');
        }
        return 0;
    }


    //Length of disable effect
    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                // Basic effect 0.5-1.5 seconds 
                return (Math.floor(Math.random() * 10) + 5) / 10;
            case 2:
                // Uncommon effect 1.5-2.5 seconds
                return (Math.floor(Math.random() * 10) + 15) / 10;
            case 3:
                // Rare effect 2.5-3.5 seconds
                return (Math.floor(Math.random() * 10) + 25) / 10;
            case 4:
                // Godlike effect 3.5-5 seconds
                return (Math.floor(Math.random() * 15) + 35) / 10;
            default:
                console.log('Effect rarity not found');
                return -1;
        }
    }

    //Required
    update() {
        this.BB = new BoundingBox(player.x - 256 - CANVAS_WIDTH/3, player.y - 156 - CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT*1.5);

        this.cooldownTimer.checkCooldown()
        if (this.inUse) {
            gameEngine.entities.forEach((enemy) => {
                if ( (enemy instanceof Molecule) && this.BB.collide(enemy.BB)) {
                    enemy.frameDuration = 10000
                    enemy.health = 0;
                    //enemy.disabled = true;
                    enemy.loadAnimations();
                    this.moleculesHit.push(enemy);
                }
           })
           this.disableCountdown = this.effect * 100;
        } 

        if (this.inUse && (player.animations[4][0].isDone() || player.animations[4][1].isDone() )) {
            this.onEnd();
        }

        //countdown cooldown for disable effect for molecules in moleculesHit
        if (!this.inUse && this.disableCountdown <=0) {
            this.moleculesHit.forEach((molecule) => {
                molecule.frameDuration = 0.2;
                molecule.disabled = false;
                molecule.loadAnimations();
            })
            this.moleculesHit = [];
        } else {
            this.moleculesHit.forEach((molecule) => {
                molecule.y += 0.07;

            })
        }

        this.disableCountdown--;
    }

    //Required - draw collision BB here
    draw(ctx) {
        if(debug && this.inUse) {
            ctx.strokeRect(
            this.BB.x - gameEngine.camera.x,
            this.BB.y - gameEngine.camera.y,
            this.BB.width,
            this.BB.height
            );
        }
    }
}