const PHASE_ONE = 1;
const PHASE_TWO = 2;
const PHASE_THREE = 3;

const BODY = 4;
const UPPER_LEFT_ARM = 5;
const UPPER_RIGHT_ARM = 6;
const LOWER_LEFT_ARM = 7;
const LOWER_RIGHT_ARM = 8;
const RING = 9;
const CROSS = 10;

const MAX_HEALTH = 850;


class DarkColossus {
    constructor(x, y) {
        this.width = 512;
        this.height = 512;
        this.player = player;
        this.game = gameEngine;
        

        //PHASE 1/PHASE 2 LOOP
            //1) Every 30 seconds, enter PHASE 2
            //2) Spawn enemies/ads/mobs
            //3) Boss heals until all ads/mobs are dead or full health
                //3.5) Make sure boss ceases healing if ads/mobs are dead
            //4) Then Boss enters PHASE 1

        //PHASE 3 LOOP
            //1) At 30% health, enter PHASE 3
            //2) Boss stats all increase by 50%
            //3) Cross from Sky move is added to move pool
            //4) Phase 3 ends when boss is dead
            
        //Move List:
            //Arm Grab
            //Cross Laser
            //Arm Laser

        this.x = x;
        this.y = y;
        this.state = PHASE_ONE;
        this.hostile = true;
        this.damage = 1;
        this.fireRate = 0.1
        this.projectileDamage = 5;
        this.elapsedTime = 0;
        this.attackDistance = 0;
        this.health =  MAX_HEALTH;
        this.healthRegen = 0.5; // higher = fast regen
        this.currentIFrameTimer = 0;
        this.velocity = { x: 0, y: 0 };
        
        this.maxIFrameTimer = 30;
        this.dead = false;
        this.paused = false;
        //this.updateBB();
        this.animations = [];
        this.baseFrameSpeed = 0.25;
        this.frameSpeed = this.baseFrameSpeed;
        this.loadAnimations();

        this.t = 0;
        this.bodyT = 0;
        this.amplitude = 50;

        this.updateBB();



  }

  update() {


    const TICK = this.game.clockTick;
    this.elapsedTime += this.game.clockTick;
    //Chance
    this.t += 0.01;
    this.bodyT += 0.005;
    if (this.animations[BODY].currentFrame() === 0) {
        if (this.state == PHASE_TWO){
            this.animations[BODY].frameDuration = 0.02;
        } else {
            this.animations[BODY].frameDuration = Math.max(this.baseFrameSpeed - (Math.abs(Math.sin(this.bodyT) * 0.25)), 0.05);
        }
    }

    if (this.currentIFrameTimer > 0) {
        this.currentIFrameTimer -= 1;
        // console.log(this.currentIFrameTimer);
    }

    if (this.state === PHASE_TWO) {
        this.updatePhase2BB();
    } else {
        this.updateBB();
    }
    

    if (this.state != PHASE_THREE && this.health <= MAX_HEALTH * 0.3) {
        this.state = PHASE_THREE;
        this.fireRate *= 3;
    }

    if (this.state === PHASE_TWO) {
        this.health = Math.min(this.health+this.healthRegen, MAX_HEALTH);

    } else {
        if (this.x > this.player.x) this.velocity.x += -100 * TICK;
        if (this.x < this.player.x && this.velocity.x < 0) {
            this.velocity.x = 0;
        }

        if (this.y > this.player.y) this.velocity.y += -100 * TICK;
        if (this.y < this.player.y && this.velocity.y < 0) {
            this.velocity.y = 0;
        }

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

      if(this.state === PHASE_THREE){
        this.x += this.velocity.x * TICK * 3;
        this.y += this.velocity.y * TICK * 3;
        this.fireRate = 0.03;
        this.projectileDamage = 10;
      } else {
        this.x += this.velocity.x * TICK * 1;
        this.y += this.velocity.y * TICK * 1;
      }

        //Collisions

        this.game.entities.forEach((entity) => {
            if (entity instanceof GameCharacter &&
                this.elapsedTime > this.fireRate) {
                this.elapsedTime = 0;

                //Different attacks
                //random number between 0-2
                const CROSS_ATTACK = 0;
                const MOLECULE_PROJECTILE_ATTACK = 1;
                const BOSS_PROJECTILE_ATTACK = 2;
                let attack = null;
                switch (Math.floor(Math.random() * 3)) {
                    // case CROSS_ATTACK:
                    //     attack = new CrossProjectile(this.game, this.x+300, this.y+200, entity);
                    //     attack.damage = this.projectileDamage*2;
                    //     attack.maxSpeed = 200;
                    //     break;
                    case MOLECULE_PROJECTILE_ATTACK:
                        attack = new MoleculeProjectile(this.game, this.x + 300, this.y+200, entity);
                        attack.damage =this.projectileDamage;
                        attack.maxSpeed = 300;
                        this.game.camera.game.addEntityFirst(attack);

                        break;
                    case BOSS_PROJECTILE_ATTACK:
                        attack = new BossProjectile(this.game, this.x + 200, this.y+200, entity);
                        attack.damage = this.projectileDamage*3;
                        attack.maxSpeed = 600;
                        this.game.camera.game.addEntityFirst(attack);

                        break;
                }
            }
        });
    }
  }

