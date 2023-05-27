class Molecule {
  constructor(game, x, y, size) {
    Object.assign(this, { game, x, y, size });
    const TICK = this.game.clockTick;
    this.molecule = this;
    this.player = this.game.camera.player;
    this.hostile = true;


    this.width = 256;
    this.height = 256;
    this.facing = 1; // 0 = right, 1 == left
    this.state = size; // 0 = low 1 = half,  2 = full, 3 = attack
    this.velocity = { x: 0, y: 0 };
    this.health = ENEMY_HEALTH;
    this.maxHealth = this.health;
    this.dead = false;
    this.paused = true;
    this.currentIFrameTimer = 0;
    this.maxIFrameTimer = ENEMY_IFRAME;
    
    //Changed to center point
    this.projectileBuffer = 150;

    this.attackDistance = Math.random() * 200 + 300;
    this.fireRate = MOLECULE_FIRE_RATE;
    this.elapsedTime = 0;
    this.updateBB();
    this.animationXOffset = 0;
    this.animationYOffset = 0;
    this.animations = [];
    this.frameDuration = 0.2; //allows for easy freezing of animation speed for disabled molecules
    this.loadAnimations();

    this.disabled = false; //status condition specific to Molecules
  }

  updateBB() {
    this.lastBB = this.BB;
    this.BB = new BoundingBox(this.x+75, this.y+50, 100, 100);
  }

  update() {
    //if enemy is dead, remove from game
    if (this.health <= 0 || this.y > 1000) {
      this.dead = true;
      console.log("Molecule " + this.id + " with " + this.health + " hp was removed from the game");
      params.PARTICLE_SYSTEM.createParticleEffect(this.x + this.width/2 - gameEngine.camera.x, this.y + this.height/2 - gameEngine.camera.y, 50, 14, '#FF3232', 23, 5, 0.55);
      this.removeFromWorld = true;
      dropItems(this.x, this.y);
    }

    const TICK = this.game.clockTick;
    this.elapsedTime += this.game.clockTick;

    //Update Molecule Visual based off health
    if (this.health <= this.maxHealth/3) {
      this.size = 0;
    } else if (this.health <= this.maxHealth/1.5) {
      this.size = 1;
    }

    if (this.paused && this.game.camera.player.x > this.x - 1000) {
      this.paused = false;
    }

    if (this.disabled) 
      //(x, y, particleCount, particleSize, particleColor, xSpeed, ySpeed, sizeDecrement)
      params.PARTICLE_SYSTEM.createParticleEffect(this.x + this.width/2 - gameEngine.camera.x, this.y + this.height/2 - gameEngine.camera.y, 1, 20, '#330000', 5, 2, 0.3);
    
      this.updateBB();

    if (!this.paused && !this.dead && !this.disabled) {
      // If not paused, activate molecule AI
      if (this.x > this.player.x) this.velocity.x += -100 * TICK;
      if (this.x < this.player.x && this.velocity.x < 0) {
        this.velocity.x = 0;
      }

      if (this.y > this.player.y) this.velocity.y += -100 * TICK;
      if (this.y < this.player.y && this.velocity.y < 0) {
        this.velocity.y = 0;
      }
      //Stop moving Condition

      //if the molecule is to the right of the player
      if (this.x > this.player.x) {
        // if the player is facing right
        if (
          this.player.facing === 0 &&
          this.BB.left - this.player.BB.right <= this.attackDistance
        ) {
          this.velocity.x = 0;
          this.velocity.y = 0;
        } else if (
          this.player.facing === 1 &&
          this.BB.left - this.player.BB.right <= this.attackDistance
        ) {
          this.velocity.x = 0;
          this.velocity.y = 0;
        }
      }

      //if the molecule is to the left of the player
      if (this.x < this.player.x) {
        // if the player is facing left
        if (
          this.player.facing === 1 &&
          Math.abs(this.BB.right - this.player.BB.left) <= this.attackDistance
        ) {
          this.velocity.x = 0;
          this.velocity.y = 0;
        } else if (
          this.player.facing === 0 &&
          Math.abs(this.BB.right - this.player.BB.left) <= this.attackDistance
        ) {
          this.velocity.x = 0;
          this.velocity.y = 0;
        }
      }

      if (this.x < this.player.x) this.velocity.x += 100 * TICK;
      if (this.x > this.player.x && this.velocity.x > 0) {
        this.velocity.x = 0;
      }

      if (this.y < this.player.y) this.velocity.y += 100 * TICK;
      if (this.y > this.player.y && this.velocity.y > 0) {
        this.velocity.y = 0;
      }

      this.x += this.velocity.x * TICK;
      this.y += this.velocity.y * TICK;

      //change state to attacking if in range
      if (
        Math.abs(this.x - this.player.x) <=
          this.attackDistance + this.projectileBuffer &&
        Math.abs(this.y - this.player.y) <=
          this.attackDistance + this.projectileBuffer
      )
        this.state = 3;
      else {
        this.state = this.size;
      }

      //Collisions

      this.game.entities.forEach((entity) => {
        if (
          entity instanceof GameCharacter &&
          this.elapsedTime > this.fireRate &&
          this.state === 3
        ) {
          this.elapsedTime = 0;
          this.game.camera.game.addEntityFirst(
            new MoleculeProjectile(this.game, this.x + 200, this.y, entity)
          );
        }
      });

      // Update Facing direction
      if (this.velocity.x < 0) this.facing = 1;
      if (this.velocity.x > 0) this.facing = 0;
      
      if (this.currentIFrameTimer > 0) {
        this.currentIFrameTimer -= 1;
        // console.log(this.currentIFrameTimer);
      }

    }
  }

  loadAnimations() {
    for (let i = 0; i < 3; i++) {
      this.animations.push([]);
      for (let j = 0; j < 2; j++) {
        // two directions
        this.animations[i].push([]);
      }
    }

    // low animation for state = 0
    // facing right = 0
    this.animations[0][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_low.png"),
      0,
      0,
      256,
      256,
      5,
      this.frameDuration,
      0,
      true
    );

    // facing left = 1
    this.animations[0][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_low.png"),
      0,
      0,
      256,
      256,
      5,
      this.frameDuration,
      0,
      true
    );

    // half Animation state = 1
    // facing right = 0
    this.animations[1][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_half.png"),
      0,
      0,
      256,
      256,
      6,
      this.frameDuration,
      0,
      true
    );

    // facing left = 1
    this.animations[1][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_half.png"),
      0,
      0,
      256,
      256,
      6,
      this.frameDuration,
      0,
      true
    );

    // full animation for state = 2
    // facing right = 0
    this.animations[2][0] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_full.png"),
      0,
      0,
      256,
      256,
      6,
      this.frameDuration,
      0,
      true
    );

    //facing left  = 1
    this.animations[2][1] = new Animator(
      ASSET_MANAGER.getAsset("./Sprites/Molecule/molecule_full.png"),
      0,
      0,
      256,
      256,
      6,
      this.frameDuration,
      0,
      true
    );
  }
  draw(ctx) {

    if (this.health != this.maxHealth){
      ctx.fillStyle = "red";
      ctx.fillRect(
        this.x - this.game.camera.x,
        this.y - this.game.camera.y - 10,
        this.width/1.5,
        5
      );
      ctx.fillStyle = "green";
      ctx.fillRect(
        this.x - this.game.camera.x,
        this.y - this.game.camera.y - 10,
        this.width/1.5 * (this.health / this.maxHealth),
        5
      );
    }

    if (this.state === 3) {
      this.animations[this.size][this.facing].drawFrame(
        this.game.clockTick,
        ctx,
        this.x - this.animationXOffset - this.game.camera.x,
        this.y - this.animationYOffset - this.game.camera.y,
        1
      );
    } else {
      this.animations[this.state][this.facing].drawFrame(
        this.game.clockTick,
        ctx,
        this.x - this.animationXOffset - this.game.camera.x,
        this.y - this.animationYOffset - this.game.camera.y,
        1
      );
    }

    if (debug)
      ctx.strokeRect(
        this.BB.x - this.game.camera.x,
        this.BB.y - this.game.camera.y,
        this.BB.width,
        this.BB.height
      );
  }
}
