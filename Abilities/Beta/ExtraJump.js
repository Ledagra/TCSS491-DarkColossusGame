class ExtraJump {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Extra Jump';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/extra_jump_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/extra_jump_in_use_icon.png");
        this.dominant = false;
        this.cooldownRarity = cooldownRarity;
        this.effectRarity = effectRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.effect = this.setEffect(effectRarity);
        this.description = 'Allows you to jump ' + this.effect + ' more time(s) in the air!';
        this.currentCooldown = 0;
        this.inUse = false;

        //Ability specific properties
        //insert properties here
    }

    onEquip() {
        player.MAX_JUMPS += this.effect;
    }

    onUnequip() {
        player.MAX_JUMPS -= this.effect;

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
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 4;                
        }
    }

    //Required
    update() {
        
    }

    //Required
    draw(ctx) {
        
    }
}