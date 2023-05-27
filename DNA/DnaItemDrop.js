class DnaItemDrop {

    //On collision, move the DNA to the player's inventory
    //and remove it from the level
    //DnaItemDrop.js is an entity
    //DNA.js is not an entity
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.t = Math.random();
        this.amplitude = 2;
        this.dna = getRandomDNA(); //this is what goes into the player's inventory
        this.BB = new BoundingBox(this.x, this.y, 116, 116);
    }

    update() {
        this.t += 0.06;
        this.y += Math.sin(this.t) * this.amplitude;
        if (this.BB.collide(player.BB)) {
            params.INVENTORY.inventory.push(this.dna);
            this.removeFromWorld = true;
        }
        
    }

    draw(ctx) {
        // let w = Math.max(136 + Math.sin(this.t) * 100, 150); // minimum size it can become
        // let x = this.x - this.game.camera.x + 50 - Math.sin(this.t) * 100 - 20; // move the circle to the left
        // let y = this.y + this.game.camera.y + 100;
        // this.drawEllipse(ctx, x, y, w, 40, 0.5);
        this.dna.drawDna(ctx, this.x - this.game.camera.x , this.y - this.game.camera.y, 116);

    }
    

}