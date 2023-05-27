//This method will be used to create a new random DNA 
function getRandomDNA() {
    const sigmaAbility = getAbility('sigma');
    const alphaAbility = getAbility('alpha');
    const betaAbility = getAbility('beta');
    const epsilonAbility = getAbility('epsilon');

    let epsilonAbilityCooldownRarity = (epsilonAbility == null) ? 0 : epsilonAbility.cooldownRarity;
    let epsilonAbilityEffectRarity = (epsilonAbility == null) ? 0 : epsilonAbility.effectRarity;
    let sigmaAbilityCooldownRarity = (sigmaAbility == null) ? 0 : sigmaAbility.cooldownRarity;
    let sigmaAbilityEffectRarity = (sigmaAbility == null) ? 0 : sigmaAbility.effectRarity;
    let alphaAbilityCooldownRarity = (alphaAbility == null) ? 0 : alphaAbility.cooldownRarity;
    let alphaAbilityEffectRarity = (alphaAbility == null) ? 0 : alphaAbility.effectRarity;
    let betaAbilityCooldownRarity = (betaAbility == null) ? 0 : betaAbility.cooldownRarity;
    let betaAbilityEffectRarity = (betaAbility == null) ? 0 : betaAbility.effectRarity;


    // const rarity = calculateDnaRarity(
    //     sigmaAbility.cooldownRarity,
    //     alphaAbility.cooldownRarity,
    //     betaAbility.cooldownRarity,
    //     epsilonAbilityCooldownRarity,
    //     sigmaAbility.effectRarity,
    //     alphaAbility.effectRarity,
    //     betaAbility.effectRarity,
    //     epsilonAbilityEffectRarity
    // );

    const rarity = calculateDnaRarity(
        sigmaAbilityCooldownRarity,
        alphaAbilityCooldownRarity,
        betaAbilityCooldownRarity,
        epsilonAbilityCooldownRarity,
        sigmaAbilityEffectRarity,
        alphaAbilityEffectRarity,
        betaAbilityEffectRarity,
        epsilonAbilityEffectRarity
    );


    return new DNA(
        sigmaAbility,
        alphaAbility,
        betaAbility,
        epsilonAbility,
        rarity
    );
}

//This method will be used to create a new DNA based on the parents' DNA
//We don't use the AbilityFactory because we are not getting random abilities
//Pass in two DNA objects
function getDNAFromParents(parent1, parent2) {
    //Step 1: Inherit abilities from Parent DNA
    let childSigmaAbility = getAbilityFromParents(parent1.sigmaAbility, parent2.sigmaAbility);
    let childAlphaAbility = getAbilityFromParents(parent1.alphaAbility, parent2.alphaAbility);
    let childBetaAbility = getAbilityFromParents(parent1.betaAbility, parent2.betaAbility);
    let childEpsilonAbility = getAbility('epsilon');

    //Step 2: Inherit cooldown and effect rarity from Parent DNA
    childSigmaAbility.cooldownRarity = getRarityFromParents(parent1.sigmaAbility.cooldownRarity, parent2.sigmaAbility.cooldownRarity);
    childAlphaAbility.cooldownRarity = getRarityFromParents(parent1.alphaAbility.cooldownRarity, parent2.alphaAbility.cooldownRarity);
    childBetaAbility.cooldownRarity = getRarityFromParents(parent1.betaAbility.cooldownRarity, parent2.betaAbility.cooldownRarity);
    childSigmaAbility.effectRarity = getRarityFromParents(parent1.sigmaAbility.effectRarity, parent2.sigmaAbility.effectRarity);
    childAlphaAbility.effectRarity = getRarityFromParents(parent1.alphaAbility.effectRarity, parent2.alphaAbility.effectRarity);
    childBetaAbility.effectRarity = getRarityFromParents(parent1.betaAbility.effectRarity, parent2.betaAbility.effectRarity);

    //Step 3: Update the cooldown and effect of the inherited abilities 
    //        from the inherited rarities
    childSigmaAbility.setCooldown();
    childSigmaAbility.setEffect();
    childAlphaAbility.setCooldown();
    childAlphaAbility.setEffect();
    childBetaAbility.setCooldown();
    childBetaAbility.setEffect();

    //Step 4: Calculate the rarity of the child DNA
    let epsilonAbilityCooldownRarity = (childEpsilonAbility == null) ? 0 : childEpsilonAbility.cooldownRarity;
    let epsilonAbilityEffectRarity = (childEpsilonAbility == null) ? 0 : childEpsilonAbility.effectRarity;

    const rarity = calculateDnaRarity(
        childSigmaAbility.cooldownRarity,
        childAlphaAbility.cooldownRarity,
        childBetaAbility.cooldownRarity,
        epsilonAbilityCooldownRarity,
        childSigmaAbility.effectRarity,
        childAlphaAbility.effectRarity,
        childBetaAbility.effectRarity,
        epsilonAbilityEffectRarity
    );

    //Step 5: Return the child DNA
    return new DNA(
        childSigmaAbility,
        childAlphaAbility,
        childBetaAbility,
        childEpsilonAbility,
        rarity
    );
}

