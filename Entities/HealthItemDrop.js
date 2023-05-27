class HealthItemDrop {

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.t = Math.random();
        this.amplitude = 2;
        this.width = 128;
        this.height = this.width;
        }

    update() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
        this.t += 0.06;
        this.y += Math.sin(this.t) * this.amplitude;

        // calculate distance between the player and the item drop
        let dx = player.x - this.x + player.width/2;
        let dy = player.y - this.y + player.height/2;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let gatherDistance = 600;
        // check if the player is within proximity
        if (distance < gatherDistance) {
            // calculate the speed of the item drop moving towards the player
            let speed = 2 + (gatherDistance - distance) / 20;
            this.x += speed * dx / distance;
            this.y += speed * dy / distance;
        }

        if (this.BB.collide(player.BB)) {
            this.removeFromWorld = true;
            player.health = Math.min(player.baseHealth + params.DARK_ENERGY.hp, player.health + 1);
            params.PARTICLE_SYSTEM.createParticleEffect(player.x + player.width/2 - gameEngine.camera.x, player.y + player.height/2 - gameEngine.camera.y, 5, 10, '#330000', 3, 25, 0.55);
        }

    }

    draw(ctx) {
        // dark energy asset
        ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/UI/hp_cross.png"), this.x - this.game.camera.x + Math.sin(this.t) * this.amplitude, this.y - this.game.camera.y + Math.sin(this.t) * this.amplitude, this.width, this.height);
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(this.BB.x - this.game.camera.x , this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
     }
    

}