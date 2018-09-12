//A Gene is an AdjacencyEnvironment and a Behavior

//Basically, a gene has some Behavior it can tell its cell to do,
//described by a single Action, 1 targeting each adjacent square.
//The cell only executes the behavior if the 4 squares adjacent to it
//meet certain criteria, described by the list of 4 Matchers we give it
//(an AdjacencyEnvironment is just a list of 4 Matchers)

//We check all rotations (called isomorphisms here) of the AdjacencyEnvironment
//and will treat any of them as valid matches. Ex: if a gene's AdjacencyEnvironment
//is: 'A cell to the north, and anything else in the other directions', then we would
//*also* match if there was a cell to the east, south, or west, remembering how much we
//rotated (aka remembering which isomorphism (0-3)) to get to the first match we found.
//We remember this because if the cell's behavior in this case is to move south, we want
//to make sure we rotate the Actions of the Behavior accordingly. So if we actually matched
//a cell to the west, we would move east.

class Gene {
	constructor(matchers, behavior, name) {
		this.matchers = matchers;
		this.behavior = behavior;
		this.name = name;
	}

	//returns -1 if there is no rotational ismorphism of the matchers that can match on the stuff
	//adjacent to the given posn in the given world. Returns the number of the isomorphism if there is.
	//(0 means no rotation was necessary, 1 means 1 counterclockwise rotation was necessary, etc.)
	//(asker is a Cell)
	findMatchingIsomorphism(posn, world, asker) {
		//grab the adjacent squares by posn, put them in a 4 element array
		var adjacentPosns = posn.getAdjacentPosns()
		//try each of the 4 isomorphisms:
		for (var isomorphism = 0; isomorphism < 4; isomorphism++) {
			var isMatch = true;
			for (var i = 0; i < 4; i++) {
				if (!this.matchers[(i + isomorphism) % 4](adjacentPosns[i], world, asker)) {
					isMatch = false;
					i = 4; // break the loop
				}
			}
			if (isMatch) {
				return isomorphism;
			}
		}
		return -1;
	}

	/*executeBehavior(cell, posn, world, isomorphism) {
		var adjacentPosns = posn.getAdjacentPosns();
		//execute every action in the behavior, accounting for the isomorphism
		for (var i = 0; i < 4; i++) {
			this.behavior[(i + isomorphism) % 4](posn, adjacentPosns[i], world);
		}
	}*/

	//TODO REMOVE THIS ^^

	//checks if this gene should act on the given cell at the given posn in the given world,
	//and if it should, makes it act by executing its behavior, and returns true.
	//Otherwise returns false, and does not act
	tick(cell, posn, world) {
		var isomorphism = this.findMatchingIsomorphism(posn, world, cell);
		if (isomorphism > -1 && cell.food >= this.behavior.cost) {
			//this.executeBehavior(cell, posn, world, isomorphism);
			this.behavior.execute(cell, posn, world, isomorphism);
			return true;
		} else {
			return false;
		}
	}
}