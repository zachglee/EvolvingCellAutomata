//This is where the code to generate genes lives

var genesGenerated = 0;

//To gen Behavior:
// - pick an action and cost
// - pick a direction
function genBehavior() {
	var actionName = choose(Object.keys(ACTION_SPEC));
	var actioncost = ACTION_SPEC[actionName]; //choose a random action
	var action = actioncost.action;
	var cost = actioncost.cost;
	var direction = Math.floor(Math.random() * 3);
	return new Behavior(direction, cost, action, actionName)
}

//To gen AdjacencyEnv:
// - start with an anyEnv
// - pick a number of spots to fill in (1-2)
// - for every spot you're filling in, choose a random matcher
//   (empty, cell, food, something)
// - put it in a random unfilled direction
function genAdjacencyEnv() {
	var adjEnv = [any, any, any, any]
	var numMatchers = Math.floor(Math.random() * 4) + 1;
	for (var i = 0; i < numMatchers; i++) {
		var matcher = MATCHER_SPEC[choose(Object.keys(MATCHER_SPEC))]; //choose a random matcher
		var targetIndex = Math.floor(Math.random() * 4);
		adjEnv[targetIndex] = matcher;
	}
	return adjEnv;
}

function genGene() {
	genesGenerated += 1;
	return new Gene(genAdjacencyEnv(), genBehavior(), "randomGene" + genesGenerated);
}