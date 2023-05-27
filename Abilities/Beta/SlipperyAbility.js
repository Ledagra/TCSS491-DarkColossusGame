class SlipperyAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Slippery';
        this.effect = this.setEffect(effectRarity);
        this.description = 'Increase movement speed; decreased ground friction. ' + '(' + this.effect + ')';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/slippery_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/slippery_in_use_icon.png");
        this.dominant = false;
        this.cooldownRarity = cooldownRarity;
        this.effectRarity = effectRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.currentCooldown = 0;
        this.inUse = false;

        //Ability specific properties
        //base player values for reference
        //this.RUN_ACC = 2500;
        //this.DEC_SKID = 5000;
        //this.MAX_RUN = 800;
    }

    onEquip() {
        player.RUN_ACC += this.effect;
        player.MAX_RUN += this.effect;
        player.DEC_SKID -= this.effect;
    }

    onUnequip() { 
        player.RUN_ACC -= this.effect;
        player.MAX_RUN -= this.effect;
        player.DEC_SKID += this.effect;
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
        return 0;
    }


    //Edit these to change the power of the ability based on rarity
    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                // Basic effect
                return Math.floor(Math.random() * 2) + 250;
            case 2:
                // Uncommon effect
                return Math.floor(Math.random() * 2) + 500;
            case 3:
                // Rare effect
                return Math.floor(Math.random() * 2) + 750;
            case 4:
                // Godlike effect
                return Math.floor(Math.random() * 2) + 1000;
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