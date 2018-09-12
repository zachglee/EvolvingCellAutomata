//A Square is a gameObject that can also contain content, usually a Cell

//The game world is made up of a grid of Squares, stored in a nested array

class Square extends GameObject {
	constructor(food, marked, content) {
		super(food, marked);
		this.content = content;
	}

	tick(posn, world) {
		if (this.content) {
			this.content.tick(posn, world)
		}
	}

	drawAt(posn, world, ctx) {
		if (this.content) {
			this.content.drawAt(posn, world, ctx)
		} else if (this.food) {
			//var canvasPosn = posn.toCanvasPosn(world);
			//ctx.fillStyle = 'black';
			//ctx.fillText(this.food, canvasPosn.x, canvasPosn.y + 10);
		}
	}
}