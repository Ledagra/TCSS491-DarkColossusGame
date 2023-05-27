class InventoryUI {
    constructor(game) {
        params.STATE = "menu";
        this.font = "20px " + params.FONT;
        this.fontColor = "#FFFFFF"
        this.BROWSE = 1;
        this.SPLICE = 2;
        this.state = this.BROWSE;
        this.game = game;
        //find inventory in entities
        this.inventory = params.INVENTORY.inventory;
        this.rows = 2;
        this.columns = 6;
        this.numPages = Math.ceil(this.inventory.length / (this.rows * this.columns));
        this.color = "#330000";
        this.gridSize = 6;
        this.slotSize = 116;
        this.currentPage = 0;
        this.currentSlot = 0;
        this.currentDna = 0;
        this.count = 50;
        this.x = CANVAS_WIDTH/2 - this.columns * this.slotSize/2;
        this.y = CANVAS_HEIGHT - this.rows * this.slotSize;
        this.pressed = false;

        this.spliceSlot1 = 0;
        this.spliceSlot2 = 0;
    }
  
    draw(ctx) {

      if (this.state == this.BROWSE) dnaInfoWindow(ctx, CANVAS_WIDTH/3, 5, this.inventory[this.currentDna]);
      if (this.state == this.SPLICE) {
        dnaInfoWindow(ctx, 0, 0, this.inventory[this.spliceSlot1]);
        dnaInfoWindow(ctx, CANVAS_WIDTH/3, 0, this.inventory[this.spliceSlot2]);
       // this.drawSpliceInformation(ctx, CANVAS_WIDTH/1.5, 0, getPredictedDna(this.inventory[this.spliceSlot1], this.inventory[this.spliceSlot2]));
      }

      ctx.fillStyle = "#e09fa4"//"#994B50";

      //ctx.fillStyle = "#994B50";
      //make the rect transparent
      ctx.globalAlpha = .8;
      ctx.fillRect(this.x, this.y, this.columns*this.slotSize, this.rows*this.slotSize);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
            ctx.strokeRect(
                this.x + j * this.slotSize,
                this.y + i * this.slotSize,
                this.slotSize,
                this.slotSize
            );
        }
      }

      //draw the current slot
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 5;
      ctx.strokeRect(
        this.x + (this.currentSlot % this.columns) * this.slotSize,
        this.y + Math.floor(this.currentSlot / this.columns) * this.slotSize,
        this.slotSize,
        this.slotSize
      );
      ctx.fillStyle = "#FFFFFF";
      ctx.globalAlpha = .3;
      ctx.fillRect(
        this.x + (this.currentSlot % this.columns) * this.slotSize,
        this.y + Math.floor(this.currentSlot / this.columns) * this.slotSize,
        this.slotSize,
        this.slotSize
      );
      ctx.globalAlpha = 1;

      ctx.globalAlpha = 1;

      let end = (this.rows * this.columns * this.currentPage) + (this.rows * this.columns);
      for (let i = this.currentPage * this.rows * this.columns; i < end; i++) {
        let dna = this.inventory[i];
        let x = this.x + (i % this.columns) * this.slotSize;
        let row = Math.floor(i / this.columns);
        let y = this.y + row * this.slotSize - (this.currentPage * this.rows * this.slotSize);

        if (dna != null) dna.drawDna(ctx, x, y, this.slotSize);

        // Draw an "E" on the dna in slot1
        if (dna === params.INVENTORY.dnaSlot1 && dna != null) {
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "30px " + params.FONT;
          ctx.fillText("E", x + 10, y + 30);
        }
      }




      this.drawControls(ctx);
     }

    update() {

      //Controls
      this.equipSlot1();
     // this.equipSlot2();
      this.sellDna();
     // this.toggleMode();
      this.closeInventory();

      //Move Cursor Left
      if (!this.pressed && (this.game.keys.KeyA || this.game.controllerButtonLeft_press)) {
        if (this.currentSlot == 0 || this.currentSlot % this.columns == 0) {
          if (this.currentPage > 0) {
            this.prevPage();
            //this.currentSlot = this.columns * this.rows - 1;
          } else {
            //this.currentSlot = this.columns * this.rows - 1;
          }
        } else {
          this.currentSlot = (this.currentSlot - 1) % (this.columns * this.rows);
        }

      //Move Cursor Right
      } else if (!this.pressed && (this.game.keys.KeyD || this.game.controllerButtonRight_press)) {
        if ((this.currentSlot+1) % (this.columns) == 0) {
          if (this.currentPage < this.inventory.length / (this.columns * this.rows) - 1) {
            this.nextPage();
            this.currentSlot = 0;
            //this.currentSlot = 0;
          } else {
            this.currentSlot = 0;
          }
        } else {
          this.currentSlot = (this.currentSlot + 1) % (this.columns * this.rows);
        }

      //Move Cursor Down
      } else if (keypress("KeyS") || this.game.controllerButtonDown_press) {
        this.currentSlot = (this.currentSlot + this.columns) % (this.columns * this.rows);
        //this.nextPage();
       //this.currentPage++;

      //Move cursor up or wrap to bottom
      } else if (keypress("KeyW") || this.game.controllerButtonUp_press) {
        this.currentSlot = (this.currentSlot - this.columns + this.rows * this.columns) % (this.columns * this.rows);
        //this.prevPage();
      } 

      if (this.game.keys.KeyA == true || this.game.keys.KeyD == true || this.game.keys.KeyS == true || this.game.keys.KeyW == true) {
        this.pressed = true;
      } else {
        this.pressed = false;
      }
      this.currentDna = this.currentSlot + (this.currentPage * this.rows * this.columns);
    }

    drawControls(ctx) {
      //draw controls right above the inventory in a horizontal line
      ctx.fillStyle = this.fontColor;
      ctx.textAlign = "center";
      ctx.font = this.font;
      if(this.state == this.BROWSE){
        //ctx.fillText("1: Equip slot 1   2: Equip slot 2   3: Sell   4:Splice", CANVAS_WIDTH/2, this.y - 20);
        ctx.fillText("1: Equip DNA      3: Sell", CANVAS_WIDTH/2, this.y - 20);

      } else if (this.state == this.SPLICE) {
        ctx.fillText("1: Select slot 1   2: Select slot 2   3: Splice   4:Browse", CANVAS_WIDTH/2, this.y - 20);
      }

      //draw on the left and right side of the inventory to indicate that there are more pages
      ctx.font = "50px "  + params.FONT;
      if (this.currentPage > 0) {
        ctx.fillText("<", this.x - 40, this.y + this.slotSize * this.rows/2);
      }
      
      if (this.currentPage < this.inventory.length / (this.rows * this.columns) - 1) {
        ctx.fillText(">", this.x + this.slotSize * this.columns + 40, this.y + this.slotSize * this.rows/2);
      }

      
    }

    toggleMode() {
      if (keypress("Digit4") && !this.game.PAUSED) {
        if (this.state == this.BROWSE) {
          this.state = this.SPLICE;
        } else if (this.state == this.SPLICE) {
          this.state = this.BROWSE;
        }
      }
    }

    equipSlot1() {
        if ((keypress("Digit1") || this.game.controllerButtonA_press) && this.state == this.BROWSE && !this.game.PAUSED) {
            this.game.controllerButtonA = false;
            unequipAbilities(params.INVENTORY.dnaSlot1);
            params.INVENTORY.dnaSlot1 = this.inventory[this.currentDna];

        //If moving from slot2 to slot1, dont unequip or equip the abilities, just swap the slots
        if (params.INVENTORY.dnaSlot1 === params.INVENTORY.dnaSlot2) {
          unequipAbilities(params.INVENTORY.dnaSlot2);
          params.INVENTORY.dnaSlot2 = null;
        }

        equipAbilities(params.INVENTORY.dnaSlot1);
      }
    }

    equipSlot2() {
      if (keypress("Digit2") && this.state == this.BROWSE && !this.game.PAUSED){
        console.log("equipping slot 2");
        unequipAbilities(params.INVENTORY.dnaSlot2);
        params.INVENTORY.dnaSlot2 = this.inventory[this.currentDna];

        //If moving from slot1 to slot2, dont unequip or equip the abilities, just swap the slots
        if (params.INVENTORY.dnaSlot1 === params.INVENTORY.dnaSlot2) {
          unequipAbilities(params.INVENTORY.dnaSlot1);
          params.INVENTORY.dnaSlot1 = null;
        }

        equipAbilities(params.INVENTORY.dnaSlot2);
      }
    }

    sellDna() {
      if ((keypress("Digit3") || this.game.controllerButtonY_press) && this.state == this.BROWSE && !this.game.PAUSED){
        if(this.inventory[this.currentDna] == null) return;
        //check if current dna is equipped
        if (this.inventory[this.currentDna] === params.INVENTORY.dnaSlot1) {
          unequipAbilities(this.inventory[this.currentDna]);
          params.INVENTORY.dnaSlot1 = null;

        } else if (this.inventory[this.currentDna] === params.INVENTORY.dnaSlot2) {
          unequipAbilities(this.inventory[this.currentDna]);
          params.INVENTORY.dnaSlot2 = null;
        }

        params.DARK_ENERGY.currency += this.inventory[this.currentDna].value;
        //remove only the current slot
        this.inventory.splice(this.currentDna, 1);
      }
    }
  
    nextPage() {
      if (this.currentPage < this.numPages - 1) {
        this.currentPage++;
      }
    }
  
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }

    closeInventory() {
      if (this.game.keys.KeyE || this.game.controllerButtonX_press) {
        params.STATE = "gameplay";
        this.removeFromWorld = true;
        gameEngine.keys.KeyE = false;
        this.game.controllerButtonX_press = false;
      }
    }
}
  