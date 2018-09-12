// A Behavior is a (Direction, Cost, Action)
// A Direction is an integer 0-3 referring to one of the following directions: [up (0), right (1), down (2), left (3)]
// A Cost is a number describing the cost of executing this Behavior, in food
// An Action is a (CellPosn, TargetPosn, World) -> Side Effect

// Behaviors are what Genes execute. When a Behavior is executed, it will perform its Action in its Direction,
// provided that its Cost can be paid by the cell in question

class Behavior {
	constructor(direction, cost, action, actionName) {
		this.direction = direction;
		this.cost = cost;
		this.action = action;
		this.actionName = actionName
	}

	// execute this behavior's action with the given cell as the actor, acting from the given posn, with the given isomorphism
	execute(cell, posn, world, isomorphism) {
		var adjacentPosns = posn.getAdjacentPosns(); //posns adjacent to the cell
		this.action(posn, adjacentPosns[(this.direction + 3*isomorphism) % 4], world);
		//^^ 3*isomorphism is rotating counterclockwise in mod 4, aka -1 for isomorphism 1, -2 for isomorphism 2, etc.
		cell.food -= this.cost;
	}
}

