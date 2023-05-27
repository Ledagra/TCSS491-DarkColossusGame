class TemplateAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = '';
        this.description = '' + this.effect + '';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/INSERT_ICON_HERE.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/INSERT_ICON_HERE.png");
        this.dominant = false;
        this.cooldownRarity = cooldownRarity;
        this.effectRarity = effectRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.effect = this.setEffect(effectRarity);
        this.currentCooldown = 0;
        this.inUse = false;

        //Ability specific properties
        //insert properties here
    }

    onEquip() {
        console.log("Equipped Ability");
        player.animations[1][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/supersonic.png"), 0, 0, 320, 256, 9, .06, 0, true);
        player.animations[1][1] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/supersonic_left.png"), 0, 0, 320, 256, 9, .06, 0, true);
        player.MAX_RUN += this.speedIncrease;
    }

    onUnequip() {
        player.animations[1][0] = this.originalAnimationRight;
        player.animations[1][1] = this.originalAnimationLeft;
        player.MAX_RUN -= this.speedIncrease;
    }

    //This runs when the Character presses the ability button
    onUse() {

    }

    //The ability will call this itself 
    //(useful for cooldowns, reverting player state, etc)
    onEnd() {

    }

    //Edit these to change the cooldown of the ability based on rarity
    setCooldown(cooldownRarity) { 
        switch (cooldownRarity) {
            case 1:
                // Basic cooldown
                return Math.floor(Math.random() * 10) + 15;
            case 2:
                // Uncommon cooldown
                return Math.floor(Math.random() * 10) + 10;
            case 3:
                // Rare cooldown
                return Math.floor(Math.random() * 10) + 5;
            case 4:
                // Godlike cooldown
                return Math.floor(Math.random() * 10) + 1;
            default:
                console.log('Cooldown rarity not found');
        }

        return 0;
    }


    //Edit these to change the power of the ability based on rarity
    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                // Basic effect
                return Math.floor(Math.random() * 2) + 1;
            case 2:
                // Uncommon effect
                return Math.floor(Math.random() * 2) + 3;
            case 3:
                // Rare effect
                return Math.floor(Math.random() * 2) + 5;
            case 4:
                // Godlike effect
                return Math.floor(Math.random() * 2) + 7;
            default:
                console.log('Effect rarity not found');
                return -1;
        }
    }

    //Required
    update() {
        
    }

    //Required
    draw(ctx) {
        
    }
}