function getAbilityFromParents(parent1, parent2) {
    let childAblity = parent1.dominant ? parent1 : parent2;

    if ((parent1.dominant && parent2.dominant) ||
        (!parent1.dominant && !parent2.dominant)) {
        let random = Math.round(Math.random());
        childAblity = random ? parent1 : parent2;
    }

    return childAblity;
}

function getRarityFromParents(parent1Rarity, parent2Rarity) {
    return Math.floor((parent1Rarity + parent2Rarity) / 2);
}

function calculateDnaRarity(sigmaCooldownRarity,
    alphaCooldownRarity,
    betaCooldownRarity,
    epsilonCooldownRarity,
    sigmaEffectRarity,
    alphaEffectRarity,
    betaEffectRarity,
    epsilonEffectRarity) {
    let numberOfAttributes = (epsilonCooldownRarity == 0) ? 6 : 8;
    let rarity = 0;
    rarity += sigmaCooldownRarity;
    rarity += alphaCooldownRarity;
    rarity += betaCooldownRarity;
    rarity += sigmaEffectRarity;
    rarity += alphaEffectRarity;
    rarity += betaEffectRarity;
    rarity += epsilonCooldownRarity;
    rarity += epsilonEffectRarity;
    rarity = Math.round(rarity / numberOfAttributes);
    return rarity;
}

function getRarityAsString(rarity) {
    switch (rarity) {
        case 1:
            return 'Common';
        case 2:
            return 'Uncommon';
        case 3:
            return 'Rare';
        case 4:
            return 'Godlike';
    }
}

