class GameCharacter {
  #sprite;
  BLOCKWIDTH = 256;

  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    //Physics
    this.JUMP_ACC = -1300;
    this.MIN_RUN = 50;
    this.MAX_RUN = 800;
    this.RUN_ACC = 2500;
    this.DEC_SKID = 7000;
    this.DEC_REL = 1500;
    this.FALL_ACC = 2700;
    this.MAX_JUMPS = 2;
    this.JUMPS = this.MAX_JUMPS;
    const TICK = this.game.clockTick;
    this.state = 2;

    //Base Stats
    this.baseHealth = 5;
    this.health = this.baseHealth + params.DARK_ENERGY.hp;
    this.width = 256;
    this.height = 256;
    this.facing = 0; // 0 = right, 1 == left
    this.state = 0; //0 = idle, 1 = running, 2 = falling 3 = jumping, 4 = attacking
    this.velocity = { x: 0, y: 0 };
    this.dead = false;
    this.currentIFrameTimer = 0;
    this.maxIFrameTimer = 65;
    this.usingAbility = false;
    this.updateBB();
    this.animationXOffset = 0;
    this.animationYOffset = 0;
    this.animations = [];
    this.loadAnimations();

    this.brightness = 150;
  }

  updateBB() {
    this.lastBB = this.BB;
    if (this.state === 3)
      this.BB = new BoundingBox(this.x + 100, this.y, 100, 256);
    else if (this.state === 1) {
      if (this.facing === 0) {
        this.BB = new BoundingBox(this.x + 150, this.y, 100, 256);
      } else {
        this.BB = new BoundingBox(this.x + 50, this.y, 100, 256);
      }
    } else {
      if (this.facing == 0)
        this.BB = new BoundingBox(this.x + 100, this.y, 100, 256);
      else this.BB = new BoundingBox(this.x + 50, this.y, 100, 256);
    }
  }

  update() {
    const JUMP_ACC = this.JUMP_ACC;
    const MIN_RUN = this.MIN_RUN;
    const MAX_RUN = this.MAX_RUN;
    const RUN_ACC = this.RUN_ACC;
    const DEC_SKID = this.DEC_SKID;
    const DEC_REL = this.DEC_REL;
    const MAX_FALL = this.MAX_FALL;
    const FALL_ACC = this.FALL_ACC;
    const TICK = this.game.clockTick;


    // Call ability update methods at all times
    if (params.INVENTORY.dnaSlot1 != null) params.INVENTORY.dnaSlot1.update();
    if (params.INVENTORY.dnaSlot2 != null) params.INVENTORY.dnaSlot2.update();

    if (keypress("Escape") || this.game.controllerButtonStart_press) {
        this.game.PAUSED = !this.game.PAUSED;
    }

    // Ground Physics
    if (this.state < 2) {
      if (this.state == 0 || (this.state == 1 && params.STATE == "gameplay"))
        this.JUMPS = this.MAX_JUMPS;
      // this.animationXOffset = 0;
      // this.animationYOffset = 0;
      if (Math.abs(this.velocity.x) < MIN_RUN && this.velocity.y <= 0) {
        this.velocity.x = 0;
        this.state = 0;
        if (
          (this.game.keys.KeyA || this.game.controllerButtonLeft) &&
          params.STATE == "gameplay"
        ) {
          this.velocity.x -= MIN_RUN;
        }
        if (
          (this.game.keys.KeyD || this.game.controllerButtonRight) &&
          params.STATE == "gameplay"
        ) {
          this.velocity.x += MIN_RUN;
        }
      } else if (Math.abs(this.velocity.x) >= MIN_RUN && this.velocity.y <= 0) {
        if (this.facing === 0) {
         // this.animationYOffset = -35;
          if (
            (this.game.keys.KeyD || this.game.controllerButtonRight) &&
            (!this.game.keys.KeyA || !this.game.controllerButtonLeft) &&
            params.STATE == "gameplay"
          ) {
            this.velocity.x += RUN_ACC * TICK;
           // this.animationXOffset = 0;
          } else if (
            (this.game.keys.KeyA || this.game.controllerButtonLeft) &&
            (!this.game.keys.KeyD || !this.game.controllerButtonRight) &&
            params.STATE == "gameplay"
          ) {
            this.velocity.x -= DEC_SKID * TICK;
          } else {
            this.velocity.x -= DEC_REL * TICK;
          }
        }
        if (this.facing === 1) {
         // this.animationYOffset = -35;
          if (
            (this.game.keys.KeyA || this.game.controllerButtonLeft) &&
            (!this.game.keys.KeyD || !this.game.controllerButtonRight) &&
            params.STATE == "gameplay"
          ) {
            this.velocity.x -= RUN_ACC * TICK;
          } else if (
            (this.game.keys.KeyD || this.game.controllerButtonRight) &&
            (!this.game.keys.KeyA || !this.game.controllerButtonLeft) &&
            params.STATE == "gameplay"
          ) {
            this.velocity.x += DEC_SKID * TICK;
          } else {
            this.velocity.x += DEC_REL * TICK;
          }
        }
      } else if (this.velocity.y >= 0) {
        this.state = 2;
        if (this.facing == 0) {
          // this.animationXOffset = 257;
          // this.animationYOffset = 200;
        } else {
          // this.animationXOffset = 0;
          // this.animationYOffset = 200;
        }
      }
      this.velocity.y += FALL_ACC * TICK;

      // Jump Physics
      this.jump();

      //Falling
    } else if (this.velocity.y >= 0) {
      
      if (this.jump() != true) this.state = 2;
      if (this.facing == 0) {
        // this.animationXOffset = 257;
        // this.animationYOffset = 200;
      } else {
        // this.animationXOffset = 0;
        // this.animationYOffset = 200;
      }
      if (
        (this.game.keys.KeyD && !this.game.keys.KeyA) ||
        (this.game.controllerButtonRight && !this.game.controllerButtonLeft)
      ) {
        this.velocity.x += RUN_ACC * TICK;
      } else if (
        (this.game.keys.KeyA && !this.game.keys.keyD) ||
        (this.game.controllerButtonLeft && !this.game.controllerButtonRight)
      ) {
        this.velocity.x -= RUN_ACC * TICK;
      }

      if (this.game.keys.KeyS || (this.game.controllerButtonA)) {
        this.velocity.y += FALL_ACC * TICK*2;
      }
    }

    //Ability to move while jumping
    if (this.state == 3){
      if (
        (this.game.keys.KeyD && !this.game.keys.KeyA) ||
        (this.game.controllerButtonRight && !this.game.controllerButtonLeft)
      ) {

        if (Math.abs(this.velocity.x) < MIN_RUN) {
          this.velocity.x += MIN_RUN;
        } else {
          this.velocity.x += RUN_ACC * TICK;
        }
      } else if (
        (this.game.keys.KeyA && !this.game.keys.keyD) ||
        (this.game.controllerButtonLeft && !this.game.controllerButtonRight)
      ) {

        if (Math.abs(this.velocity.x) >= MIN_RUN) {
          this.velocity.x -= MIN_RUN;
        } else {
          this.velocity.x -= RUN_ACC * TICK;
        }
      }
    }

    this.velocity.y += FALL_ACC * TICK;
    if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
    if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
    this.x += this.velocity.x * TICK;
    this.y += this.velocity.y * TICK;
    this.updateBB();

    //Collision
    this.game.entities.forEach((entity) => {
      // Collisions with players bounding box
      if (entity.BB && this.BB.collide(entity.BB)) {
        //falling
        if (this.velocity.y > 0) {
          if (
            entity instanceof SmallPlatform ||
            (entity instanceof Platform && this.lastBB.bottom <= entity.BB.top)
          ) {
            this.y = entity.BB.top - this.BB.height;
            this.velocity.y = 0;
            // this.animationXOffset = 0;
            // this.animationYOffset = 0;
            if (this.state === 2 || this.state == 3) this.state = 0;
            this.updateBB();
          }
        }

        // Damage Player

        if (entity.hostile) {
          // if reaper is in attack state
          if (
            entity instanceof Reaper &&
            entity.state == 3 &&
            this.currentIFrameTimer === 0 
          ) {
            // subtract reaper damage from player health
            this.health -= Math.max(0, entity.damage - params.DARK_ENERGY.meleeDefense);
            this.health = Math.max(this.health, 0);
            this.currentIFrameTimer = this.maxIFrameTimer;
            this.game.addEntityFirst(
              new DamageIndicator(this.x+150, this.y, entity.damage)
            );
            this.brightness = 220;
          }
          if (
            entity instanceof MoleculeProjectile &&
            this.currentIFrameTimer == 0
          ) {
            // subtract molecule damage from player health
            this.health -= Math.max(0, entity.damage - params.DARK_ENERGY.rangedDefense);
            this.currentIFrameTimer = this.maxIFrameTimer;
            entity.removeFromWorld = true;
            this.game.camera.game.addEntityFirst(
              new DamageIndicator(this.x+250, this.y, entity.damage)
            );
            this.brightness = 200;
          }

          if (
            entity instanceof BossProjectile &&
            this.currentIFrameTimer == 0 
          ) {
            // subtract boss projectile damage from player health
            this.health -= Math.max(0, entity.damage - params.DARK_ENERGY.rangedDefense);
            this.currentIFrameTimer = this.maxIFrameTimer;
            entity.removeFromWorld = true;
            this.game.camera.game.addEntityFirst(
              new DamageIndicator(this.x+250, this.y, entity.damage)
            );
            this.brightness = 200;
          }
        }
      }
    });

    // Update State
    if (this.state !== 4 && this.state !== 2 && this.state !== 3) {
      if (Math.abs(this.velocity.x) > 0) {
        this.state = 1;
        this.animationXOffset = 0;
        this.animationYOffset = -30;
      } else {
        this.state = 0;
        this.animationXOffset = 0;
        this.animationYOffset = 0;
      }
    }

    // Update Facing direction
    if (this.velocity.x < 0) this.facing = 1;
    if (this.velocity.x > 0) this.facing = 0;

    //Create particle under and behind player feet
    if (this.state == 1 && this.facing == 1 && this.animations[1][1].currentFrame() % 3 == 0 && !this.usingAbility){

      params.PARTICLE_SYSTEM.createParticleEffect(this.x + 200 - gameEngine.camera.x, this.y+256 - gameEngine.camera.y, 1+3*(Math.abs(this.velocity.x)/this.MAX_RUN), 5, '#330000', 10, 3, 0.3, -1, 1);
    } else if (this.state == 1 && this.facing == 0 && this.animations[1][0].currentFrame() % 3 == 0 && !this.usingAbility){
      params.PARTICLE_SYSTEM.createParticleEffect(this.x + 100 - gameEngine.camera.x, this.y+256 - gameEngine.camera.y, 1+3*(Math.abs(this.velocity.x)/this.MAX_RUN), 5, '#330000', 10, 3, 0.3, -1, 1);

    }



    // Pass control to abilities
    this.abilityControls();

    // Check if player is out of bounds
    if (this.y > 1700 && !this.dead) {
      this.dead = true;
      this.game.camera.gameOver = true;
      
    }


    if (this.health <= 0) {
      if(params.RESURRECTS > 0) {
        

      } else {
        this.dead = true;
        this.game.camera.gameOver = true;
      }
      

    }

    if (this.currentIFrameTimer > 0) {
      this.currentIFrameTimer -= 1;
      // console.log(this.currentIFrameTimer);
    }
  }

  jump() {
    if (
      !this.game.PAUSED &&
      params.STATE == "gameplay" &&
      (this.game.keys.Space || this.game.controllerButtonRT) &&
      this.JUMPS > 0
    ) {

      this.JUMPS--;
      this.velocity.y = this.JUMP_ACC;
      if (this.facing == 0) {
        this.animationXOffset = 257;
        this.animationYOffset = 300;
      } else {
        this.animationYOffset = 300;
      }
      this.state = 3;
      this.animations[this.state][this.facing].elapsedTime = 0;
      return true;
    } else {
      return false;
    }
  }

  abilityControls() {
    if (this.game.keys.ArrowUp || (this.game.controllerButtonY)) {
      if (
        params.INVENTORY.dnaSlot1 != null &&
        params.INVENTORY.dnaSlot1.sigmaAbility != null
      ) {
        params.INVENTORY.dnaSlot1.sigmaAbility.onUse();
      }
    }

    if ((this.game.keys.ArrowUp && KeyboardEvent.shiftKey) || (this.controllerButtonLT && this.controllerButtonY)) {
      if (
        params.INVENTORY.dnaSlot2 != null &&
        params.INVENTORY.dnaSlot2.sigmaAbility != null
      ) {
        params.INVENTORY.dnaSlot2.sigmaAbility.onUse();
      }
    }

      if (this.game.keys.ArrowRight || (this.game.controllerButtonB)) {
      if (
        params.INVENTORY.dnaSlot1 != null &&
        params.INVENTORY.dnaSlot1.alphaAbility != null
      ) {
        params.INVENTORY.dnaSlot1.alphaAbility.onUse();
      }
    }

    if ((this.game.keys.ArrowRight && KeyboardEvent.shiftKey) || (this.game.controllerButtonLT && this.game.controllerButtonB)) {
      if (
        params.INVENTORY.dnaSlot2 != null &&
        params.INVENTORY.dnaSlot2.alphaAbility != null
      ) {
        params.INVENTORY.dnaSlot2.alphaAbility.onUse();
      }
    }

      if (this.game.keys.ArrowLeft || (this.game.controllerButtonX)) {
      if (
        params.INVENTORY.dnaSlot1 != null &&
        params.INVENTORY.dnaSlot1.epsilonAbility != null
      ) {
        params.INVENTORY.dnaSlot1.epsilonAbility.onUse();
      }
    }

    if ((this.game.keys.ArrowLeft && KeyboardEvent.shiftKey) || (this.game.controllerButtonLT && this.game.controllerButtonX)) {
      if (
        params.INVENTORY.dnaSlot2 != null &&
        params.INVENTORY.dnaSlot2.epsilonAbility != null
      ) {
        params.INVENTORY.dnaSlot2.epsilonAbility.onUse();
      }
    }

      if (this.game.keys.ArrowDown || (this.game.controllerButtonA)) {
      if (
        params.INVENTORY.dnaSlot1 != null &&
        params.INVENTORY.dnaSlot1.betaAbility != null
      ) {
        params.INVENTORY.dnaSlot1.betaAbility.onUse();
      }
    }

    if ((this.game.keys.ArrowDown && KeyboardEvent.shiftKey) || (this.game.controllerButtonLT && this.game.controllerButtonA)) {
      if (
        params.INVENTORY.dnaSlot2 != null &&
        params.INVENTORY.dnaSlot2.betaAbility != null
      ) {
        params.INVENTORY.dnaSlot2.betaAbility.onUse();
      }
    }
  }

  loadAnimations() {
    for (let i = 0; i < 5; i++) {
      this.animations.push([]);
      for (let j = 0; j < 2; j++) {
        // two directions
        this.animations[i].push([]);
      }
    }

    // idle animation for state = 0
    // facing right = 0
    this.animations[0][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_idle_right.png"),
      0,
      0,
      256,
      256,
      8,
      0.2,
      0,
      true
    );


    // facing left = 1
    this.animations[0][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_idle_left.png"),
      0,
      0,
      256,
      256,
      8,
      0.2,
      0,
      true
    );

    // Walking Animation state = 1
    // facing right = 0
    this.animations[1][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_running_right.png"),
      0,
      0,
      320,
      256,
      5,
      0.075,
      0,
      true
    );

    // facing left = 1
    this.animations[1][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_running_left.png"),
      0,
      0,
      320,
      256,
      5,
      0.075,
      0,
      true
    );

    // Falling animation for state = 2
    // facing right = 0
    this.animations[2][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_falling_right.png"),
      0,
      0,
      512,
      564,
      5,
      0.1,
      0,
      true
    );

    //facing left  = 1
    this.animations[2][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_falling_left.png"),
      0,
      0,
      512,
      564,
      5,
      0.1,
      0,
      true
    );

    // Jumping Animation state = 3
    // facing right = 0
    this.animations[3][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_jump_right.png"),
      0,
      0,
      512,
      564,
      8,
      0.075,
      0,
      false
    );

    // facing left = 1
    this.animations[3][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Player/player_jump_left.png"),
      0,
      0,
      512,
      564,
      8,
      0.075,
      0,
      false
    );

    //this.animations[4][0] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/emp.png"), 0, 0, 1200, 1164, 7, 0.1, 0, true);
    //this.animations[4][1] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Abilities/emp.png"), 0, 0, 1200, 1164, 7, 0.1, 0, true);
    


    //Offsets
    //idle
    this.animations[0][0].xOffset = 0;
    this.animations[0][0].yOffset = 0;
    this.animations[0][1].xOffset = 0;
    this.animations[0][1].yOffset = 0;

    //running
    this.animations[1][0].xOffset = 0;
    this.animations[1][0].yOffset = 40;
    this.animations[1][1].xOffset = 0;
    this.animations[1][1].yOffset = 40;

    //falling
    this.animations[2][0].xOffset = -256;
    this.animations[2][0].yOffset = -256;
    this.animations[2][1].xOffset = 0;
    this.animations[2][1].yOffset = -256;

    //jumping
    this.animations[3][0].xOffset = -256;
    this.animations[3][0].yOffset = -256;
    this.animations[3][1].xOffset = 10;
    this.animations[3][1].yOffset = -256;

  }
  draw(ctx) {


    ctx.filter = "brightness" + "(" + this.brightness + "%)";
    if (this.brightness > 100) this.brightness -= 2;

    if (this.usingAbility){
      this.animations[4][this.facing].drawFrame(
        this.game.clockTick,
        ctx,
        this.x - this.game.camera.x,
        this.y - this.game.camera.y,
        1
      );
    } else {
      this.animations[this.state][this.facing].drawFrame(
        this.game.clockTick,
        ctx,
        this.x - this.game.camera.x,
        this.y - this.game.camera.y,
        1
      );

    }
    ctx.filter = "none"


    //DEBUG (I probably should have put it all in one if statement oops lmao)
    ctx.fillStyle = "white";
    ctx.font = "20px " + params.FONT;
    ctx.textAlign = "left";
    if (debug)
      ctx.strokeRect(
        this.BB.x - this.game.camera.x,
        this.BB.y - this.game.camera.y,
        this.BB.width,
        this.BB.height
      );
    //put debug on screen text for x, y, velocity, state, facing, and jumps on the right hand side of the screen
    let debugY = 150;
    let debugX = 1400;
    //use math.round
    if (debug) ctx.fillText("X: " + Math.round(this.x), debugX, debugY);
    if (debug) ctx.fillText("Y: " + Math.round(this.y), debugX, debugY + 20);
    if (debug)
      ctx.fillText(
        "Velocity X: " + Math.round(this.velocity.x),
        debugX,
        debugY + 40
      );
    if (debug)
      ctx.fillText(
        "Velocity Y: " + Math.round(this.velocity.y),
        debugX,
        debugY + 60
      );
    switch (this.state) {
      case 0:
        if (debug) ctx.fillText("State: Idle", debugX, debugY + 80);
        break;
      case 1:
        if (debug) ctx.fillText("State: Running", debugX, debugY + 80);
        break;
      case 2:
        if (debug) ctx.fillText("State: Falling", debugX, debugY + 80);
        break;
      case 3:
        if (debug) ctx.fillText("State: Jumping", debugX, debugY + 80);
        break;
      case 4:
        if (debug) ctx.fillText("State: Ability", debugX, debugY + 80);
        break;
      default:
        if (debug) ctx.fillText("State: Unknown", debugX, debugY + 80);
        break;
    }
    switch (this.facing) {
      case 0:
        if (debug) ctx.fillText("Facing: Right", debugX, debugY + 100);
        break;
      case 1:
        if (debug) ctx.fillText("Facing: Left", debugX, debugY + 100);
        break;
      default:
        if (debug) ctx.fillText("Facing: Unknown", debugX, debugY + 100);
        break;
    }
    

    if (debug) ctx.fillText("Jump Acceleration: " + this.JUMP_ACC, debugX, debugY + 240);
    if (debug) ctx.fillText("Max Run Speed: " + this.MAX_RUN, debugX, debugY + 220);
    if (debug) ctx.fillText("Jumps: " + this.JUMPS, debugX, debugY + 120);
    if (debug)
      ctx.fillText("PAUSED: " + this.game.PAUSED, debugX, debugY + 140);
    if (debug) ctx.fillText("Health: " + this.health, debugX, debugY + 160);
    if (debug)
      ctx.fillText(
        "Current IFrames: " + this.currentIFrameTimer,
        debugX,
        debugY + 180
      );
      if (debug)
      ctx.fillText(
        "Using Ability: " + this.usingAbility,
        debugX,
        debugY + 200
      );
    if (debug) {
      ctx.strokeRect(
        this.BB.x - this.game.camera.x,
        this.BB.y - this.game.camera.y,
        this.BB.width,
        this.BB.height
      );

      //draw information about the all abilities equipped in slot1 (Sigma, alpha, beta, epsilon) for these fields: in use , effect, effect rarity, cooldown rarity, cooldown, and cooldown max, name
      if (debug){
       // ctx.fillText("Slot 1", debugX, debugY + 220);
        if (params.INVENTORY.dnaSlot1 != null && params.INVENTORY.dnaSlot1.sigmaAbility != null){
          ctx.fillText("Sigma Ability: " + params.INVENTORY.dnaSlot1.sigmaAbility.name, debugX, debugY + 240);
          ctx.fillText("In Use: " + params.INVENTORY.dnaSlot1.sigmaAbility.inUse, debugX, debugY + 260);
          ctx.fillText("Effect: " + params.INVENTORY.dnaSlot1.sigmaAbility.effect, debugX, debugY + 280);
          ctx.fillText("Effect Rarity: " + params.INVENTORY.dnaSlot1.sigmaAbility.effectRarity, debugX, debugY + 300);
          ctx.fillText("Cooldown Rarity: " + params.INVENTORY.dnaSlot1.sigmaAbility.cooldownRarity, debugX, debugY + 320);
          ctx.fillText("Cooldown: " + params.INVENTORY.dnaSlot1.sigmaAbility.cooldown, debugX, debugY + 340);
          let remainingSeconds = (params.INVENTORY.dnaSlot1.sigmaAbility.cooldownTimer != null) ? params.INVENTORY.dnaSlot1.sigmaAbility.cooldownTimer.getRemainingSeconds() : -1;
          //ctx.fillText("Cooldown Seconds Remaining: " + params.INVENTORY.dnaSlot1.sigmaAbility.cooldownTimer.getRemainingSeconds(), debugX, debugY + 360);
        }

        if (params.INVENTORY.dnaSlot1 != null && params.INVENTORY.dnaSlot1.alphaAbility != null){
          ctx.fillText("Alpha Ability: " + params.INVENTORY.dnaSlot1.alphaAbility.name, debugX, debugY + 400);
          ctx.fillText("In Use: " + params.INVENTORY.dnaSlot1.alphaAbility.inUse, debugX, debugY + 420);
          ctx.fillText("Effect: " + params.INVENTORY.dnaSlot1.alphaAbility.effect, debugX, debugY + 440);
          ctx.fillText("Effect Rarity: " + params.INVENTORY.dnaSlot1.alphaAbility.effectRarity, debugX, debugY + 460);
          ctx.fillText("Cooldown Rarity: " + params.INVENTORY.dnaSlot1.alphaAbility.cooldownRarity, debugX, debugY + 480);
          ctx.fillText("Cooldown: " + params.INVENTORY.dnaSlot1.alphaAbility.cooldown, debugX, debugY + 500);
          let remainingSeconds = (params.INVENTORY.dnaSlot1.alphaAbility.cooldownTimer != null) ? params.INVENTORY.dnaSlot1.alphaAbility.cooldownTimer.getRemainingSeconds() : -1;
          ctx.fillText("Cooldown Seconds Remaining: " + remainingSeconds, debugX, debugY + 520);
        }
        if (params.INVENTORY.dnaSlot1 != null && params.INVENTORY.dnaSlot1.epsilonAbility != null){
          ctx.fillText("Epsilon Ability: " + params.INVENTORY.dnaSlot1.epsilonAbility.name, debugX, debugY + 560);
          ctx.fillText("In Use: " + params.INVENTORY.dnaSlot1.epsilonAbility.inUse, debugX, debugY + 580);
          ctx.fillText("Effect: " + params.INVENTORY.dnaSlot1.epsilonAbility.effect, debugX, debugY + 600);
          ctx.fillText("Effect Rarity: " + params.INVENTORY.dnaSlot1.epsilonAbility.effectRarity, debugX, debugY + 620);
          ctx.fillText("Cooldown Rarity: " + params.INVENTORY.dnaSlot1.epsilonAbility.cooldownRarity, debugX, debugY + 640);
          ctx.fillText("Cooldown: " + params.INVENTORY.dnaSlot1.epsilonAbility.cooldown, debugX, debugY + 660);
          let remainingSeconds = (params.INVENTORY.dnaSlot1.epsilonAbility.cooldownTimer != null) ? params.INVENTORY.dnaSlot1.epsilonAbility.cooldownTimer.getRemainingSeconds() : -1;
          ctx.fillText("Cooldown Seconds Remaining: " + remainingSeconds, debugX, debugY + 680);
        }

        if (params.INVENTORY.dnaSlot1 != null && params.INVENTORY.dnaSlot1.betaAbility != null){
          ctx.fillText("Beta Ability: " + params.INVENTORY.dnaSlot1.betaAbility.name, debugX, debugY + 720);
          ctx.fillText("In Use: " + params.INVENTORY.dnaSlot1.betaAbility.inUse, debugX, debugY + 740);
          ctx.fillText("Effect: " + params.INVENTORY.dnaSlot1.betaAbility.effect, debugX, debugY + 760);
          ctx.fillText("Effect Rarity: " + params.INVENTORY.dnaSlot1.betaAbility.effectRarity, debugX, debugY + 780);
          ctx.fillText("Cooldown Rarity: " + params.INVENTORY.dnaSlot1.betaAbility.cooldownRarity, debugX, debugY + 800);
          ctx.fillText("Cooldown: " + params.INVENTORY.dnaSlot1.betaAbility.cooldown, debugX, debugY + 820);
          let remainingSeconds = (params.INVENTORY.dnaSlot1.betaAbility.cooldownTimer != null) ? params.INVENTORY.dnaSlot1.betaAbility.cooldownTimer.getRemainingSeconds() : -1;
          ctx.fillText("Cooldown Seconds Remaining: " + remainingSeconds, debugX, debugY + 840);
        }



      }
        

        
    }

    //run draw event for all abilities
    //will add slot2 later
    if (
      params.INVENTORY.dnaSlot1 != null &&
      params.INVENTORY.dnaSlot1.sigmaAbility != null
    ) {
      params.INVENTORY.dnaSlot1.sigmaAbility.draw(ctx);
    }

    if (
      params.INVENTORY.dnaSlot1 != null &&
      params.INVENTORY.dnaSlot1.alphaAbility != null
    ) {
      params.INVENTORY.dnaSlot1.alphaAbility.draw(ctx);
    }

    if (
      params.INVENTORY.dnaSlot1 != null &&
      params.INVENTORY.dnaSlot1.epsilonAbility != null
    ) {
      params.INVENTORY.dnaSlot1.epsilonAbility.draw(ctx);
    }

    if (
      params.INVENTORY.dnaSlot1 != null &&
      params.INVENTORY.dnaSlot1.betaAbility != null
    ) {
      params.INVENTORY.dnaSlot1.betaAbility.draw(ctx);
    }
  }
}
