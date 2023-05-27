class DarkEnergyItemDrop {

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.t = Math.random();
        this.amplitude = 2;
        this.width = 64;
        this.height = 64;
        this.BB = new BoundingBox(this.x, this.y, 64, 64);
        }

    update() {
        this.BB = new BoundingBox(this.x, this.y, 64, 64);
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
            this.game.darkEnergy.currency += 2;
        }

    }

    draw(ctx) {
        // dark energy asset
        ctx.drawImage(ASSET_MANAGER.getAsset("./Sprites/LevelAssets/dark_energy.png"), this.x - this.game.camera.x + Math.sin(this.t) * this.amplitude, this.y - this.game.camera.y + Math.sin(this.t) * this.amplitude, this.width, this.height);
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(this.BB.x - this.game.camera.x , this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
     }
    

}