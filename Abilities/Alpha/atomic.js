class AtomicAbility {
  constructor(cooldownRarity, effectRarity) {
    //Necessary properties for all abilities
    this.name = "Atomic";
    this.icon = ASSET_MANAGER.getAsset(
      "./Sprites/Abilities/Icons/atomic_icon.png"
    );
    this.inUseIcon = ASSET_MANAGER.getAsset(
      "./Sprites/Abilities/Icons/atomic_in_use_icon.png"
    );
    this.dominant = true;
    this.effect = this.setEffect(effectRarity);
    this.effectRarity = effectRarity;
    this.cooldownRarity = cooldownRarity;
    this.cooldown = this.setCooldown(this.cooldownRarity);
    this.cooldownTimer = new AbilityCooldown(this.cooldown);
    this.inUse = false;
    this.updateDamage();
    //Ability specific properties
    this.updateBB();
    this.game = gameEngine;
    this.projectileCount = 0;
    
  }

  updateBB() {
    this.lastBB1 = this.BB1;
    if (player.facing === 0) {
      this.BB1 = new BoundingBox(player.x+150, player.y, 100, 256);
    } else {
      this.BB1 = new BoundingBox(player.x+50, player.y, 100, 256);
    }
    
  }
  onEquip() {}

  onUnequip() {}

  //This runs when the Character presses the ability button
  onUse() {
    if (this.inUse || this.cooldownTimer.checkCooldown()) return;
    gameEngine.addEntityFirst(new AbilityIndicatorEffect(this.icon));

    player.animations[4][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Abilities/atomic_right.png"),
      0,
      0,
      256,
      256,
      8,
      0.03,
      0,
      false
    );
    player.animations[4][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Abilities/atomic_left.png"),
      0,
      0,
      256,
      256,
      8,
      0.03,
      0,
      false
    );

    player.animations[4][0].yOffset = 0;
    player.animations[4][0].xOffset = 0;
    player.animations[4][1].yOffset = 0;
    player.animations[4][1].xOffset = 0;
    this.inUse = true;
    player.usingAbility = true;
    console.log("Atomic started");
  }

  //The ability will call this itself
  //(useful for cooldowns, reverting player state, etc)
  onEnd() {
    this.cooldownTimer.startCooldown();
    player.usingAbility = false;
    this.inUse = false;
    console.log("Atomic ended");
    this.projectileCount = 0;
  }

  //Edit these to change the cooldown of the ability based on rarity
  setCooldown(cooldownRarity) {
    switch (cooldownRarity) {
      case 1:
      case 2:
      case 3:
      case 4:
        return 0;
      default:
        console.log("Cooldown rarity not found");
    }
    return 0;
  }

  //Edit these to change the effect of the ability based on rarity
  setEffect(effectRarity) {

    //damge between 1 and 3
    switch (effectRarity) {
      case 1:
        return 2.5
      case 2:
        return 3.5
      case 3:
        return 4.5
      case 4:
        return 5.5
      default:
        console.log("Effect rarity not found");
        return -1;
    }
  }

  updateDamage() {
    this.damage = Math.round(this.effect * (params.DARK_ENERGY.rangedAttack+1) * 10) / 10;
    this.description =
      "Become a gun slinger, shooting    " + this.effectRarity + " orb(s) that inflict " + this.damage + " damage.";
  }

  //Required
  update() {
    //this.elapsedTime += this.game.clockTick;
    this.updateDamage();
    this.cooldownTimer.checkCooldown();
    
    if (this.inUse && this.projectileCount == 0) {
      //this.elapsedTime = 0;

      for (let i = 0; i < this.effectRarity; i++) {
        this.game.camera.game.addEntityFirst(new AtomicProjectile(this.game, this.x, this.y, player.facing, this.damage));
      }
      this.projectileCount = 1;
    }
    
    // if game camera.gameOver is true, then end the ability
    if (this.inUse && gameEngine.camera.gameOver) {
      this.onEnd();
    } else {
      if (
        this.inUse &&
        (player.animations[4][0].isDone() || player.animations[4][1].isDone())
      ) {
        player.usingAbility = false;

      }
      //if player is not using ability, end the ability
      if (this.inUse && !player.usingAbility) {
        this.onEnd();

      }
    }

    this.updateBB();
    //update x and y to follow player
    this.x = player.x;
    this.y = player.y;
  }

  //Required - draw collision BB here
  draw(ctx) {
    if (debug && this.inUse && (player.animations[4][0].currentFrame() >= 2|| player.animations[4][1].currentFrame() >= 2)) {
      ctx.strokeRect(this.BB1.x - gameEngine.camera.x, this.BB1.y - gameEngine.camera.y, this.BB1.width, this.BB1.height);
    }
  }
}