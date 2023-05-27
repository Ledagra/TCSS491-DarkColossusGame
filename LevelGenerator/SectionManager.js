class SectionManager {

	constructor(x, y , width) {
		this.x = x;
		this.y = y;
		this.width = width;
	}



	SectionStart(x, y, width) {

		//let player = new GameCharacter(gameEngine, 0, 0);
		let level = getLevel(1);
		let xOffset = 0;
		let yOffset = -30;


		//for (let i = 0; i <= (1400 / width); i++) {
		for (let i = 0; i <= (15); i++) {
			gameEngine.addEntity(new SmallPlatform(gameEngine, x, y, width));
			x += width + yOffset;

		}
		for (let i = 0; i <= (5); i++) {
			gameEngine.addEntity(new SmallPlatform(gameEngine, x, y - 300, width));
			x += width + yOffset;
		}
	}



	update() {

	}

	draw(ctx) {
		this.SectionStart(this.x, this.y, this.width);
}

}