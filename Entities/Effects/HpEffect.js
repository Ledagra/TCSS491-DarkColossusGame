class HpEffect {
    constructor() {
      this.canvasWidth = CANVAS_WIDTH
      this.canvasHeight = CANVAS_HEIGHT
      this.maxRadius = (Math.sqrt(Math.pow(this.canvasWidth / 2, 2) + Math.pow(this.canvasHeight / 2, 2)));
      this.currentRadius = 0//this.maxRadius;
      this.hpThreshold = 0.8;
      this.maxHP = player.health;
      this.currentHP = this.maxHP;
    }
  
    update() {
        const hpRatio = player.health / player.maxHealth;
        if (hpRatio < this.hpThreshold) {
          const maxRadius = Math.sqrt(Math.pow(this.canvasWidth / 2, 2) + Math.pow(this.canvasHeight / 2, 2));
          const targetRadius = (1 - hpRatio / this.hpThreshold) * maxRadius;
          this.currentRadius += (targetRadius - this.currentRadius) / 10;
        } else {
          this.currentRadius = 0;
        }
    }
  
    draw(ctx) {
        if (this.currentRadius > 0) {
          const centerWidth = this.canvasWidth / 2;
          const centerHeight = this.canvasHeight / 2;
      
          // Draw red circle
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.beginPath();
          ctx.arc(centerWidth, centerHeight, this.currentRadius, 0, 2 * Math.PI);
          ctx.fill();
      
          // Draw transparent center
          const gradient = ctx.createRadialGradient(centerWidth, centerHeight, 0, centerWidth, centerHeight, this.currentRadius);
          gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
          // Draw red edges
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, this.canvasHeight);
          ctx.lineTo(this.canvasWidth, this.canvasHeight);
          ctx.lineTo(this.canvasWidth, 0);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          ctx.fill();
        }
      }
    }
    

  