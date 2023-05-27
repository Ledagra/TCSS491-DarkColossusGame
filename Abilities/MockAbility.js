class MockAbility {

    //This is not a parent abstract class. 
    //This is a mock ability that will be used to test the ability system.

    //I still need to research abstract classes in JS 
    //To see if it makes sense to use them here.

    constructor(cooldownRarity, effectRarity) {
        
        //Necessary properties for all abilities
        this.name = 'Mock Ability';
        this.cooldownRarity = cooldownRarity;
        this.effectRarity = effectRarity;
        this.cooldown = this.setCooldown(cooldownRarity);
        this.effect = this.setEffect(effectRarity);
        this.dominant = false; //dominant or recessive
        this.description = 'This is a mock ability';
        this.icon = ASSET_MANAGER.getAsset('./Sprites/Abilities/Icons/mock_icon.png');

        //Store animation in abilities
        this.animation = 'mockAbilityAnimation';

        this.currentCooldown = 0;

        // console.log('Mock Ability created');
        // console.log('Cooldown Rarity: ' + cooldownRarity);
        // console.log('Effect Rarity: ' + effectRarity);
    }

    //INVENTORY UI CALL THIS
    onEquip() {
        //add stat changes
        //example cases:
            //on splice?
            //on equip DONE
            //on new level start DONE
    }

    //INVENTORY UI CALL THIS
    onUnequip() {
        //remove stat changes
        //example cases:
            //on sell DONE
            //on splice
            //on replace/equip other DONE
    }

    //GAME CHARACTER CALLS THIS
    onUse() {
        //changes character state to 4/5
        //example cases:
            //on use/specific button press
    }

    //Ability itself
    onEnd() {
        //reverts character state to 1-3
    }

    setCooldown(cooldownRarity) { // 1-4
        switch (cooldownRarity) {
            case 1:
                // returns a random number between 15-25
                return Math.floor(Math.random() * 10) + 15;
            case 2:
                // returns a random number between 10-15
                return Math.floor(Math.random() * 5) + 10;
            case 3:
                // returns a random number between 5-10
                return Math.floor(Math.random() * 5) + 5;
            case 4:
                // returns a random number between 1-5
                return Math.floor(Math.random() * 5) + 1;
            default:
                console.log('Cooldown rarity not found');
                return -1;
        }
    }

    setEffect(effectRarity) {
        switch (effectRarity) {
            case 1:
                // inflict 1 cross of damage
                return 1;
            case 2:
                // inflict 2 crosses of damage
                return 2;
            case 3:
                // inflict 3 crosses of damage
                return 3;
            case 4:
                // inflict 4 crosses of damage
                return 4;
            default:
                console.log('Effect rarity not found');
                return -1;
        }
    }

    update() {
        //This will be called through the DNA's update method.
    }

    draw(ctx) {
        //This will be called through the DNA's draw method.
    }
}