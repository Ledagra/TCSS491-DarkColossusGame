class Inventory {

    constructor(game) {
        this.inventory = [];
        

        //test data

        this.game = game;
        this.dnaSlot1 = null;
        this.dnaSlot2 = null;
    }

    draw(ctx) {
        
    }

    update() {
        if (keypress("KeyP") || this.game.controllerButtonLeftStick) {
           // this.inventory.push(getRandomDNA());
        }
    }
}