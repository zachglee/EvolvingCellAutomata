
//A Posn is an (x, y) coordinate
class Posn {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	//returns a list of the posns adjacent to this,
	//[top, right, bottom, left]
	getAdjacentPosns() {
		return [new Posn(this.x, this.y + 1), new Posn(this.x + 1, this.y), new Posn(this.x, this.y - 1), new Posn(this.x - 1, this.y)];
	}

	//returns the pixel position of the top left corner of the square referred to by this posn
	toCanvasPosn(world) {
		return new Posn(this.x * squareWidth(world), (world.height - (this.y + 1)) * squareHeight(world))
	}
}