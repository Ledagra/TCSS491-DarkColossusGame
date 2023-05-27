class TextCutscene {
    constructor(sentences, fadeSpeed) {
      this.sentences = sentences;
      this.fadeSpeed = fadeSpeed;
      this.opacity = 0;
      this.currentSentence = 0;

      //clear all input
      clearAllInput();
    }
  
    update() {
      if (this.opacity < 2) {
        this.opacity += this.fadeSpeed;
      } else {
          if (this.currentSentence === this.sentences.length - 1) {
            this.removeFromWorld = true;
            gameEngine.camera.loadHub();
          } else {
            this.currentSentence++;
            this.opacity = 0;
          }
      }

      if (isAnyInputDetected() && this.opacity > 0.5) {
        this.removeFromWorld = true;
        gameEngine.camera.loadHub();
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.textAlign = 'center';
      ctx.font = '55px ' + params.FONT;
      ctx.fillText(this.sentences[this.currentSentence], ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
  }
  