//

class Obstacle {
	constructor() {
		this.isObstacle = true;
	}

	drawAt(posn, world, ctx) {
		var canvasPosn = posn.toCanvasPosn(world);
		ctx.fillStyle = 'black';
		ctx.fillRect(canvasPosn.x, canvasPosn.y, squareWidth(world), squareHeight(world));
	}
}