//A World is a (board[][], tickNum, settings)
//It provides a tick() and draw(), which are the bread and butter of the simulation.
//Also has a bunch of convenience methods to give other code a nice interface to use when
//it wants to access or modify the World.

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

	//returns a random posn within the bounds of this World
	randomPosn() {
		var p = new Posn(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
		return p;
	}

	//gets a random square TODO: let this one take a predicate to filter by?
	randomSquare() {
		return this.get(this.randomPosn());
	}

	//returns the list of existing posns adjacent to the given posn, in this world (no out of bounds posns)
	getExistingAdjacentPosns(posn) {
		var theWorld = this;
		return posn.getAdjacentPosns().filter(function(p) {
			return !!theWorld.get(p);
		})
	}

	//returns the position of the closest open (aka non-obstacle) square to the square at the given posn
	//(if the square at the given posn is open, returns the given posn)
	//TODO UNTESTED ITS BROKEN BROKEN BROKEN
	//TODO make this code less inefficient for god's sake
	closestOpenPosn(posn) {
		//bfs starting from posn
		var searchQueue = [posn];
		var blacklist = [];
		while (searchQueue.length > 0) {
			var searching = searchQueue.pop();
			var searchingSquare = this.get(searching);
			//is it a posn we're looking for?
			if (searchingSquare && (!searchingSquare.content || !searchingSquare.content.isObstacle)) {
				return searching; //we found what we're looking for!
			}
			//otherwise, add the current posn to blacklist and keep searching
			blacklist.push(searching);
			var adjacents = shuffle(this.getExistingAdjacentPosns(searching));
			adjacents.forEach(function(p) { //add every posn in adjacents to the searchQueue
				var posnEqualToCurPos = function(otherPos) {
					return otherPos.x == p.x && otherPos.y == p.y;
				}
				//but only if it's not been blacklisted!
				if (blacklist.filter(posnEqualToCurPos).length == 0) {
					searchQueue.unshift(p);
				}
			})
		}
	}

	//gets a random square which passes the given predicate
	/*randomSquareWhichPassesPredicate(pred) {

	}*/

	//adds the given amount of food to the square at the given posn.
	//if the square has an obstacle on it, the food will 'roll off'
	//and be placed on the closest square (manhattan distance) which
	//does NOT have an obstacle on it
	spawnFood(posn, amount) {
		var targetSquare = this.get(this.closestOpenPosn(posn))
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

	//performs one tick of the world
	//aka goes through the board and finds all tickable GameObjects, then tick()'s them with the proper arguments
	//also executes some World logic, like checking if any cells have decayed enough that they become Obstacles.
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
						toTick.push({cell: cell, posn: new Posn(i, j)}); //add it to our list of cells to tick()
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

	//renders this World on the given ctx (context object from an HTML5 canvas)
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

}