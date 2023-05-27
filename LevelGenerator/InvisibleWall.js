class InvisibleWall{
    constructor(game, x, y) {
        this.game = game;
        this.width = 10;
        this.height = 300;
        this.x = x;
        this.y = y;

        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    draw(ctx) {
        // draw bounding box
        //if debug mode is on
        if (debug) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.BB.x - this.game.camera.x , this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
        
    }

    update() {
    }
}