    draw(ctx) {
        this.animations[BODY].drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude, 1);

        if (this.state == PHASE_TWO){
            ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_ring_healing.png"), this.x - gameEngine.camera.x - 100, this.y - gameEngine.camera.y - 100 + Math.sin(this.t) * this.amplitude, 700, 700);
        } else {
            ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_cross.png"), this.x - gameEngine.camera.x + 145, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude - 300, 244, 270);
            if (this.health > MAX_HEALTH *0.8)
                this.animations[UPPER_LEFT_ARM].drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 700, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude - 190, 1);
            if (this.health > MAX_HEALTH * 0.6)
                this.animations[UPPER_RIGHT_ARM].drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x + 475, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude - 190, 1);
            if (this.health > MAX_HEALTH * 0.4)
                this.animations[LOWER_LEFT_ARM].drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x - 300, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude +400, 1);
            if (this.health > MAX_HEALTH * 0.2)
                this.animations[LOWER_RIGHT_ARM].drawFrame(gameEngine.clockTick, ctx, this.x - gameEngine.camera.x + 475, this.y - gameEngine.camera.y + Math.sin(this.t) * this.amplitude + 400, 1);    
            ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_ring.png"), this.x - gameEngine.camera.x - 100, this.y - gameEngine.camera.y - 100 + Math.sin(this.t) * this.amplitude, 700, 700);
        
        }

        ctx.strokeStyle = "red";
       // ctx.strokeRect(this.BB.x - gameEngine.camera.x, this.BB.y - gameEngine.camera.y, this.BB.width, this.BB.height);
    }

    loadAnimations() {
        this.animations[BODY] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_body.png"), 0, 0, 512, 512, 8, this.frameSpeed, 0, true);
        this.animations[BODY].yOffset = 0;
        this.animations[BODY].xOffset = 0;

        this.animations[UPPER_LEFT_ARM] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_top_left_arm.png"), 0, 0, 320, 320, 6, 0.2, 0, true);
        this.animations[UPPER_LEFT_ARM].yOffset = 0;
        this.animations[UPPER_LEFT_ARM].xOffset = 400;

        this.animations[UPPER_RIGHT_ARM] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_top_right_arm.png"), 0, 0, 320, 320, 6, 0.2, 0, true);
        this.animations[UPPER_RIGHT_ARM].yOffset = 0;
        this.animations[UPPER_RIGHT_ARM].xOffset = 0;

        this.animations[LOWER_LEFT_ARM] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_bottom_left_arm.png"), 0, 0, 320, 320, 6, 0.2, 0, true);
        this.animations[LOWER_LEFT_ARM].yOffset = 0;
        this.animations[LOWER_LEFT_ARM].xOffset = 0;

        this.animations[LOWER_RIGHT_ARM] = new Animator(ASSET_MANAGER.getAsset("./Sprites/Boss/boss_bottom_right_arm.png"), 0, 0, 320, 320, 6, 0.2, 0, true);
        this.animations[LOWER_RIGHT_ARM].yOffset = 0;
        this.animations[LOWER_RIGHT_ARM].xOffset = 0;
    }

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.x, this.y + Math.sin(this.t) * this.amplitude, 512, 512);
    }

    updatePhase2BB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(-100, 4000, 1, 1);
    }


}



        
//}