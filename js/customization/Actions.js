// -------- A C T I O N S -------- //

//An Action is a (CellPosn, TargetPosn, World) -> Side Effect
//(The given cell does the Action (side effect) targeting the given posn, in the given world)

//A Behavior is a Action to perform, and a Direction to perform that Action in.

//This file is where the available Actions are defined. (see ACTION_SPEC at bottom of file)
//There are countless different actions you could define, and they greatly influence what kinds of
//organisms evolve.

//The Action Factory abstracts out some of the boilerplate all actions will have
//(like case analysis based on if the target is a Cell, Square, or Obstacle
// and some convenience logic, like resolving the the actor and target from their Posns)
//You pass in three functions, for behavior in different cases, and it creates an Action,
//using that behavior.
var actionFactory = function(cellCase, squareCase, obstacleCase) {
	return function(cellPosn, targetPosn, world) {
		//resolve the cell and target squares from the given posns, do validity checking for edge cases
		var cellSquare = world.get(cellPosn);
		var cell = cellSquare.content;
		var targetSquare = world.get(targetPosn);
		if (!targetSquare) { return } //we can't act on a square that doesn't exist.
		var target = targetSquare.content;
		//determine what's on the target square:
		if (target && target.isCell) { //CASE: target = cell
			cellCase(cell, cellPosn, target, targetPosn, world)
		} else if (!target) { //CASE: target = a square without content
			squareCase(cell, cellPosn, targetSquare, targetPosn, world)	
		} else if (target && target.isObstacle) { //CASE: target = Obstacle
			obstacleCase(cell, cellPosn, targetSquare, targetPosn, world)	
		} else { //CASE: target is something else weird
			console.log("ERROR: Something has gone wrong, the target for this action is: " + target);
		}
	}
}

//constant action costs
const TRANSFER_COST = 2;
const REPRODUCE_COST = 60;
const MOVE_COST = 2;
const EAT_COST = 2;
const DIG_COST = 2;
const HIBERNATE_COST = 0;

const ABSORB_AMOUNT = 10;
const BODY_COST = REPRODUCE_COST / 10;
const TRANSFER_AMOUNT = 6.0;

var nothing = function(cellPosn, targetPosn, world) {
	return;
}

var transfer = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		target.food += TRANSFER_AMOUNT / 1.5;
		/*var openAdjacents = cellPosn.getAdjacentPosns().filter(function(posn) {
			return !!world.get(posn);
		})
		world.spawnFood(choose(openAdjacents), TRANSFER_AMOUNT)*/
	},
	//target = Square
	function(cell, cellPosn, target, targetPosn, world) {
		target.food += TRANSFER_AMOUNT;
		/*var openAdjacents = cellPosn.getAdjacentPosns().filter(function(posn) {
			return !!world.get(posn);
		})
		for (i = 0; i < 3; i++) {
			world.spawnFood(choose(openAdjacents), 1)
		}*/
	},
	//target = Obstacle
	function(cell, cellPosn, traget, targetPosn, world) {
		//do nothing
	}
)

//creates a child of the actor on an empty square
var reproduce = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		//console.log("This would be sexual reproduction but it's not implemented yet.")
		cell.food += REPRODUCE_COST; //TEMP FIX REFUND
	},
	//target = Square
	function(cell, cellPosn, target, targetPosn, world) {
		//target.content = cell.newChild(REPRODUCE_COST - BODY_COST); //<-- SHOULD BE OBSOLETE NOW
		world.spawnCell(targetPosn, cell.newChild(REPRODUCE_COST - BODY_COST));
		//have the newly born cell absorb food on its square
		if (target.content.food >= ABSORB_AMOUNT) {
			cell.food += ABSORB_AMOUNT;
			target.content.food -= ABSORB_AMOUNT;
		} else {
			cell.food += target.content.food;
			target.content.food = 0;
		}
	},
	//target = Obstacle
	function(cell, cellPosn, traget, targetPosn, world) {
		//do nothing
		cell.food += REPRODUCE_COST; //TEMP FIX REFUND
	},
)

//moves the actor to an adjacent empty square, picking up some food from that square
var move = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		//do nothing
	},
	//target = Square
	function(cell, cellPosn, target, targetPosn, world) {
		//cell.food += target.food;
		//target.food = 0;
		if (target.food >= ABSORB_AMOUNT) {
			cell.food += ABSORB_AMOUNT;
			target.food -= ABSORB_AMOUNT;
		} else {
			cell.food += target.food;
			target.food = 0;
		}
		target.content = cell;
		world.get(cellPosn).content = null;
	},
	//target = Obstacle
	function(cell, cellPosn, traget, targetPosn, world) {
		//do nothing
	}
)

//actor steals some food from another cell, consuming it completely if it has below a certain food threshold
var eat = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		if  (target.food <= 0) {
			world.cellStats.cellDied(target); //TODO is there a way to make this more elegant?
			cell.food += (target.food + BODY_COST);
			world.get(targetPosn).content = cell;
			world.get(cellPosn).content = null; // we move onto the cell we eat if it's a corpse
			//world.get(targetPosn).content = null;
		} else {
			target.food -= (ABSORB_AMOUNT / 1);
			cell.food += (ABSORB_AMOUNT / 1);
		}
	},
	//target = Square
	function(cell, cellPosn, target, targetPosn, world) {
		//you can leech empty squares of food
		/*if (target.food >= ABSORB_AMOUNT / 2) {
			cell.food += ABSORB_AMOUNT / 2
			target.food -= ABSORB_AMOUNT / 2
		} else {
			cell.food += target.food
			target.food = 0;
		}*/
		cell.food += EAT_COST; //refund
	},
	//target = Obstacle
	function(cell, cellPosn, traget, targetPosn, world) {
		cell.food += EAT_COST;
	}
)

//the actor destroys and moves onto an adjecenet Obstacle
var dig = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		//do nothing
		cell.food += DIG_COST; //refund the dig cost TODO THIS IS TEMPORARY AND HACKY
	},
	//target = Square
	function(cell, cellPosn, traget, targetPosn, world) {
		//do nothing
		cell.food += DIG_COST; //TEMP FIX REFUND
	},
	//target = Obstacle
	function(cell, cellPosn, traget, targetPosn, world) {
		//cell.food += BODY_COST / 2;
		world.get(targetPosn).content = cell;
		world.get(cellPosn).content = null;
	}
)

var hibernate = actionFactory(
	//target = Cell
	function(cell, cellPosn, target, targetPosn, world) {
		cell.food += .9;
		//cell.age -= .9;
	}, HIBERNATE_COST,
	function(cell, cellPosn, target, targetPosn, world) {
		//nothing
		cell.food += .95
		//cell.age -= .9
	}, HIBERNATE_COST
)

//This object is the SPOT for what actions are available, as well as their costs, names, and associated colors
const ACTION_SPEC = {
	"transfer": {action: transfer, cost: TRANSFER_COST, color: "#00ff00"}, //green
	"reproduce": {action: reproduce, cost: REPRODUCE_COST, color: "#fcfcfc"}, //white
	"move": {action: move, cost: MOVE_COST, color: "#004cff"}, //blue
	"dig": {action: dig, cost: DIG_COST, color: "#ffae00"}, //orange
				      /*, hibernate,*/
	"eat": {action: eat, cost: EAT_COST, color: "#ff0000"} //red
};