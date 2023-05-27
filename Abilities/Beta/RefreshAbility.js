class RefreshAbility {

    constructor(cooldownRarity, effectRarity) {
        //Necessary properties for all abilities
        this.name = 'Refresh';
        this.effectRarity = effectRarity;
        this.effect = this.setEffect(effectRarity);
        this.description = 'Instantly refreshes all other cooldowns!';
        this.icon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/refresh_icon.png");
        this.inUseIcon = ASSET_MANAGER.getAsset("./Sprites/Abilities/Icons/refresh_in_use_icon.png");
        this.dominant = false;
        this.cooldownRarity = cooldownRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.cooldownTimer = new AbilityCooldown(this.cooldown);
        this.currentCooldown = 0;
        this.inUse = false;

        //Ability specific properties
        //insert properties here
    }

    onEquip() {

    }

    onUnequip() {

    }

    //This runs when the Character presses the ability button
    onUse() {
        if (this.inUse || (this.cooldownTimer.checkCooldown()) || player.usingAbility ) return;
        gameEngine.addEntityFirst(new AbilityIndicatorEffect(this.icon));
        this.inUse = true;
        player.usingAbility = true;
        if(params.INVENTORY.dnaSlot1 != null) {
            this.refreshSlot1();
        }
        if(params.INVENTORY.dnaSlot2 != null) {
            this.refreshSlot2();
        }
        this.onEnd();
    }

    refreshSlot1() {
        let abilityS = params.INVENTORY.dnaSlot1.sigmaAbility;
        let abilityA = params.INVENTORY.dnaSlot1.alphaAbility;
        let abilityB = params.INVENTORY.dnaSlot1.betaAbility;
        let abilityE = params.INVENTORY.dnaSlot1.epsilonAbility;

        if(abilityS != null) {
            abilityS.cooldownTimer = new AbilityCooldown(0);
            abilityS.cooldownTimer = new AbilityCooldown(abilityS.cooldown);
        }
        

        if(abilityA != null) {
            abilityA.cooldownTimer = new AbilityCooldown(0);
            abilityA.cooldownTimer = new AbilityCooldown(abilityA.cooldown);
        }
        

        if(abilityB != null) {
            abilityB.cooldownTimer = new AbilityCooldown(0);
            abilityB.cooldownTimer = new AbilityCooldown(abilityB.cooldown);
        }

        if(abilityE != null) {
            abilityE.cooldownTimer = new AbilityCooldown(0);
            abilityE.cooldownTimer = new AbilityCooldown(abilityE.cooldown);
        }
    }

    refreshSlot2() {
        let abilityS = params.INVENTORY.dnaSlot2.sigmaAbility;
        let abilityA = params.INVENTORY.dnaSlot2.alphaAbility;
        let abilityB = params.INVENTORY.dnaSlot2.betaAbility;
        let abilityE = params.INVENTORY.dnaSlot2.epsilonAbility;

        if(abilityS != null) {
            abilityS.cooldownTimer = new AbilityCooldown(0);
            abilityS.cooldownTimer = new AbilityCooldown(abilityS.cooldown);
        }
        

        if(abilityA != null) {
            abilityA.cooldownTimer = new AbilityCooldown(0);
            abilityA.cooldownTimer = new AbilityCooldown(abilityA.cooldown);
        }
        

        if(abilityB != null) {
            abilityB.cooldownTimer = new AbilityCooldown(0);
            abilityB.cooldownTimer = new AbilityCooldown(abilityB.cooldown);
        }

        if(abilityE != null) {
            abilityE.cooldownTimer = new AbilityCooldown(0);
            abilityE.cooldownTimer = new AbilityCooldown(abilityE.cooldown);
        }

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
        this.cooldownTimer.checkCooldown();
        //player.usingAbility = false;

 
        //if player is not using ability, end the ability
        // if (this.inUse && !player.usingAbility) {
        //     this.onEnd();
        // }
        
    }

    //Required
    draw(ctx) {
        
    }
}