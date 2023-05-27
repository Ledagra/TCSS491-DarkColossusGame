class DNA {
    constructor(sigmaAbility, alphaAbility, betaAbility, epsilonAbility, rarity) {
        this.sigmaAbility = sigmaAbility; // up dnaslot1.sigmaAbility
                                                
        this.alphaAbility = alphaAbility; //down
        this.betaAbility = betaAbility; //left
        this.epsilonAbility = epsilonAbility; //right
        this.rarity = rarity;
        this.image = ASSET_MANAGER.getAsset("./Sprites/DNA/dna_basic.png");
        //set image
        switch (this.rarity) {
            case 1:
                this.image = ASSET_MANAGER.getAsset("./Sprites/DNA/dna_basic.png");
                break;
            case 2:
                this.image = ASSET_MANAGER.getAsset("./Sprites/DNA/dna_uncommon.png");
                break;
            case 3:
                this.image = ASSET_MANAGER.getAsset("./Sprites/DNA/dna_rare.png");
                break;
            case 4:
                this.image = ASSET_MANAGER.getAsset("./Sprites/DNA/dna_godly.png");
                break;
        }

        //set hud image
        switch (this.rarity) {
            case 1:
                this.hudImage = ASSET_MANAGER.getAsset("./Sprites/UI/ability_hud_basic.png");
                break;
            case 2:
                this.hudImage = ASSET_MANAGER.getAsset("./Sprites/UI/ability_hud_uncommon.png");
                break;
            case 3:
                this.hudImage = ASSET_MANAGER.getAsset("./Sprites/UI/ability_hud_rare.png");
                break;
            case 4:
                this.hudImage = ASSET_MANAGER.getAsset("./Sprites/UI/ability_hud_godly.png");
                break;
        }
        
        //add up all the ability rarities and set the dna value
        this.value = 0;
        if (this.sigmaAbility != null) this.value += this.sigmaAbility.cooldownRarity + this.sigmaAbility.effectRarity;
        if (this.alphaAbility != null) this.value += this.alphaAbility.cooldownRarity + this.alphaAbility.effectRarity;
        if (this.betaAbility != null) this.value += this.betaAbility.cooldownRarity + this.betaAbility.effectRarity;
        if (this.epsilonAbility != null) this.value += this.epsilonAbility.cooldownRarity + this.epsilonAbility.effectRarity;
        this.value *= 2;
    };

    update() {
        if(this.sigmaAbility != null)this.sigmaAbility.update();
        if(this.alphaAbility != null)this.alphaAbility.update();
        if(this.betaAbility != null)this.betaAbility.update();
        if(this.epsilonAbility != null)this.epsilonAbility.update();
        
    }

    drawDna(ctx, x, y, slotSize) {
         let strips = 
            [(this.sigmaAbility == null) ? -1 : this.sigmaAbility.cooldownRarity,
             (this.sigmaAbility == null) ? -1 : this.sigmaAbility.effectRarity,
             (this.alphaAbility == null) ? -1 : this.alphaAbility.cooldownRarity,
             (this.alphaAbility == null) ? -1 : this.alphaAbility.effectRarity,
             (this.betaAbility == null) ? -1 : this.betaAbility.cooldownRarity,
             (this.betaAbility == null) ? -1 : this.betaAbility.effectRarity
            ];


        for (let i = 0; i < 6; i++) {
            let distance = (slotSize/7)*i;
            let offset = 0;
            if (i == 1 || i == 3 || i == 5) {
                offset = -10
            }
            
            if (strips[i] == -1) continue;     
            switch (strips[i]) {
                case 1:
                    ctx.strokeStyle = "#990F26"; //basic gray
                    break;
                case 2:
                    ctx.strokeStyle = "#1E9958"; //uncommon green
                    break;
                case 3:
                    ctx.strokeStyle = "#0080B2"; //rare blue
                    break;
                case 4:
                    ctx.strokeStyle = "#E55916"; //godly gold
                    break;
            }

            let c = 0.3;
            ctx.lineWidth = 5;        
            ctx.beginPath();
            ctx.moveTo(x + slotSize/1.6 + offset + distance - slotSize * c, y + slotSize/1.6 - offset - distance + slotSize * c);
            ctx.lineTo(x + slotSize/2.6 + offset + distance - slotSize * c, y + slotSize/2.6 - offset - distance + slotSize * c);
            ctx.stroke();
        }

        ctx.drawImage(this.image, x, y, slotSize, slotSize);
    }



    toString() {


        let string = `DNA Overall rarity: ${this.rarity}`;

        if (this.sigmaAbility != null){
            string += `\nSigma:` +
                        `\n   Name: ${this.sigmaAbility.name}` +
                        `\n   CooldownRarity: ${this.sigmaAbility.cooldownRarity}` +
                        `\n   EffectRarity: ${this.sigmaAbility.effectRarity}` +
                        `\n   CooldownSeconds: ${this.sigmaAbility.cooldown}` +
                        `\n   EffectModifer: ${this.sigmaAbility.effect}`;
        } else {
            string += `\nSigma: null`;
        }

        if (this.alphaAbility != null){
            string += `\nAlpha:` +
                        `\n   Name: ${this.alphaAbility.name}` +
                        `\n   CooldownRarity: ${this.alphaAbility.cooldownRarity}` +
                        `\n   EffectRarity: ${this.alphaAbility.effectRarity}` +
                        `\n   CooldownSeconds: ${this.alphaAbility.cooldown}` +
                        `\n   EffectModifer: ${this.alphaAbility.effect}`;
        } else {
            string += `\nAlpha: null`;
        }

        if (this.betaAbility != null){
            string += `\nBeta:` +
                        `\n   Name: ${this.betaAbility.name}` +
                        `\n   CooldownRarity: ${this.betaAbility.cooldownRarity}` +
                        `\n   EffectRarity: ${this.betaAbility.effectRarity}` +
                        `\n   CooldownSeconds: ${this.betaAbility.cooldown}` +
                        `\n   EffectModifer: ${this.betaAbility.effect}`;
        } else {
            string += `\nBeta: null`;
        }
        

                        // \nSigma:` +
                        //       `\n   Name: ${this.sigmaAbility.name}` +
                        //         `\n   CooldownRarity: ${this.sigmaAbility.cooldownRarity}` +
                        //         `\n   EffectRarity: ${this.sigmaAbility.effectRarity}` +
                        //         `\n   CooldownSeconds: ${this.sigmaAbility.cooldown}` +
                        //         `\n   EffectModifer: ${this.sigmaAbility.effect}` +
                        // `\nAlpha:` +
                        //         `\n   Name: ${this.alphaAbility.name}` +
                        //         `\n   CooldownRarity: ${this.alphaAbility.cooldownRarity}` +
                        //         `\n   EffectRarity: ${this.alphaAbility.effectRarity}` +
                        //         `\n   CooldownSeconds: ${this.alphaAbility.cooldown}` +
                        //         `\n   EffectModifer: ${this.alphaAbility.effect}` +
                        // `\nBeta:` +
                        //         `\n   Name: ${this.betaAbility.name}` +
                        //         `\n   CooldownRarity: ${this.betaAbility.cooldownRarity}` +
                        //         `\n   EffectRarity: ${this.betaAbility.effectRarity}` +
                        //         `\n   CooldownSeconds: ${this.betaAbility.cooldown}` +
                        //         `\n   EffectModifer: ${this.betaAbility.effect}`;

        if (this.epsilonAbility != null){
            string += `\nEpsilon:` +
                                `\n   Name: ${this.epsilonAbility.name}` +
                                `\n   CooldownRarity: ${this.epsilonAbility.cooldownRarity}` +
                                `\n   EffectRarity: ${this.epsilonAbility.effectRarity}` +
                                `\n   CooldownSeconds: ${this.epsilonAbility.cooldown}` +
                                `\n   EffectModifer: ${this.epsilonAbility.effect}`;
        } else {
            string += `\nEpsilon: null`;
        }

        return string;
    }
}