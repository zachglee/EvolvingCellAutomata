// A CellBuilder is an object that containis the methods necessary for the logic of a UI
// that lets the user construct a Cell. I have chosen as the 2 basic building operations
// addMatcher, and addBehavior. Thus for the purpose of any UI that uses CellBuilder,
// those two operations are atomic. I chose relatively small operations for flexibility,
// so you could implement a UI that lets you build in small pieces or in large chunks.

//NOTE: Maybe I should make a GeneBuilder component as well? idk

// A Direction is a number [0-3] that corresponds to a direction [up, right, down, left]

// An Environment (adjacency environment) is a set of 4 matchers, with each matcher matching
// squares in the direction of its index in the list. Thus the first matcher is matching the
// square in the 'up' direction, the second in the 'right' direction, etc.

// An ActionSpecification is a ...
// A MatcherSpecification is a ...

class CellBuilder {
	constructor(actionSpec, matcherSpec) {
		this.workingBehavior = null;
		this.workingEnvironment = [any, any, any, any];
		this.workingGenes = [];
		this.workingColor = getRandomColor();
		this.actionSpec = actionSpec; //info about what actions are available and their costs
		this.matcherSpec = matcherSpec; //info about what matchers are available
	}

	//Puts the Matcher with the given name in the given direction of the working Environment
	//(if no such matcher exists, logs an error and does nothing)
	addMatcher(matcherName, direction) {
		var matcher = this.matcherSpec[matcherName];
		if (matcher) {
			this.workingEnvironment[direction] = matcher;
		} else {
			console.log("The given matcherName is not specified in the Matcher Specification")
		}
	}

	//Puts a Behavior as the working behavior, that consists of the given Action in the given Direction
	//(if no such action exists, logs an error and does nothing)
	addBehavior(actionName, direction) {
		var actioncost = this.actionSpec[actionName];
		if (actioncost) {
			this.workingBehavior = new Behavior(direction, actioncost.cost, actioncost.action, actioncost.name)
		} else {
			console.log("The given actionName is not specified in the Action Specification");
		}
	}

	//resets the state data we keep track of for building genes to the initial values
	clearGeneWorkspace() {
		this.workingEnvironment = [any, any, any, any];
		this.workingBehavior = null;
	}

	//saves the current gene described by the workspace
	addGene() {
		this.workingGenes.push(new Gene(this.workingEnvironment, this.workingBehavior, "dummy name for now"))
	}

	//returns a new Cell that has all the genes saved thus far (idemptotent)
	genCell() {
		//TODO allow the user to pick the color of the cell?
		return new Cell(CELL_STARTING_FOOD, false, this.workingGenes.slice(0, this.workingGenes.length), 0, this.workingColor);
	}

	//resets the state data we keep track of for building cells to the initial values
	clearEntireWorkspace() {
		this.clearGeneWorkspace();
		this.workingGenes = [];
		this.workingColor = getRandomColor();
	}
}