//A World is a (board[][], tickNum, settings)
class World {
	constructor(board, tickNum, settings) {
		this.board = board;
		this.tickNum = tickNum;
		this.settings = settings;
		this.width = board.length;
		this.height = board[0].length;
		this.paused = false;
		//this is the stats object. We call its methods to let it know when events like cell death and birth happen, to keep it up to date
		this.cellStats = new CellStats();
	}

	//TODO make this less terribly inefficient
	randomPosn() {
		var p = new Posn(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
		while (!this.get(p) || (this.get(p).content && this.get(p).content.isObstacle)) {
			p = new Posn(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
		}
		return p;
	}

	//gets a random square that does NOT have an obstacle on it
	randomSquare() {
		return this.get(this.randomPosn());
	}

	spawnFood(posn, amount) {
		var targetSquare = this.get(posn)
		if (targetSquare.content && targetSquare.content.isCell) {
			targetSquare.content.food += amount / 1;
		} else {
			targetSquare.food += amount;
		}
	}

	//puts the given cell onto the world at the given posn, provided the square at that posn is empty
	//(you should always use this to put new cells into the world, it does bookkeeping for gathering stats)
	spawnCell(posn, cell) {
		var targetSquare = this.get(posn);
		if (!targetSquare.content) {
			targetSquare.content = cell;
			this.cellStats.cellBorn(cell); //let the stats object know a cell was born so it can update
		} else {
			console.log("The target square is not empty, can't spawn cell here.")
		}
	}

	tick() {
		for (var i = 0; i < FOOD_SQUARES_PER_TICK; i++) {
			this.spawnFood(this.randomPosn(), FOOD_PER_SQUARE);
		}
		var toTick = [];
		//for every square on the board, if there's a cell there, gather it into our list to tick
		for (var i = 0; i < this.board.length; i++) {
			var column = this.board[i];
			for (var j = 0; j < column.length; j++) {
				var square = column[j];
				if (square && square.content && square.content.isCell) { //if it's a cell...
					var cell = square.content;
					if (cell.decay > this.settings.decomposeThreshold) { //if it should decompose
						square.content = new Obstacle(); //it turns into an obstacle
						this.cellStats.cellDied(cell); //let the stats object know a cell died so it can update
						square.food += BODY_COST;
					} else {
						toTick.push({cell: cell, posn: new Posn(i, j)});
					}
				}
			}
		}
		//sort the list of cells and their posns by lowest amount of food
		toTick.sort(function(a, b) {
			return a.cell.food - b.cell.food;
		})
		//tick every cell in the list
		for (var i = 0; i < toTick.length; i++) {
			var posnCell = toTick[i];
			posnCell.cell.tick(posnCell.posn, this)
		}
		this.tickNum++;
	}

	// -------- H E L P E R S -------- //

	outOfBounds(posn) {
		return posn.x < 0 || posn.y < 0 || posn.x >= this.width || posn.y >= this.height
	}

	//returns the square the given Posn refers to
	//if the given posn is out of bounds, returns null
	get(posn) {
		if (!this.outOfBounds(posn)) {
			return this.board[posn.x][posn.y];
		} else {
			//console.log("ERROR: Cannot get value - posn out of bounds: " + posn.x + "," + posn.y);
		}
	}


	//puts the given square at the given posn in this world 
	put(square, posn) {
		if (!outOfBounds(posn)) {
			this.board[posn.x][posn.y] = value;
		} else {
			//console.log("ERROR: Cannot put value - posn out of bounds: " + posn);
		}
	}

	draw(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//for every square on the board
		for (var i = 0; i < this.board.length; i++) {
			var column = this.board[i];
			for (var j = 0; j < column.length; j++) {
				var square = column[j];
				if (square && square.drawAt) { //if it's drawAt-able...
					square.drawAt(new Posn(i, j), this, ctx); //draw it
				}
			}
		}
		ctx.fillStyle = 'red';
		ctx.fillText('Tick=' + this.tickNum, 0, 10);
	}

	togglePause() {
		this.paused = !this.paused;
	}
	//

	/*run(ticks) {
		for (var i = 0; i < ticks; i++) {
			this.tick();
		}

		//count who did the best?
	}

	runWithRendering(ticks) {
		const doneRunning = $.Deferred();
		var theWorld = this;
		setIntervalX(function() {
			theWorld.tick();
			theWorld.draw(ctx);
		}, 8, ticks, function() {
			doneRunning.resolve();
		})
		return doneRunning;
	}*/
 
	getSurvivingSpecies() {
		var seenSpecies = []; //a list of cell colors
		var survivingSpecies = [];
		for (var i = 0; i < this.board.length; i++) {
			var column = this.board[i];
			for (var j = 0; j < column.length; j++) {
				var square = column[j];
				if (square && square.content && square.content.isCell) { //if it's a cell...
					var cell = square.content;
					if (seenSpecies.indexOf(cell.color) <= -1 && cell.food > 0) { //as long as we haven't already seen this species
						seenSpecies.push(cell.color) //now we've seen it
						survivingSpecies.push(cell); //add it to the list
					}
				}
			}
		}
		return survivingSpecies;
	}
}