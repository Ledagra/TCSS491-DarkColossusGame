class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, height, width, frameCount, frameDuration, framePadding, loop });
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.xOffset = 0;
        this.yOffset = 0;

    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
       
        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding),
            this.yStart, //source from sheet
            this.width, this.height,
            x + this.xOffset, y + this.yOffset,
            this.width * scale,
            this.height * scale);

        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        // }
    };

    currentFrame() {
        this.totalTime = this.frameCount * this.frameDuration;
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};