function dnaInfoWindow(ctx, x, y, dna) {
    // let dna = this.inventory[this.currentDna];
    if (dna == null) return;
    //function wrapText(ctx, text, x, y, maxWidth, lineHeight)

    let windowWidth = CANVAS_WIDTH / 3;
    let windowHeight = CANVAS_HEIGHT / 1.8;
    let xIconOffset = 35;
    let yIconOffset = 20;
    let xNameOffset = 30;
    let yNameOffset = 15;
    let xCooldownOffset = 230;
    let yCooldownOffset = -55;
    let xDescriptionOffset = 230;
    let yDescriptionOffset = -40;
    let yGap = 30;
    let fontHeight = 35;


    ctx.fillStyle = "#e09fa4"//"#994B50";
    ctx.globalAlpha = .9;
    ctx.fillRect(x, y, windowWidth, windowHeight);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#330000";
    ctx.lineWidth = 5;
    ctx.strokeRect(x, y, windowWidth, windowHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "32px " + params.FONT;
    //ctx.fillText(getRarityAsString(dna.rarity) + " DNA", x + windowWidth / 2, y);

    if (dna.sigmaAbility != null) {
        ctx.drawImage(dna.sigmaAbility.icon, x + xIconOffset, y + yGap - yIconOffset, 98, 98);
        ctx.fillText(dna.sigmaAbility.name, x + xNameOffset, y + yGap * 4 + yNameOffset);
        drawRarityColoredText(ctx, dna.sigmaAbility.cooldown + "s", x + xCooldownOffset, y + yCooldownOffset + yGap * 3, dna.sigmaAbility.cooldownRarity);
        wrapText(ctx, dna.sigmaAbility.description, x + xDescriptionOffset, y + yDescriptionOffset + yGap * 4, windowWidth/1.7, fontHeight, getRarityColor(dna.sigmaAbility.effectRarity));
    } else {
        ctx.fillText("No Sigma Ability", x + xDescriptionOffset, y + yGap * 4 + yNameOffset);
    }
    
    if (dna.alphaAbility != null) {
        ctx.drawImage(dna.alphaAbility.icon, x + xIconOffset, y + yGap * 6 - yIconOffset, 98, 98);
        ctx.fillText(dna.alphaAbility.name, x + xNameOffset, y + yGap * 9 + yNameOffset);
        drawRarityColoredText(ctx, dna.alphaAbility.cooldown + "s", x + xCooldownOffset, y + yCooldownOffset + yGap * 8, dna.alphaAbility.cooldownRarity);
        wrapText(ctx, dna.alphaAbility.description, x + xDescriptionOffset, y + yDescriptionOffset + yGap * 9, windowWidth/1.7, fontHeight, getRarityColor(dna.alphaAbility.effectRarity));
    } else {
        ctx.fillText("No Alpha Ability", x + xDescriptionOffset, y + yGap * 9 + yNameOffset);
    }
    

    if (dna.betaAbility != null) {
        ctx.drawImage(dna.betaAbility.icon, x + xIconOffset, y + yGap * 11 - yIconOffset, 98, 98);
        ctx.fillText(dna.betaAbility.name, x + xNameOffset, y + yGap * 14 + yNameOffset);
        drawRarityColoredText(ctx, dna.betaAbility.cooldown + "s", x + xCooldownOffset, y + yCooldownOffset + yGap * 13, dna.betaAbility.cooldownRarity);        
        wrapText(ctx, dna.betaAbility.description, x + xDescriptionOffset, y + yDescriptionOffset + yGap * 14, windowWidth/1.7, fontHeight, getRarityColor(dna.betaAbility.effectRarity));
    } else {
        ctx.fillText("No Beta Ability", x + xDescriptionOffset, y + yDescriptionOffset + yGap * 14);
    }



    if (dna.epsilonAbility != null) {
        ctx.drawImage(dna.epsilonAbility.icon, x + xIconOffset, y + yGap * 16 - yIconOffset, 98, 98);
        ctx.fillText(dna.epsilonAbility.name, x + xNameOffset, y + yGap * 19 + yNameOffset);
        drawRarityColoredText(ctx, dna.epsilonAbility.cooldown + "s", x + xCooldownOffset, y + yCooldownOffset + yGap * 18, dna.epsilonAbility.cooldownRarity);
        wrapText(ctx, dna.epsilonAbility.description, x + xDescriptionOffset, y + yDescriptionOffset + yGap * 19, windowWidth/1.7, fontHeight, getRarityColor(dna.epsilonAbility.effectRarity));
        //ctx.fillText(dna.epsilonAbility.description, x + xDescriptionOffset, y + yDescriptionOffset + yGap * 19);
    } else {
        ctx.fillText("No Epsilon Ability", x + xDescriptionOffset, y + yGap * 19 + yNameOffset);
    }

    //draw separator lines
    ctx.beginPath();
    ctx.moveTo(x, y + yGap * 5 + 5);
    ctx.lineTo(x + windowWidth, y + yGap * 5 + 5);
    ctx.strokeStyle = "#330000";
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + yGap * 10 + 5);
    ctx.lineTo(x + windowWidth, y + yGap * 10 + 5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y + yGap * 15 + 5);
    ctx.lineTo(x + windowWidth, y + yGap * 15 + 5);


    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + windowWidth / 3, y);
    ctx.lineTo(x + windowWidth / 3, y + windowHeight);
    ctx.stroke();
}

//draw text a certain color depending on the rarity
function getRarityColor(rarity) {
    switch (rarity) {
        case 1:
            return "#e3000f";
            break;
        case 2:
            return "#1E9958";
            break; 
        case 3:
            return "#0080B2";
            break;
        case 4:
            return "#E55916"; 
            break;
     }
}

//draw text a certain color depending on the rarity
function drawRarityColoredText(ctx, text, x, y, rarity) {
    switch (rarity) {
        case 1:
            ctx.fillStyle = "#e3000f";
            break;
        case 2:
            ctx.fillStyle = "#1E9958"; 
            break;
        case 3:
            ctx.fillStyle = "#0080B2";
            break;
        case 4:
            ctx.fillStyle = "#E55916"; 
            break;
    }
    ctx.fillText(text, x, y);
    
}