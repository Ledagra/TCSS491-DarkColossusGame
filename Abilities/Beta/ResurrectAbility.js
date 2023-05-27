class ResurrectAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Resurrect';
        this.description = 'Come back to life when you would have died!';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/atomic_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/atomic_in_use_icon.png");
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
        params.RESURRECTS += 1;

    }

    onUnequip() {
        params.RESURRECTS -= 1;
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
        return 30;
    }


    //Edit these to change the power of the ability based on rarity
    setEffect(effectRarity) {
        
    }

    //Required
    update() {
        
    }

    //Required
    draw(ctx) {
        
    }
}